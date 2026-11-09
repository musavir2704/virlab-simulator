/**
 * VIRLAB-SIMULATOR: Master Application Controller (ES Module)
 * Mengorkestrasi loop simulasi 3D, input raycaster drag & drop, interaksi saklar, dan sinkronisasi status.
 */

import * as THREE from 'three';
import {
    scene,
    camera,
    renderer,
    controls,
    pcGroup,
    caseLight,
    setEnvironment,
    initScene,
    currentQuality,
    setGraphicsQuality,
    resetCamera,
    updateCameraReset
} from './core/scene.js';
import { rgbMaterials, fanMeshes, updateAioDisplay } from './core/materials.js';
import {
    setupPeripherals,
    monitorPowerBtnMesh,
    powerStripSwitchMesh,
    dongleObject
} from './3d/peripherals.js';
import { pcDropHitbox, generateCables } from './3d/components.js';
import { updateMonitorScreen } from './systems/monitorDisplay.js';
import {
    togglePowerStrip as execTogglePowerStrip,
    toggleMonitorPower as execToggleMonitorPower,
    togglePower as execTogglePower
} from './systems/powerSystem.js';
import {
    installPart as execInstallPart,
    resetRig as execResetRig,
    installShowcasePC,
    updateAssemblyStatus,
    updateAssemblyAnimations
} from './systems/assemblySystem.js';
import {
    showToast,
    log,
    initTerminal,
    setupModal,
    setupResetModal,
    setupGuideModal,
    setRightPanelVisibility,
    renderCategories,
    selectCategory,
    setupVirtualControls,
    setupFullscreenAndHUD,
    toggleFullscreen,
    toggleHUD
} from './ui/uiManager.js';
import {
    initLearningSystem,
    setMode,
    focusHotspot,
    updateLearningSystem,
    handleObjectClickInExplore,
    openLearningModal,
    openQuizModal
} from './systems/learningSystem.js';
import {
    INITIAL_CAMERA_POS,
    INITIAL_TARGET_POS,
    PC_OFFSET,
    ORIGINAL_DONGLE_POS,
    MAX_JOYSTICK_RADIUS,
    MOVE_SPEED,
    ELEVATION_SPEED,
    ROTATE_SPEED,
    MOUSE_ROTATE_SPEED
} from './core/constants.js';

// --- STATE APLIKASI UTAMA (BEBAS HARGA) ---
const state = {
    activeCategory: null,
    installed: {
        case: null,
        motherboard: null,
        cpu: null,
        ram: null,
        gpu: null,
        storage: null,
        cooler: null,
        psu: null
    },
    isPoweredOn: false,
    isPowerStripOn: false,
    isMonitorOn: false,
    isKeyboardConnected: false,
    cablesNeat: true,
    environment: 'clean',
    isCategoryDropdownOpen: true,
    isRightPanelHidden: true,
    isHUDHidden: false
};

let isGameStarted = false;
let bootStartTime = 0;
const interactiveObjects = [];
const clock = new THREE.Clock();

// --- RAYCASTER & INTERAKSI DRAG / KLIK 3D ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isDraggingDongle = false;
let dragPlane = new THREE.Plane();
let pointerDownTime = 0;
let isLookingAround = false;

// Navigasi Input
const keys = { w: false, a: false, s: false, d: false, q: false, e: false, space: false, shift: false };
let joystickDelta = { x: 0, y: 0, active: false };
let isMovingUp = false;
let isMovingDown = false;
const lastJoystickVisual = { x: 0, y: 0 };

function rotateView(yawDelta, pitchDelta) {
    const offset = new THREE.Vector3().subVectors(controls.target, camera.position);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta -= yawDelta;
    spherical.phi -= pitchDelta;
    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
    offset.setFromSpherical(spherical);
    controls.target.copy(camera.position).add(offset);
}

// Wrapper Aksi Daya
function handleTogglePower() {
    const powerBtn = document.getElementById('power-btn');
    const result = execTogglePower(state, powerBtn, showToast, log, () => clock.getElapsedTime());
    if (result !== null) {
        bootStartTime = result;
    }
    updateAssemblyStatus(state);
}

function handleToggleMonitorPower() {
    execToggleMonitorPower(state, monitorPowerBtnMesh, showToast, log);
}

function handleTogglePowerStrip() {
    execTogglePowerStrip(state, powerStripSwitchMesh, showToast, log, {
        togglePower: handleTogglePower,
        toggleMonitorPower: handleToggleMonitorPower
    });
}

function handleInstallPart(category, item) {
    execInstallPart(
        category,
        item,
        state,
        interactiveObjects,
        showToast,
        log,
        () => {
            renderCategories(state, handleSelectCategory);
            selectCategory(category, state, handleInstallPart);
        },
        handleTogglePower
    );
}

function handleSelectCategory(catId) {
    selectCategory(catId, state, handleInstallPart);
    renderCategories(state, handleSelectCategory);
}

function handleResetRig(mode = 'empty') {
    execResetRig(state, interactiveObjects, mode, {
        togglePower: handleTogglePower,
        togglePowerStrip: handleTogglePowerStrip,
        toggleMonitorPower: handleToggleMonitorPower,
        refreshUI: () => {
            renderCategories(state, handleSelectCategory);
            if (state.activeCategory) {
                selectCategory(state.activeCategory, state, handleInstallPart);
            }
        }
    });
}

// Event Listeners Raycaster
function setupRaycasterInteractions() {
    const dom = renderer.domElement;

    dom.addEventListener('pointerdown', (event) => {
        if (!isGameStarted || isLookingAround) return;
        if (joystickDelta.active || isMovingUp || isMovingDown) return;

        pointerDownTime = Date.now();
        const clientX = event.clientX || (event.touches ? event.touches[0].clientX : 0);
        const clientY = event.clientY || (event.touches ? event.touches[0].clientY : 0);

        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        if (dongleObject) {
            const intersectsDongle = raycaster.intersectObject(dongleObject, true);
            if (intersectsDongle.length > 0) {
                isDraggingDongle = true;
                controls.enabled = false;
                const normal = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
                dragPlane.setFromNormalAndCoplanarPoint(normal, dongleObject.position);

                if (state.isKeyboardConnected) {
                    state.isKeyboardConnected = false;
                    dongleObject.rotation.set(0, 0, 0);
                    log('USB Dongle dicabut dari PC.', 'warning');
                    showToast('USB Dongle dicabut dari PC.', false, true);
                }
                return;
            }
        }
    });

    dom.addEventListener('pointermove', (event) => {
        if (!isGameStarted || joystickDelta.active) return;

        if (isDraggingDongle && dongleObject) {
            const clientX = event.clientX || (event.touches ? event.touches[0].clientX : 0);
            const clientY = event.clientY || (event.touches ? event.touches[0].clientY : 0);
            mouse.x = (clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            const targetPos = new THREE.Vector3();
            if (raycaster.ray.intersectPlane(dragPlane, targetPos)) {
                targetPos.y = Math.max(0.1, targetPos.y);
                dongleObject.position.copy(targetPos);
            }
        } else if (isLookingAround && event.pointerType === 'mouse') {
            rotateView((event.movementX || 0) * MOUSE_ROTATE_SPEED, (event.movementY || 0) * MOUSE_ROTATE_SPEED);
        }
    });

    dom.addEventListener('pointerup', (event) => {
        if (!isGameStarted) return;

        if (isDraggingDongle && dongleObject) {
            isDraggingDongle = false;
            controls.enabled = true;

            if (state.installed.case && pcDropHitbox) {
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObject(pcDropHitbox);

                if (intersects.length > 0) {
                    state.isKeyboardConnected = true;
                    const caseHeight = 1.8;
                    const dropPos = new THREE.Vector3(PC_OFFSET.x, PC_OFFSET.y + caseHeight + 0.02, PC_OFFSET.z + 0.5);
                    dongleObject.position.copy(dropPos);
                    dongleObject.rotation.set(Math.PI / 2, 0, 0);

                    showToast('USB Dongle Terhubung! Keyboard Wireless Aktif.', false, false);
                    log('Keyboard Wireless berhasil terdeteksi via USB Dongle.', 'success');
                } else {
                    dongleObject.position.copy(ORIGINAL_DONGLE_POS);
                    dongleObject.rotation.set(0, 0, 0);
                    showToast('Dongle dilepas.', false, true);
                }
            } else {
                dongleObject.position.copy(ORIGINAL_DONGLE_POS);
                dongleObject.rotation.set(0, 0, 0);
                if (!state.installed.case) {
                    showToast('Casing PC belum dirakit!', true);
                }
            }
            return;
        }

        const clickDuration = Date.now() - pointerDownTime;
        if (clickDuration < 300 && !joystickDelta.active && !isMovingUp && !isMovingDown) {
            const clientX = event.clientX || (event.changedTouches ? event.changedTouches[0].clientX : 0);
            const clientY = event.clientY || (event.changedTouches ? event.changedTouches[0].clientY : 0);

            mouse.x = (clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(interactiveObjects, true);
            if (intersects.length > 0) {
                let obj = intersects[0].object;
                while (obj && !obj.userData.action && obj.parent) {
                    obj = obj.parent;
                }

                if (obj && obj.userData.action === 'togglePowerStrip') {
                    handleTogglePowerStrip();
                    return;
                } else if (obj && obj.userData.action === 'toggleMonitorPower') {
                    handleToggleMonitorPower();
                    return;
                } else if (obj && obj.userData.action === 'togglePcPower') {
                    handleTogglePower();
                    return;
                }
            }

            // Mode Eksplorasi 3D: Cek klik langsung pada komponen PC di viewport
            const exploreBanner = document.getElementById('explore-mode-banner');
            if (exploreBanner && !exploreBanner.classList.contains('hidden') && pcGroup) {
                const pcIntersects = raycaster.intersectObjects(pcGroup.children, true);
                if (pcIntersects.length > 0) {
                    let hitObj = pcIntersects[0].object;
                    while (hitObj && !hitObj.userData.category && hitObj.parent && hitObj.parent !== pcGroup) {
                        hitObj = hitObj.parent;
                    }
                    if (hitObj && hitObj.userData.category) {
                        handleObjectClickInExplore(hitObj.userData.category);
                    }
                }
            }
        }
    });

    dom.addEventListener('mousedown', (e) => {
        if (isGameStarted && (e.button === 2 || (e.button === 0 && !isDraggingDongle))) {
            isLookingAround = true;
            controls.enableRotate = false;
            controls.enablePan = false;
        }
    });

    window.addEventListener('mouseup', () => {
        if (isGameStarted) {
            isLookingAround = false;
            controls.enableRotate = true;
            controls.enablePan = true;
        }
    });

    // Keyboard Navigation & Escape Handler
    window.addEventListener('keydown', (e) => {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag === 'input' || activeTag === 'textarea') return;

        // Pintasan Layar Penuh (F)
        if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
            return;
        }

        if (!isGameStarted) return;

        // Pintasan Sembunyikan / Tampilkan Menu (H)
        if (e.key === 'h' || e.key === 'H') {
            toggleHUD(state);
            return;
        }

        if (e.key === 'Escape') {
            // Tutup kartu detail hotspot jika terbuka
            const card = document.getElementById('hotspot-detail-card');
            if (card && !card.classList.contains('hidden')) {
                const closeCardBtn = document.getElementById('btn-close-hotspot-card');
                if (closeCardBtn) closeCardBtn.click();
            }

            // Tutup drawer kanan jika terbuka
            if (!state.isRightPanelHidden) {
                setRightPanelVisibility(false, state);
            }

            // Tutup modal aktif (kecuali start-menu)
            const activeModals = document.querySelectorAll('.fixed.inset-0:not(.hidden)');
            activeModals.forEach(m => {
                if (m.id === 'start-menu') return;
                const closeBtn = m.querySelector('button[id^="btn-close-"]');
                if (closeBtn) closeBtn.click();
            });
            return;
        }

        const key = e.key.toLowerCase();
        if (keys.hasOwnProperty(key)) keys[key] = true;
        if (e.code === 'Space') keys.space = true;
        if (e.key === 'Shift') keys.shift = true;
    });

    window.addEventListener('keyup', (e) => {
        if (!isGameStarted) return;
        const key = e.key.toLowerCase();
        if (keys.hasOwnProperty(key)) keys[key] = false;
        if (e.code === 'Space') keys.space = false;
        if (e.key === 'Shift') keys.shift = false;
    });
}

// Setup Event Listener UI
function setupUIEventListeners() {
    // Start Menu
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            const menu = document.getElementById('start-menu');
            menu.style.opacity = '0';
            setEnvironment('clean');
            handleResetRig(true);

            setTimeout(() => {
                menu.style.display = 'none';
                document.getElementById('game-ui-container').style.display = 'block';
                isGameStarted = true;
                camera.position.copy(INITIAL_CAMERA_POS);
                controls.target.copy(INITIAL_TARGET_POS);
                showToast('Selamat Datang di VIRLAB-SIMULATOR!', false, false);
                log('Sistem Laboratorium Siap. Silakan pilih kategori komponen.', 'info');
                document.getElementById('btn-help').click();
            }, 1000);
        });
    }

    // Back to Menu
    const btnBackMenu = document.getElementById('btn-back-menu');
    if (btnBackMenu) {
        btnBackMenu.addEventListener('click', () => {
            const menu = document.getElementById('start-menu');
            const gameUi = document.getElementById('game-ui-container');
            if (state.isHUDHidden) {
                toggleHUD(state);
            }
            if (state.isPoweredOn) handleTogglePower();
            if (state.isPowerStripOn) handleTogglePowerStrip();
            if (state.isMonitorOn) handleToggleMonitorPower();

            setEnvironment('clean');
            installShowcasePC(state, interactiveObjects);
            gameUi.style.display = 'none';
            menu.style.display = 'flex';
            void menu.offsetWidth;
            menu.style.opacity = '1';
            isGameStarted = false;
        });
    }

    // Modals
    setupModal('btn-about', 'about-modal', 'about-content', 'btn-close-about');
    setupModal('btn-help', 'help-modal', 'help-content', 'btn-close-help');
    setupModal('btn-start-help', 'help-modal', 'help-content', 'btn-close-help');

    // Portrait Rotation Banner Dismiss
    const btnClosePortrait = document.getElementById('btn-close-portrait-banner');
    const portraitBanner = document.getElementById('portrait-banner');
    if (btnClosePortrait && portraitBanner) {
        btnClosePortrait.addEventListener('click', () => {
            portraitBanner.style.opacity = '0';
            setTimeout(() => {
                portraitBanner.style.display = 'none';
            }, 300);
        });
    }

    // Category Dropdown Toggle
    const toggleLeftBtn = document.getElementById('toggle-left-btn');
    if (toggleLeftBtn) {
        toggleLeftBtn.addEventListener('click', () => {
            const panelContainer = document.getElementById('category-panel-container');
            const chevron = document.getElementById('category-chevron');
            state.isCategoryDropdownOpen = !state.isCategoryDropdownOpen;

            if (!state.isCategoryDropdownOpen) {
                panelContainer.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
                panelContainer.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
                if (chevron) chevron.style.transform = 'rotate(-90deg)';
            } else {
                panelContainer.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
                panelContainer.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Inventory Drawer Toggles
    const closeRightPanel = document.getElementById('close-right-panel');
    const openRightPanel = document.getElementById('open-right-panel');
    if (closeRightPanel) closeRightPanel.addEventListener('click', () => setRightPanelVisibility(false, state));
    if (openRightPanel) openRightPanel.addEventListener('click', () => setRightPanelVisibility(true, state));

    // Environment Switchers
    const envBasic = document.getElementById('env-basic');
    const envRgb = document.getElementById('env-rgb');
    const envClean = document.getElementById('env-clean');
    if (envBasic) envBasic.onclick = () => setEnvironment('basic');
    if (envRgb) envRgb.onclick = () => setEnvironment('rgb');
    if (envClean) envClean.onclick = () => setEnvironment('clean');

    // Toggle Cables
    const toggleCablesBtn = document.getElementById('toggle-cables');
    if (toggleCablesBtn) {
        toggleCablesBtn.onclick = (e) => {
            state.cablesNeat = !state.cablesNeat;
            const btnSpan = e.currentTarget.querySelector('span');
            if (btnSpan) {
                btnSpan.innerText = state.cablesNeat ? 'Kabel: Rapi' : 'Kabel: Acak';
            }
            generateCables(state);
        };
    }

    // Reset Sudut Kamera
    const btnResetCamera = document.getElementById('btn-reset-camera');
    if (btnResetCamera) {
        btnResetCamera.addEventListener('click', () => {
            resetCamera(true);
            showToast('Sudut kamera dikembalikan ke posisi awal.', false, false);
            log('Sudut kamera dikembalikan ke posisi awal laboratorium.');
        });
    }

    // Settings Modal Setup
    setupModal('btn-settings', 'settings-modal', 'settings-content', 'btn-close-settings');
    const btnDoneSettings = document.getElementById('btn-done-settings');
    if (btnDoneSettings) {
        btnDoneSettings.addEventListener('click', () => {
            const closeBtn = document.getElementById('btn-close-settings');
            if (closeBtn) closeBtn.click();
        });
    }

    // Settings Graphics Quality Buttons
    const qualityBtns = document.querySelectorAll('.btn-quality');
    const updateQualityBtnsUI = (activeQ) => {
        qualityBtns.forEach(btn => {
            const q = btn.dataset.quality;
            if (q === activeQ) {
                btn.className = 'btn-quality p-2.5 rounded-xl border text-center transition font-semibold bg-blue-600 text-white border-blue-500 shadow-sm';
                const sub = btn.querySelector('.text-\\[10px\\]');
                if (sub) sub.className = 'text-[10px] text-blue-100';
            } else {
                btn.className = 'btn-quality p-2.5 rounded-xl border text-center transition font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200';
                const sub = btn.querySelector('.text-\\[10px\\]');
                if (sub) sub.className = 'text-[10px] text-slate-400';
            }
        });
    };
    updateQualityBtnsUI(currentQuality);

    qualityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const q = btn.dataset.quality;
            setGraphicsQuality(q);
            updateQualityBtnsUI(q);
            showToast(`Kualitas grafis diatur ke: ${q.toUpperCase()}`, false, false);
            log(`Kualitas grafis diubah menjadi: ${q.toUpperCase()}.`);
        });
    });

    // Settings Environment Options
    const optEnvClean = document.getElementById('opt-env-clean');
    const optEnvRgb = document.getElementById('opt-env-rgb');
    const optEnvBasic = document.getElementById('opt-env-basic');
    if (optEnvClean) optEnvClean.onclick = () => setEnvironment('clean');
    if (optEnvRgb) optEnvRgb.onclick = () => setEnvironment('rgb');
    if (optEnvBasic) optEnvBasic.onclick = () => setEnvironment('basic');

    // Settings Camera Reset Option
    const optResetCamera = document.getElementById('opt-reset-camera');
    if (optResetCamera) {
        optResetCamera.onclick = () => {
            resetCamera(true);
            showToast('Sudut pandang kamera laboratorium di-reset.', false, false);
            log('Sudut pandang kamera laboratorium di-reset.');
        };
    }

    // Reset Rig Modal Setup
    setupResetModal(
        () => handleResetRig('empty'),
        () => handleResetRig('showcase')
    );

    // Assembly Step Guide Modal Setup
    setupGuideModal(state, (catId) => handleSelectCategory(catId));

    // Power Button
    const powerBtn = document.getElementById('power-btn');
    if (powerBtn) {
        powerBtn.addEventListener('click', handleTogglePower);
    }

    // Setup Virtual Controls (Joystick & Elevasi)
    setupVirtualControls(
        () => isGameStarted,
        (delta) => {
            joystickDelta = delta;
        },
        (isUp, isActive) => {
            if (isUp) isMovingUp = isActive;
            else isMovingDown = isActive;
        }
    );

    // Setup Mode Layar Penuh (Auto Landscape) & Toggle Sembunyikan Menu
    setupFullscreenAndHUD(state);
}

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (!isGameStarted) {
        camera.position.x = Math.sin(time * 0.3) * 6;
        camera.position.z = Math.cos(time * 0.3) * 6;
        camera.position.y = 3 + Math.sin(time * 0.5) * 0.5;
        controls.target.set(0, 0.5, 0);
    }

    controls.update();

    if (isGameStarted) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

        // Keyboard Movement
        if (keys.w) {
            controls.target.addScaledVector(forward, MOVE_SPEED);
            camera.position.addScaledVector(forward, MOVE_SPEED);
        }
        if (keys.s) {
            controls.target.addScaledVector(forward, -MOVE_SPEED);
            camera.position.addScaledVector(forward, -MOVE_SPEED);
        }
        if (keys.a) {
            controls.target.addScaledVector(right, -MOVE_SPEED);
            camera.position.addScaledVector(right, -MOVE_SPEED);
        }
        if (keys.d) {
            controls.target.addScaledVector(right, MOVE_SPEED);
            camera.position.addScaledVector(right, MOVE_SPEED);
        }
        if (keys.e) rotateView(ROTATE_SPEED, 0);
        if (keys.q) rotateView(-ROTATE_SPEED, 0);

        // Vertical Elevation
        if (isMovingUp || keys.space) {
            camera.position.y += ELEVATION_SPEED;
            controls.target.y += ELEVATION_SPEED;
        }
        if (isMovingDown || keys.shift) {
            if (camera.position.y > 0.5) {
                camera.position.y -= ELEVATION_SPEED;
                controls.target.y -= ELEVATION_SPEED;
            }
        }

        // Virtual Joystick Movement
        if (joystickDelta.active && (joystickDelta.x !== 0 || joystickDelta.y !== 0)) {
            const moveZ = joystickDelta.y / MAX_JOYSTICK_RADIUS;
            const moveX = joystickDelta.x / MAX_JOYSTICK_RADIUS;

            controls.target.addScaledVector(forward, -moveZ * MOVE_SPEED);
            camera.position.addScaledVector(forward, -moveZ * MOVE_SPEED);

            controls.target.addScaledVector(right, moveX * MOVE_SPEED);
            camera.position.addScaledVector(right, moveX * MOVE_SPEED);
        }
    }

    // Animasi Kipas, Efek RGB, dan Display AIO
    if (state.isPoweredOn || !isGameStarted) {
        if (state.isPoweredOn) {
            fanMeshes.forEach((fan) => {
                fan.rotateZ(0.35);
            });
        }
        const rgbColor = new THREE.Color().setHSL((time * 0.2) % 1, 1, 0.5);
        rgbMaterials.forEach((mat) => {
            mat.emissive.copy(rgbColor);
            mat.emissiveIntensity = 2;
        });
        if (rgbMaterials.length > 0) {
            caseLight.color.copy(rgbColor);
            caseLight.intensity = 5;
        }
    } else if (!state.isPoweredOn && state.isPowerStripOn) {
        rgbMaterials.forEach((mat) => {
            mat.emissive.setHex(0x000000);
            mat.emissiveIntensity = 0;
        });
    }

    updateLearningSystem(delta);
    updateCameraReset(delta);
    updateAioDisplay(state.isPoweredOn, time);
    updateMonitorScreen(time, state, bootStartTime);
    updateAssemblyAnimations(time);
    renderer.render(scene, camera);
}

// --- INIT UTAMA ---
function init() {
    const container = document.getElementById('canvas-container');
    initScene(container);

    setupPeripherals(interactiveObjects);
    setupRaycasterInteractions();
    setupUIEventListeners();
    initTerminal();

    // Hardware Learning System Inisialisasi
    initLearningSystem({
        scene,
        camera,
        renderer,
        controls,
        state,
        callbacks: {
            showToast,
            log
        }
    });

    renderCategories(state, handleSelectCategory);
    setRightPanelVisibility(false, state);

    setEnvironment('clean');
    installShowcasePC(state, interactiveObjects);

    setTimeout(() => {
        handleTogglePowerStrip();
        setTimeout(() => {
            handleToggleMonitorPower();
        }, 500);
    }, 500);

    animate();
}

// Jalankan ketika DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
