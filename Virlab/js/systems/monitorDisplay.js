/**
 * VIRLAB-SIMULATOR: Dynamic Monitor Canvas Display
 * Merender tekstur layar monitor secara dinamis pada Canvas 1024x512:
 * OFF, NO SIGNAL, BIOS POST (Deteksi Hardware Nyata), NO BOOT DEVICE, BOOTING, dan VIRLAB DESKTOP OS.
 */

import { monitorCtx, monitorTexture } from '../core/materials.js';
import { monitorLight } from '../core/scene.js';

let lastScreenState = 'INIT';
let lastDrawTime = 0;

export function updateMonitorScreen(time, state, bootStartTime) {
    let currentState = 'OFF';

    if (state.isMonitorOn && state.isPowerStripOn) {
        if (!state.isPoweredOn) {
            currentState = 'NOSIGNAL';
        } else {
            const elapsed = time - bootStartTime;

            if (elapsed < 3.2) {
                // Tahap 1: BIOS POST Hardware Discovery
                currentState = 'BIOS';
            } else if (!state.installed.storage) {
                // Skenario Error: Tidak ada media penyimpanan terpasang (Gagal Booting)
                currentState = 'NO_BOOT_DEVICE';
            } else if (elapsed < 6.5) {
                // Tahap 2: Animasi Booting OS
                currentState = 'BOOTING';
            } else {
                // Tahap 3: Desktop VIRLAB OS Aktif
                currentState = 'DESKTOP';
            }
        }
    }

    // Untuk efisiensi GPU, render ulang hanya jika state berubah atau animasi aktif pada batas ~30fps
    const isAnimatedState = ['BOOTING', 'DESKTOP', 'NOSIGNAL', 'BIOS', 'NO_BOOT_DEVICE'].includes(currentState);
    if (currentState === lastScreenState) {
        if (!isAnimatedState || (time - lastDrawTime < 0.033)) {
            return;
        }
    }
    lastDrawTime = time;
    lastScreenState = currentState;

    const w = 1024, h = 512;
    monitorCtx.clearRect(0, 0, w, h);

    // =========================================================================
    // 1. STATE: NO SIGNAL (Monitor Hidup, tetapi PC Mati / Belum Mengirim Sinyal)
    // =========================================================================
    if (currentState === 'NOSIGNAL') {
        monitorCtx.fillStyle = '#080d1a';
        monitorCtx.fillRect(0, 0, w, h);

        // Floating OSD Box mengambang perlahan
        const floatY = Math.sin(time * 1.5) * 12;
        const boxX = 330, boxY = 160 + floatY, boxW = 364, boxH = 180;

        monitorCtx.fillStyle = '#0f172a';
        monitorCtx.strokeStyle = '#38bdf8';
        monitorCtx.lineWidth = 2.5;
        monitorCtx.beginPath();
        monitorCtx.roundRect(boxX, boxY, boxW, boxH, 16);
        monitorCtx.fill();
        monitorCtx.stroke();

        // OSD Header Bar
        monitorCtx.fillStyle = '#1e293b';
        monitorCtx.beginPath();
        monitorCtx.roundRect(boxX, boxY, boxW, 38, [16, 16, 0, 0]);
        monitorCtx.fill();

        monitorCtx.fillStyle = '#38bdf8';
        monitorCtx.font = 'bold 15px system-ui, sans-serif';
        monitorCtx.textAlign = 'left';
        monitorCtx.fillText('INPUT: DISPLAYPORT 1.4a', boxX + 16, boxY + 24);

        // Status NO SIGNAL
        monitorCtx.fillStyle = '#f87171';
        monitorCtx.font = 'bold 24px system-ui, sans-serif';
        monitorCtx.textAlign = 'center';
        monitorCtx.fillText('NO SIGNAL DETECTED', boxX + boxW / 2, boxY + 85);

        monitorCtx.fillStyle = '#94a3b8';
        monitorCtx.font = '13px system-ui, sans-serif';
        monitorCtx.fillText('Menunggu transmisi sinyal video dari kartu grafis...', boxX + boxW / 2, boxY + 118);
        monitorCtx.fillText('Pastikan kabel display terpasang dan PC menyala.', boxX + boxW / 2, boxY + 140);

        monitorLight.intensity = 0.45;
        monitorLight.color.setHex(0x38bdf8);
    }

    // =========================================================================
    // 2. STATE: BIOS POST HARDWARE DISCOVERY (UEFI System Self-Test)
    // =========================================================================
    else if (currentState === 'BIOS') {
        monitorCtx.fillStyle = '#05070f';
        monitorCtx.fillRect(0, 0, w, h);

        // Header Top Bar
        monitorCtx.fillStyle = '#0369a1';
        monitorCtx.fillRect(0, 0, w, 44);

        monitorCtx.fillStyle = '#ffffff';
        monitorCtx.font = 'bold 18px monospace';
        monitorCtx.textAlign = 'left';
        monitorCtx.fillText('VIRLAB PRO UEFI BIOS UTILITY - EZ MODE (x64) v4.8', 25, 28);

        // Waktu Sistem BIOS
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        monitorCtx.font = '14px monospace';
        monitorCtx.textAlign = 'right';
        monitorCtx.fillText(`SYSTEM CLOCK: ${timeStr} | POST OK`, w - 25, 28);

        // Informasi Motherboard & Platform
        monitorCtx.textAlign = 'left';
        monitorCtx.fillStyle = '#38bdf8';
        monitorCtx.font = 'bold 15px monospace';
        monitorCtx.fillText(`MAINBOARD: ${state.installed.motherboard ? state.installed.motherboard.name : 'Unknown Platform'}`, 30, 80);

        // Tabel Deteksi Perangkat Keras Nyata
        monitorCtx.fillStyle = '#1e293b';
        monitorCtx.fillRect(25, 95, 974, 250);
        monitorCtx.strokeStyle = '#334155';
        monitorCtx.lineWidth = 1;
        monitorCtx.strokeRect(25, 95, 974, 250);

        const cpuName = state.installed.cpu ? state.installed.cpu.name : 'TIDAK TERDETEKSI';
        const ramName = state.installed.ram ? `${state.installed.ram.name} (Dual-Channel Slot 2 & 4 Active)` : 'TIDAK TERDETEKSI';
        const gpuName = state.installed.gpu ? `${state.installed.gpu.name} (PCIe 4.0 x16 @ 16 GT/s)` : 'TIDAK TERDETEKSI';
        const storageName = state.installed.storage ? `${state.installed.storage.name} (Primary M.2 NVMe)` : 'TIDAK ADA MEDIA PENYIMPANAN';

        monitorCtx.font = '14px monospace';
        const drawHwRow = (label, val, y, isWarn = false) => {
            monitorCtx.fillStyle = '#94a3b8';
            monitorCtx.fillText(label, 45, y);
            monitorCtx.fillStyle = isWarn ? '#ef4444' : '#ffffff';
            monitorCtx.fillText(val, 240, y);
            monitorCtx.fillStyle = isWarn ? '#ef4444' : '#10b981';
            monitorCtx.fillText(isWarn ? '[PERIKSA]' : '[OK]', 920, y);
        };

        drawHwRow('Prosesor (CPU)    :', cpuName, 130, !state.installed.cpu);
        drawHwRow('Memori Utama (RAM):', ramName, 165, !state.installed.ram);
        drawHwRow('Kartu Grafis (GPU):', gpuName, 200, !state.installed.gpu);
        drawHwRow('Media Penyimpanan :', storageName, 235, !state.installed.storage);

        // Deteksi USB Dongle Keyboard Nirkabel
        const kbStatus = state.isKeyboardConnected ? 'TERDETEKSI (USB HID 2.4GHz Wireless)' : 'TIDAK TERDETEKSI (USB Dongle Belum Dicolok ke Casing)';
        drawHwRow('Keyboard Nirkabel :', kbStatus, 270, !state.isKeyboardConnected);

        // Telemetri Suhu & Arus
        monitorCtx.fillStyle = '#38bdf8';
        monitorCtx.font = '13px monospace';
        monitorCtx.fillText('STATUS TERMAL & LISTRIK: CPU Temp 38°C | Fan Speed 1250 RPM | PSU Rel DC: +12.06V, +5.02V, +3.31V [Stabil]', 45, 318);

        // Bottom Navigation Tips
        monitorCtx.fillStyle = '#0f172a';
        monitorCtx.fillRect(0, 468, w, 44);
        monitorCtx.fillStyle = '#cbd5e1';
        monitorCtx.font = '13px monospace';
        monitorCtx.fillText('<DEL> atau <F2>: BIOS Setup  |  <F11>: Boot Menu  |  Inisialisasi sistem berhasil, melanjutkan ke OS...', 30, 495);

        monitorLight.intensity = 1.2;
        monitorLight.color.setHex(0xffffff);
    }

    // =========================================================================
    // 3. STATE: ERROR NO BOOTABLE DEVICE FOUND (Jika Storage Tidak Dipasang)
    // =========================================================================
    else if (currentState === 'NO_BOOT_DEVICE') {
        monitorCtx.fillStyle = '#000000';
        monitorCtx.fillRect(0, 0, w, h);

        monitorCtx.fillStyle = '#f8fafc';
        monitorCtx.font = '17px "Courier New", monospace';
        monitorCtx.textAlign = 'left';

        monitorCtx.fillText('VIRLAB BIOS POST Verification Successful.', 40, 60);
        monitorCtx.fillText('Checking for Bootable Storage Media...', 40, 90);

        monitorCtx.fillStyle = '#ef4444';
        monitorCtx.font = 'bold 18px "Courier New", monospace';
        monitorCtx.fillText('ERROR: Reboot and Select proper Boot device', 40, 150);
        monitorCtx.fillText('or Insert Boot Media in selected Boot device and press a key', 40, 180);

        monitorCtx.fillStyle = '#94a3b8';
        monitorCtx.font = '14px monospace';
        monitorCtx.fillText('Tips Edukasi: Pasang SSD M.2 NVMe melalui katalog hardware untuk memuat sistem operasi.', 40, 240);

        // Kursor terminal berkedip (blinking cursor)
        if (Math.sin(time * 6) > 0) {
            monitorCtx.fillStyle = '#ffffff';
            monitorCtx.fillRect(40, 280, 12, 22);
        }

        monitorLight.intensity = 0.5;
        monitorLight.color.setHex(0xef4444);
    }

    // =========================================================================
    // 4. STATE: BOOTING OS (Animasi Spinner & Logo Modern)
    // =========================================================================
    else if (currentState === 'BOOTING') {
        monitorCtx.fillStyle = '#090d16';
        monitorCtx.fillRect(0, 0, w, h);

        // Modern Minimalist Logo Box
        const logoX = 475, logoY = 150, size = 34, gap = 6;
        monitorCtx.fillStyle = '#0284c7';
        monitorCtx.fillRect(logoX, logoY, size, size);
        monitorCtx.fillRect(logoX + size + gap, logoY, size, size);
        monitorCtx.fillRect(logoX, logoY + size + gap, size, size);
        monitorCtx.fillRect(logoX + size + gap, logoY + size + gap, size, size);

        // Text Logo
        monitorCtx.fillStyle = '#f8fafc';
        monitorCtx.font = 'bold 28px system-ui, sans-serif';
        monitorCtx.textAlign = 'center';
        monitorCtx.fillText('VIRLAB OS', 512, 260);

        // Circular Fluent Progress Spinner
        const spinRadius = 20;
        const spinX = 512, spinY = 320;
        for (let i = 0; i < 6; i++) {
            const dotAngle = time * 5 - i * 0.35;
            const dx = spinX + Math.cos(dotAngle) * spinRadius;
            const dy = spinY + Math.sin(dotAngle) * spinRadius;
            const dotSize = Math.max(1.5, 4.5 - i * 0.6);

            monitorCtx.beginPath();
            monitorCtx.arc(dx, dy, dotSize, 0, Math.PI * 2);
            monitorCtx.fillStyle = `rgba(56, 189, 248, ${1 - i * 0.16})`;
            monitorCtx.fill();
        }

        // Subtext status
        monitorCtx.fillStyle = '#64748b';
        monitorCtx.font = '13px system-ui, sans-serif';
        monitorCtx.fillText('Memuat layanan sistem laboratorium...', 512, 380);

        monitorLight.intensity = 1.1;
        monitorLight.color.setHex(0x0284c7);
    }

    // =========================================================================
    // 5. STATE: DESKTOP SIMULATION (Sistem Operasi Desktop VIRLAB Interaktif)
    // =========================================================================
    else if (currentState === 'DESKTOP') {
        // High-Tech Laboratory Desktop Wallpaper
        const grad = monitorCtx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e293b');
        grad.addColorStop(1, '#0c4a6e');
        monitorCtx.fillStyle = grad;
        monitorCtx.fillRect(0, 0, w, h);

        // Garis-garis aksen grid teknologi pada wallpaper
        monitorCtx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        monitorCtx.lineWidth = 1;
        for (let gx = 0; gx < w; gx += 64) {
            monitorCtx.beginPath();
            monitorCtx.moveTo(gx, 0);
            monitorCtx.lineTo(gx, h - 48);
            monitorCtx.stroke();
        }
        for (let gy = 0; gy < h - 48; gy += 64) {
            monitorCtx.beginPath();
            monitorCtx.moveTo(0, gy);
            monitorCtx.lineTo(w, gy);
            monitorCtx.stroke();
        }

        // Ikon-ikon Desktop di Sisi Kiri
        const drawDesktopIcon = (iconSym, title, ix, iy) => {
            monitorCtx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            monitorCtx.beginPath();
            monitorCtx.roundRect(ix, iy, 56, 56, 12);
            monitorCtx.fill();

            monitorCtx.fillStyle = '#38bdf8';
            monitorCtx.font = '24px system-ui, sans-serif';
            monitorCtx.textAlign = 'center';
            monitorCtx.fillText(iconSym, ix + 28, iy + 36);

            monitorCtx.fillStyle = '#ffffff';
            monitorCtx.font = 'bold 11px system-ui, sans-serif';
            monitorCtx.fillText(title, ix + 28, iy + 74);
        };

        drawDesktopIcon('💻', 'PC Ini', 35, 30);
        drawDesktopIcon('📊', 'Hardware', 35, 125);
        drawDesktopIcon('⚡', 'Terminal', 35, 220);
        drawDesktopIcon('📁', 'Berkas Lab', 35, 315);

        // Jendela Aplikasi Aktif: "VIRLAB HARDWARE DIAGNOSTIC SUITE"
        const winX = 170, winY = 40, winW = 680, winH = 370;

        // Window Frame
        monitorCtx.fillStyle = '#0f172a';
        monitorCtx.strokeStyle = '#38bdf8';
        monitorCtx.lineWidth = 2;
        monitorCtx.beginPath();
        monitorCtx.roundRect(winX, winY, winW, winH, 16);
        monitorCtx.fill();
        monitorCtx.stroke();

        // Window Title Bar
        monitorCtx.fillStyle = '#1e293b';
        monitorCtx.beginPath();
        monitorCtx.roundRect(winX, winY, winW, 38, [16, 16, 0, 0]);
        monitorCtx.fill();

        // Tombol Close/Min/Max Khas Desktop
        const btnY = winY + 19;
        monitorCtx.fillStyle = '#ef4444';
        monitorCtx.beginPath();
        monitorCtx.arc(winX + 22, btnY, 6, 0, Math.PI * 2);
        monitorCtx.fill();

        monitorCtx.fillStyle = '#f59e0b';
        monitorCtx.beginPath();
        monitorCtx.arc(winX + 40, btnY, 6, 0, Math.PI * 2);
        monitorCtx.fill();

        monitorCtx.fillStyle = '#10b981';
        monitorCtx.beginPath();
        monitorCtx.arc(winX + 58, btnY, 6, 0, Math.PI * 2);
        monitorCtx.fill();

        // Window Title Text
        monitorCtx.fillStyle = '#ffffff';
        monitorCtx.font = 'bold 13px system-ui, sans-serif';
        monitorCtx.textAlign = 'left';
        monitorCtx.fillText('VIRLAB Professional Hardware Monitor & Benchmark v2026', winX + 80, winY + 24);

        // Konten Diagnostik di dalam Jendela
        // Kartu Status CPU
        monitorCtx.fillStyle = '#1e293b';
        monitorCtx.beginPath();
        monitorCtx.roundRect(winX + 25, winY + 55, 300, 135, 12);
        monitorCtx.fill();

        monitorCtx.fillStyle = '#38bdf8';
        monitorCtx.font = 'bold 14px system-ui, sans-serif';
        monitorCtx.fillText('STATUS PROSESOR (CPU)', winX + 40, winY + 80);
        monitorCtx.fillStyle = '#ffffff';
        monitorCtx.font = '12px monospace';
        monitorCtx.fillText(state.installed.cpu ? state.installed.cpu.name : 'Unknown CPU', winX + 40, winY + 105);
        monitorCtx.fillStyle = '#10b981';
        const cpuUsage = Math.floor(12 + Math.sin(time * 2) * 5);
        monitorCtx.fillText(`Beban Aktif : ${cpuUsage}% [Normal]`, winX + 40, winY + 130);
        monitorCtx.fillText(`Suhu Inti   : 39°C (TjMax 95°C)`, winX + 40, winY + 152);
        monitorCtx.fillText(`Pendingin   : ${state.installed.cooler?.name || 'Cooler Standar'}`, winX + 40, winY + 172);

        // Kartu Status GPU & VRAM
        monitorCtx.fillStyle = '#1e293b';
        monitorCtx.beginPath();
        monitorCtx.roundRect(winX + 350, winY + 55, 305, 135, 12);
        monitorCtx.fill();

        monitorCtx.fillStyle = '#a855f7';
        monitorCtx.font = 'bold 14px system-ui, sans-serif';
        monitorCtx.fillText('STATUS KARTU GRAFIS (GPU)', winX + 365, winY + 80);
        monitorCtx.fillStyle = '#ffffff';
        monitorCtx.font = '12px monospace';
        monitorCtx.fillText(state.installed.gpu ? state.installed.gpu.name : 'Integrated Graphics', winX + 365, winY + 105);
        monitorCtx.fillStyle = '#10b981';
        monitorCtx.fillText(`Suhu GPU    : 34°C (Fan 0 RPM Silent)`, winX + 365, winY + 130);
        monitorCtx.fillText(`VRAM        : ${state.installed.gpu?.vram || '8 GB GDDR6'}`, winX + 365, winY + 152);
        monitorCtx.fillText(`Driver      : Game Ready WHQL v552.12`, winX + 365, winY + 172);

        // Kartu Status RAM & Storage di Bawah
        monitorCtx.fillStyle = '#1e293b';
        monitorCtx.beginPath();
        monitorCtx.roundRect(winX + 25, winY + 205, 630, 140, 12);
        monitorCtx.fill();

        monitorCtx.fillStyle = '#38bdf8';
        monitorCtx.font = 'bold 14px system-ui, sans-serif';
        monitorCtx.fillText('STATUS MEMORI RAM & MEDIA PENYIMPANAN NVMe', winX + 40, winY + 230);

        monitorCtx.fillStyle = '#ffffff';
        monitorCtx.font = '12px monospace';
        monitorCtx.fillText(`Memori RAM  : ${state.installed.ram?.name || '16GB'} | EXPO/XMP Aktif (Kecepatan Penuh)`, winX + 40, winY + 255);
        monitorCtx.fillText(`Penyimpanan : ${state.installed.storage?.name || 'SSD 1TB'} (Health: 100% S.M.A.R.T. Good)`, winX + 40, winY + 278);
        monitorCtx.fillText(`Kecepatan   : Read 7,450 MB/s  |  Write 6,900 MB/s (PCIe 4.0 x4 Protocol)`, winX + 40, winY + 300);
        monitorCtx.fillStyle = '#10b981';
        monitorCtx.fillText(`Status Sistem : SEMUA KOMPONEN BERJALAN OPTIMAL DENGAN KINERJA PENUH`, winX + 40, winY + 325);

        // Taskbar Modern di Sisi Bawah
        monitorCtx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        monitorCtx.fillRect(0, 464, w, 48);

        // Start Button Khas Modern OS
        monitorCtx.fillStyle = '#0284c7';
        monitorCtx.beginPath();
        monitorCtx.roundRect(18, 472, 32, 32, 8);
        monitorCtx.fill();

        monitorCtx.fillStyle = '#ffffff';
        monitorCtx.font = 'bold 16px system-ui, sans-serif';
        monitorCtx.textAlign = 'center';
        monitorCtx.fillText('⊞', 34, 494);

        // Search pill di taskbar
        monitorCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        monitorCtx.beginPath();
        monitorCtx.roundRect(62, 472, 140, 32, 8);
        monitorCtx.fill();
        monitorCtx.fillStyle = '#94a3b8';
        monitorCtx.font = '12px system-ui, sans-serif';
        monitorCtx.textAlign = 'left';
        monitorCtx.fillText('🔍 Cari di VIRLAB...', 74, 492);

        // System Tray & Live Clock
        const curDate = new Date();
        const timeNow = curDate.toTimeString().split(' ')[0];
        const dateNow = curDate.toLocaleDateString('id-ID');

        monitorCtx.fillStyle = '#ffffff';
        monitorCtx.font = 'bold 12px monospace';
        monitorCtx.textAlign = 'right';
        monitorCtx.fillText(timeNow, w - 24, 486);
        monitorCtx.fillStyle = '#94a3b8';
        monitorCtx.font = '10px monospace';
        monitorCtx.fillText(dateNow, w - 24, 501);

        // Ikon Wi-Fi & Speaker Tray
        monitorCtx.fillStyle = '#38bdf8';
        monitorCtx.font = '12px system-ui, sans-serif';
        monitorCtx.fillText('📶  🔊  🔋', w - 110, 493);

        monitorLight.intensity = 1.85;
        monitorLight.color.setHex(0x38bdf8);
    }

    // =========================================================================
    // 6. STATE: OFF (Layar Hitam Padam)
    // =========================================================================
    else {
        monitorCtx.fillStyle = '#040608';
        monitorCtx.fillRect(0, 0, w, h);
        monitorLight.intensity = 0;
    }

    monitorTexture.needsUpdate = true;
}
