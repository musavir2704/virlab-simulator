/**
 * VIRLAB-SIMULATOR: Core Constants
 * Konstanta koordinat posisi 3D, kecepatan kamera, dan konfigurasi simulator.
 */

import * as THREE from 'three';

export const INITIAL_CAMERA_POS = new THREE.Vector3(0, 2.2, 5.2);
export const INITIAL_TARGET_POS = new THREE.Vector3(0, 0.5, 0);
export const PC_OFFSET = new THREE.Vector3(1.5, 0.05, -0.2);
export const ORIGINAL_DONGLE_POS = new THREE.Vector3(-0.4, 0.025, 0.6);

export const MAX_JOYSTICK_RADIUS = 40;
export const MOVE_SPEED = 0.1;
export const ELEVATION_SPEED = 0.08;
export const ROTATE_SPEED = 0.04;
export const MOUSE_ROTATE_SPEED = 0.005;

export const REQUIRED_BOOT_PARTS = ['case', 'motherboard', 'cpu', 'ram', 'gpu', 'psu'];
