/**
 * VIRLAB-SIMULATOR: 3D Hardware Component Procedural Builders
 * Membangun model 3D komponen PC fotorealistik & berdetail tinggi:
 * Casing, Motherboard, CPU, RAM, GPU, Storage, Cooler, PSU, dan Pengkabelan Fleksibel.
 */

import * as THREE from 'three';
import {
    materials,
    registerRGBMaterial,
    registerFanMesh,
    createMotherboardTexture,
    createCpuIhsTexture,
    createSsdLabelTexture,
    createPsuLabelTexture,
    disposeGeometries
} from '../core/materials.js';
import { cableGroup } from '../core/scene.js';
import { PC_OFFSET } from '../core/constants.js';

export let pcDropHitbox = null;

/**
 * Membuat Kipas Pendingin Berdetail (Housing, Duct, Rotor, Sculpted Blades, RGB Ring)
 */
export function createFan(isRGB = false, size = 0.12, bladeCount = 7, depth = 0.035) {
    const fanGrp = new THREE.Group();

    // 1. Frame / Housing Luar Kotak dengan Bevel
    const frameMat = materials.plastic;
    const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(size * 2, size * 2, depth), frameMat);
    fanGrp.add(outerFrame);

    // Lubang Baut Sudut & Rubber Vibration Pads
    const padGeo = new THREE.BoxGeometry(size * 0.35, size * 0.35, depth * 1.05);
    const screwHoleGeo = new THREE.CylinderGeometry(size * 0.05, size * 0.05, depth * 1.1, 8);
    const padPositions = [
        [-size * 0.8, -size * 0.8],
        [size * 0.8, -size * 0.8],
        [-size * 0.8, size * 0.8],
        [size * 0.8, size * 0.8]
    ];

    padPositions.forEach(([px, py]) => {
        const pad = new THREE.Mesh(padGeo, materials.rubber);
        pad.position.set(px, py, 0);
        const hole = new THREE.Mesh(screwHoleGeo, materials.silver);
        hole.rotation.x = Math.PI / 2;
        hole.position.set(px, py, 0);
        fanGrp.add(pad, hole);
    });

    // 2. Circular Intake Duct Ring
    const duct = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.88, size * 0.88, depth * 1.02, 32, 1, true), frameMat);
    duct.rotation.x = Math.PI / 2;
    fanGrp.add(duct);

    // 3. Rotor Hub Motor & Kipas (Bilah-bilah Kipas Berputar Bersama)
    const rotorGroup = new THREE.Group();

    const hubMat = materials.darkSteel;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.32, size * 0.32, depth * 0.85, 24), hubMat);
    hub.rotation.x = Math.PI / 2;
    rotorGroup.add(hub);

    // Metallic Center Emblem
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.22, size * 0.22, 0.002, 16), materials.silver);
    emblem.rotation.x = Math.PI / 2;
    emblem.position.z = depth * 0.44;
    rotorGroup.add(emblem);

    // Sculpted Aerodynamic Blades
    const bladeGeo = new THREE.BoxGeometry(size * 0.55, 0.006, size * 0.22);
    for (let b = 0; b < bladeCount; b++) {
        const angle = (b / bladeCount) * Math.PI * 2;
        const blade = new THREE.Mesh(bladeGeo, materials.fanBlade);
        blade.position.set(Math.cos(angle) * size * 0.52, Math.sin(angle) * size * 0.52, 0);
        blade.rotation.z = angle + 0.35;
        blade.rotation.y = 0.55; // Angle of attack
        rotorGroup.add(blade);
    }

    fanGrp.add(rotorGroup);
    registerFanMesh(rotorGroup); // Didaftarkan ke array animasi putaran saat PC menyala

    // 4. Cincin RGB Lighting (Jika didukung)
    if (isRGB) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(size * 0.85, size * 0.04, 16, 36), materials.rgbOff.clone());
        ring.position.z = depth * 0.42;
        fanGrp.add(ring);
        registerRGBMaterial(ring.material);
    }

    return fanGrp;
}

/**
 * Membangun PC Case Berdetail Tinggi (Chassis, Tempered Glass, Mesh, Front I/O, Cable Bar, Fans)
 */
export function createCase(item, interactiveObjects) {
    const caseGrp = new THREE.Group();
    const isFull = item.id === 'c2'; // Corsair Obsidian 1000D vs NZXT H510 Flow
    const w = isFull ? 0.95 : 0.82;
    const h = isFull ? 2.05 : 1.82;
    const d = isFull ? 1.85 : 1.62;

    const frameMat = item.id === 'c1' ? materials.whiteChassis : materials.blackMetal;

    // 1. Rangka Utama & Backplate
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(0.04, h, d), frameMat);
    backPanel.position.set(-w / 2, h / 2, 0);
    caseGrp.add(backPanel);

    // Slot Ekspansi PCIe Belakang (7-8 slot logam berventilasi)
    const numPcieSlots = isFull ? 8 : 7;
    for (let p = 0; p < numPcieSlots; p++) {
        const pcieCover = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.035, 0.28), materials.darkSteel);
        pcieCover.position.set(-w / 2 - 0.002, 0.7 + p * 0.045, -0.35);
        caseGrp.add(pcieCover);
    }

    // 2. Kompartemen Bawah & PSU Shroud
    const psuShroud = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, 0.42, d * 0.98), frameMat);
    psuShroud.position.set(0, 0.21, 0);
    caseGrp.add(psuShroud);

    // 4 Kaki Casing dengan Bantalan Karet Non-Slip
    const footPositions = [
        [-w * 0.42, -d * 0.42],
        [w * 0.42, -d * 0.42],
        [-w * 0.42, d * 0.42],
        [w * 0.42, d * 0.42]
    ];
    footPositions.forEach(([fx, fz]) => {
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.06, 16), materials.darkSteel);
        foot.position.set(fx, 0.03, fz);
        const footPad = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.015, 16), materials.rubber);
        footPad.position.set(fx, 0.007, fz);
        caseGrp.add(foot, footPad);
    });

    // 3. Panel Atas dengan Mesh Exhaust
    const topPanel = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), frameMat);
    topPanel.position.set(0, h, 0);
    caseGrp.add(topPanel);

    const topFilter = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, 0.005, d * 0.7), materials.darkSteel);
    topFilter.position.set(0, h + 0.021, -0.1);
    caseGrp.add(topFilter);

    // 4. Panel Depan (Perforated Mesh Airflow untuk H510 Flow / Smoked Glass untuk 1000D)
    if (item.id === 'c1') {
        const frontMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.04), materials.blackMetal);
        frontMesh.position.set(0, h / 2, d / 2);
        caseGrp.add(frontMesh);

        // Aksen Bezel Casing Putih
        const frontBezelL = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.045), frameMat);
        frontBezelL.position.set(-w / 2 + 0.03, h / 2, d / 2 + 0.002);
        const frontBezelR = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.045), frameMat);
        frontBezelR.position.set(w / 2 - 0.03, h / 2, d / 2 + 0.002);
        caseGrp.add(frontBezelL, frontBezelR);
    } else {
        const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.03), materials.smokedGlass);
        frontGlass.position.set(0, h / 2, d / 2);
        caseGrp.add(frontGlass);
    }

    // 5. Panel Samping Tempered Glass dengan Baut Pengencang Sudut
    const glassMat = isFull ? materials.smokedGlass : materials.glass;
    const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.015, h * 0.98, d * 0.98), glassMat);
    sideGlass.position.set(w / 2 + 0.008, h / 2, 0);
    caseGrp.add(sideGlass);

    // 4 Corner Thumbscrews Kaca
    const screwPositions = [
        [h * 0.92, -d * 0.44],
        [h * 0.92, d * 0.44],
        [h * 0.08, -d * 0.44],
        [h * 0.08, d * 0.44]
    ];
    screwPositions.forEach(([sy, sz]) => {
        const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.025, 12), materials.silver);
        screw.rotation.z = Math.PI / 2;
        screw.position.set(w / 2 + 0.02, sy, sz);
        caseGrp.add(screw);
    });

    // 6. Signature Cable Management Bar (Khusus H510 Flow)
    if (item.id === 'c1') {
        const cableBar = new THREE.Mesh(new THREE.BoxGeometry(0.03, h * 0.65, 0.12), materials.whiteChassis);
        cableBar.position.set(-0.05, 1.05, 0.35);
        caseGrp.add(cableBar);
    }

    // 7. Front I/O Panel (Tombol Daya, USB-C, Dual USB 3.0, Audio Jack)
    const ioBase = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.01, 0.08), materials.darkSteel);
    ioBase.position.set(0, h + 0.022, d / 2 - 0.15);
    caseGrp.add(ioBase);

    // Tombol Daya Fisik Casing (Lingkaran Metalik dengan LED Ring)
    const pcPowerBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.015, 24), materials.silver);
    pcPowerBtn.position.set(-0.1, h + 0.03, d / 2 - 0.15);

    const pcPowerLedRing = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.005, 12, 24), materials.blueLed);
    pcPowerLedRing.rotation.x = Math.PI / 2;
    pcPowerLedRing.position.copy(pcPowerBtn.position);
    caseGrp.add(pcPowerBtn, pcPowerLedRing);

    // Port USB-C & USB-A
    const usbcPort = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.005, 0.03), materials.blackMetal);
    usbcPort.position.set(-0.02, h + 0.03, d / 2 - 0.15);
    const usbaPort1 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.008, 0.035), materials.blueLed);
    usbaPort1.position.set(0.04, h + 0.03, d / 2 - 0.15);
    const audioJack = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.01, 16), materials.silver);
    audioJack.position.set(0.1, h + 0.03, d / 2 - 0.15);
    caseGrp.add(usbcPort, usbaPort1, audioJack);

    // Hitbox Tombol Daya Interaktif
    const pcPowerHitbox = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.18), new THREE.MeshBasicMaterial({ visible: false }));
    pcPowerHitbox.position.copy(pcPowerBtn.position);
    pcPowerHitbox.userData.action = 'togglePcPower';
    interactiveObjects.push(pcPowerHitbox);
    caseGrp.add(pcPowerHitbox);

    // 8. Hitbox Drop Zone untuk Wireless USB Dongle
    const portArea = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.15), materials.darkSteel);
    portArea.position.set(0, h + 0.02, d / 2 - 0.45);

    pcDropHitbox = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 1.0), new THREE.MeshBasicMaterial({ visible: false }));
    pcDropHitbox.position.copy(portArea.position);
    caseGrp.add(portArea, pcDropHitbox);

    // 9. Kipas Pre-installed Depan & Belakang
    const numFrontFans = isFull ? 4 : 2;
    for (let f = 0; f < numFrontFans; f++) {
        const fan = createFan(item.rgb, 0.13);
        fan.position.set(0, 0.65 + f * 0.38, d / 2 - 0.07);
        caseGrp.add(fan);
    }

    // Kipas Exhaust Belakang
    const rearFan = createFan(item.rgb, 0.12);
    rearFan.rotation.y = Math.PI / 2;
    rearFan.position.set(-w / 2 + 0.08, 1.35, -0.35);
    caseGrp.add(rearFan);

    return caseGrp;
}

/**
 * Membangun Motherboard Berdetail Tinggi (ATX PCB, CPU Socket, DIMM Slots, PCIe SafeSlots, M.2, VRM Heatsinks, I/O Block)
 */
export function createMotherboard(item) {
    const mbGrp = new THREE.Group();
    const isTuf = item.id === 'mb1';

    // 1. PCB Utama dengan Tekstur Sirkuit Fotorealistik
    const pcbTex = createMotherboardTexture(isTuf);
    const pcbMat = new THREE.MeshStandardMaterial({
        map: pcbTex,
        roughness: 0.75,
        metalness: 0.25
    });

    const pcbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.25, 1.02), pcbMat);
    mbGrp.add(pcbMesh);

    // 9 Lubang Pemasangan Baut ATX dengan Cincin Tembaga
    const standoffPositions = [
        [0.55, -0.45], [0.55, 0], [0.55, 0.45],
        [0, -0.45], [0, 0], [0, 0.45],
        [-0.55, -0.45], [-0.55, 0], [-0.55, 0.45]
    ];
    standoffPositions.forEach(([sy, sz]) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.005, 8, 16), materials.copper);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(0.016, sy, sz);
        mbGrp.add(ring);
    });

    // 2. Soket CPU (AM4 PGA Socket / AM5 LGA 1718 Socket)
    const socketGrp = new THREE.Group();
    socketGrp.position.set(0.02, 0.28, -0.12);

    const socketBase = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.24, 0.24), isTuf ? materials.plasticLight : materials.darkSteel);
    socketGrp.add(socketBase);

    // Retention Frame Logam & Tuas Pengunci (Locking Lever)
    const socketFrame = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.26, 0.26), materials.silver);
    const socketHollow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.21, 0.21), materials.darkSteel);
    socketGrp.add(socketFrame, socketHollow);

    const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.28, 8), materials.chrome);
    lever.position.set(0.012, 0, 0.14);
    socketGrp.add(lever);
    mbGrp.add(socketGrp);

    // 3. VRM Heatsinks Ekstrusi Aluminium Berat di Sekitar CPU
    const vrmTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.36), materials.darkSteel);
    vrmTop.position.set(0.05, 0.48, -0.12);

    const vrmLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.36, 0.14), materials.darkSteel);
    vrmLeft.position.set(0.05, 0.28, -0.34);
    mbGrp.add(vrmTop, vrmLeft);

    // Deretan Kapasitor Silinder Solid & Power Chokes
    for (let c = 0; c < 8; c++) {
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.035, 12), materials.aluminum);
        cap.rotation.z = Math.PI / 2;
        cap.position.set(0.03, 0.12 + c * 0.04, -0.24);

        const choke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.028, 0.028), materials.plastic);
        choke.position.set(0.03, 0.12 + c * 0.04, -0.28);
        mbGrp.add(cap, choke);
    }

    // 4. Rear I/O Armor Block Terintegrasi (Port HDMI, DP, USB, LAN, Audio)
    const ioBlock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.52, 0.16), materials.blackMetal);
    ioBlock.position.set(0.07, 0.35, -0.44);
    mbGrp.add(ioBlock);

    // Polymo / Aura RGB Display pada I/O Shield (Khusus ROG X670E)
    if (!isTuf) {
        const rogRgb = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.3), materials.rgbOff.clone());
        rogRgb.rotation.y = Math.PI / 2;
        rogRgb.position.set(0.131, 0.35, -0.44);
        registerRGBMaterial(rogRgb.material);
        mbGrp.add(rogRgb);
    }

    // 5. 4x Slot RAM DDR4/DDR5 Dual Channel dengan Klip Retensi
    for (let r = 0; r < 4; r++) {
        const ramSlotMat = r % 2 === 0 ? materials.blackMetal : (isTuf ? materials.plasticLight : materials.darkSteel);
        const ramSlot = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.54, 0.022), ramSlotMat);
        ramSlot.position.set(0.02, 0.28, 0.14 + r * 0.06);

        // Klip Pengunci Atas & Bawah
        const clipTop = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.03, 0.022), materials.silver);
        clipTop.position.set(0.022, 0.56, 0.14 + r * 0.06);
        const clipBottom = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.03, 0.022), materials.silver);
        clipBottom.position.set(0.022, 0.0, 0.14 + r * 0.06);

        mbGrp.add(ramSlot, clipTop, clipBottom);
    }

    // 6. PCIe Expansion Slots (Slot 1 Dilapisi Metal Armor SafeSlot)
    const pcie1 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.035, 0.65), materials.silver); // SafeSlot Logam
    pcie1.position.set(0.025, -0.1, -0.05);

    const pcieLatch1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 0.04), materials.plasticLight);
    pcieLatch1.position.set(0.025, -0.1, 0.3);
    mbGrp.add(pcie1, pcieLatch1);

    const pcie2 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.035, 0.65), materials.darkSteel);
    pcie2.position.set(0.02, -0.35, -0.05);
    mbGrp.add(pcie2);

    // 7. Heatsink Thermal M.2 NVMe dengan Pelindung Aluminium
    const m2Heatsink1 = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.06, 0.38), materials.aluminum);
    m2Heatsink1.position.set(0.03, 0.02, -0.05);
    mbGrp.add(m2Heatsink1);

    const m2Heatsink2 = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.06, 0.38), materials.aluminum);
    m2Heatsink2.position.set(0.03, -0.22, -0.05);
    mbGrp.add(m2Heatsink2);

    // 8. Heatsink Chipset Utama di Kanan Bawah
    const chipsetHeatsink = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.28, 0.28), materials.blackMetal);
    chipsetHeatsink.position.set(0.035, -0.42, 0.28);
    mbGrp.add(chipsetHeatsink);

    // Posisi Motherboard di dalam Casing
    mbGrp.position.set(-0.35, 1.05, 0);
    return mbGrp;
}

/**
 * Membangun CPU Berdetail Tinggi (Substrate, Pin / LGA Pads, Nickel IHS, Laser Engraving)
 */
export function createCPU(item) {
    const cpuGrp = new THREE.Group();
    const isAm5 = item && item.socket === 'AM5';

    // 1. PCB Substrate Hijau / Hitam
    const substrateMat = isAm5 ? materials.pcb : materials.pcbGreen;
    const substrate = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.22, 0.22), substrateMat);
    cpuGrp.add(substrate);

    // Gold Corner Alignment Triangle (Tanda Orientasi Soket)
    const goldCorner = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.025, 0.025), materials.gold);
    goldCorner.position.set(0.004, -0.095, -0.095);
    cpuGrp.add(goldCorner);

    // 2. Integrated Heat Spreader (IHS) dari Tembaga Berlapis Nikel
    const ihsTex = createCpuIhsTexture(item ? item.name : 'AMD Ryzen', item ? item.socket : 'AM4');
    const ihsMat = new THREE.MeshStandardMaterial({
        map: ihsTex,
        roughness: 0.28,
        metalness: 0.88
    });

    if (isAm5) {
        // Desain Ikonik IHS AMD AM5 (Potongan berbentuk gurita dengan celah kapasitor SMD)
        const mainIhs = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.17, 0.17), ihsMat);
        mainIhs.position.x = 0.012;
        cpuGrp.add(mainIhs);

        // 8 Wing Tab Keliling IHS AM5
        const tabGeo = new THREE.BoxGeometry(0.016, 0.03, 0.03);
        const tabs = [
            [-0.095, -0.05], [-0.095, 0.05],
            [0.095, -0.05], [0.095, 0.05],
            [-0.05, -0.095], [0.05, -0.095],
            [-0.05, 0.095], [0.05, 0.095]
        ];
        tabs.forEach(([ty, tz]) => {
            const tab = new THREE.Mesh(tabGeo, materials.silver);
            tab.position.set(0.011, ty, tz);
            cpuGrp.add(tab);
        });
    } else {
        // Desain Tradisional IHS AM4 Solid Persegi dengan Sudut Bevel
        const am4Ihs = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.19, 0.19), ihsMat);
        am4Ihs.position.x = 0.012;
        cpuGrp.add(am4Ihs);
    }

    // 3. Permukaan Kontak Bawah (Gold Pads / Pins)
    const contactPad = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.19, 0.19), materials.gold);
    contactPad.position.x = -0.005;
    cpuGrp.add(contactPad);

    // Letak CPU pas di atas soket Motherboard
    cpuGrp.position.set(-0.315, 1.33, -0.12);
    return cpuGrp;
}

/**
 * Membangun Modul RAM Berdetail Tinggi (Dual Sticks, Gold Contacts, Anodized Heatsink / RGB Light Bar)
 */
export function createRAM(item) {
    const ramGrp = new THREE.Group();
    const isRgb = item && item.rgb; // G.Skill Trident Z5 vs Corsair Vengeance LPX

    // 2 Modul RAM Terpasang di Slot Dual-Channel (Slot 2 dan Slot 4)
    const slotOffsets = [0.20, 0.32];

    slotOffsets.forEach(zPos => {
        const stickGrp = new THREE.Group();

        // 1. PCB Dasar dengan Jari-jari Kontak Emas & Notch Kunci
        const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 0.012), materials.pcb);
        stickGrp.add(pcb);

        const goldFingers = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.06, 0.014), materials.gold);
        goldFingers.position.y = -0.22;
        stickGrp.add(goldFingers);

        // 2. Heatspreader Aluminium
        if (isRgb) {
            // G.Skill Trident Z5 RGB: Dual-Tone Brushed Metal Wings
            const spreaderMat = materials.darkSteel;
            const spreader = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.42, 0.024), spreaderMat);
            spreader.position.y = 0.04;
            stickGrp.add(spreader);

            const silverWing = new THREE.Mesh(new THREE.BoxGeometry(0.086, 0.28, 0.026), materials.aluminum);
            silverWing.position.set(0, 0.05, 0);
            stickGrp.add(silverWing);

            // Translucent Acrylic RGB Light Bar di Puncak Modul
            const rgbBar = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.06, 0.028), materials.rgbOff.clone());
            rgbBar.position.y = 0.26;
            registerRGBMaterial(rgbBar.material);
            stickGrp.add(rgbBar);
        } else {
            // Corsair Vengeance LPX: Low Profile Black Anodized Ribbed Fins
            const lpxMat = materials.blackMetal;
            const spreader = new THREE.Mesh(new THREE.BoxGeometry(0.084, 0.38, 0.02), lpxMat);
            spreader.position.y = 0.02;
            stickGrp.add(spreader);

            // Sirip-sirip Pembuang Panas Horizontal
            for (let rib = -3; rib <= 3; rib++) {
                const ribMesh = new THREE.Mesh(new THREE.BoxGeometry(0.086, 0.012, 0.024), materials.darkSteel);
                ribMesh.position.set(0, rib * 0.035 + 0.05, 0);
                stickGrp.add(ribMesh);
            }
        }

        stickGrp.position.set(-0.31, 1.33, zPos);
        ramGrp.add(stickGrp);
    });

    return ramGrp;
}

/**
 * Membangun GPU Berdetail Tinggi (PCIe SafeSlot Bracket, Stacked Heatsink Fins, Copper Heatpipes, Fans, Backplate, 12VHPWR)
 */
export function createGPU(item) {
    const gpuGrp = new THREE.Group();
    const is4090 = item && item.id === 'gpu2'; // RTX 4090 OC vs RTX 3060 Ti
    const w = is4090 ? 0.46 : 0.36;
    const h = is4090 ? 0.24 : 0.16; // 3.5 Slot vs 2 Slot
    const d = is4090 ? 1.15 : 0.88;

    // 1. Multi-Layer PCB Hitam dengan Gold PCIe x16 Fingers
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(w, 0.015, d), materials.pcb);
    pcb.position.set(0, h * 0.45, 0);
    gpuGrp.add(pcb);

    const pcieFingers = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.55), materials.gold);
    pcieFingers.position.set(-w * 0.4, h * 0.45 + 0.02, -d * 0.1);
    gpuGrp.add(pcieFingers);

    // 2. Bracket I/O Logam Stainless Steel di Bagian Belakang
    const bracketH = is4090 ? 0.38 : 0.26;
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.02, bracketH, 0.12), materials.silver);
    bracket.position.set(-w / 2 - 0.01, 0, -d / 2 - 0.04);

    // Port Tampilan Belakang (3x DisplayPort + 1x HDMI)
    for (let dp = 0; dp < 3; dp++) {
        const dpPort = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.02, 0.035), materials.darkSteel);
        dpPort.position.set(-w / 2 - 0.012, -0.06 + dp * 0.04, -d / 2 - 0.04);
        gpuGrp.add(dpPort);
    }
    const hdmiPort = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.018, 0.04), materials.gold);
    hdmiPort.position.set(-w / 2 - 0.012, 0.08, -d / 2 - 0.04);
    gpuGrp.add(bracket, hdmiPort);

    // 3. Dense Stacked Aluminum Heatsink Fin Array
    const finArray = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, h * 0.65, d * 0.88), materials.aluminum);
    finArray.position.set(0, 0, 0);
    gpuGrp.add(finArray);

    // Pipa Panas Tembaga (Copper Heatpipes) yang Menembus Heatsink
    const numPipes = is4090 ? 6 : 4;
    for (let hp = 0; hp < numPipes; hp++) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, d * 0.92, 12), materials.copper);
        pipe.rotation.x = Math.PI / 2;
        pipe.position.set(-w * 0.35 + hp * (w * 0.7 / (numPipes - 1)), 0.02, 0);
        gpuGrp.add(pipe);
    }

    // 4. Shroud Aerodinamis Luar
    const shroudMat = is4090 ? materials.darkSteel : materials.blackMetal;
    const shroud = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, h * 0.72, d * 0.92), shroudMat);
    shroud.position.set(0, -0.02, 0);
    gpuGrp.add(shroud);

    // 5. Kipas Aksial Berputar (2 Kipas untuk 3060 Ti / 3 Kipas untuk 4090)
    const numFans = is4090 ? 3 : 2;
    const fanRadius = is4090 ? 0.15 : 0.13;
    const fanSpacing = d * 0.75 / numFans;

    for (let f = 0; f < numFans; f++) {
        const fan = createFan(item && item.rgb, fanRadius, 9, 0.03);
        fan.rotation.x = Math.PI / 2;
        const zOffset = (f - (numFans - 1) / 2) * (fanSpacing + 0.08);
        fan.position.set(0, -h / 2 - 0.01, zOffset);
        gpuGrp.add(fan);
    }

    // 6. Full-Coverage Metal Backplate dengan Cutout Aliran Udara
    const backplate = new THREE.Mesh(new THREE.BoxGeometry(w * 0.98, 0.012, d * 0.95), materials.blackMetal);
    backplate.position.set(0, h * 0.46, 0);
    gpuGrp.add(backplate);

    // Cutout Ventilasi Aliran Udara Belakang
    const ventCutout = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, 0.016, d * 0.25), materials.darkSteel);
    ventCutout.position.set(0, h * 0.46, d * 0.3);
    gpuGrp.add(ventCutout);

    // 7. Konektor Daya (8-Pin PCIe / 16-Pin 12VHPWR)
    const pwrConnector = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.035, is4090 ? 0.06 : 0.04), materials.plastic);
    pwrConnector.position.set(w * 0.42, h * 0.42, -d * 0.2);
    gpuGrp.add(pwrConnector);

    // 8. Logo RGB Menyala pada Tepi Samping GPU
    const rgbLogo = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.05, 0.35), materials.rgbOff.clone());
    rgbLogo.position.set(w / 2 + 0.002, 0.02, 0);
    registerRGBMaterial(rgbLogo.material);
    gpuGrp.add(rgbLogo);

    // Posisi GPU di dalam Casing (Terpasang pada PCIe Slot Motherboard)
    gpuGrp.position.set(-0.16, 0.95, -0.05);
    return gpuGrp;
}

/**
 * Membangun Media Penyimpanan Berdetail Tinggi (M.2 NVMe SSD 2280, Controller Chip, NAND Flash, Label / Heatsink)
 */
export function createStorage(item) {
    const ssdGrp = new THREE.Group();
    const is990Pro = item && item.id === 'st2';

    // 1. Form Factor M.2 2280 Standar (80mm x 22mm x 2.3mm)
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.075, 0.26), materials.pcb);
    ssdGrp.add(pcb);

    // Pin Konektor M-Key Emas di Bagian Bawah
    const mKeyPins = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.015, 0.262), materials.gold);
    mKeyPins.position.y = -0.035;
    ssdGrp.add(mKeyPins);

    // Lubang Baut Setengah Lingkaran di Bagian Atas
    const screwNotch = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.016, 12), materials.silver);
    screwNotch.position.set(0, 0.036, 0);
    ssdGrp.add(screwNotch);

    if (is990Pro) {
        // Samsung 990 PRO: Heatsink Termal Aluminium Tebal dengan Aksen Merah
        const heatsink = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.068, 0.25), materials.darkSteel);
        heatsink.position.x = 0.015;
        ssdGrp.add(heatsink);

        const redStripe = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.006, 0.24), materials.redSwitchOn);
        redStripe.position.set(0.016, 0.015, 0);
        ssdGrp.add(redStripe);
    } else {
        // Samsung 980: PCB Telanjang dengan Chip Controller Nikel & NAND Flash IC
        const controllerChip = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.035, 0.035), materials.silver); // Nikel coated
        controllerChip.position.set(0.008, -0.01, -0.04);

        const nandChip1 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.035, 0.045), materials.plastic);
        nandChip1.position.set(0.008, -0.01, 0.02);

        const nandChip2 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.035, 0.045), materials.plastic);
        nandChip2.position.set(0.008, -0.01, 0.075);
        ssdGrp.add(controllerChip, nandChip1, nandChip2);

        // Label Stiker Produk V-NAND Fotorealistik
        const labelTex = createSsdLabelTexture(item ? item.name : 'Samsung 980');
        const labelMat = new THREE.MeshStandardMaterial({
            map: labelTex,
            roughness: 0.5,
            metalness: 0.1
        });
        const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.065, 0.22), labelMat);
        labelMesh.rotation.y = Math.PI / 2;
        labelMesh.position.set(0.018, 0, 0.01);
        ssdGrp.add(labelMesh);
    }

    // Posisi M.2 di Motherboard (Slot M.2 Utama)
    ssdGrp.position.set(-0.315, 0.83, -0.05);
    return ssdGrp;
}

/**
 * Membangun CPU Cooler Berdetail Tinggi:
 * - Air Cooler (Hyper 212): Copper Base, 4 Heatpipes, 50+ Aluminum Fins Stack, 120mm Halo Fan
 * - AIO Liquid Cooler (Kraken Z73): Mirror Pump with Live Animated LCD, Braided Hoses, 360mm Radiator, 3x RGB Fans
 */
export function createCooler(item) {
    const clGrp = new THREE.Group();
    const isLiquid = item && item.isLiquid;

    if (isLiquid) {
        // 1. Water Block & Pompa Silinder dengan Cermin Bezel
        const pumpGrp = new THREE.Group();
        pumpGrp.position.set(-0.24, 1.33, -0.12);

        const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.09, 32), materials.darkSteel);
        pumpBody.rotation.z = Math.PI / 2;
        pumpGrp.add(pumpBody);

        // Layar LCD 2.36 Inci Lingkaran Dinamis
        const lcdMesh = new THREE.Mesh(new THREE.CircleGeometry(0.095, 32), materials.aioScreen);
        lcdMesh.rotation.y = Math.PI / 2;
        lcdMesh.position.x = 0.046;
        pumpGrp.add(lcdMesh);

        // Cincin RGB Infinity Mirror Keliling Pompa
        const pumpRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.008, 16, 36), materials.rgbOff.clone());
        pumpRing.rotation.y = Math.PI / 2;
        pumpRing.position.x = 0.046;
        registerRGBMaterial(pumpRing.material);
        pumpGrp.add(pumpRing);

        // Fitting Putar Siku 90 Derajat (Swivel Elbow Fittings)
        const fitting1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 12), materials.blackMetal);
        fitting1.position.set(0.01, 0.09, -0.04);
        const fitting2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 12), materials.blackMetal);
        fitting2.position.set(0.01, 0.09, 0.04);
        pumpGrp.add(fitting1, fitting2);
        clGrp.add(pumpGrp);

        // 2. Radiator Aluminium 360mm di Atas Casing
        const radGrp = new THREE.Group();
        radGrp.position.set(0, 1.76, 0);

        const radCore = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 1.15), materials.darkSteel);
        radGrp.add(radCore);

        // 3x Kipas Radiator 120mm Aer RGB
        for (let rf = 0; rf < 3; rf++) {
            const radFan = createFan(true, 0.13, 9, 0.035);
            radFan.rotation.x = Math.PI / 2;
            radFan.position.set(0, -0.05, (rf - 1) * 0.36);
            radGrp.add(radFan);
        }
        clGrp.add(radGrp);

        // 3. Selang Pendingin Fleksibel (Braided Liquid Coolant Hoses)
        const hoseMat = materials.rubber;
        const hoseCurve1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.23, 1.42, -0.16),
            new THREE.Vector3(-0.15, 1.62, -0.22),
            new THREE.Vector3(-0.05, 1.72, -0.25)
        ]);
        const hose1 = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve1, 24, 0.018, 12, false), hoseMat);

        const hoseCurve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.23, 1.42, -0.08),
            new THREE.Vector3(-0.12, 1.60, -0.12),
            new THREE.Vector3(-0.05, 1.72, -0.15)
        ]);
        const hose2 = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve2, 24, 0.018, 12, false), hoseMat);
        clGrp.add(hose1, hose2);

    } else {
        // Air Cooler Menara (Cooler Master Hyper 212 Halo)
        // 1. Blok Basis Kontak Tembaga Presisi
        const baseBlock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.12), materials.copper);
        baseBlock.position.set(-0.24, 1.33, -0.12);
        clGrp.add(baseBlock);

        // 2. 4 Pipa Panas Tembaga U-Shape Berkelanjutan
        for (let hp = 0; hp < 4; hp++) {
            const pipeCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.24, 1.34, -0.16 + hp * 0.028),
                new THREE.Vector3(-0.18, 1.45, -0.16 + hp * 0.028),
                new THREE.Vector3(-0.18, 1.62, -0.16 + hp * 0.028)
            ]);
            const pipe = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 16, 0.008, 8, false), materials.copper);
            clGrp.add(pipe);
        }

        // 3. Tumpukan Sirip Aluminium Horizontal (Aluminum Fin Stack)
        const finStack = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.34, 0.38), materials.aluminum);
        finStack.position.set(-0.16, 1.52, -0.12);
        clGrp.add(finStack);

        // Plat Penutup Atas Hitam Estetis
        const topCap = new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.012, 0.385), materials.darkSteel);
        topCap.position.set(-0.16, 1.695, -0.12);
        clGrp.add(topCap);

        // 4. Kipas 120mm Halo PWM di Sisi Depan Menara
        const airFan = createFan(item && item.rgb, 0.15, 7, 0.035);
        airFan.rotation.y = Math.PI / 2;
        airFan.position.set(-0.05, 1.52, -0.12);
        clGrp.add(airFan);
    }

    return clGrp;
}

/**
 * Membangun Power Supply Unit Berdetail Tinggi (SECC Housing, Honeycomb Grill, 135mm Fan, AC Switch, Label, Modular Grid)
 */
export function createPSU(item) {
    const psuGrp = new THREE.Group();
    const brand = item ? item.brand : 'Corsair';
    const wattage = item ? item.wattage : 750;
    const cert = item ? item.efficiency : '80 PLUS Gold';

    // 1. Casing Utama Baja SECC Matte Black
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.46), materials.darkSteel);
    body.position.set(-0.14, 0.22, -0.48);
    psuGrp.add(body);

    // 2. Grill Kipas Honeycomb Heksagonal Bawah & Kipas 135mm
    const fanGrill = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.01, 24), materials.blackMetal);
    fanGrill.position.set(-0.14, 0.08, -0.48);
    psuGrp.add(fanGrill);

    const psuFan = createFan(false, 0.13, 9, 0.025);
    psuFan.rotation.x = Math.PI / 2;
    psuFan.position.set(-0.14, 0.12, -0.48);
    psuGrp.add(psuFan);

    // 3. Panel Belakang (Sakelar Rocker AC I/O, Soket IEC C14 3-Pin, Honeycomb Mesh)
    const rearPanel = new THREE.Group();
    rearPanel.position.set(-0.14, 0.22, -0.71);

    const acSocket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.02), materials.blackMetal);
    acSocket.position.set(-0.08, 0, 0);

    const psuRocker = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.02), materials.darkSteel);
    psuRocker.position.set(0.06, 0, 0);
    rearPanel.add(acSocket, psuRocker);
    psuGrp.add(rearPanel);

    // 4. Stiker Spesifikasi Daya Fotorealistik di Sisi Samping
    const labelTex = createPsuLabelTexture(brand, wattage, cert);
    const labelMat = new THREE.MeshStandardMaterial({
        map: labelTex,
        roughness: 0.6,
        metalness: 0.1
    });
    const sideLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.4), labelMat);
    sideLabel.rotation.y = Math.PI / 2;
    sideLabel.position.set(0.052, 0.22, -0.48);
    psuGrp.add(sideLabel);

    // 5. Grid Antarmuka Kabel Fully Modular di Bagian Depan
    const modularPanel = new THREE.Group();
    modularPanel.position.set(-0.14, 0.22, -0.245);

    // Socket 24-Pin ATX
    const atx24 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.015), materials.blackMetal);
    atx24.position.set(-0.06, 0.05, 0);

    // Socket PCIe / CPU EPS 8-Pin
    for (let s = 0; s < 4; s++) {
        const sock8 = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.035, 0.015), materials.blackMetal);
        sock8.position.set(0.04, -0.06 + s * 0.045, 0);
        modularPanel.add(sock8);
    }
    modularPanel.add(atx24);
    psuGrp.add(modularPanel);

    return psuGrp;
}

/**
 * Membangun Pengkabelan Fleksibel Berdetail Tinggi (Braided Power Cables, DisplayPort, AC Cord)
 */
export function generateCables(state) {
    disposeGeometries(cableGroup);
    while (cableGroup.children.length > 0) {
        cableGroup.remove(cableGroup.children[0]);
    }

    const cableMatPower = new THREE.MeshStandardMaterial({ color: 0x14181f, roughness: 0.85, metalness: 0.15 });
    const cableMatDisplay = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.3 });
    const cableMatMainPower = new THREE.MeshStandardMaterial({ color: 0x090b0e, roughness: 0.9, metalness: 0.05 });

    const drawCable = (points, material, radius = 0.014) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, radius, 8, false), material);
        cableGroup.add(tube);
    };

    // Kabel Display dari GPU / Motherboard ke Monitor
    if (state.installed.motherboard) {
        drawCable([
            new THREE.Vector3(-1.2, 0.45, -0.55),
            new THREE.Vector3(-0.8, 0.08, -0.65),
            new THREE.Vector3(-0.1, 0.08, -0.65),
            new THREE.Vector3(PC_OFFSET.x - 0.42, 0.95, PC_OFFSET.z - 0.45)
        ], cableMatDisplay, 0.012);
    }

    // Kabel Daya AC Utama dari PSU ke Terminal Colokan (Power Strip)
    if (state.installed.psu) {
        drawCable([
            new THREE.Vector3(-0.14, 0.22, -0.71).add(PC_OFFSET),
            new THREE.Vector3(-0.14, 0.04, -0.85).add(PC_OFFSET),
            new THREE.Vector3(1.2, 0.04, -0.95),
            new THREE.Vector3(2.35, 0.05, -1.0)
        ], cableMatMainPower, 0.016);
    }

    // Kabel Daya AC Monitor ke Terminal Colokan (Power Strip)
    drawCable([
        new THREE.Vector3(-1.2, 0.35, -0.55),
        new THREE.Vector3(-1.0, 0.04, -0.75),
        new THREE.Vector3(0.5, 0.04, -0.95),
        new THREE.Vector3(2.2, 0.05, -1.0)
    ], cableMatMainPower, 0.014);

    // Kabel Internal 24-Pin ATX dari PSU ke Motherboard
    if (state.installed.psu && state.installed.motherboard) {
        drawCable([
            new THREE.Vector3(-0.14, 0.22, -0.25).add(PC_OFFSET),
            new THREE.Vector3(-0.02, 0.45, 0.2).add(PC_OFFSET),
            new THREE.Vector3(-0.32, 1.05, 0.35).add(PC_OFFSET)
        ], cableMatPower, 0.018);
    }
}
