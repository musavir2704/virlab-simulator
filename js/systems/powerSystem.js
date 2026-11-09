/**
 * VIRLAB-SIMULATOR: Electrical & Power System
 * Mengendalikan alur simulasi kelistrikan menyeluruh:
 * Terminal Colokan (Power Strip AC 220V), Monitor IPS, dan Sirkuit Daya Komputer (PSU & Tombol PC).
 */

import { materials, rgbMaterials } from '../core/materials.js';
import { caseLight, monitorLight } from '../core/scene.js';
import { REQUIRED_BOOT_PARTS } from '../core/constants.js';

/**
 * Sakelar Terminal Colokan Listrik (Power Strip AC 220V)
 */
export function togglePowerStrip(state, powerStripSwitchMesh, showToast, log, callbacks = {}) {
    state.isPowerStripOn = !state.isPowerStripOn;
    const indicator = document.getElementById('power-indicator');

    if (state.isPowerStripOn) {
        if (powerStripSwitchMesh) {
            powerStripSwitchMesh.material = materials.redSwitchOn;
            powerStripSwitchMesh.rotation.z = 0.2;
        }
        if (indicator) {
            indicator.className = "w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]";
            indicator.title = "Status Listrik: AC 220V Aktif (Terhubung ke Stopkontak)";
        }
        log('Listrik Induk Aktif: Terminal colokan mengalirkan daya AC 220V ke perangkat.', 'success');
        showToast('Listrik Induk: ON (AC 220V)', false, false);
    } else {
        if (powerStripSwitchMesh) {
            powerStripSwitchMesh.material = materials.redSwitchOff;
            powerStripSwitchMesh.rotation.z = -0.2;
        }
        if (indicator) {
            indicator.className = "w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]";
            indicator.title = "Status Listrik: Padam (Tidak Ada Arus Listrik)";
        }
        log('Listrik Induk Padam: Pemutusan daya darurat ke seluruh stasiun kerja.', 'error');
        showToast('Listrik Induk: OFF', false, true);

        // Jika listrik mati saat PC / Monitor hidup, matikan seketika (pemutusan arus darurat)
        if (state.isPoweredOn && callbacks.togglePower) callbacks.togglePower();
        if (state.isMonitorOn && callbacks.toggleMonitorPower) callbacks.toggleMonitorPower();
    }
}

/**
 * Sakelar Daya Monitor
 */
export function toggleMonitorPower(state, monitorPowerBtnMesh, showToast, log) {
    if (!state.isPowerStripOn && !state.isMonitorOn) {
        showToast('Listrik induk mati! Nyalakan terminal colokan terlebih dahulu.', true);
        log('Gagal menyalakan monitor: Kabel daya AC monitor terhubung ke terminal listrik yang sedang padam.', 'warning');
        return;
    }
    state.isMonitorOn = !state.isMonitorOn;

    if (state.isMonitorOn) {
        if (monitorPowerBtnMesh) monitorPowerBtnMesh.material = materials.redSwitchOn;
        log('Layar Monitor dinyalakan (Sinyal video menunggu input PC).', 'success');
        showToast('Monitor: ON', false, false);
    } else {
        if (monitorPowerBtnMesh) monitorPowerBtnMesh.material = materials.redSwitchOff;
        log('Layar Monitor dimatikan.');
        showToast('Monitor: OFF', false, true);
    }
}

/**
 * Validasi Komponen Esensial untuk Booting POST PC
 */
export function validateBootPrerequisites(state) {
    // 1. Cek Catu Daya PSU
    if (!state.installed.psu) {
        return {
            canBoot: false,
            error: 'Tidak Ada Daya: Power Supply Unit (PSU) belum terpasang di sasis PC!',
            log: 'POST Gagal: Komputer tidak menerima pasokan arus DC. Pasang PSU terlebih dahulu.',
            code: 'NO_PSU'
        };
    }

    // 2. Cek Motherboard
    if (!state.installed.motherboard) {
        return {
            canBoot: false,
            error: 'Sirkuit Terputus: Motherboard belum terpasang di dalam sasis!',
            log: 'POST Gagal: Papan induk sirkuit utama tidak ditemukan.',
            code: 'NO_MOTHERBOARD'
        };
    }

    // 3. Cek Prosesor (CPU)
    if (!state.installed.cpu) {
        return {
            canBoot: false,
            error: 'POST Error: CPU tidak terdeteksi (Indikator CPU_LED Merah)!',
            log: 'POST Terhenti [CPU Error]: Tidak ada unit pemroses di soket motherboard.',
            code: 'NO_CPU'
        };
    }

    // 4. Cek Pendingin CPU (Cooler)
    if (!state.installed.cooler) {
        return {
            canBoot: false,
            error: 'Peringatan Termal: CPU Cooler belum terpasang (Risiko panas ekstrem)!',
            log: 'POST Terhenti [Thermal Error]: Proteksi sirkuit mencegah penyalaan CPU tanpa pendingin.',
            code: 'NO_COOLER'
        };
    }

    // 5. Cek Memori RAM
    if (!state.installed.ram) {
        return {
            canBoot: false,
            error: 'POST Error: Memori RAM tidak terpasang (Indikator DRAM_LED Menyala)!',
            log: 'POST Terhenti [DRAM Error]: Sistem tidak mendeteksi memori utama yang valid.',
            code: 'NO_RAM'
        };
    }

    // 6. Cek Kartu Grafis (GPU)
    if (!state.installed.gpu) {
        return {
            canBoot: false,
            error: 'POST Error: Kartu grafis (GPU) belum terpasang (Tidak ada sinyal video)!',
            log: 'POST Terhenti [VGA Error]: Sistem membutuhkan kartu grafis PCIe untuk output visual.',
            code: 'NO_GPU'
        };
    }

    // 7. Cek Media Penyimpanan (Storage)
    // Jika Storage tidak ada: PC tetap dapat menyala dan masuk BIOS, tetapi gagal boot ke OS
    const hasStorage = !!state.installed.storage;

    return {
        canBoot: true,
        hasStorage: hasStorage,
        warning: hasStorage ? null : 'Peringatan BIOS: Media penyimpanan sistem tidak ditemukan (Hanya masuk BIOS).'
    };
}

/**
 * Sakelar Tombol Daya PC (Power Button)
 */
export function togglePower(state, powerBtn, showToast, log, getElapsedTime) {
    if (state.isPoweredOn) {
        // Mematikan Komputer
        state.isPoweredOn = false;
        if (powerBtn) {
            powerBtn.className = "px-3 sm:px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition shadow-sm border border-slate-300 text-xs sm:text-sm flex items-center";
            powerBtn.innerHTML = '<i class="fas fa-power-off text-slate-500 sm:mr-2"></i><span class="hidden sm:inline">Nyalakan PC</span>';
        }
        log('Sistem PC dimatikan. Seluruh kipas pendingin dan lampu RGB padam.');
        rgbMaterials.forEach(mat => mat.emissive.setHex(0x000000));
        caseLight.intensity = 0;
        monitorLight.intensity = state.isMonitorOn ? 0.6 : 0;
        return 0; // reset bootStartTime
    } else {
        // Menyalakan Komputer
        if (!state.isPowerStripOn) {
            showToast('Nyalakan terminal colokan (Listrik Induk) terlebih dahulu!', true);
            log('Penyalaan PC ditolak: Kabel catu daya PSU tidak menerima aliran listrik dari colokan dinding.', 'warning');
            return null;
        }

        const bootCheck = validateBootPrerequisites(state);
        if (!bootCheck.canBoot) {
            showToast(bootCheck.error, true);
            log(bootCheck.log, 'error');
            return null;
        }

        if (bootCheck.warning) {
            log(bootCheck.warning, 'warning');
        }

        state.isPoweredOn = true;
        if (powerBtn) {
            powerBtn.className = "px-3 sm:px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md shadow-emerald-500/25 border border-emerald-400 text-xs sm:text-sm flex items-center";
            powerBtn.innerHTML = '<i class="fas fa-power-off text-emerald-100 sm:mr-2"></i><span class="hidden sm:inline">Matikan PC</span>';
        }
        log('Tombol daya PC ditekan: Arus DC aktif, kipas mulai berputar, inisialisasi BIOS POST dimulai...', 'success');
        showToast('PC Berhasil Dinyalakan!', false, false);

        if (state.isMonitorOn) {
            monitorLight.intensity = 1.6;
        }
        return getElapsedTime();
    }
}
