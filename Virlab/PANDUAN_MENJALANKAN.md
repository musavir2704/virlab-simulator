# Panduan Menjalankan VIRLAB-SIMULATOR Secara Lokal
### *Petunjuk Instalasi, Konfigurasi Server Lokal, & Kompatibilitas Browser*

---

## 📌 Mengapa Aplikasi Membutuhkan Server Lokal?

**VIRLAB-SIMULATOR Professional Edition** dibangun menggunakan arsitektur modern **JavaScript ES6+ Modules (ESM)** dengan pemisahan kode ke dalam modul-modul independen (`import` / `export`) serta konfigurasi CDN Three.js menggunakan `<script type="importmap">`.

Sebagian besar browser modern menerapkan kebijakan keamanan **CORS (Cross-Origin Resource Sharing)** yang memblokir pemuatan file JavaScript bertipe modul (`type="module"`) jika file HTML dibuka langsung menggunakan protokol berkas lokal (`file:///C:/...`). 

Oleh karena itu, aplikasi **wajib dijalankan melalui server lokal (*Local HTTP Server*)**.

---

## 🖥️ Pilihan Cara Menjalankan Aplikasi

Pilih salah satu metode yang paling nyaman sesuai lingkungan kerja yang Anda gunakan:

---

### Metode 1: Menggunakan VS Code "Live Server" (Sangat Direkomendasikan)

Metode ini merupakan cara termudah dan paling umum bagi pengembang maupun guru/siswa:

1. Buka folder proyek `Virlab` menggunakan **Visual Studio Code**.
2. Pastikan ekstensi **Live Server** (oleh Ritwick Dey) sudah terpasang di VS Code:
   * Tekan `Ctrl + Shift + X` untuk membuka tab Extensions.
   * Cari `Live Server`, lalu klik **Install**.
3. Di panel file explorer VS Code, klik kanan pada file **`Virlab.html`**.
4. Pilih menu **"Open with Live Server"** (atau tekan tombol *Go Live* di baris status kanan bawah VS Code).
5. Browser default Anda akan otomatis terbuka pada alamat:
   ```
   http://127.0.0.1:5500/Virlab.html
   ```

---

### Metode 2: Menggunakan Python (Tanpa Instalasi Ekstensi Tambahan)

Jika di komputer Anda sudah terpasang Python (versi 3.x):

1. Buka terminal (PowerShell, Command Prompt, atau Terminal Linux/macOS).
2. Masuk ke direktori folder proyek:
   ```bash
   cd "d:\1. Chelly Satya Carsa Thesar\Semester 6\PLP\Project Musavir\Virlab"
   ```
3. Jalankan server lokal built-in Python:
   ```bash
   python -m http.server 8080
   ```
4. Buka browser Anda dan akses tautan berikut:
   ```
   http://localhost:8080/Virlab.html
   ```

---

### Metode 3: Menggunakan Node.js (npx serve / http-server)

Jika komputer Anda telah memiliki Node.js dan npm:

1. Buka terminal pada folder proyek `Virlab`.
2. Jalankan perintah `npx` tanpa perlu menginstal paket secara permanen:
   ```bash
   npx serve .
   ```
   *atau alternatifnya:*
   ```bash
   npx http-server -p 8080
   ```
3. Akses alamat URL lokal yang ditampilkan pada terminal (misal: `http://localhost:3000` atau `http://localhost:8080`).

---

### Metode 4: Menggunakan PHP Built-in Server

Jika Anda terbiasa dengan lingkungan XAMPP, WampServer, atau PHP CLI:

1. Buka terminal pada folder proyek `Virlab`.
2. Jalankan perintah:
   ```bash
   php -S localhost:8080
   ```
3. Buka browser dan kunjungi `http://localhost:8080/Virlab.html`.

---

## 📱 Membuka Simulator di Smartphone / Tablet Melalui Wi-Fi Lokal

Anda dapat menguji dan menggunakan aplikasi ini langsung di layar smartphone atau tablet Anda tanpa perlu mengunggah ke hosting:

1. Pastikan komputer dan perangkat smartphone/tablet Anda terhubung ke **jaringan Wi-Fi yang sama**.
2. Cari tahu alamat IP lokal komputer Anda:
   * **Windows:** Buka PowerShell / CMD, ketik `ipconfig`, cari bagian *IPv4 Address* (contoh: `192.168.1.15`).
   * **macOS / Linux:** Buka terminal, ketik `ifconfig` atau `ip a`.
3. Jalankan server lokal di komputer menggunakan Metode 2 (`python -m http.server 8080`) atau Metode 3 (`npx http-server -p 8080`).
4. Di browser smartphone/tablet Anda (Chrome Mobile, Safari iOS), ketikkan alamat IP komputer tersebut disertai nomor port dan nama file:
   ```
   http://192.168.1.15:8080/Virlab.html
   ```
5. Putar smartphone ke posisi **Landscape** untuk menikmati simulasi perakitan PC secara maksimal dengan virtual joystick.

---

## 🌐 Kompatibilitas Browser yang Didukung

Aplikasi ini telah dioptimalkan dan diuji untuk berjalan dengan baik pada browser modern yang mendukung standar WebGL 2.0 dan ES Modules:

| Browser | Versi Minimal | Status Dukungan |
|---|:---:|:---:|
| **Google Chrome** | Versi 80+ | **Sangat Baik (Rekomendasi Utama)** |
| **Microsoft Edge** | Versi 80+ | **Sangat Baik** |
| **Mozilla Firefox** | Versi 85+ | **Sangat Baik** |
| **Apple Safari (macOS & iOS)** | Versi 14+ | **Sangat Baik** |
| **Opera Browser** | Versi 67+ | **Sangat Baik** |

---

## ❓ Pemecahan Masalah (Troubleshooting)

### 1. Layar Hitam atau Elemen 3D Tidak Muncul
* **Penyebab:** File dibuka menggunakan `file:///` langsung dari File Explorer Windows tanpa web server lokal, sehingga browser memblokir modul JavaScript.
* **Solusi:** Jalankan melalui salah satu metode di atas (misal: *VS Code Live Server*).

### 2. Tampilan Terasa Berat / Patah-patah pada Perangkat Spesifikasi Menengah
* **Solusi:** 
  1. Klik tombol **Pengaturan** (ikon roda gigi `⚙`) di toolbar kanan atas.
  2. Ubah preset kualitas grafis ke **Rendah (Low)** atau **Sedang (Medium)**.
  3. Bayangan berat akan otomatis dinonaktifkan dan pixel ratio diturunkan, menghasilkan framerate yang stabil dan lancar.

### 3. Layar Terpotong di Smartphone
* **Solusi:** 
  1. Putar layar ke posisi **Landscape**.
  2. Aplikasi telah dilengkapi unit `100dvh` (*Dynamic Viewport Height*) yang otomatis menyesuaikan ruang layar saat address bar browser mobile muncul atau tersembunyi.
