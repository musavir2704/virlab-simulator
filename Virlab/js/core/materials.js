/**
 * VIRLAB-SIMULATOR: High-Fidelity PBR Materials & Dynamic Collections
 * Koleksi material fisik prosedural Three.js, generator CanvasTexture fotorealistik,
 * dan array dinamis untuk animasi RGB, rotasi kipas, serta display AIO.
 */

import * as THREE from 'three';

// 1. MONITOR TEXTURE & CANVAS
export const monitorCanvas = document.createElement('canvas');
monitorCanvas.width = 1024;
monitorCanvas.height = 512;
export const monitorCtx = monitorCanvas.getContext('2d');
export const monitorTexture = new THREE.CanvasTexture(monitorCanvas);
monitorTexture.colorSpace = THREE.SRGBColorSpace;

// 2. AIO COOLER LCD DISPLAY TEXTURE & CANVAS
export const aioCanvas = document.createElement('canvas');
aioCanvas.width = 256;
aioCanvas.height = 256;
export const aioCtx = aioCanvas.getContext('2d');
export const aioTexture = new THREE.CanvasTexture(aioCanvas);
aioTexture.colorSpace = THREE.SRGBColorSpace;

// Inisialisasi tampilan LCD AIO
let lastAioUpdate = 0;
let lastAioPowerState = null;

export function updateAioDisplay(isPowered, time = 0) {
    if (!aioCtx) return;

    if (!isPowered) {
        if (lastAioPowerState !== false) {
            const w = 256, h = 256;
            aioCtx.clearRect(0, 0, w, h);
            aioCtx.fillStyle = '#0a0d14';
            aioCtx.beginPath();
            aioCtx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
            aioCtx.fill();
            aioCtx.strokeStyle = '#1e293b';
            aioCtx.lineWidth = 4;
            aioCtx.stroke();
            aioTexture.needsUpdate = true;
            lastAioPowerState = false;
        }
        return;
    }

    lastAioPowerState = true;

    // Batasi update saat menyala menjadi ~15 fps (hemat daya GPU dan meminimalkan texture uploads)
    if (time - lastAioUpdate < 0.066) return;
    lastAioUpdate = time;

    const w = 256, h = 256;
    aioCtx.clearRect(0, 0, w, h);

    // Latar belakang circular screen
    aioCtx.fillStyle = '#0a0d14';
    aioCtx.beginPath();
    aioCtx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2);
    aioCtx.fill();

    // Outer Tech Gauge Ring
    const temp = Math.floor(38 + Math.sin(time * 0.8) * 3);

    // Glowing Arc
    const grad = aioCtx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#06b6d4');
    grad.addColorStop(0.5, '#3b82f6');
    grad.addColorStop(1, '#8b5cf6');

    aioCtx.strokeStyle = grad;
    aioCtx.lineWidth = 8;
    aioCtx.lineCap = 'round';
    aioCtx.beginPath();
    aioCtx.arc(w / 2, h / 2, 100, -Math.PI * 0.75, Math.PI * 0.75 * (temp / 60));
    aioCtx.stroke();

    // Background track
    aioCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    aioCtx.lineWidth = 4;
    aioCtx.beginPath();
    aioCtx.arc(w / 2, h / 2, 100, -Math.PI * 0.75, Math.PI * 0.75);
    aioCtx.stroke();

    // Center Readout
    aioCtx.fillStyle = '#ffffff';
    aioCtx.font = 'bold 54px system-ui, -apple-system, sans-serif';
    aioCtx.textAlign = 'center';
    aioCtx.textBaseline = 'middle';
    aioCtx.fillText(`${temp}°C`, w / 2, h / 2 - 8);

    // Label
    aioCtx.fillStyle = '#94a3b8';
    aioCtx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    aioCtx.fillText('CPU LIQUID TEMP', w / 2, h / 2 + 35);

    // Brand tag
    aioCtx.fillStyle = '#38bdf8';
    aioCtx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    aioCtx.fillText('VIRLAB HYDRO', w / 2, h / 2 + 55);

    aioTexture.needsUpdate = true;
}

// 3. GENERATOR PROCEDURAL CANVASTEXTURES UNTUK REALISME DETAIL

/**
 * Tekstur PCB Motherboard Prosedural (Jalur sirkuit, chip, silkscreen, capacitor pads)
 */
export function createMotherboardTexture(isTuf = true) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Dasar PCB Matte
    ctx.fillStyle = isTuf ? '#0d131a' : '#080a0f';
    ctx.fillRect(0, 0, 512, 512);

    // Garis Jalur Sirkuit Emas / Tembaga Halus
    ctx.strokeStyle = isTuf ? 'rgba(212, 175, 55, 0.22)' : 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 1.2;

    // Bus lines
    for (let y = 30; y < 480; y += 18) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(160, y);
        ctx.lineTo(210, y + 20);
        ctx.lineTo(460, y + 20);
        ctx.stroke();
    }

    for (let x = 80; x < 450; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 100);
        ctx.lineTo(x, 260);
        ctx.lineTo(x + 20, 310);
        ctx.lineTo(x + 20, 480);
        ctx.stroke();
    }

    // Audio trace separation line (amber / cyan glowing trace)
    ctx.strokeStyle = isTuf ? '#f59e0b' : '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(30, 280);
    ctx.lineTo(75, 340);
    ctx.lineTo(75, 490);
    ctx.stroke();

    // Solder pads array (Capacitor & resistor matrix)
    ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
    for (let i = 0; i < 90; i++) {
        const px = 60 + ((i * 37) % 380);
        const py = 50 + ((i * 53) % 400);
        ctx.fillRect(px, py, 4, 3);
        ctx.fillRect(px + 6, py, 4, 3);
    }

    // Silkscreen Text Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('PCIEX16_1 (GEN 4.0)', 180, 240);
    ctx.fillText('PCIEX16_2', 180, 360);
    ctx.fillText('M.2_1 (64Gb/s)', 180, 190);
    ctx.fillText('M.2_2 (32Gb/s)', 180, 395);
    ctx.fillText('DDR4_A1/B1 (DUAL CH)', 340, 60);
    ctx.fillText('CPU_FAN', 240, 40);
    ctx.fillText('ATX_POWER_24P', 430, 180);
    ctx.fillText('AUDIO_CODEC_HD', 30, 470);

    // Brand Logo Silkscreen
    ctx.fillStyle = isTuf ? '#eab308' : '#ef4444';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(isTuf ? 'TUF GAMING' : 'ROG HERO', 260, 470);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(isTuf ? 'B550-PLUS MILITARY GRADE' : 'X670E EXTREME OC', 260, 485);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

/**
 * Tekstur Laser Etched Heat Spreader CPU (AMD Ryzen, model, QR matrix)
 */
export function createCpuIhsTexture(name = 'AMD Ryzen 5 5600X', socket = 'AM4') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Latar brushed nickel metal
    ctx.fillStyle = '#c5cad3';
    ctx.fillRect(0, 0, 256, 256);

    // Halus serat brushed metal
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let y = 0; y < 256; y += 2) {
        ctx.fillRect(0, y, 256, 1);
    }

    // Laser Etch Logo AMD
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('AMD', 30, 50);

    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
    ctx.fillText('Ryzen™', 30, 85);

    // Model Name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px monospace';
    const cleanName = name.replace('AMD ', '').replace(' Desktop Processor', '').replace(' Flagship Processor', '');
    ctx.fillText(cleanName, 30, 125);

    // Technical Subtext
    ctx.fillStyle = '#475569';
    ctx.font = '9px monospace';
    ctx.fillText(`SOCKET ${socket} ARCHITECTURE`, 30, 155);
    ctx.fillText('DIFFUSED IN TAIWAN', 30, 172);
    ctx.fillText('MADE IN MALAYSIA', 30, 186);
    ctx.fillText('SN: 9JA3820R10294-AA', 30, 202);

    // 2D Matrix / QR Code Simulation
    ctx.fillStyle = '#1e293b';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if ((r + c * 3) % 2 === 0 || (r === 0 && c === 0) || (r === 7 && c === 7)) {
                ctx.fillRect(180 + c * 5, 40 + r * 5, 4, 4);
            }
        }
    }

    // Gold Triangle Indicator (Sudut orientasi pin 1)
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.moveTo(18, 238);
    ctx.lineTo(34, 238);
    ctx.lineTo(18, 222);
    ctx.closePath();
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

/**
 * Tekstur Label M.2 NVMe SSD (Samsung V-NAND, controller, barcode)
 */
export function createSsdLabelTexture(name = 'Samsung 980 1TB') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 256, 96);

    // Silver border line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 248, 88);

    // Brand
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('SAMSUNG', 16, 26);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(name.includes('990') ? '990 PRO NVMe M.2' : '980 NVMe M.2 SSD', 16, 46);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText('PCIe Gen 4.0 x4 | V-NAND 3-bit MLC', 16, 62);
    ctx.fillText('MODEL: MZ-V8V1T0BW 1000GB', 16, 75);

    // Barcode Simulation
    ctx.fillStyle = '#ffffff';
    for (let x = 175; x < 240; x += 4) {
        if (x % 3 !== 0) ctx.fillRect(x, 15, 2, 45);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

/**
 * Tekstur Label Spesifikasi PSU (Tabel output voltase, sertifikasi 80 PLUS)
 */
export function createPsuLabelTexture(brand = 'Corsair', wattage = 750, cert = 'Gold') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 256, 160);

    // Header Brand & Model
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText(brand.toUpperCase(), 16, 30);

    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillStyle = cert.includes('Titanium') ? '#e2e8f0' : '#eab308';
    ctx.fillText(`${wattage}W`, 175, 32);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('ATX 12V ADVANCED POWER SUPPLY', 16, 46);

    // Output Rating Table
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 55, 228, 65);

    // Table Header
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(14, 55, 228, 18);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('DC OUTPUT  +3.3V  +5V   +12V   -12V  +5Vsb', 20, 68);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`MAX CURRENT  20A   20A   ${Math.floor(wattage / 12)}A   0.3A   3.0A`, 20, 88);
    ctx.fillText(`TOTAL POWER       130W     ${wattage - 20}W    3.6W   15W`, 20, 105);

    // 80 PLUS Shield Badge
    ctx.fillStyle = cert.includes('Titanium') ? '#94a3b8' : '#ca8a04';
    ctx.fillRect(16, 128, 70, 22);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px system-ui, sans-serif';
    ctx.fillText(`80 PLUS ${cert.toUpperCase()}`, 20, 143);

    // Regulatory stamps
    ctx.fillStyle = '#64748b';
    ctx.font = '8px monospace';
    ctx.fillText('CE  FCC  RoHS  TUV  EAC', 110, 142);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

// 4. KOLEKSI LENGKAP PBR MATERIALS
export const materials = {
    // Logam & Chassis
    blackMetal: new THREE.MeshStandardMaterial({
        color: 0x1a1e24,
        roughness: 0.35,
        metalness: 0.85
    }),
    darkSteel: new THREE.MeshStandardMaterial({
        color: 0x0f1318,
        roughness: 0.45,
        metalness: 0.9
    }),
    silver: new THREE.MeshStandardMaterial({
        color: 0xd2d7e0,
        roughness: 0.22,
        metalness: 0.92
    }),
    aluminum: new THREE.MeshStandardMaterial({
        color: 0x9aa2ad,
        roughness: 0.32,
        metalness: 0.88
    }),
    chrome: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.08,
        metalness: 0.98
    }),
    copper: new THREE.MeshStandardMaterial({
        color: 0xc87444,
        roughness: 0.25,
        metalness: 0.95
    }),
    gold: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.18,
        metalness: 0.96
    }),
    whiteChassis: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.35,
        metalness: 0.65
    }),

    // Sirkuit & PCB
    pcb: new THREE.MeshStandardMaterial({
        color: 0x0c1117,
        roughness: 0.85,
        metalness: 0.2
    }),
    pcbGreen: new THREE.MeshStandardMaterial({
        color: 0x165b2e,
        roughness: 0.8,
        metalness: 0.15
    }),

    // Plastik & Polimer
    plastic: new THREE.MeshStandardMaterial({
        color: 0x181c22,
        roughness: 0.65,
        metalness: 0.1
    }),
    plasticLight: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.5,
        metalness: 0.08
    }),
    keyboardKey: new THREE.MeshStandardMaterial({
        color: 0x14181f,
        roughness: 0.75,
        metalness: 0.05
    }),
    fanBlade: new THREE.MeshStandardMaterial({
        color: 0x111419,
        roughness: 0.4,
        metalness: 0.35
    }),
    rubber: new THREE.MeshStandardMaterial({
        color: 0x090b0e,
        roughness: 0.9,
        metalness: 0.02
    }),

    // Kaca Transparan & Smoked
    glass: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.92,
        opacity: 0.3,
        metalness: 0.08,
        roughness: 0.06,
        transparent: true,
        ior: 1.52
    }),
    smokedGlass: new THREE.MeshPhysicalMaterial({
        color: 0x1e293b,
        transmission: 0.72,
        opacity: 0.55,
        metalness: 0.15,
        roughness: 0.05,
        transparent: true,
        ior: 1.54
    }),

    // Emissive & RGB
    rgbOff: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        emissive: 0x000000,
        roughness: 0.28,
        metalness: 0.1
    }),
    redSwitchOff: new THREE.MeshStandardMaterial({
        color: 0x7f1d1d,
        roughness: 0.45,
        metalness: 0.2
    }),
    redSwitchOn: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 0.75,
        roughness: 0.3
    }),
    greenLed: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.8
    }),
    blueLed: new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.85
    }),

    // Layar
    monitorScreen: new THREE.MeshBasicMaterial({
        map: monitorTexture
    }),
    aioScreen: new THREE.MeshBasicMaterial({
        map: aioTexture
    })
};

// 5. KOLEKSI ANIMASI DINAMIS
export const rgbMaterials = [];
export const fanMeshes = [];

export function registerRGBMaterial(material) {
    if (material && !rgbMaterials.includes(material)) {
        rgbMaterials.push(material);
    }
}

export function registerFanMesh(mesh) {
    if (mesh && !fanMeshes.includes(mesh)) {
        fanMeshes.push(mesh);
    }
}

export function clearDynamicCollections() {
    fanMeshes.length = 0;
    rgbMaterials.length = 0;
}

/**
 * Utilitas pelepasan memori GPU (VRAM disposal) untuk seluruh geometri pada grup 3D
 */
export function disposeGeometries(group) {
    if (!group) return;
    group.traverse((child) => {
        if (child.isMesh && child.geometry) {
            child.geometry.dispose();
        }
    });
}
