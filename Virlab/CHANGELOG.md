# Catatan Perubahan (CHANGELOG)
### *VIRLAB-SIMULATOR: Interactive 3D PC Building Laboratory*

Seluruh pembaruan, peningkatan fitur, dan refactoring arsitektur proyek dicatat secara kronologis di bawah ini.

---

## [2.6.0] — 2026-11-09
### Peningkatan Ergonomi Mobile: Mode Layar Penuh & Kontrol Tampilan Bersih (HUD Toggle)
#### Ditambahkan
* **Mode Layar Penuh Imersif (Fullscreen Mode & Auto-Landscape Lock):**
  - Mengintegrasikan HTML5 Fullscreen API standar dengan fallback multi-browser (`webkit`, `moz`, `ms`).
  - Fitur penguncian otomatis orientasi layar ke horizontal / landscape (`screen.orientation.lock('landscape')`) saat masuk ke mode layar penuh di smartphone dan melepas kuncinya saat keluar.
  - Menghilangkan bilah alamat URL dan antarmuka browser secara otomatis untuk memperluas area pandang simulasi 3D.
  - Tombol `#btn-fullscreen` pada bilah navigasi utama dan `#btn-start-fullscreen` pada layar menu awal (Start Menu).
  - Pintasan keyboard `F` (*Desktop Shortcut*) untuk mengaktifkan/menonaktifkan layar penuh secara instan.
  - Sinkronisasi ikon status (`fa-expand` vs `fa-compress`) secara real-time via event listener `fullscreenchange`.
* **Mode Tampilan Bersih / Sembunyikan & Tampilkan Menu (HUD Toggle System):**
  - Tombol `#btn-toggle-hud` untuk menyembunyikan seluruh overlay menu yang menghalangi pandangan (Top Bar, Dropdown Kategori, Joystick Virtual, Kontrol Elevasi, Sistem Log Terminal, dan Banner).
  - Animasi transisi halus (`0.3s cubic-bezier`) saat elemen HUD menghilang ke atas dan kontrol virtual meluncur ke bawah.
  - Tombol mengambang ergonomis (`#btn-floating-hud`) berdesain *glassmorphism* di pojok layar dengan pendaran lembut yang memungkinkan pengguna memulihkan menu hanya dengan 1 ketukan.
  - Pintasan keyboard `H` (*Clean View Shortcut*) untuk menyembunyikan/menampilkan menu pada desktop.
  - Kanvas interaksi 3D tetap aktif 100% sehingga pengguna dapat bebas mengamati rig, memutar sudut pandang, zoom, dan berinteraksi dengan saklar daya.
  - Umpan balik notifikasi *toast* interaktif saat menu disembunyikan dan dimunculkan kembali.
  - Pemulihan otomatis visibilitas menu saat pengguna kembali ke layar utama simulator.
* **Pembaruan Panduan Kontrol (`#help-modal`):**
  - Penjelasan instruksi penggunaan mode layar penuh & sembunyikan menu untuk smartphone/tablet serta pintasan keyboard `F` dan `H`.

---

## [2.5.0] — 2026-11-09
### Tahap 8 (Optimasi & Pengujian) & Tahap 9 (Finalisasi & Dokumentasi)
#### Ditambahkan
* **Sistem Preset Kualitas Grafis Dinamis (`setGraphicsQuality`):**
  - Opsi *Rendah (Low)*: Mematikan bayangan, pixel ratio 1.0, sangat hemat baterai pada smartphone.
  - Opsi *Sedang (Medium)*: Bayangan *BasicShadowMap*, pixel ratio 1.25, seimbang untuk tablet.
  - Opsi *Tinggi (High)*: Bayangan *PCFSoftShadowMap 2048x2048*, pixel ratio 2.0 untuk desktop.
* **Deteksi Perangkat Otomatis (`autoDetectQuality`):** Otomatis mendeteksi perangkat mobile untuk menerapkan preset performa optimal tanpa pengaturan manual.
* **Fitur Reset Sudut Kamera Halus (`resetCamera`):** Tombol HUD `#btn-reset-camera` untuk mengembalikan posisi kamera dan target pandang secara mulus ke pusat laboratorium.
* **Panel Pengaturan Simulator (`#settings-modal`):** Modal terpadu untuk mengatur kualitas grafis, suasana pencahayaan ruangan, dan reset simulator.
* **Utilitas Pembebasan Memori VRAM (`disposeGeometries`):** Pelepasan buffer geometri WebGL saat komponen dilepas atau kabel diperbarui untuk mencegah *memory leak*.
* **Penanganan Tombol Keyboard Escape (Esc):** Menekan tombol Esc otomatis menutup kartu detail titik anatomi, drawer katalog, atau modal pop-up yang aktif.
* **Penutupan Modal Melalui Backdrop Click:** Mengklik area gelap luar modal langsung menutup jendela pop-up.
* **Dokumentasi Proyek Lengkap:**
  - `README.md`: Gambaran umum proyek, identitas pengembang, dan arsitektur.
  - `PANDUAN_PENGGUNAAN.md`: Petunjuk detail bagi siswa/pengguna simulator.
  - `PANDUAN_MENJALANKAN.md`: Instruksi konfigurasi server lokal (VS Code Live Server, Python, Node.js).
  - `CHANGELOG.md`: Catatan riwayat pembaruan menyeluruh.

#### Dioptimalkan
* **Throttling Upload Tekstur 2D ke WebGL:** Pembaruan kanvas monitor 1024x512 dibatasi hingga ~30fps dan layar AIO LCD ~15fps saat menyala (0fps saat mati), menghemat lebih dari 60% bandwidth GPU.
* **Pembersihan Koleksi Material Dinamis:** Array `rgbMaterials` dibersihkan pada `clearDynamicCollections()` untuk meminimalkan beban CPU loop animasi.
* **Media Query Lanskap Murni:** Aturan otomatis menyembunyikan `#portrait-banner` pada seluruh orientasi lanskap.

---

## [2.4.0] — 2026-11-09
### Tahap 7 (Fitur Edukasi dan Informasi — Hardware Learning System)
#### Ditambahkan
* **Tiga Mode Pembelajaran Fungsional (*Core Modes*):**
  - *Assembly Mode*: Alur perakitan komputer interaktif.
  - *Explore Mode*: Pengamatan bebas objek 3D tanpa drawer penghalang dengan titik anatomi bercahaya.
  - *Learning Mode*: Akses penuh modul materi 12 aspek pembelajaran perangkat keras.
* **12 Titik Anatomi Interaktif 3D (*Anatomy Hotspots*):**
  - Penanda mengambang (*pulsing cyan beacon*) yang diproyeksikan dari koordinat 3D ke layar 2D secara real-time.
  - Fokus kamera otomatis dengan interpolasi halus (*cubic ease-out*) ke bagian yang dipilih.
  - Kartu detail interaktif (*Hotspot Detail Floating Card*) memuat nama bagian, pengertian fisik, fungsi utama, dan urgensi teknis.
* **Materi Edukasi 12 Poin Wajib untuk Seluruh 8 Kategori Hardware:**
  - 1. Nama Perangkat, 2. Pengertian, 3. Fungsi Utama, 4. Kegunaan, 5. Cara Kerja, 6. Bagian-Bagian Fisik, 7. Spesifikasi Teknis, 8. Konektor/Antarmuka, 9. Lokasi Pemasangan, 10. Kompatibilitas, 11. Contoh Penggunaan, 12. Tips Perawatan.
* **Kuis Interaktif 10 Soal Berbobot:**
  - Soal pilihan ganda interaktif dengan verifikasi instan (hijau/merah).
  - Kotak pembahasan komprehensif pada setiap pertanyaan.
  - Layar evaluasi skor akhir dengan penganugerahan predikat (*Ahli Laboratorium*, *Teknisi Terampil*, *Siswa Magang*).

---

## [2.3.0] — 2026-11-09
### Tahap 6 (Penyempurnaan Kelistrikan & Booting Komputer)
#### Ditambahkan
* **Stopkontak AC 220V Realistis (Power Strip):** Saklar rocker 3D dengan kemiringan fisik dan lampu neon merah yang dapat dihidupkan/dimatikan.
* **Pemutusan Arus Darurat:** Mematikan stopkontak otomatis memutuskan aliran daya ke seluruh komponen PC dan mematikan layar monitor.
* **Logika Dongle USB Wireless:** Dongle nano USB yang dapat di-drag & drop ke port USB casing PC untuk mengaktifkan konektivitas keyboard wireless.
* **Layar Monitor Dinamis 6 Status Layar (Canvas 1024x512):**
  - Layar mati (`OFF`).
  - Tidak ada sinyal (`NO SIGNAL` dengan kotak OSD floating).
  - BIOS/UEFI POST (*Power-On Self-Test*) dengan pembacaan spesifikasi hardware nyata.
  - Konsol teks kesalahan berkedip (`NO BOOTABLE DEVICE FOUND`) jika media SSD belum terpasang.
  - Animasi booting OS dengan circular spinner.
  - Antarmuka **VIRLAB OS Desktop** dengan jendela diagnostik perangkat keras aktif.

---

## [2.2.0] — 2026-11-09
### Tahap 5 (Penyempurnaan Simulasi Perakitan)
#### Ditambahkan
* **Animasi Pendekatan 3D (Approach Docking Vector):** Komponen meluncur secara 3D dari arah luar sasis menuju slot target dengan interpolasi cubic ease-out selama 450ms.
* **Pendaran Kontak Visual (Contact Flash):** Kilatan cahaya biru lembut saat pin komponen menyentuh slot sasis.
* **Animasi Pelepasan Halus (Slide-Out Disassembly):** Komponen meluncur keluar soket selama 320ms sebelum dilepas dari hierarki.
* **Mesin Validasi Kompatibilitas Arsitektur:**
  - Penolakan ketidakcocokan soket CPU AM4 (PGA) vs AM5 (LGA).
  - Penolakan ketidakcocokan jenis memori RAM DDR4 vs DDR5.
  - Pengecekan dimensi radiator pendingin cairan (360mm AIO vs Mid-Tower Case NZXT H510 Flow).
  - Peringatan kapasitas catu daya (GPU RTX 4090 disarankan PSU 1000W+).
* **Sistem Reset 2 Mode:**
  - *Kosongkan Seluruh Rig (0/8)*: Memulai perakitan dari sasis kosong.
  - *Showcase PC Flagship (8/8)*: Memuat komputer spesifikasi tertinggi secara instan.
* **Modal Panduan 8 Langkah Perakitan:** Road map interaktif panduan urutan perakitan standar laboratorium.

---

## [2.1.0] — 2026-11-09
### Tahap 4 (Pengembangan Model 3D Detail & Realistis)
#### Ditambahkan
* **PBR (Physically Based Rendering) Materials:** Material tembaga, emas, aluminium sikat, baja gelap, plastik bertekstur, bilah kipas aerodinamis, dan kaca smoked tempered.
* **Generator Tekstur Prosedural Resolusi Tinggi:**
  - `createMotherboardTexture`: Jalur bus tembaga/emas, IC chip, solder pads, silkscreen.
  - `createCpuIhsTexture`: Laser-etched logo, barcode, teks spesifikasi mikroprosesor.
  - `createSsdLabelTexture`: Stiker label garansi pabrik M.2 PCIe Gen 4.
  - `createPsuLabelTexture`: Tabel tegangan daya dan lencana sertifikasi efisiensi 80 PLUS.
  - `updateAioDisplay`: Tampilan digital meteran suhu cairan prosesor real-time.
* **Pencahayaan Studio Laboratorium Fotorealistik:**
  - Key Directional Light dengan bayangan halus (*PCFSoftShadowMap 2048x2048*).
  - Fill Light seimbang dari sudut berlawanan dan pendaran cahaya monitor ke meja.

---

## [2.0.0] — 2026-11-09
### Tahap 1, 2, & 3 (Audit, Redesign UI/UX & Eliminasi Total Sistem Harga)
#### Dirombak
* **Pemisahan Monolitik Menjadi 14 Modul ES6 Modular:**
  - Pemisahan bersih antara logika simulasi (`js/systems/`), model 3D (`js/3d/`), inti WebGL (`js/core/`), data katalog (`js/data/`), dan antarmuka (`js/ui/`).
* **Transformasi Tema Menjadi "Bright Professional Technology Laboratory":**
  - Mengganti latar belakang gelap pekat dengan warna putih bersih dan abu-abu terang (`#f8fafc`).
  - Mengganti panel kusam dengan panel kaca modern (*White Frosted Glass*).
* **Responsivitas Layar Penuh (100dvh / 100dvw):**
  - Penataan ergonomis khusus smartphone landscape (analog virtual kiri, kontrol elevasi kanan).
  - Banner panduan rotasi cerdas yang hanya muncul pada smartphone orientasi vertikal.
* **100% Eliminasi Sistem Harga:**
  - Menghapus seluruh simbol mata uang (`$`, `Rp`), variabel `totalCost`, `cost-display`, dan logika belanja.
  - Mengganti seluruh badge harga dengan spesifikasi teknis edukatif murni.

---

## [1.0.0] — Legacy Base Version
* Versi monolitik awal simulator perakitan PC dalam satu file HTML tunggal dengan tema gelap dan sistem nominal mata uang belanja komputer.
