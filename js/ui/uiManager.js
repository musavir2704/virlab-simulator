/**
 * VIRLAB-SIMULATOR: UI Manager & User Experience Controller
 * Mengelola notifikasi toast, log sistem, modal dialog, alur kerja panduan perakitan,
 * katalog perangkat teknis, dan input kontrol visual.
 */

import { CATEGORIES, ASSEMBLY_STEPS, getNextRecommendedStep } from '../data/categories.js';
import { CATALOG } from '../data/hardwareCatalog.js';
import { MAX_JOYSTICK_RADIUS } from '../core/constants.js';
import { validateCompatibility } from '../systems/assemblySystem.js';

// --- TOAST NOTIFICATION SYSTEM ---
export function showToast(msg, isError = false, isWarning = false) {
    const toast = document.createElement('div');
    let bgColor = 'bg-blue-600 border-blue-400 shadow-blue-500/25';
    let icon = '<i class="fas fa-check-circle mr-2 text-blue-200 text-base"></i>';

    if (isError) {
        bgColor = 'bg-rose-600 border-rose-400 shadow-rose-500/25';
        icon = '<i class="fas fa-exclamation-triangle mr-2 text-rose-200 text-base"></i>';
    } else if (isWarning) {
        bgColor = 'bg-amber-500 border-amber-300 shadow-amber-500/25';
        icon = '<i class="fas fa-info-circle mr-2 text-amber-200 text-base"></i>';
    }

    toast.className = `fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 px-5 py-2.5 rounded-2xl shadow-xl font-semibold z-50 transition-opacity duration-300 pointer-events-none border text-white text-xs sm:text-sm flex items-center ${bgColor} backdrop-blur-md`;
    toast.innerHTML = `${icon} <span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => toast.style.opacity = '0', 2500);
    setTimeout(() => toast.remove(), 2900);
}

// --- TERMINAL LOG SYSTEM ---
let isTerminalOpen = false;

export function initTerminal() {
    const terminalPopup = document.getElementById('terminal-popup');
    const toggleTerminalBtn = document.getElementById('toggle-terminal-btn');
    const closeTerminalBtn = document.getElementById('close-terminal-btn');
    const logBadge = document.getElementById('log-badge');

    function toggleTerminal() {
        isTerminalOpen = !isTerminalOpen;
        if (isTerminalOpen) {
            terminalPopup.classList.remove('scale-0', 'opacity-0', 'pointer-events-none');
            terminalPopup.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
            logBadge.classList.add('hidden');
            const termContent = document.getElementById('terminal-content');
            termContent.scrollTop = termContent.scrollHeight;
        } else {
            terminalPopup.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
            terminalPopup.classList.add('scale-0', 'opacity-0', 'pointer-events-none');
        }
    }

    if (toggleTerminalBtn) toggleTerminalBtn.addEventListener('click', toggleTerminal);
    if (closeTerminalBtn) closeTerminalBtn.addEventListener('click', toggleTerminal);
}

export function log(msg, type = 'info') {
    const term = document.getElementById('terminal-content');
    const logBadge = document.getElementById('log-badge');
    if (!term) return;

    const color = type === 'error' ? 'text-rose-400' : type === 'success' ? 'text-emerald-400' : type === 'warning' ? 'text-amber-300' : 'text-cyan-300';
    term.innerHTML += `<div class="terminal-line ${color}">> ${msg}</div>`;
    term.scrollTop = term.scrollHeight;

    if (!isTerminalOpen && logBadge) logBadge.classList.remove('hidden');
}

// --- MODAL POP-UP SYSTEM ---
export function setupModal(btnId, modalId, contentId, closeBtnId) {
    const modal = document.getElementById(modalId);
    const content = document.getElementById(contentId);
    const triggerBtn = document.getElementById(btnId);
    const closeBtn = document.getElementById(closeBtnId);

    if (!modal || !content) return;

    if (triggerBtn) {
        triggerBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            }, 10);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal && closeBtn) {
            closeBtn.click();
        }
    });
}

// --- RESET CONFIRMATION MODAL HANDLER ---
export function setupResetModal(onResetEmpty, onResetShowcase) {
    const modal = document.getElementById('reset-modal');
    const content = document.getElementById('reset-content');
    const triggerBtn = document.getElementById('reset-btn');
    const closeBtn = document.getElementById('btn-close-reset');
    const emptyBtn = document.getElementById('btn-reset-empty');
    const showcaseBtn = document.getElementById('btn-reset-showcase');

    if (!modal || !content) return;

    const openResetModal = () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 10);
    };

    const closeResetModal = () => {
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    };

    if (triggerBtn) triggerBtn.addEventListener('click', openResetModal);
    if (closeBtn) closeBtn.addEventListener('click', closeResetModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeResetModal();
    });

    if (emptyBtn) {
        emptyBtn.addEventListener('click', () => {
            closeResetModal();
            if (onResetEmpty) onResetEmpty();
            showToast('Simulasi direset: Silakan rakit dari Casing PC!', false, true);
        });
    }

    if (showcaseBtn) {
        showcaseBtn.addEventListener('click', () => {
            closeResetModal();
            if (onResetShowcase) onResetShowcase();
            showToast('Showcase PC Flagship (8/8) berhasil dimuat!', false, false);
        });
    }
}

// --- ASSEMBLY GUIDE MODAL & STEPS HANDLER ---
export function setupGuideModal(state, onSelectCategory) {
    const modal = document.getElementById('guide-modal');
    const content = document.getElementById('guide-content');
    const banner = document.getElementById('assembly-guide-banner');
    const closeBtn = document.getElementById('btn-close-guide');
    const doneBtn = document.getElementById('btn-done-guide');

    if (!modal || !content) return;

    const openGuide = () => {
        renderGuideSteps(state, (catId) => {
            closeGuide();
            if (onSelectCategory) onSelectCategory(catId);
        });
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 10);
    };

    const closeGuide = () => {
        modal.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    };

    if (banner) banner.addEventListener('click', openGuide);
    if (closeBtn) closeBtn.addEventListener('click', closeGuide);
    if (doneBtn) doneBtn.addEventListener('click', closeGuide);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGuide();
    });
}

export function renderGuideSteps(state, onSelectCategory) {
    const container = document.getElementById('guide-steps-container');
    if (!container) return;
    container.innerHTML = '';

    const nextStep = getNextRecommendedStep(state.installed);

    ASSEMBLY_STEPS.forEach(s => {
        const isInstalled = !!state.installed[s.category];
        const isCurrent = nextStep && nextStep.category === s.category;

        const card = document.createElement('div');
        card.className = `p-3 rounded-2xl border transition flex items-start justify-between gap-3 ${
            isInstalled
                ? 'bg-emerald-50/80 border-emerald-200'
                : isCurrent
                ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-400/20 shadow-sm'
                : 'bg-white border-slate-200/80 opacity-80'
        }`;

        let statusBadge = '';
        if (isInstalled) {
            statusBadge = `<span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase flex items-center gap-1 border border-emerald-200 shrink-0"><i class="fas fa-check text-[9px]"></i> Selesai</span>`;
        } else if (isCurrent) {
            statusBadge = `<span class="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px] uppercase shrink-0 shadow-xs">Langkah Anda</span>`;
        } else {
            statusBadge = `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-semibold text-[10px] uppercase shrink-0 border border-slate-200">Belum</span>`;
        }

        card.innerHTML = `
            <div class="flex items-start gap-2.5">
                <div class="w-7 h-7 rounded-lg ${isInstalled ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'} flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ${s.step}
                </div>
                <div>
                    <div class="font-bold text-slate-900 text-xs">${s.title}</div>
                    <div class="text-[11px] text-slate-600 mt-0.5 leading-relaxed">${s.why}</div>
                    <div class="text-[10px] text-blue-700 font-medium mt-1 bg-white/70 p-1.5 rounded-lg border border-slate-200/60">
                        <i class="fas fa-lightbulb text-amber-500 mr-1"></i><b>Tips:</b> ${s.tip}
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-end gap-2 shrink-0">
                ${statusBadge}
                <button class="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition py-1">
                    Pilih &rarr;
                </button>
            </div>
        `;

        card.onclick = () => {
            if (onSelectCategory) onSelectCategory(s.category);
        };

        container.appendChild(card);
    });
}

// --- RIGHT PANEL DRAWER ---
export function setRightPanelVisibility(show, state) {
    const rightPanel = document.getElementById('inventory-panel');
    const openRightBtn = document.getElementById('open-right-panel');
    if (!rightPanel || !openRightBtn) return;

    state.isRightPanelHidden = !show;
    if (show) {
        rightPanel.classList.remove('hidden-panel');
        openRightBtn.classList.add('hidden');
        openRightBtn.classList.remove('flex');
    } else {
        rightPanel.classList.add('hidden-panel');
        if (state.activeCategory) {
            openRightBtn.classList.remove('hidden');
            openRightBtn.classList.add('flex');
        }
    }
}

// --- CATEGORY & HARDWARE CARDS RENDERING (BEBAS HARGA) ---
export function renderCategories(state, onSelectCategory) {
    const list = document.getElementById('category-list');
    if (!list) return;
    list.innerHTML = '';

    const nextStep = getNextRecommendedStep(state.installed);

    CATEGORIES.forEach(cat => {
        const isInst = state.installed[cat.id] !== null;
        const isRecommended = nextStep && nextStep.category === cat.id;

        // Periksa apakah prasyarat belum terpenuhi
        let isLocked = false;
        let lockReason = '';
        if (cat.id === 'motherboard' && !state.installed.case) {
            isLocked = true;
            lockReason = 'Butuh Casing';
        } else if (['cpu', 'ram', 'gpu', 'storage'].includes(cat.id) && !state.installed.motherboard) {
            isLocked = true;
            lockReason = 'Butuh Motherboard';
        } else if (cat.id === 'cooler' && !state.installed.cpu) {
            isLocked = true;
            lockReason = 'Butuh CPU';
        }

        const btn = document.createElement('button');
        let stateClass = '';
        if (state.activeCategory === cat.id) {
            stateClass = 'active';
        } else if (isRecommended) {
            stateClass = 'recommended border border-sky-300';
        } else if (isLocked) {
            stateClass = 'locked bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-xs';
        } else {
            stateClass = 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-xs';
        }

        btn.className = `category-btn w-full text-left p-3 rounded-xl flex items-center justify-between mb-1.5 transition-all text-xs sm:text-sm font-medium ${stateClass}`;
        btn.onclick = () => onSelectCategory(cat.id);

        let badgeHtml = '';
        if (isInst) {
            badgeHtml = `<span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px] tracking-wide flex items-center gap-1 border border-emerald-200"><i class="fas fa-check text-[9px]"></i> TERPASANG</span>`;
        } else if (isRecommended) {
            badgeHtml = `<span class="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 font-bold text-[10px] tracking-wide border border-sky-300">LANGKAH ${cat.step}</span>`;
        } else if (isLocked) {
            badgeHtml = `<span class="text-[10px] text-slate-400 font-medium flex items-center gap-1"><i class="fas fa-lock text-[9px]"></i> ${lockReason}</span>`;
        }

        btn.innerHTML = `
            <div class="flex items-center gap-2.5">
                <i class="fas ${cat.icon} w-5 text-center text-blue-600"></i>
                <span>${cat.label}</span>
            </div>
            ${badgeHtml}
        `;
        list.appendChild(btn);
    });
}

export function selectCategory(catId, state, onInstallPart) {
    state.activeCategory = catId;
    const catInfo = CATEGORIES.find(c => c.id === catId);
    const titleEl = document.getElementById('current-category-title');
    const countEl = document.getElementById('category-count');
    const partsList = document.getElementById('parts-list');

    if (titleEl && catInfo) titleEl.innerText = catInfo.label;
    const items = CATALOG[catId] || [];
    if (countEl) countEl.innerText = `${items.length} pilihan perangkat`;

    if (!partsList) return;
    partsList.innerHTML = '';

    items.forEach(item => {
        const isInst = state.installed[catId]?.id === item.id;
        const card = document.createElement('div');

        // Uji validitas kompatibilitas sebelum klik untuk menampilkan badge edukatif
        const check = validateCompatibility(catId, item, state);

        card.className = `part-card p-3.5 rounded-2xl border cursor-pointer ${
            isInst ? 'installed' : check.valid ? 'border-slate-200 bg-white hover:border-blue-400' : 'border-rose-200 bg-rose-50/30 hover:border-rose-300'
        }`;

        // Status Badge Edukatif
        let statusBadge = '';
        if (isInst) {
            statusBadge = `<span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px] tracking-wide uppercase flex items-center gap-1 border border-emerald-200"><i class="fas fa-check text-[9px]"></i> TERPASANG</span>`;
        } else if (check.valid) {
            statusBadge = `<span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px] tracking-wide uppercase border border-blue-200">SIAP DIPASANG</span>`;
        } else {
            statusBadge = `<span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 font-semibold text-[10px] tracking-wide uppercase border border-rose-200" title="${check.error}"><i class="fas fa-exclamation-circle text-[9px] mr-0.5"></i> INKOMPATIBEL</span>`;
        }

        // Tags spesifikasi penting
        const tagsHtml = (item.highlights || [])
            .map(h => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px] border border-slate-200">${h}</span>`)
            .join('');

        card.onclick = () => {
            if (!isInst && !check.valid) {
                // Efek getar visual pada kartu saat ditolak
                card.classList.remove('shake');
                void card.offsetWidth; // trigger reflow
                card.classList.add('shake');
            }
            onInstallPart(catId, item);
        };

        card.innerHTML = `
            <div class="flex justify-between items-start mb-1.5 gap-2">
                <div>
                    <div class="text-[11px] text-blue-600 font-bold uppercase tracking-wider">${item.brand || 'Hardware'}</div>
                    <div class="font-bold text-slate-900 text-sm leading-snug">${item.name}</div>
                </div>
                ${statusBadge}
            </div>
            <div class="flex gap-1.5 flex-wrap mt-2.5">
                ${tagsHtml}
            </div>
            <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span><i class="fas fa-info-circle mr-1 text-slate-400"></i>${item.model || ''}</span>
                <span class="font-semibold ${isInst ? 'text-rose-600 hover:text-rose-700' : check.valid ? 'text-blue-600 hover:text-blue-700' : 'text-slate-400'}">
                    ${isInst ? 'Lepas Komponen' : check.valid ? 'Pasang ke Rig &rarr;' : 'Periksa Kecocokan'}
                </span>
            </div>
        `;
        partsList.appendChild(card);
    });

    setRightPanelVisibility(true, state);
}

// --- VIRTUAL CONTROLS (JOYSTICK & ELEVATION) ---
export function setupVirtualControls(isGameStartedGetter, onDeltaUpdate, onElevationUpdate) {
    const joystickZone = document.getElementById('joystick-zone');
    const joystickKnob = document.getElementById('joystick-knob');
    if (!joystickZone || !joystickKnob) return;

    let joystickActive = false;
    let joystickCenter = { x: 0, y: 0 };

    joystickZone.addEventListener('pointerdown', (e) => {
        if (!isGameStartedGetter()) return;
        joystickActive = true;
        joystickKnob.style.transition = 'none';
        const rect = joystickZone.getBoundingClientRect();
        joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        updateJoystick(e);
        e.stopPropagation();
    });

    window.addEventListener('pointermove', (e) => {
        if (!joystickActive) return;
        updateJoystick(e);
    });

    const resetJoystick = () => {
        if (!joystickActive) return;
        joystickActive = false;
        onDeltaUpdate({ x: 0, y: 0, active: false });
        joystickKnob.style.transition = 'transform 0.2s ease-out';
        joystickKnob.style.transform = 'translate(0px, 0px)';
    };

    window.addEventListener('pointerup', resetJoystick);
    window.addEventListener('pointercancel', resetJoystick);

    function updateJoystick(e) {
        let dx = e.clientX - joystickCenter.x;
        let dy = e.clientY - joystickCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > MAX_JOYSTICK_RADIUS) {
            const ratio = MAX_JOYSTICK_RADIUS / distance;
            dx *= ratio;
            dy *= ratio;
        }

        joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
        onDeltaUpdate({ x: dx, y: dy, active: true });
    }

    // Elevation Buttons
    const btnMoveUp = document.getElementById('btn-move-up');
    const btnMoveDown = document.getElementById('btn-move-down');

    const setupElevatorBtn = (btn, isUp) => {
        if (!btn) return;
        btn.addEventListener('pointerdown', (e) => {
            if (!isGameStartedGetter()) return;
            onElevationUpdate(isUp, true);
            e.stopPropagation();
            e.preventDefault();
        });
        const stopMove = () => onElevationUpdate(isUp, false);
        btn.addEventListener('pointerup', stopMove);
        btn.addEventListener('pointerleave', stopMove);
        btn.addEventListener('pointercancel', stopMove);
    };

    setupElevatorBtn(btnMoveUp, true);
    setupElevatorBtn(btnMoveDown, false);
}

// --- FULLSCREEN & SCREEN ORIENTATION CONTROLLER ---
export async function toggleFullscreen() {
    try {
        const isCurrentlyFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);

        if (!isCurrentlyFullscreen) {
            const el = document.documentElement;
            if (el.requestFullscreen) {
                await el.requestFullscreen();
            } else if (el.webkitRequestFullscreen) {
                await el.webkitRequestFullscreen();
            } else if (el.mozRequestFullScreen) {
                await el.mozRequestFullScreen();
            } else if (el.msRequestFullscreen) {
                await el.msRequestFullscreen();
            }

            // Kunci layar ke orientasi horizontal / landscape pada smartphone
            if (window.screen && window.screen.orientation && typeof window.screen.orientation.lock === 'function') {
                try {
                    await window.screen.orientation.lock('landscape');
                } catch (e) {
                    console.info('Screen orientation lock not permitted or supported:', e.message);
                }
            }
            showToast('Mode Layar Penuh (Landscape) Aktif', false, false);
            log('Mode Layar Penuh diaktifkan (Orientasi Landscape).');
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }

            // Lepaskan kunci orientasi saat keluar
            if (window.screen && window.screen.orientation && typeof window.screen.orientation.unlock === 'function') {
                try {
                    window.screen.orientation.unlock();
                } catch (e) {}
            }
            showToast('Keluar dari Mode Layar Penuh', false, false);
            log('Keluar dari Mode Layar Penuh.');
        }
    } catch (err) {
        console.warn('Gagal mengubah mode layar penuh:', err);
        showToast('Izin layar penuh dibatasi oleh sistem browser.', false, true);
    }
}

export function updateFullscreenUI() {
    const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const btnStartFullscreen = document.getElementById('btn-start-fullscreen');

    [btnFullscreen, btnStartFullscreen].forEach(btn => {
        if (!btn) return;
        const icon = btn.querySelector('i');
        if (icon) {
            if (isFull) {
                icon.className = 'fas fa-compress text-base';
            } else {
                icon.className = 'fas fa-expand text-base';
            }
        }
        if (btn.id === 'btn-fullscreen') {
            btn.title = isFull ? 'Keluar Layar Penuh (Esc / F)' : 'Mode Layar Penuh (Auto Landscape - F)';
        }
    });
}

// --- HUD HIDE / SHOW CONTROLLER (CLEAN VIEW MODE) ---
export function toggleHUD(state) {
    const gameUi = document.getElementById('game-ui-container');
    const floatingHudBtn = document.getElementById('btn-floating-hud');
    const toggleHudBtn = document.getElementById('btn-toggle-hud');
    if (!gameUi) return;

    state.isHUDHidden = !state.isHUDHidden;

    if (state.isHUDHidden) {
        gameUi.classList.add('hud-hidden');
        if (floatingHudBtn) {
            floatingHudBtn.classList.remove('hidden');
            floatingHudBtn.classList.add('flex');
        }
        if (toggleHudBtn) {
            const icon = toggleHudBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-eye text-base';
            toggleHudBtn.title = 'Tampilkan Menu (H)';
        }
        showToast('Menu disembunyikan. Analog, elevasi, dan kategori tetap aktif!', false, false);
        log('Toolbar menu disembunyikan (Analog, elevasi, dan kategori komponen tetap aktif).');
    } else {
        gameUi.classList.remove('hud-hidden');
        if (floatingHudBtn) {
            floatingHudBtn.classList.add('hidden');
            floatingHudBtn.classList.remove('flex');
        }
        if (toggleHudBtn) {
            const icon = toggleHudBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-eye-slash text-base';
            toggleHudBtn.title = 'Sembunyikan / Tampilkan Menu (H)';
        }
        showToast('Menu & kontrol berhasil ditampilkan kembali.', false, false);
        log('Tampilan menu & HUD ditampilkan kembali.');
    }
}

export function setupFullscreenAndHUD(state) {
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const btnStartFullscreen = document.getElementById('btn-start-fullscreen');
    const btnToggleHUD = document.getElementById('btn-toggle-hud');
    const btnFloatingHUD = document.getElementById('btn-floating-hud');

    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => toggleFullscreen());
    }
    if (btnStartFullscreen) {
        btnStartFullscreen.addEventListener('click', () => toggleFullscreen());
    }
    if (btnToggleHUD) {
        btnToggleHUD.addEventListener('click', () => toggleHUD(state));
    }
    if (btnFloatingHUD) {
        btnFloatingHUD.addEventListener('click', () => toggleHUD(state));
    }

    const handleFullscreenChange = () => updateFullscreenUI();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
}

