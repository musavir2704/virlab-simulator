/**
 * VIRLAB-SIMULATOR: Assembly System, Validation & 3D Transitions
 * Mengelola pemasangan & pelepasan komponen, animasi transisi perakitan 3D,
 * validasi kompatibilitas teknis edukatif, serta pelacakan progres perakitan.
 */

import * as THREE from 'three';
import { pcGroup, caseLight, camera, controls } from '../core/scene.js';
import { rgbMaterials, clearDynamicCollections, disposeGeometries } from '../core/materials.js';
import {
    createCase,
    createMotherboard,
    createCPU,
    createRAM,
    createGPU,
    createStorage,
    createCooler,
    createPSU,
    generateCables
} from '../3d/components.js';
import { dongleObject } from '../3d/peripherals.js';
import { INITIAL_CAMERA_POS, INITIAL_TARGET_POS, PC_OFFSET, ORIGINAL_DONGLE_POS } from '../core/constants.js';
import { CATALOG } from '../data/hardwareCatalog.js';
import { getNextRecommendedStep } from '../data/categories.js';

// Koleksi animasi transisi perakitan aktif
export const activeAnimations = [];

// Vektor pendekatan pemasangan (Approach Vectors) untuk setiap kategori
export const APPROACH_OFFSETS = {
    case: new THREE.Vector3(-0.8, 0, 0),
    motherboard: new THREE.Vector3(0.55, 0, 0),
    cpu: new THREE.Vector3(0, 0.42, 0),
    cooler: new THREE.Vector3(0, 0.55, 0),
    ram: new THREE.Vector3(0, 0.38, 0),
    storage: new THREE.Vector3(0.18, 0.18, 0),
    gpu: new THREE.Vector3(0.52, 0, 0),
    psu: new THREE.Vector3(0, 0, -0.6)
};

// Referensi mesh per kategori di dalam pcGroup untuk mempermudah animasi
export const installedMeshMap = {};

/**
 * Menghitung jumlah komponen yang saat ini terpasang (0 sampai 8)
 */
export function getInstalledCount(state) {
    return Object.values(state.installed).filter(Boolean).length;
}

/**
 * Memperbarui status HUD Perakitan dan Panduan Langkah Rekomendasi
 */
export function updateAssemblyStatus(state) {
    const count = getInstalledCount(state);
    const countEl = document.getElementById('installed-count');
    const badgeEl = document.getElementById('assembly-status-badge');
    const systemIndicator = document.getElementById('system-status-indicator');
    const nextStepLabel = document.getElementById('next-step-label');

    if (countEl) countEl.innerText = count;

    if (badgeEl) {
        if (count === 0) {
            badgeEl.className = "px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px] border border-slate-200";
            badgeEl.innerHTML = `<span>0/8 Komponen</span>`;
        } else if (count < 6) {
            badgeEl.className = "px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200";
            badgeEl.innerHTML = `<span>${count}/8 Dalam Proses</span>`;
        } else if (count < 8) {
            badgeEl.className = "px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] border border-amber-200";
            badgeEl.innerHTML = `<span>${count}/8 Hampir Lengkap</span>`;
        } else {
            badgeEl.className = "px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200";
            badgeEl.innerHTML = `<span>8/8 Rakitan Lengkap</span>`;
        }
    }

    if (systemIndicator) {
        if (state.isPoweredOn) {
            systemIndicator.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]";
            systemIndicator.title = "Status: PC Aktif Beroperasi";
        } else if (count >= 6) {
            systemIndicator.className = "w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]";
            systemIndicator.title = "Status: Siap Booting";
        } else {
            systemIndicator.className = "w-2.5 h-2.5 rounded-full bg-slate-300";
            systemIndicator.title = "Status: Menunggu Perakitan Komponen";
        }
    }

    // Update Banner Langkah Rekomendasi Selanjutnya
    const nextStep = getNextRecommendedStep(state.installed);
    if (nextStepLabel) {
        if (nextStep) {
            nextStepLabel.innerText = `${nextStep.title}`;
            nextStepLabel.parentElement.parentElement.className =
                "mt-1 text-[11px] text-blue-800 bg-blue-50/90 hover:bg-blue-100/90 cursor-pointer px-2.5 py-1.5 rounded-xl border border-blue-200/70 flex items-center justify-between transition-all";
        } else {
            nextStepLabel.innerText = "Semua Komponen Terpasang (Siap Dinyalakan)";
            nextStepLabel.parentElement.parentElement.className =
                "mt-1 text-[11px] text-emerald-800 bg-emerald-50/90 hover:bg-emerald-100/90 cursor-pointer px-2.5 py-1.5 rounded-xl border border-emerald-200/70 flex items-center justify-between transition-all";
        }
    }
}

/**
 * Validasi Kompatibilitas Menyeluruh & Berorientasi Edukasi
 * Memeriksa soket, tipe memori, batas dimensi casing, dan urutan logis perakitan.
 */
export function validateCompatibility(category, item, state) {
    // 1. Validasi Keberadaan Casing
    if (['motherboard', 'psu'].includes(category) && !state.installed.case) {
        return {
            valid: false,
            error: 'Pasang Casing PC terlebih dahulu sebagai tempat sasis komponen!',
            log: `Perakitan ditolak: ${item.name} memerlukan Casing PC untuk tempat pemasangan.`,
            type: 'warning'
        };
    }

    // 2. Validasi Keberadaan Motherboard
    if (['cpu', 'ram', 'gpu', 'storage', 'cooler'].includes(category) && !state.installed.motherboard) {
        return {
            valid: false,
            error: 'Pasang Motherboard terlebih dahulu sebagai papan sirkuit utama!',
            log: `Perakitan ditolak: ${item.name} memerlukan Motherboard untuk dapat ditancapkan.`,
            type: 'warning'
        };
    }

    // 3. Validasi Prasyarat CPU untuk Cooler
    if (category === 'cooler' && !state.installed.cpu) {
        return {
            valid: false,
            error: 'Pasang Prosesor (CPU) terlebih dahulu sebelum memasang pendingin (Cooler)!',
            log: `Perakitan ditolak: Pendingin membutuhkan CPU terpasang di soket terlebih dahulu agar pelat kontak menempel pada IHS.`,
            type: 'warning'
        };
    }

    // 4. Validasi Kompatibilitas Soket CPU vs Motherboard
    if (category === 'cpu' && state.installed.motherboard && state.installed.motherboard.socket !== item.socket) {
        return {
            valid: false,
            error: `Soket tidak kompatibel! Motherboard membutuhkan soket ${state.installed.motherboard.socket}, sedangkan CPU adalah ${item.socket}.`,
            log: `Ketidakcocokan Soket: ${item.name} (${item.socket}) tidak dapat dipasang ke Motherboard ${state.installed.motherboard.name} (${state.installed.motherboard.socket}).`,
            type: 'error'
        };
    }

    // 5. Validasi Kompatibilitas Tipe Memori RAM (DDR4 vs DDR5)
    if (category === 'ram' && state.installed.motherboard) {
        const isMbDdr5 = state.installed.motherboard.socket === 'AM5'; // B550 = DDR4, X670E = DDR5
        const isRamDdr5 = item.memoryType === 'DDR5';

        if (isMbDdr5 && !isRamDdr5) {
            return {
                valid: false,
                error: `Tipe RAM tidak cocok! Motherboard AM5 membutuhkan memori DDR5, sedangkan ${item.name} adalah DDR4.`,
                log: `Inkompatibilitas Memori: ${item.name} (DDR4) tidak cocok untuk platform AM5 Next-Gen yang membutuhkan DDR5 (${state.installed.motherboard.name}).`,
                type: 'error'
            };
        }
        if (!isMbDdr5 && isRamDdr5) {
            return {
                valid: false,
                error: `Tipe RAM tidak cocok! Motherboard AM4 ini hanya mendukung DDR4, sedangkan ${item.name} adalah DDR5.`,
                log: `Inkompatibilitas Memori: ${item.name} (DDR5) memiliki notch fisik berbeda dan tidak dapat dipasang pada Motherboard DDR4 (${state.installed.motherboard.name}).`,
                type: 'error'
            };
        }
    }

    // 6. Validasi Dimensi Radiator Pendingin vs Sasis Casing
    if (category === 'cooler' && item.isLiquid && state.installed.case) {
        // NZXT H510 Flow (c1) maksimal 280mm di depan, tidak muat 360mm AIO (cl2)
        if (state.installed.case.id === 'c1' && item.id === 'cl2') {
            return {
                valid: false,
                error: 'Radiator 360mm tidak muat pada casing Mid-Tower NZXT H510 Flow! Gunakan Air Cooler atau ganti casing ke Super-Tower.',
                log: `Inkompatibilitas Dimensi: Radiator 360mm (${item.name}) melebihi kapasitas braket NZXT H510 Flow (Maks. 280mm). Pilih Cooler Master Air Cooler atau Casing Corsair 1000D.`,
                type: 'warning'
            };
        }
    }

    // 7. Peringatan Daya PSU terhadap GPU Flagship (Opsional Warning Informatif)
    let warningMsg = null;
    if (category === 'gpu' && item.id === 'gpu2' && state.installed.psu && state.installed.psu.wattage < 850) {
        warningMsg = `Peringatan Daya: RTX 4090 disarankan menggunakan PSU 1000W+ (PSU saat ini ${state.installed.psu.wattage}W berisiko trip proteksi daya pada beban puncak).`;
    }

    return {
        valid: true,
        warning: warningMsg
    };
}

/**
 * Pembangun Ulang Hierarki 3D Komponen PC
 */
export function rebuild3DScene(state, interactiveObjects, animatingCategory = null) {
    // Bersihkan objek interaktif kecuali periferal
    const preservedActions = ['togglePowerStrip', 'toggleMonitorPower'];
    for (let i = interactiveObjects.length - 1; i >= 0; i--) {
        if (!preservedActions.includes(interactiveObjects[i].userData.action)) {
            interactiveObjects.splice(i, 1);
        }
    }

    disposeGeometries(pcGroup);
    while (pcGroup.children.length > 0) {
        pcGroup.remove(pcGroup.children[0]);
    }

    // Bersihkan koleksi dinamis kipas
    clearDynamicCollections();

    pcGroup.add(caseLight);

    // Pembuatan komponen individual dengan registrasi mesh untuk animasi
    if (state.installed.case) {
        const mesh = createCase(state.installed.case, interactiveObjects);
        installedMeshMap['case'] = mesh;
        pcGroup.add(mesh);
    } else {
        delete installedMeshMap['case'];
    }

    if (state.installed.motherboard) {
        const mesh = createMotherboard(state.installed.motherboard);
        installedMeshMap['motherboard'] = mesh;
        pcGroup.add(mesh);
    } else {
        delete installedMeshMap['motherboard'];
    }

    if (state.installed.cpu) {
        const mesh = createCPU(state.installed.cpu);
        installedMeshMap['cpu'] = mesh;
        pcGroup.add(mesh);
    } else {
        delete installedMeshMap['cpu'];
    }

    if (state.installed.cooler) {
        const mesh = createCooler(state.installed.cooler);
        installedMeshMap['cooler'] = mesh;
        pcGroup.add(mesh);
    } else {
        delete installedMeshMap['cooler'];
    }

    if (state.installed.ram) {
        const mesh = createRAM(state.installed.ram);
        installedMeshMap['ram'] = mesh;
        pcGroup.add(mesh);
    } else {
        delete installedMeshMap['ram'];
    }

    if (state.installed.storage) {
        const mesh = createStorage(state.installed.storage);
        installedMeshMap['storage'] = mesh;
        pcGroup.add(mesh);
    } else {
        delete installedMeshMap['storage'];
    }

    if (state.installed.gpu) {
        const mesh = createGPU(state.installed.gpu);
        installedMeshMap['gpu'] = mesh;
        pcGroup.add(mesh);
    } else {
        delete installedMeshMap['gpu'];
    }

    if (state.installed.psu) {
        const mesh = createPSU(state.installed.psu);
        installedMeshMap['psu'] = mesh;
        pcGroup.add(mesh);
    } else {
        delete installedMeshMap['psu'];
    }

    generateCables(state);

    // Sinkronisasi posisi USB Wireless Dongle
    if (!state.installed.case && state.isKeyboardConnected) {
        state.isKeyboardConnected = false;
        if (dongleObject) {
            dongleObject.position.copy(ORIGINAL_DONGLE_POS);
            dongleObject.rotation.set(0, 0, 0);
        }
    } else if (state.installed.case && state.isKeyboardConnected && dongleObject) {
        const caseHeight = 1.82;
        const dropPos = new THREE.Vector3(PC_OFFSET.x, PC_OFFSET.y + caseHeight + 0.02, PC_OFFSET.z + 0.45);
        dongleObject.position.copy(dropPos);
        dongleObject.rotation.set(Math.PI / 2, 0, 0);
    }

    updateAssemblyStatus(state);
}

/**
 * Update Loop untuk Animasi Perakitan 3D (Dipanggil setiap frame di render loop)
 */
export function updateAssemblyAnimations(time) {
    if (activeAnimations.length === 0) return;

    for (let i = activeAnimations.length - 1; i >= 0; i--) {
        const anim = activeAnimations[i];
        const elapsed = (performance.now() - anim.startTime) / 1000;
        const progress = Math.min(elapsed / anim.duration, 1.0);

        // Cubic Easing Out: 1 - Math.pow(1 - progress, 3)
        const t = 1 - Math.pow(1 - progress, 3);
        anim.mesh.position.lerpVectors(anim.startPos, anim.targetPos, t);

        if (progress >= 1.0) {
            anim.mesh.position.copy(anim.targetPos);
            if (anim.onComplete) anim.onComplete();
            activeAnimations.splice(i, 1);
        }
    }
}

/**
 * Efek Kilau Kontak Visual Saat Komponen Berhasil Merapat ke Soket
 */
function triggerDockingFlash() {
    const originalColor = caseLight.color.clone();
    const originalIntensity = caseLight.intensity;

    caseLight.color.setHex(0x38bdf8); // Cyan flash
    caseLight.intensity = 6.0;

    setTimeout(() => {
        caseLight.color.copy(originalColor);
        caseLight.intensity = originalIntensity;
    }, 180);
}

/**
 * Memasang atau Melepas Komponen dengan Validasi Komprehensif & Animasi Halus
 */
export function installPart(category, item, state, interactiveObjects, showToast, log, refreshUI, togglePower) {
    // Matikan daya sebelum memasang / melepas komponen jika sedang menyala
    if (state.isPoweredOn && togglePower) {
        togglePower();
    }

    const isCurrentlyInstalled = state.installed[category]?.id === item.id;

    // A. TINDAKAN: PELEPASAN KOMPONEN (Pencopotan dengan Animasi Slide-Out)
    if (isCurrentlyInstalled) {
        // Peringatan jika melepas Motherboard sementara anak komponen masih menempel
        if (category === 'motherboard') {
            const attachedChildren = ['cpu', 'ram', 'gpu', 'storage', 'cooler'].filter(c => state.installed[c]);
            if (attachedChildren.length > 0) {
                showToast(`Lepas komponen ekspansi (${attachedChildren.join(', ').toUpperCase()}) terlebih dahulu sebelum melepas Motherboard!`, true);
                log(`Pelepasan ditolak: Motherboard tidak boleh dilepas saat masih menampung ${attachedChildren.join(', ')}.`, 'warning');
                return false;
            }
        }

        const meshToAnimate = installedMeshMap[category];
        const offset = APPROACH_OFFSETS[category] || new THREE.Vector3(0, 0.4, 0);

        if (meshToAnimate) {
            const startPos = meshToAnimate.position.clone();
            const targetPos = startPos.clone().add(offset);

            activeAnimations.push({
                mesh: meshToAnimate,
                startPos: startPos,
                targetPos: targetPos,
                startTime: performance.now(),
                duration: 0.32, // 320ms slide-out
                onComplete: () => {
                    state.installed[category] = null;
                    rebuild3DScene(state, interactiveObjects);
                    log(`Mencopot ${item.name} dari sistem.`);
                    showToast(`${item.name} berhasil dilepas.`, false, true);
                    if (refreshUI) refreshUI();
                }
            });
            return true;
        } else {
            state.installed[category] = null;
            rebuild3DScene(state, interactiveObjects);
            log(`Mencopot ${item.name} dari sistem.`);
            showToast(`${item.name} berhasil dilepas.`, false, true);
            if (refreshUI) refreshUI();
            return true;
        }
    }

    // B. TINDAKAN: PEMASANGAN KOMPONEN (Pemasangan dengan Validasi & Animasi Docking)
    const check = validateCompatibility(category, item, state);
    if (!check.valid) {
        showToast(check.error, true);
        log(check.log, check.type || 'error');
        return false;
    }

    if (check.warning) {
        log(check.warning, 'warning');
    }

    // Pasang komponen ke dalam state
    state.installed[category] = item;
    rebuild3DScene(state, interactiveObjects);

    // Inisiasi animasi pendekatan 3D
    const installedMesh = installedMeshMap[category];
    const offset = APPROACH_OFFSETS[category] || new THREE.Vector3(0, 0.4, 0);

    if (installedMesh) {
        const targetPos = installedMesh.position.clone();
        const startPos = targetPos.clone().add(offset);
        installedMesh.position.copy(startPos);

        activeAnimations.push({
            mesh: installedMesh,
            startPos: startPos,
            targetPos: targetPos,
            startTime: performance.now(),
            duration: 0.45, // 450ms smooth descent
            onComplete: () => {
                triggerDockingFlash();
                log(`Memasang ${item.name} ke dalam sistem.`, 'success');
                showToast(`${item.name} berhasil dipasang!`, false, false);
                if (refreshUI) refreshUI();
            }
        });
    } else {
        log(`Memasang ${item.name} ke dalam sistem.`, 'success');
        showToast(`${item.name} berhasil dipasang!`, false, false);
    }

    if (refreshUI) refreshUI();
    return true;
}

/**
 * Mereset Perakitan PC dengan Mode Terarah
 * - 'empty': Mengosongkan seluruh komponen (0/8) untuk perakitan mandiri dari awal
 * - 'showcase': Memuat konfigurasi PC Flagship lengkap (8/8)
 */
export function resetRig(state, interactiveObjects, mode = 'empty', callbacks = {}) {
    if (state.isPoweredOn && callbacks.togglePower) callbacks.togglePower();
    if (state.isPowerStripOn && callbacks.togglePowerStrip) callbacks.togglePowerStrip();
    if (state.isMonitorOn && callbacks.toggleMonitorPower) callbacks.toggleMonitorPower();

    activeAnimations.length = 0; // Hentikan animasi in-flight

    if (mode === 'empty') {
        state.installed = {
            case: null,
            motherboard: null,
            cpu: null,
            cooler: null,
            ram: null,
            storage: null,
            gpu: null,
            psu: null
        };
        state.activeCategory = 'case';
    } else {
        // Mode Showcase Flagship
        state.installed = {
            case: CATALOG.case[1],
            motherboard: CATALOG.motherboard[1],
            cpu: CATALOG.cpu[1],
            cooler: CATALOG.cooler[1],
            ram: CATALOG.ram[1],
            storage: CATALOG.storage[1],
            gpu: CATALOG.gpu[1],
            psu: CATALOG.psu[1]
        };
    }

    state.isKeyboardConnected = false;
    if (dongleObject) {
        dongleObject.position.copy(ORIGINAL_DONGLE_POS);
        dongleObject.rotation.set(0, 0, 0);
    }

    camera.position.copy(INITIAL_CAMERA_POS);
    controls.target.copy(INITIAL_TARGET_POS);
    controls.update();

    rebuild3DScene(state, interactiveObjects);
    if (callbacks.refreshUI) callbacks.refreshUI();
}

/**
 * Shortcut Memuat Showcase PC Lengkap
 */
export function installShowcasePC(state, interactiveObjects) {
    resetRig(state, interactiveObjects, 'showcase');
}
