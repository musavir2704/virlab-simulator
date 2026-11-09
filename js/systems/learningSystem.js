/**
 * VIRLAB-SIMULATOR: Hardware Learning System Engine
 * Mengelola tiga mode utama (Assembly Mode, Explore Mode, Learning Mode),
 * proyeksi 3D hotspot anatomi perangkat keras, kartu detail interaktif,
 * pusat pembelajaran 12 poin untuk 8 kategori, dan kuis edukatif interaktif.
 */

import * as THREE from 'three';
import {
    HARDWARE_LEARNING_CONTENT,
    ANATOMY_HOTSPOTS,
    HARDWARE_QUIZ_QUESTIONS
} from '../data/learningData.js';
import { CATEGORIES } from '../data/categories.js';

// State Internal Sistem Edukasi
const learningState = {
    currentMode: 'assembly', // 'assembly' | 'explore' | 'learning'
    activeHotspotId: null,
    activeCategoryKey: 'case',
    activeLearningTab: 'overview',
    cameraAnim: {
        active: false,
        startPos: new THREE.Vector3(),
        endPos: new THREE.Vector3(),
        startTarget: new THREE.Vector3(),
        endTarget: new THREE.Vector3(),
        progress: 0,
        duration: 0.85
    },
    quiz: {
        currentIndex: 0,
        userAnswers: [],
        selectedOption: null,
        isAnswered: false,
        score: 0,
        isFinished: false
    }
};

let refScene = null;
let refCamera = null;
let refRenderer = null;
let refControls = null;
let refAppState = null;
let refCallbacks = {
    showToast: () => {},
    log: () => {},
    onModeChange: () => {}
};

/**
 * Inisialisasi Hardware Learning System
 */
export function initLearningSystem({ scene, camera, renderer, controls, state, callbacks }) {
    refScene = scene;
    refCamera = camera;
    refRenderer = renderer;
    refControls = controls;
    refAppState = state;
    if (callbacks) refCallbacks = { ...refCallbacks, ...callbacks };

    createHotspotsDOM();
    setupLearningCenterDOM();
    setupQuizDOM();
    setupModeSwitcherDOM();

    // Default mode: Assembly
    setMode('assembly');
}

/**
 * Membuat elemen DOM marker untuk setiap titik anatomi 3D
 */
function createHotspotsDOM() {
    const container = document.getElementById('hotspots-container');
    if (!container) return;

    container.innerHTML = '';
    ANATOMY_HOTSPOTS.forEach((hs) => {
        const marker = document.createElement('div');
        marker.className = 'hotspot-marker';
        marker.id = `marker-${hs.id}`;
        marker.dataset.id = hs.id;
        marker.title = `${hs.part}: ${hs.title}`;

        marker.innerHTML = `
            <div class="hotspot-beacon">
                <span class="hotspot-pulse"></span>
                <span class="hotspot-dot"></span>
            </div>
            <div class="hotspot-label-tag">
                <span class="hotspot-category">${hs.part}</span>
                <span class="hotspot-title">${hs.title}</span>
            </div>
        `;

        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            focusHotspot(hs.id);
        });

        container.appendChild(marker);
    });
}

/**
 * Mengubah Mode Aplikasi (assembly | explore | learning)
 */
export function setMode(newMode) {
    if (learningState.currentMode === newMode && newMode !== 'learning') return;

    const prevMode = learningState.currentMode;
    learningState.currentMode = newMode;

    // Update Mode Buttons Active State di Top Bar
    const btnAssembly = document.getElementById('btn-mode-assembly');
    const btnExplore = document.getElementById('btn-mode-explore');
    const btnLearning = document.getElementById('btn-mode-learning');

    const updateBtn = (btn, isActive) => {
        if (!btn) return;
        if (isActive) {
            btn.className = 'mode-pill px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all bg-blue-600 text-white shadow-sm border border-blue-500';
        } else {
            btn.className = 'mode-pill px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-transparent';
        }
    };

    updateBtn(btnAssembly, newMode === 'assembly');
    updateBtn(btnExplore, newMode === 'explore');
    updateBtn(btnLearning, newMode === 'learning');

    const exploreBanner = document.getElementById('explore-mode-banner');
    const hotspotsContainer = document.getElementById('hotspots-container');
    const hotspotCard = document.getElementById('hotspot-detail-card');
    const assemblyBanner = document.getElementById('assembly-guide-banner');

    if (newMode === 'assembly') {
        if (exploreBanner) exploreBanner.classList.add('hidden');
        if (hotspotsContainer) hotspotsContainer.classList.add('hidden');
        if (hotspotCard) hotspotCard.classList.add('hidden');
        if (assemblyBanner) assemblyBanner.style.display = '';

        learningState.activeHotspotId = null;
        refCallbacks.showToast('Mode Perakitan Aktif: Silakan lanjutkan proses instalasi komponen PC.', false, false);
        refCallbacks.log('Beralih ke Mode Perakitan PC.');
    } else if (newMode === 'explore') {
        if (exploreBanner) exploreBanner.classList.remove('hidden');
        if (hotspotsContainer) hotspotsContainer.classList.remove('hidden');
        if (assemblyBanner) assemblyBanner.style.display = 'none';

        // Tutup drawer kanan jika sedang terbuka agar pandangan 3D bebas hambatan
        if (refAppState && !refAppState.isRightPanelHidden) {
            const closeBtn = document.getElementById('close-right-panel');
            if (closeBtn) closeBtn.click();
        }

        refCallbacks.showToast('Mode Eksplorasi 3D Aktif: Klik titik anatomi interaktif pada rig PC.', false, false);
        refCallbacks.log('Beralih ke Mode Eksplorasi 3D & Anatomi Komponen.');

        // Kembalikan kamera ke sudut pengamatan ideal PC jika baru masuk
        if (prevMode !== 'explore') {
            smoothFocusCamera(new THREE.Vector3(1.4, 1.8, 1.8), new THREE.Vector3(0, 0.9, 0));
        }
    } else if (newMode === 'learning') {
        openLearningModal(learningState.activeCategoryKey);
    }

    if (refCallbacks.onModeChange) {
        refCallbacks.onModeChange(newMode);
    }
}

/**
 * Fokus kamera secara halus ke titik anatomi tertentu dan tampilkan kartu informasi
 */
export function focusHotspot(hotspotId) {
    const hs = ANATOMY_HOTSPOTS.find(h => h.id === hotspotId);
    if (!hs) return;

    learningState.activeHotspotId = hotspotId;

    // Aktifkan marker visual highlight
    document.querySelectorAll('.hotspot-marker').forEach(m => m.classList.remove('active-hotspot'));
    const activeMarker = document.getElementById(`marker-${hs.id}`);
    if (activeMarker) activeMarker.classList.add('active-hotspot');

    // Animasi kamera halus menuju posisi fokus
    smoothFocusCamera(hs.cameraFocusPos, hs.cameraTargetPos);

    // Tampilkan Hotspot Detail Card
    showHotspotDetailCard(hs);

    refCallbacks.log(`Mengamati anatomi: ${hs.part} - ${hs.title}`, 'info');
}

/**
 * Animasi perpindahan kamera halus (lerp dengan cubic ease-out)
 */
function smoothFocusCamera(targetCameraPos, targetLookAtPos) {
    if (!refCamera || !refControls) return;

    learningState.cameraAnim.startPos.copy(refCamera.position);
    learningState.cameraAnim.endPos.copy(targetCameraPos);
    learningState.cameraAnim.startTarget.copy(refControls.target);
    learningState.cameraAnim.endTarget.copy(targetLookAtPos);
    learningState.cameraAnim.progress = 0;
    learningState.cameraAnim.active = true;
}

/**
 * Menampilkan kartu detail interaktif untuk titik anatomi
 */
function showHotspotDetailCard(hs) {
    const card = document.getElementById('hotspot-detail-card');
    if (!card) return;

    card.innerHTML = `
        <div class="flex items-start justify-between pb-2.5 border-b border-slate-100">
            <div>
                <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-wider border border-blue-200">
                    <i class="fas fa-microchip mr-1"></i>${hs.part}
                </span>
                <h3 class="text-sm font-bold text-slate-900 mt-1 leading-snug">${hs.title}</h3>
            </div>
            <button id="btn-close-hotspot-card" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>

        <div class="space-y-2 text-xs text-slate-600">
            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span class="font-bold text-slate-800 block text-[11px] mb-0.5"><i class="fas fa-search text-blue-600 mr-1"></i>Pengertian Fisik:</span>
                <p class="leading-relaxed text-[11px]">${hs.description}</p>
            </div>
            <div class="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 text-blue-900">
                <span class="font-bold text-blue-800 block text-[11px] mb-0.5"><i class="fas fa-cogs text-blue-600 mr-1"></i>Fungsi & Peran Utama:</span>
                <p class="leading-relaxed text-[11px] text-slate-700">${hs.functionality}</p>
            </div>
            <div class="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 text-amber-900">
                <span class="font-bold text-amber-800 block text-[11px] mb-0.5"><i class="fas fa-lightbulb text-amber-600 mr-1"></i>Pentingnya Komponen:</span>
                <p class="leading-relaxed text-[11px] text-slate-700">${hs.importance}</p>
            </div>
        </div>

        <div class="pt-2 border-t border-slate-100 flex gap-2">
            <button id="btn-learn-more-hotspot" class="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5">
                <i class="fas fa-book-reader text-xs"></i> Pelajari Kategori Lengkap
            </button>
        </div>
    `;

    card.classList.remove('hidden');

    const btnClose = document.getElementById('btn-close-hotspot-card');
    if (btnClose) {
        btnClose.onclick = () => {
            card.classList.add('hidden');
            learningState.activeHotspotId = null;
            document.querySelectorAll('.hotspot-marker').forEach(m => m.classList.remove('active-hotspot'));
        };
    }

    const btnLearnMore = document.getElementById('btn-learn-more-hotspot');
    if (btnLearnMore) {
        btnLearnMore.onclick = () => {
            card.classList.add('hidden');
            openLearningModal(hs.category);
        };
    }
}

/**
 * Loop update proyeksi 3D dan animasi kamera (Dipanggil di requestAnimationFrame animate())
 */
export function updateLearningSystem(delta) {
    // 1. Animasi Kamera Halus
    if (learningState.cameraAnim.active && refCamera && refControls) {
        learningState.cameraAnim.progress += delta / learningState.cameraAnim.duration;
        if (learningState.cameraAnim.progress >= 1.0) {
            learningState.cameraAnim.progress = 1.0;
            learningState.cameraAnim.active = false;
        }

        // Cubic ease-out
        const t = 1 - Math.pow(1 - learningState.cameraAnim.progress, 3);
        refCamera.position.lerpVectors(learningState.cameraAnim.startPos, learningState.cameraAnim.endPos, t);
        refControls.target.lerpVectors(learningState.cameraAnim.startTarget, learningState.cameraAnim.endTarget, t);
    }

    // 2. Proyeksi Hotspots Marker ke Layar 2D
    if (learningState.currentMode === 'explore' && refCamera && refRenderer) {
        const container = document.getElementById('canvas-container');
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        ANATOMY_HOTSPOTS.forEach((hs) => {
            const marker = document.getElementById(`marker-${hs.id}`);
            if (!marker) return;

            // Periksa apakah komponen terkait sudah terpasang
            const isInstalled = !refAppState || !refAppState.installed || refAppState.installed[hs.category] !== null;
            if (!isInstalled && hs.category !== 'case' && hs.category !== 'psu') {
                marker.style.display = 'none';
                return;
            }

            const pos = hs.worldPos.clone().project(refCamera);

            // Jika objek berada di belakang kamera
            if (pos.z > 1.0) {
                marker.style.display = 'none';
                return;
            }

            const screenX = (pos.x * 0.5 + 0.5) * width;
            const screenY = (-(pos.y * 0.5) + 0.5) * height;

            marker.style.display = 'flex';
            marker.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -50%)`;
        });
    }
}

/**
 * Menyiapkan Modal Pusat Pembelajaran Perangkat Keras (12 Poin Wajib)
 */
function setupLearningCenterDOM() {
    const modal = document.getElementById('learning-modal');
    if (!modal) return;

    const btnClose = document.getElementById('btn-close-learning');
    if (btnClose) {
        btnClose.onclick = () => {
            closeLearningModal();
        };
    }
}

/**
 * Membuka Modal Pusat Pembelajaran Perangkat Keras
 */
export function openLearningModal(categoryKey = 'case') {
    learningState.activeCategoryKey = categoryKey;
    const modal = document.getElementById('learning-modal');
    if (!modal) return;

    renderLearningSidebar();
    renderLearningContent(categoryKey);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const content = document.getElementById('learning-content');
        if (content) content.classList.remove('scale-95');
    }, 10);
}

/**
 * Menutup Modal Pusat Pembelajaran
 */
export function closeLearningModal() {
    const modal = document.getElementById('learning-modal');
    if (!modal) return;

    modal.classList.add('opacity-0');
    const content = document.getElementById('learning-content');
    if (content) content.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        // Kembalikan mode ke explore jika sebelumnya explore, atau assembly
        if (learningState.currentMode === 'learning') {
            setMode('assembly');
        }
    }, 250);
}

/**
 * Merender daftar kategori di sidebar kiri modal edukasi
 */
function renderLearningSidebar() {
    const sidebar = document.getElementById('learning-categories-list');
    if (!sidebar) return;

    sidebar.innerHTML = '';
    CATEGORIES.forEach((cat) => {
        const isActive = cat.id === learningState.activeCategoryKey;
        const btn = document.createElement('button');
        btn.className = `w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all text-xs font-semibold ${
            isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
        }`;

        btn.innerHTML = `
            <div class="w-8 h-8 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'} flex items-center justify-center shrink-0 text-sm">
                <i class="fas ${cat.icon}"></i>
            </div>
            <div class="truncate">
                <div class="leading-tight">${cat.label}</div>
                <div class="text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'} font-normal mt-0.5">12 Poin Pembelajaran</div>
            </div>
        `;

        btn.onclick = () => {
            learningState.activeCategoryKey = cat.id;
            renderLearningSidebar();
            renderLearningContent(cat.id);
        };

        sidebar.appendChild(btn);
    });
}

/**
 * Merender isi konten materi edukasi 12 poin untuk kategori aktif
 */
function renderLearningContent(categoryKey) {
    const contentEl = document.getElementById('learning-detail-body');
    if (!contentEl) return;

    const data = HARDWARE_LEARNING_CONTENT[categoryKey];
    if (!data) return;

    // Filter hotspot yang termasuk dalam kategori ini
    const relatedHotspots = ANATOMY_HOTSPOTS.filter(h => h.category === categoryKey);
    const hotspotsHtml = relatedHotspots.length > 0
        ? relatedHotspots.map(h => `
            <button class="btn-jump-hotspot text-left p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 text-slate-700 transition flex items-center justify-between gap-2 text-xs" data-id="${h.id}">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span class="font-bold text-blue-900">${h.title}</span>
                </div>
                <span class="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                    Lihat 3D <i class="fas fa-arrow-right text-[9px]"></i>
                </span>
            </button>
        `).join('')
        : '<p class="text-xs text-slate-400 italic">Titik anatomi terintegrasi pada sasis utama.</p>';

    contentEl.innerHTML = `
        <!-- HEADER KATEGORI -->
        <div class="bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 p-5 rounded-2xl border border-blue-100 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] tracking-wide uppercase mb-1.5">
                    <i class="fas fa-graduation-cap"></i> Modul Pembelajaran Resmi
                </span>
                <h2 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">${data.name}</h2>
                <p class="text-xs text-slate-600 mt-1">Panduan komprehensif 12 standar aspek perangkat keras komputer.</p>
            </div>
            <button id="btn-view-in-explore" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2 shrink-0">
                <i class="fas fa-cube"></i> Lihat di Eksplorasi 3D
            </button>
        </div>

        <!-- 12 POIN PEMBELAJARAN PERANGKAT KERAS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

            <!-- 1. PENGERTIAN -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-info-circle text-sm"></i> 1. Pengertian Perangkat
                </div>
                <p class="text-slate-700 leading-relaxed text-[11px] sm:text-xs">${data.definition}</p>
            </div>

            <!-- 2. FUNGSI UTAMA -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-bolt text-sm"></i> 2. Fungsi Utama
                </div>
                <p class="text-slate-700 leading-relaxed text-[11px] sm:text-xs">${data.mainFunction}</p>
            </div>

            <!-- 3. KEGUNAAN SEHARI-HARI -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-desktop text-sm"></i> 3. Kegunaan Sehari-hari
                </div>
                <p class="text-slate-700 leading-relaxed text-[11px] sm:text-xs">${data.usage}</p>
            </div>

            <!-- 4. CARA KERJA -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-sync-alt text-sm"></i> 4. Cara Kerja Sederhana
                </div>
                <p class="text-slate-700 leading-relaxed text-[11px] sm:text-xs">${data.howItWorks}</p>
            </div>

            <!-- 5. BAGIAN-BAGIAN FISIK -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5 md:col-span-2">
                <div class="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-layer-group text-sm"></i> 5. Bagian-Bagian Fisik Komponen
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    ${data.keyComponents.map(c => `
                        <div class="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <i class="fas fa-check-circle text-purple-500 text-xs mt-0.5 shrink-0"></i>
                            <span class="text-slate-700 text-[11px]">${c}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 6. SPESIFIKASI TEKNIS -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-microchip text-sm"></i> 6. Spesifikasi Teknis
                </div>
                <p class="text-slate-700 leading-relaxed text-[11px] sm:text-xs">${data.techSpecs}</p>
            </div>

            <!-- 7. KONEKTOR DAN INTERFACE -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-plug text-sm"></i> 7. Konektor & Antarmuka
                </div>
                <p class="text-slate-700 leading-relaxed text-[11px] sm:text-xs">${data.connectors}</p>
            </div>

            <!-- 8. LOKASI PEMASANGAN -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-map-marker-alt text-sm"></i> 8. Lokasi Pemasangan
                </div>
                <p class="text-slate-700 leading-relaxed text-[11px] sm:text-xs">${data.installLocation}</p>
            </div>

            <!-- 9. KOMPATIBILITAS -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-handshake text-sm"></i> 9. Kompatibilitas Sistem
                </div>
                <p class="text-slate-700 leading-relaxed text-[11px] sm:text-xs">${data.compatibility}</p>
            </div>

            <!-- 10. CONTOH PENGGUNAAN -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-tasks text-sm"></i> 10. Contoh Penggunaan
                </div>
                <p class="text-slate-700 leading-relaxed text-[11px] sm:text-xs">${data.useCases}</p>
            </div>

            <!-- 11. TIPS PERAWATAN -->
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1.5">
                <div class="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                    <i class="fas fa-shield-alt text-sm"></i> 11. Tips Perawatan
                </div>
                <p class="text-slate-700 leading-relaxed text-[11px] sm:text-xs">${data.maintenanceTips}</p>
            </div>

            <!-- 12. ANATOMI 3D TERKAIT -->
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 md:col-span-2">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                        <i class="fas fa-crosshairs text-sm"></i> 12. Titik Anatomi Interaktif 3D Terkait
                    </div>
                    <span class="text-[11px] text-slate-500">Klik untuk langsung mengamati di 3D</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    ${hotspotsHtml}
                </div>
            </div>

        </div>
    `;

    // Pasang listener untuk tombol "Lihat di Eksplorasi 3D"
    const btnViewExplore = document.getElementById('btn-view-in-explore');
    if (btnViewExplore) {
        btnViewExplore.onclick = () => {
            closeLearningModal();
            setMode('explore');
            // Jika ada hotspot pertama pada kategori ini, fokuskan
            if (relatedHotspots.length > 0) {
                setTimeout(() => focusHotspot(relatedHotspots[0].id), 300);
            }
        };
    }

    // Pasang listener untuk tombol jump ke hotspot
    contentEl.querySelectorAll('.btn-jump-hotspot').forEach(btn => {
        btn.onclick = () => {
            const hId = btn.dataset.id;
            closeLearningModal();
            setMode('explore');
            setTimeout(() => focusHotspot(hId), 300);
        };
    });
}

/**
 * Menyiapkan Modal Kuis Hardware Interaktif
 */
function setupQuizDOM() {
    const modal = document.getElementById('quiz-modal');
    if (!modal) return;

    const btnClose = document.getElementById('btn-close-quiz');
    if (btnClose) {
        btnClose.onclick = () => {
            closeQuizModal();
        };
    }
}

/**
 * Membuka Modal Kuis Interaktif
 */
export function openQuizModal() {
    const modal = document.getElementById('quiz-modal');
    if (!modal) return;

    // Reset kuis jika sudah selesai
    if (learningState.quiz.isFinished) {
        learningState.quiz.currentIndex = 0;
        learningState.quiz.userAnswers = [];
        learningState.quiz.score = 0;
        learningState.quiz.selectedOption = null;
        learningState.quiz.isAnswered = false;
        learningState.quiz.isFinished = false;
    }

    renderQuizQuestion();

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const content = document.getElementById('quiz-content');
        if (content) content.classList.remove('scale-95');
    }, 10);
}

/**
 * Menutup Modal Kuis
 */
export function closeQuizModal() {
    const modal = document.getElementById('quiz-modal');
    if (!modal) return;

    modal.classList.add('opacity-0');
    const content = document.getElementById('quiz-content');
    if (content) content.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 250);
}

/**
 * Merender pertanyaan kuis saat ini
 */
function renderQuizQuestion() {
    const body = document.getElementById('quiz-body');
    if (!body) return;

    const { currentIndex, score, isAnswered, selectedOption } = learningState.quiz;
    const totalQuestions = HARDWARE_QUIZ_QUESTIONS.length;

    // Jika sudah selesai seluruh soal
    if (currentIndex >= totalQuestions) {
        renderQuizSummary();
        return;
    }

    const q = HARDWARE_QUIZ_QUESTIONS[currentIndex];
    const progressPercent = Math.round((currentIndex / totalQuestions) * 100);

    body.innerHTML = `
        <!-- PROGRESS & STATS -->
        <div class="mb-4">
            <div class="flex justify-between items-center text-xs text-slate-500 font-semibold mb-1.5">
                <span>Soal ${currentIndex + 1} dari ${totalQuestions}</span>
                <span class="text-blue-600 font-bold">Skor: ${score * 10} Poin</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/80">
                <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300" style="width: ${progressPercent}%"></div>
            </div>
        </div>

        <!-- PERTANYAAN -->
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 mb-4">
            <span class="inline-block px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wide mb-1.5">Pertanyaan ${currentIndex + 1}</span>
            <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">${q.question}</h3>
        </div>

        <!-- PILIHAN JAWABAN -->
        <div class="space-y-2 mb-4" id="quiz-options-container">
            ${q.options.map((opt, idx) => {
                let btnClass = 'w-full text-left p-3.5 rounded-2xl border transition-all text-xs sm:text-sm font-medium flex items-center justify-between ';
                let badge = `<span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 mr-3 border border-slate-200">${String.fromCharCode(65 + idx)}</span>`;

                if (!isAnswered) {
                    btnClass += 'bg-white hover:bg-blue-50/70 hover:border-blue-300 text-slate-800 border-slate-200 shadow-sm cursor-pointer';
                } else {
                    if (idx === q.correctIndex) {
                        btnClass += 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm';
                        badge = `<span class="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mr-3"><i class="fas fa-check text-xs"></i></span>`;
                    } else if (idx === selectedOption) {
                        btnClass += 'bg-rose-50 border-rose-300 text-rose-800 shadow-sm';
                        badge = `<span class="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mr-3"><i class="fas fa-times text-xs"></i></span>`;
                    } else {
                        btnClass += 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                    }
                }

                return `
                    <button class="${btnClass} quiz-option-btn" data-index="${idx}" ${isAnswered ? 'disabled' : ''}>
                        <div class="flex items-center">
                            ${badge}
                            <span class="leading-relaxed">${opt}</span>
                        </div>
                    </button>
                `;
            }).join('')}
        </div>

        <!-- FEEDBACK & PENJELASAN EDUKATIF -->
        ${isAnswered ? `
            <div class="p-4 rounded-2xl border transition-all mb-4 ${
                selectedOption === q.correctIndex
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/90 border-rose-200 text-rose-950'
            }">
                <div class="flex items-center gap-2 font-bold text-xs mb-1">
                    ${selectedOption === q.correctIndex
                        ? '<i class="fas fa-check-circle text-emerald-600 text-sm"></i> <span class="text-emerald-700">Jawaban Anda Benar!</span>'
                        : '<i class="fas fa-times-circle text-rose-600 text-sm"></i> <span class="text-rose-700">Jawaban Kurang Tepat!</span>'
                    }
                </div>
                <p class="text-xs text-slate-700 leading-relaxed pl-5">
                    <b>Penjelasan Edukatif:</b> ${q.explanation}
                </p>
            </div>
        ` : ''}

        <!-- TOMBOL AKSI -->
        <div class="flex justify-end pt-2 border-t border-slate-100">
            ${isAnswered ? `
                <button id="btn-next-quiz" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2">
                    ${currentIndex + 1 < totalQuestions ? 'Pertanyaan Selanjutnya &rarr;' : 'Lihat Hasil Evaluasi &rarr;'}
                </button>
            ` : `
                <span class="text-xs text-slate-400 italic">Pilih salah satu jawaban di atas untuk melihat pembahasannya.</span>
            `}
        </div>
    `;

    // Pasang listener pada pilihan jawaban
    if (!isAnswered) {
        body.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.onclick = () => {
                const optIndex = parseInt(btn.dataset.index, 10);
                handleSelectQuizOption(optIndex);
            };
        });
    } else {
        const btnNext = document.getElementById('btn-next-quiz');
        if (btnNext) {
            btnNext.onclick = () => {
                learningState.quiz.currentIndex++;
                learningState.quiz.isAnswered = false;
                learningState.quiz.selectedOption = null;
                renderQuizQuestion();
            };
        }
    }
}

/**
 * Memproses pemilihan jawaban kuis
 */
function handleSelectQuizOption(optionIndex) {
    if (learningState.quiz.isAnswered) return;

    const q = HARDWARE_QUIZ_QUESTIONS[learningState.quiz.currentIndex];
    const isCorrect = optionIndex === q.correctIndex;

    learningState.quiz.selectedOption = optionIndex;
    learningState.quiz.isAnswered = true;
    learningState.quiz.userAnswers.push({
        questionId: q.id,
        chosen: optionIndex,
        isCorrect
    });

    if (isCorrect) {
        learningState.quiz.score++;
    }

    renderQuizQuestion();
}

/**
 * Merender ringkasan hasil nilai kuis
 */
function renderQuizSummary() {
    const body = document.getElementById('quiz-body');
    if (!body) return;

    learningState.quiz.isFinished = true;
    const totalQuestions = HARDWARE_QUIZ_QUESTIONS.length;
    const finalScore = learningState.quiz.score * 10;
    const percentage = Math.round((learningState.quiz.score / totalQuestions) * 100);

    let badgeTitle = 'Ahli Laboratorium Komputer';
    let badgeColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    let evalText = 'Luar biasa! Anda menguasai prinsip kerja dan karakteristik perangkat keras komputer dengan pemahaman yang sangat mendalam.';

    if (percentage < 50) {
        badgeTitle = 'Siswa Magang Laboratorium';
        badgeColor = 'text-rose-600 bg-rose-50 border-rose-200';
        evalText = 'Tetap semangat! Anda disarankan meninjau kembali materi di Pusat Pembelajaran dan mengamati titik anatomi komponen di Mode Eksplorasi 3D.';
    } else if (percentage < 80) {
        badgeTitle = 'Teknisi Komputer Terampil';
        badgeColor = 'text-blue-600 bg-blue-50 border-blue-200';
        evalText = 'Bagus sekali! Pemahaman Anda mengenai arsitektur perangkat keras sudah sangat baik. Ulangi materi untuk mencapai nilai sempurna.';
    }

    body.innerHTML = `
        <div class="text-center py-6">
            <div class="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-3 shadow-inner ${
                percentage >= 80 ? 'bg-emerald-100 text-emerald-600 border border-emerald-300' : 'bg-blue-100 text-blue-600 border border-blue-300'
            }">
                ${finalScore}
            </div>

            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold text-xs uppercase tracking-wider mb-3 ${badgeColor}">
                <i class="fas fa-medal"></i> ${badgeTitle}
            </div>

            <h3 class="text-lg font-black text-slate-800 mb-1">Hasil Evaluasi Kuis</h3>
            <p class="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed mb-6">
                ${evalText}
            </p>

            <div class="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6 text-xs">
                <div class="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-emerald-900 font-bold">
                    <div class="text-lg text-emerald-600">${learningState.quiz.score}</div>
                    <div class="text-[10px] uppercase text-emerald-700">Benar</div>
                </div>
                <div class="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-rose-900 font-bold">
                    <div class="text-lg text-rose-600">${totalQuestions - learningState.quiz.score}</div>
                    <div class="text-[10px] uppercase text-rose-700">Salah</div>
                </div>
            </div>

            <div class="flex gap-2 justify-center">
                <button id="btn-restart-quiz" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition shadow-md shadow-blue-500/20 flex items-center gap-2">
                    <i class="fas fa-redo"></i> Ulangi Kuis
                </button>
                <button id="btn-open-learn-from-quiz" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition flex items-center gap-2">
                    <i class="fas fa-book-open text-blue-600"></i> Buka Pusat Edukasi
                </button>
            </div>
        </div>
    `;

    const btnRestart = document.getElementById('btn-restart-quiz');
    if (btnRestart) {
        btnRestart.onclick = () => {
            learningState.quiz.currentIndex = 0;
            learningState.quiz.userAnswers = [];
            learningState.quiz.score = 0;
            learningState.quiz.selectedOption = null;
            learningState.quiz.isAnswered = false;
            learningState.quiz.isFinished = false;
            renderQuizQuestion();
        };
    }

    const btnOpenLearn = document.getElementById('btn-open-learn-from-quiz');
    if (btnOpenLearn) {
        btnOpenLearn.onclick = () => {
            closeQuizModal();
            openLearningModal('case');
        };
    }
}

/**
 * Menghubungkan tombol mode switcher di top bar
 */
function setupModeSwitcherDOM() {
    const btnAssembly = document.getElementById('btn-mode-assembly');
    const btnExplore = document.getElementById('btn-mode-explore');
    const btnLearning = document.getElementById('btn-mode-learning');
    const btnQuiz = document.getElementById('btn-open-quiz');

    if (btnAssembly) {
        btnAssembly.onclick = () => setMode('assembly');
    }
    if (btnExplore) {
        btnExplore.onclick = () => setMode('explore');
    }
    if (btnLearning) {
        btnLearning.onclick = () => openLearningModal(learningState.activeCategoryKey);
    }
    if (btnQuiz) {
        btnQuiz.onclick = () => openQuizModal();
    }
}

/**
 * Menangani klik langsung pada model 3D komponen saat berada di mode Explore
 */
export function handleObjectClickInExplore(category) {
    const hs = ANATOMY_HOTSPOTS.find(h => h.category === category);
    if (hs) {
        focusHotspot(hs.id);
    } else {
        openLearningModal(category);
    }
}
