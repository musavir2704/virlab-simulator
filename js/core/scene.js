/**
 * VIRLAB-SIMULATOR: 3D Scene, Camera, Renderer, Lighting & Environment
 * Mengelola ruang 3D WebGL, pencahayaan laboratorium fotorealistik, dan pemilih lingkungan.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { INITIAL_CAMERA_POS, INITIAL_TARGET_POS, PC_OFFSET } from './constants.js';

export const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xf8fafc, 0.012);

export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.copy(INITIAL_CAMERA_POS);

export const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 + 0.08;
controls.minDistance = 0.5;
controls.maxDistance = 15;
controls.target.copy(INITIAL_TARGET_POS);

// 1. PENCAHAYAAN LABORATORIUM TEKNOLOGI CERAH
// Ambient Light Lembut untuk Menerangi Bagian Dalam Komponen
export const ambientLight = new THREE.AmbientLight(0xf8fafc, 0.85);
scene.add(ambientLight);

// Key Directional Light Studio (Pencahayaan Utama dengan Bayangan Halus)
export const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
keyLight.position.set(4, 7, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 25;
keyLight.shadow.camera.left = -5;
keyLight.shadow.camera.right = 5;
keyLight.shadow.camera.top = 5;
keyLight.shadow.camera.bottom = -5;
keyLight.shadow.bias = -0.0001;
keyLight.shadow.radius = 2.5; // Soft shadow edges
scene.add(keyLight);

// Fill Light dari Sisi Berlawanan untuk Memperjelas Chamfer & Logam
export const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
fillLight.position.set(-5, 4, -3);
scene.add(fillLight);

// Lampu Ruangan / Ceiling Point Light
export const roomLight = new THREE.PointLight(0xffffff, 3.5, 20);
roomLight.position.set(0, 4.5, 0);
scene.add(roomLight);

// Lampu Internal Casing PC (Menyala Terang saat Komputer Hidup)
export const caseLight = new THREE.PointLight(0xffffff, 0, 2.5);
caseLight.position.set(0, 1.2, 0.2);

// Lampu Pantulan Monitor (Pendaran Biru ke Arah Meja)
export const monitorLight = new THREE.PointLight(0x38bdf8, 0, 3.2);
monitorLight.position.set(-1.2, 0.82, 0.4);
scene.add(monitorLight);

// 2. MEJA LABORATORIUM DENGAN REFLEKSI & BAYANGAN
const deskGeometry = new THREE.BoxGeometry(10, 0.12, 4.2);
const deskMaterial = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.35,
    metalness: 0.08
});
export const desk = new THREE.Mesh(deskGeometry, deskMaterial);
desk.position.y = -0.06;
desk.receiveShadow = true;
scene.add(desk);

// 3. GRUP HIERARKI 3D UTAMA
export const pcGroup = new THREE.Group();
pcGroup.position.copy(PC_OFFSET);
pcGroup.add(caseLight);
scene.add(pcGroup);

export const peripheralsGroup = new THREE.Group();
scene.add(peripheralsGroup);

export const cableGroup = new THREE.Group();
scene.add(cableGroup);

// 4. PEMILIH PRESET LINGKUNGAN (ENVIRONMENT PRESETS)
export function setEnvironment(env) {
    const bgHex = env === 'rgb' ? 0x0b1120 : env === 'clean' ? 0xf8fafc : 0xf1f5f9;
    scene.fog.color.setHex(bgHex);
    document.body.style.backgroundColor = '#' + bgHex.toString(16).padStart(6, '0');

    if (env === 'rgb') {
        ambientLight.intensity = 0.25;
        ambientLight.color.setHex(0xffffff);
        keyLight.intensity = 1.2;
        keyLight.color.setHex(0x818cf8);
        fillLight.intensity = 0.8;
        fillLight.color.setHex(0xc084fc);
        roomLight.intensity = 1.5;
        desk.material.color.setHex(0x1e293b);
        desk.material.roughness = 0.55;
    } else if (env === 'clean') {
        ambientLight.intensity = 0.85;
        ambientLight.color.setHex(0xf8fafc);
        keyLight.intensity = 2.2;
        keyLight.color.setHex(0xffffff);
        fillLight.intensity = 1.2;
        fillLight.color.setHex(0xe0f2fe);
        roomLight.intensity = 3.5;
        desk.material.color.setHex(0xe2e8f0);
        desk.material.roughness = 0.35;
    } else {
        // Basic / Warm Workshop
        ambientLight.intensity = 0.7;
        ambientLight.color.setHex(0xffffff);
        keyLight.intensity = 1.8;
        keyLight.color.setHex(0xffedd5);
        fillLight.intensity = 0.9;
        fillLight.color.setHex(0xfef3c7);
        roomLight.intensity = 2.8;
        desk.material.color.setHex(0xd4b896);
        desk.material.roughness = 0.7;
    }
}

export function initScene(container) {
    container.appendChild(renderer.domElement);
    renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());

    autoDetectQuality();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

export let currentQuality = 'high';

/**
 * Mengubah Preset Kualitas Grafis (low | medium | high)
 * Mengoptimalkan penggunaan GPU, resolusi rendering, dan shadow map
 */
export function setGraphicsQuality(level) {
    currentQuality = level;
    if (level === 'low') {
        renderer.setPixelRatio(1.0);
        renderer.shadowMap.enabled = false;
        keyLight.castShadow = false;
        keyLight.shadow.mapSize.width = 512;
        keyLight.shadow.mapSize.height = 512;
        renderer.toneMappingExposure = 1.0;
    } else if (level === 'medium') {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.radius = 1.5;
        renderer.toneMappingExposure = 1.05;
    } else {
        // High Quality (Default Desktop)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.radius = 2.5;
        renderer.toneMappingExposure = 1.05;
    }

    if (keyLight.shadow.map) {
        keyLight.shadow.map.dispose();
        keyLight.shadow.map = null;
    }
    renderer.shadowMap.needsUpdate = true;
}

// Deteksi otomatis perangkat: mobile/tablet default 'medium', desktop 'high'
export function autoDetectQuality() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 800;
    const defaultQuality = isMobile ? 'medium' : 'high';
    setGraphicsQuality(defaultQuality);
    return defaultQuality;
}

let cameraResetAnim = {
    active: false,
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    progress: 0,
    duration: 0.65
};

/**
 * Mengembalikan sudut pandang kamera ke posisi default laboratorium
 */
export function resetCamera(smooth = true) {
    if (!smooth) {
        camera.position.copy(INITIAL_CAMERA_POS);
        controls.target.copy(INITIAL_TARGET_POS);
        controls.update();
        return;
    }
    cameraResetAnim.startPos.copy(camera.position);
    cameraResetAnim.endPos.copy(INITIAL_CAMERA_POS);
    cameraResetAnim.startTarget.copy(controls.target);
    cameraResetAnim.endTarget.copy(INITIAL_TARGET_POS);
    cameraResetAnim.progress = 0;
    cameraResetAnim.active = true;
}

export function updateCameraReset(delta) {
    if (!cameraResetAnim.active) return;
    cameraResetAnim.progress += delta / cameraResetAnim.duration;
    if (cameraResetAnim.progress >= 1.0) {
        cameraResetAnim.progress = 1.0;
        cameraResetAnim.active = false;
    }
    const t = 1 - Math.pow(1 - cameraResetAnim.progress, 3);
    camera.position.lerpVectors(cameraResetAnim.startPos, cameraResetAnim.endPos, t);
    controls.target.lerpVectors(cameraResetAnim.startTarget, cameraResetAnim.endTarget, t);
}
