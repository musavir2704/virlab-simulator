# VIRLAB-SIMULATOR: Interactive 3D PC Building Laboratory
### *Professional Edition — Platform Simulasi & Edukasi Perangkat Keras Komputer Berbasis 3D WebGL*

---

## 🌟 Identitas & Tim Pengembang
* **Nama Proyek:** VIRLAB-SIMULATOR (Professional Edition)
* **Pengembang Utama:**
  * **Chelly Satya Carsa Thesar**
  * **Rauhul Jannah**
* **Institusi:** Program Studi Pendidikan Ilmu Komputer / Teknologi Informasi
* **Tujuan Proyek:** Mengubah simulator perakitan komputer konvensional menjadi media laboratorium virtual interaktif 3D profesional, cerah, modern, realistis, dan berorientasi penuh pada pembelajaran (*pure educational hardware laboratory*) tanpa sistem nominal harga.

---

## 🔬 Konsep Desain: Bright Professional Technology Laboratory
Berbeda dengan desain lama yang didominasi warna gelap pekat dan efek neon berlebih, **VIRLAB-SIMULATOR Professional Edition** mengusung konsep laboratorium teknologi modern yang bersih, futuristik, elegan, dan nyaman dipandang:
* **Background Utama:** Putih bersih & abu-abu sangat terang (`#f8fafc`).
* **Surface & Glass Panels:** Kaca frosted modern (*White Frosted Glass* dengan blur 16px).
* **Warna Aksen:** Biru teknologi (`#2563eb`), cyan (`#06b6d4`), dan slate gelap (`#0f172a`).
* **Pencahayaan 3D:** *Key directional studio light* dengan bayangan halus (*PCFSoftShadowMap*), pencahayaan refleksi material logam, serta pendaran layar monitor.

---

## 🚀 Fitur Unggulan Simulator

### 1. Tiga Mode Interaktif (*Core Modes*)
1. **Mode Perakitan (Assembly Mode):**
   * Simulasi perakitan PC 8 langkah terstruktur.
   * Drawer pemilihan komponen berdetail spesifikasi teknis.
   * Animasi pergerakan pendekatan 3D (*cubic ease-out docking*) dan pelepasan halus (*slide-out disassembly*).
   * Pendaran visual kontak docking saat komponen terpasang tepat pada slot.
2. **Mode Eksplorasi 3D (Explore Mode):**
   * Pengamatan bebas 360 derajat terhadap seluruh anatomi sasis PC.
   * 12 Titik Anatomi Interaktif 3D (*Glowing Beacons*) yang melayang di atas komponen.
   * Klik titik atau model 3D untuk memfokuskan kamera secara halus dan menampilkan *Hotspot Detail Card*.
3. **Pusat Pembelajaran (Learning Mode):**
   * Jendela komprehensif berisi modul edukasi **12 Poin Wajib** untuk seluruh 8 kategori perangkat keras.
   * Tombol pintasan *"Lihat di Eksplorasi 3D"* untuk melompat langsung ke model 3D komponen terkait.

### 2. 100% Bebas Sistem Harga (Zero Price Logistics)
* Seluruh nominal uang, simbol mata uang (`$`, `Rp`), variabel biaya (`totalCost`, `budget`), dan label belanja telah dihapus total.
* Seluruh katalog murni menyajikan **spesifikasi teknis edukatif**: arsitektur soket, tipe generasi RAM, clock speed, VRAM, interface bus, efisiensi sertifikasi PSU, dan form factor.

### 3. Validasi Kompatibilitas Fisik & Arsitektur Nyata
Sistem simulasi menolak pemasangan komponen yang tidak cocok di dunia nyata dan memberikan umpan balik edukatif di terminal log:
* **Motherboard Requirement:** Komponen ekspansi tidak dapat dipasang tanpa Casing dan Motherboard.
* **Soket CPU:** Deteksi ketidakcocokan Soket AM4 (PGA 1331) vs Soket AM5 (LGA 1718).
* **Generasi RAM:** Memvalidasi notch memori fisik DDR4 vs DDR5 pada platform motherboard.
* **Cooler Clearance:** Mencegah pemasangan Radiator Liquid 360mm pada Casing Mid-Tower yang hanya mendukung hingga 280mm.
* **Peringatan Daya PSU:** Peringatan otomatis jika GPU kelas berat (misal RTX 4090) dipasangkan dengan PSU di bawah 1000W.
* **Pelepasan Aman Motherboard:** Mencegah pencopotan motherboard jika masih menampung komponen ekspansi aktif.

### 4. Simulasi Kelistrikan & Booting Komprehensif
* **Stopkontak Listrik AC 220V (Power Strip):** Dilengkapi saklar rocker 3D berlampu neon merah yang dapat dimiringkan secara fisik. Mematikan saklar memutus arus darurat ke seluruh sistem.
* **Dongle USB Wireless:** Dongle nano USB yang dapat di-drag & drop ke port USB atas casing untuk mengaktifkan konektivitas keyboard wireless.
* **Layar Monitor Interaktif (Canvas 1024x512) dengan 6 Status Layar:**
  1. `OFF`: Monitor mati.
  2. `NO SIGNAL`: Layar menyala dengan kotak OSD mengambang jika PC belum dinyalakan.
  3. `BIOS POST`: Inisialisasi Power-On Self-Test yang mendeteksi komponen terpasang secara *real-time*.
  4. `NO BOOT DEVICE`: Tampilan teks konsol berkedip otentik jika PC dinyalakan tanpa media penyimpanan (SSD).
  5. `BOOTING`: Animasi booting sistem operasi dengan fluent spinner berputar.
  6. `DESKTOP OS`: Antarmuka sistem operasi VIRLAB OS aktif dengan jendela diagnostik hardware interaktif.

### 5. Kuis Interaktif Edukasi Perangkat Keras
* 10 pertanyaan berbobot mengenai arsitektur, kelistrikan, dan perakitan PC.
* Umpan balik seketika dengan penjelasan edukatif komprehensif pada setiap soal.
* Layar evaluasi skor akhir dengan predikat prestasi (*Ahli Laboratorium Komputer*, *Teknisi Terampil*, *Siswa Magang*).

### 6. Optimasi Kinerja & Desain Responsif
* **Dukungan Dynamic Viewport:** Menggunakan `100dvh` & `100dvw` untuk mencegah kepotong address bar browser smartphone.
* **Ergonomi Landscape:** Tata letak khusus mobile landscape dengan analog virtual kiri dan tombol kontrol elevasi kanan.
* **Preset Kualitas Grafis (Low, Medium, High):** Mengatur resolusi pixel ratio dan shadow map secara dinamis sesuai spesifikasi perangkat.
* **VRAM Memory Disposal:** Pelepasan geometri WebGL (`dispose()`) untuk mencegah memory leak.
* **Texture Upload Throttling:** Pembatasan FPS kanvas 2D ke WebGL untuk menghemat daya baterai dan penggunaan GPU.

---

## 📁 Struktur Direktori Proyek

```
Virlab/
├── Virlab.html                  # File entry point utama laboratorium
├── README.md                    # Dokumentasi utama proyek
├── PANDUAN_PENGGUNAAN.md        # Panduan penggunaan lengkap simulator
├── PANDUAN_MENJALANKAN.md        # Petunjuk menjalankan aplikasi secara lokal
├── CHANGELOG.md                 # Catatan riwayat pembaruan sistem
├── css/
│   └── style.css                # Stylesheet tema Bright Professional Lab
└── js/
    ├── app.js                   # Master Controller aplikasi & loop simulasi
    ├── 3d/
    │   ├── components.js        # Model 3D prosedural detail komponen PC
    │   └── peripherals.js       # Model 3D monitor, keyboard, mouse, stopkontak, dongle
    ├── core/
    │   ├── constants.js         # Konstanta koordinat, offset, dan kecepatan kontrol
    │   ├── materials.js         # Material PBR, tekstur sirkuit prosedural, dan utilitas disposal
    │   └── scene.js             # Scene WebGL, kamera, pencahayaan, dan pengaturan kualitas grafis
    ├── data/
    │   ├── categories.js        # Metadata 8 kategori komponen & urutan langkah perakitan
    │   ├── hardwareCatalog.js   # Katalog spesifikasi teknis hardware (bebas harga)
    │   └── learningData.js      # Materi 12 poin, 12 hotspot 3D, dan bank soal kuis
    ├── systems/
    │   ├── assemblySystem.js    # Logika perakitan, validasi kompatibilitas, dan animasi docking
    │   ├── learningSystem.js    # Mesin pengatur 3 mode, proyeksi 3D hotspot, dan kuis
    │   ├── monitorDisplay.js    # Mesin kanvas dinamis layar monitor & desktop OS
    │   └── powerSystem.js       # Logika kelistrikan AC/DC, saklar, dan prasyarat booting
    └── ui/
        └── uiManager.js         # Pengelola UI HUD, toast, terminal log, modal, dan joystick
```

---

## 🛠️ Teknologi yang Digunakan
* **HTML5 & CSS3:** Struktur semantik modern, CSS Flexbox, CSS Grid, CSS Variables, dan CSS Animations.
* **JavaScript (ES6+ Modular):** Arsitektur modular murni (*ES Modules*) dengan enkapsulasi state bersih tanpa polusi global scope.
* **Three.js (r160):** Mesin rendering 3D WebGL berkemampuan tinggi.
* **Three.js OrbitControls:** Navigasi kamera 3D dengan damping inertia halus.
* **Tailwind CSS (CDN):** Utilitas tata letak antarmuka responsif.
* **Font Awesome 6:** Set ikon grafis profesional.

---

## 👥 Hak Cipta & Kredit
Aplikasi ini dikembangkan dan disempurnakan oleh:
* **Chelly Satya Carsa Thesar**
* **Rauhul Jannah**

*Dipersiapkan sebagai media pembelajaran interaktif laboratorium komputer profesional.*
