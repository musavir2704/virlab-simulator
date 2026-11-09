/**
 * VIRLAB-SIMULATOR: 3D Peripherals Models
 * Membuat model 3D perangkat periferal berdetail tinggi:
 * Monitor Frameless 27", Keyboard Mekanikal TKL dengan RGB, Mouse Gaming Ergonomis,
 * Terminal Colokan (Power Strip) 4 Soket Grounded, dan Dongle USB Nano.
 */

import * as THREE from 'three';
import { materials, registerRGBMaterial } from '../core/materials.js';
import { peripheralsGroup } from '../core/scene.js';
import { ORIGINAL_DONGLE_POS } from '../core/constants.js';

export let monitorScreenMesh = null;
export let monitorPowerBtnMesh = null;
export let powerStripSwitchMesh = null;
export let dongleObject = null;

export function setupPeripherals(interactiveObjects) {
    while (peripheralsGroup.children.length > 0) {
        peripheralsGroup.remove(peripheralsGroup.children[0]);
    }

    // 1. MONITOR INTERAKTIF 27" FRAMELESS ULTRA-SLIM
    const monitorGrp = new THREE.Group();
    monitorGrp.position.set(-1.2, 0, -0.5);

    // Kaki Penyangga Logam Ergonomis (Weighted Base)
    const mBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.025, 0.35), materials.darkSteel);
    mBase.position.y = 0.0125;
    mBase.receiveShadow = true;

    // Tiang Penyangga Silinder dengan Cincin Pengatur Kabel
    const mStand = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.048, 0.65, 24), materials.darkSteel);
    mStand.position.set(0, 0.33, -0.06);

    const mStandRing = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 12, 24), materials.rubber);
    mStandRing.position.set(0, 0.2, -0.06);
    mStandRing.rotation.x = Math.PI / 2;

    // Engsel Tilt & VESA Indent
    const mHinge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.06), materials.blackMetal);
    mHinge.position.set(0, 0.65, -0.04);

    // Bodi Layar Monitor Tipis
    const mBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.18, 0.045), materials.plastic);
    mBody.position.set(0, 0.82, 0);

    // Dagu Bawah Monitor (Brushed Gunmetal Chin)
    const mChin = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.045, 0.048), materials.darkSteel);
    mChin.position.set(0, -0.57, 0.002);
    mBody.add(mChin);

    // Layar IPS Resolusi Tinggi (1024 x 512 CanvasTexture)
    monitorScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.06, 1.12), materials.monitorScreen);
    monitorScreenMesh.position.set(0, 0.015, 0.024);
    mBody.add(monitorScreenMesh);

    // Tombol Daya Fisik Monitor & LED Indikator
    monitorPowerBtnMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.015), materials.redSwitchOff);
    monitorPowerBtnMesh.position.set(0.92, -0.57, 0.025);

    const mPowerHitbox = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.15), new THREE.MeshBasicMaterial({ visible: false }));
    mPowerHitbox.position.copy(monitorPowerBtnMesh.position);
    mPowerHitbox.userData.action = 'toggleMonitorPower';
    interactiveObjects.push(mPowerHitbox);

    mBody.add(monitorPowerBtnMesh, mPowerHitbox);
    monitorGrp.add(mBase, mStand, mStandRing, mHinge, mBody);
    peripheralsGroup.add(monitorGrp);

    // 2. KEYBOARD MEKANIKAL TKL DENGAN RGB PERIMETER DIFFUSER
    const kbGrp = new THREE.Group();
    kbGrp.position.set(-1.2, 0.025, 0.65);
    kbGrp.rotation.x = 0.04; // Sudut ergonomis 4 derajat

    // Plat Atas Aluminium Anodized
    const kbTopPlate = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.025, 0.52), materials.darkSteel);
    kbGrp.add(kbTopPlate);

    // Diffuser Akrilik RGB Perimeter Bawah (Underglow)
    const kbRGB = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.012, 0.54), materials.rgbOff.clone());
    kbRGB.position.y = -0.012;
    registerRGBMaterial(kbRGB.material);
    kbGrp.add(kbRGB);

    // Tombol-tombol Keycap Mekanikal (Cherry Profile Scultped Keys)
    const keyGeo = new THREE.BoxGeometry(0.062, 0.022, 0.062);
    const spaceGeo = new THREE.BoxGeometry(0.42, 0.022, 0.062);

    for (let x = -0.62; x <= 0.62; x += 0.082) {
        for (let z = -0.2; z <= 0.2; z += 0.082) {
            // Hindari tombol spacebar agar tidak tumpang tindih
            if (z > 0.12 && x > -0.22 && x < 0.22) continue;
            const key = new THREE.Mesh(keyGeo, materials.keyboardKey);
            key.position.set(x, 0.022, z);
            kbGrp.add(key);
        }
    }

    // Tombol Spacebar Utama
    const spacebar = new THREE.Mesh(spaceGeo, materials.keyboardKey);
    spacebar.position.set(0, 0.022, 0.164);
    kbGrp.add(spacebar);

    peripheralsGroup.add(kbGrp);

    // 3. MOUSE GAMING ERGONOMIS DENGAN SCROLL WHEEL & RGB
    const mouseGrp = new THREE.Group();
    mouseGrp.position.set(-0.25, 0.035, 0.65);

    // Bodi Ergonomis Mouse
    const mouseBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.055, 0.28), materials.plastic);
    mouseGrp.add(mouseBody);

    // Celah Pemisah Tombol Kiri & Kanan (LMB & RMB)
    const buttonSplit = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.02, 0.12), materials.darkSteel);
    buttonSplit.position.set(0, 0.025, -0.06);
    mouseGrp.add(buttonSplit);

    // Roda Gulir Karet Bertekstur (Rubber Scroll Wheel)
    const scrollWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.018, 16), materials.rubber);
    scrollWheel.rotation.z = Math.PI / 2;
    scrollWheel.position.set(0, 0.03, -0.06);
    mouseGrp.add(scrollWheel);

    // Garis Aksen RGB Menyala pada Mouse
    const mouseRGB = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.008, 0.29), materials.rgbOff.clone());
    mouseRGB.position.y = -0.024;
    registerRGBMaterial(mouseRGB.material);
    mouseGrp.add(mouseRGB);

    peripheralsGroup.add(mouseGrp);

    // 4. TERMINAL COLOKAN LISTRIK (POWER STRIP 4 SOKET GROUNDED)
    const stripGrp = new THREE.Group();
    stripGrp.position.set(2.45, 0.045, -1.05);
    stripGrp.rotation.y = -0.25;

    // Housing Plastik Tahan Api Putih / Abu Terang
    const stripBody = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.08, 0.26), materials.plasticLight);
    stripBody.receiveShadow = true;
    stripGrp.add(stripBody);

    // 4 Lubang Soket Bulat Standard Grounded (Schuko Standard)
    for (let s = 0; s < 4; s++) {
        const socketWell = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.02, 24), materials.darkSteel);
        socketWell.position.set(-0.35 + s * 0.18, 0.035, 0);

        // Dua Lubang Kontak Listrik
        const pin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.025, 8), materials.blackMetal);
        pin1.position.set(-0.025, 0.005, 0);
        const pin2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.025, 8), materials.blackMetal);
        pin2.position.set(0.025, 0.005, 0);

        // Jepitan Ground Logam Kuningan
        const groundClipTop = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.015, 0.02), materials.copper);
        groundClipTop.position.set(0, 0.005, 0.065);
        const groundClipBtm = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.015, 0.02), materials.copper);
        groundClipBtm.position.set(0, 0.005, -0.065);

        socketWell.add(pin1, pin2, groundClipTop, groundClipBtm);
        stripBody.add(socketWell);
    }

    // Sakelar Master Rocker Transparan dengan Lampu Neon
    powerStripSwitchMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.12), materials.redSwitchOff);
    powerStripSwitchMesh.position.set(0.42, 0.045, 0);
    powerStripSwitchMesh.rotation.z = -0.15;

    const switchHitbox = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.25), new THREE.MeshBasicMaterial({ visible: false }));
    switchHitbox.position.copy(powerStripSwitchMesh.position);
    switchHitbox.userData.action = 'togglePowerStrip';
    interactiveObjects.push(switchHitbox);

    stripBody.add(powerStripSwitchMesh, switchHitbox);
    peripheralsGroup.add(stripGrp);

    // 5. WIRELESS USB DONGLE (NANO RECEIVER INTERAKTIF DRAG & DROP)
    dongleObject = new THREE.Group();
    dongleObject.position.copy(ORIGINAL_DONGLE_POS);

    // Grip Plastik Bertekstur Hitam
    const dongleGrip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.025, 0.09), materials.plastic);

    // Mikro LED Status Koneksi Nirkabel
    const dongleLed = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.028, 8), materials.blueLed);
    dongleLed.position.set(0, 0.005, 0.025);
    dongleGrip.add(dongleLed);

    // Logam Colokan USB-A dengan Tab Plastik Biru USB 3.0
    const dongleMetal = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.018, 0.065), materials.silver);
    dongleMetal.position.z = -0.07;

    const usbBlueTongue = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.006, 0.045), materials.blueLed);
    usbBlueTongue.position.set(0, 0.004, -0.07);

    dongleObject.add(dongleGrip, dongleMetal, usbBlueTongue);
    peripheralsGroup.add(dongleObject);
}
