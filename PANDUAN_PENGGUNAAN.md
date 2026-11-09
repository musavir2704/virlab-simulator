# Panduan Penggunaan VIRLAB-SIMULATOR
### *Petunjuk Interaksi & Eksplorasi Laboratorium Komputer 3D*

---

## 📋 Daftar Isi
1. [Memulai Simulasi](#1-memulai-simulasi)
2. [Navigasi & Kontrol Kamera 3D](#2-navigasi--kontrol-kamera-3d)
3. [Alur Perakitan Komputer (Mode Perakitan)](#3-alur-perakitan-komputer-mode-perakitan)
4. [Simulasi Kelistrikan & Booting Komputer](#4-simulasi-kelistrikan--booting-komputer)
5. [Mode Eksplorasi 3D & Titik Anatomi](#5-mode-eksplorasi-3d--titik-anatomi)
6. [Pusat Pembelajaran Perangkat Keras (12 Poin)](#6-pusat-pembelajaran-perangkat-keras-12-poin)
7. [Kuis Interaktif Perangkat Keras](#7-kuis-interaktif-perangkat-keras)
8. [Pengaturan Grafis, Lingkungan & Reset](#8-pengaturan-grafis-lingkungan--reset)

---

## 1. Memulai Simulasi
1. Buka simulator melalui browser modern.
2. Pada layar **Start Menu**, Anda dapat memilih:
   * **Mulai Simulasi:** Memasuki area laboratorium komputer virtual dengan rig contoh (*Showcase Rig Flagship 8/8* terpasang).
   * **Panduan:** Membuka panduan navigasi dan kontrol.
   * **Tentang:** Melihat identitas pembuat simulator (*Chelly Satya Carsa Thesar & Rauhul Jannah*).

---

## 2. Navigasi & Kontrol Kamera 3D

### A. Pengguna Desktop (Mouse & Keyboard)
* **Klik Kiri + Geser Mouse:** Memutar sudut pandang kamera (*Orbit Rotation*) mengelilingi meja laboratorium.
* **Klik Kanan + Geser Mouse:** Melihat sekeliling (*Look Around*).
* **Scroll Wheel Mouse:** Memperbesar (*Zoom In*) atau memperkecil (*Zoom Out*) tampilan objek.
* **Tombol WASD atau Tombol Panah:** Bergerak horizontal (Maju, Mundur, Geser Kiri, Geser Kanan).
* **Tombol Q / E:** Memutar sudut pandang horizontal ke kiri atau ke kanan secara bertahap.
* **Spasi (Spacebar):** Menaikkan elevasi sudut pandang kamera.
* **Shift:** Menurunkan elevasi sudut pandang kamera.
* **Tombol F (Fullscreen):** Mengaktifkan / keluar dari Mode Layar Penuh (*Fullscreen*).
* **Tombol H (Hide / Show HUD):** Menyembunyikan / menampilkan seluruh menu dan tombol antarmuka (*Clean View Mode*).
* **Tombol Escape (Esc):** Menutup kartu detail titik anatomi, drawer katalog, atau modal pop-up yang sedang aktif.

### B. Pengguna Smartphone & Tablet (Layar Sentuh)
* **Mode Layar Penuh (Ikon Kotak Panah):** Ketuk tombol layar penuh pada menu awal atau toolbar atas untuk mengunci layar ke posisi **Landscape (Horizontal)** secara otomatis dan menyembunyikan bilah URL/address bar browser agar pandangan simulasi menjadi maksimal.
* **Sembunyikan / Tampilkan Menu (Ikon Mata):** Jika tampilan menu toolbar menghalangi observasi rig komputer pada layar smartphone, ketuk tombol **Mata Dicoret** pada toolbar atas. Toolbar atas, status perakitan, dan tombol log akan disembunyikan, sedangkan **Analog, Tombol Naik/Turun Elevasi, dan Tombol Kategori Komponen tetap aktif** sehingga Anda tetap leluasa bergerak dan merakit.
* **Tombol Pemulih Menu Mengambang:** Saat menu disembunyikan, tombol mengambang transparan **"Tampilkan Menu"** akan hadir di pojok kanan atas. Cukup ketuk satu kali untuk mengembalikan seluruh menu secara instan.
* **Analog Virtual (Pojok Kiri Bawah):** Geser tuas analog biru untuk berjalan maju, mundur, atau menyamping di dalam laboratorium.
* **Tombol Elevasi (Pojok Kanan Bawah):**
  * Tekan tombol panah atas (`▲`) untuk menaikkan posisi kamera.
  * Tekan tombol panah bawah (`▼`) untuk menurunkan posisi kamera.
* **Usap Layar 1 Jari:** Memutar sudut pandang kamera 3D secara bebas.
* **Cubit Layar 2 Jari (*Pinch-to-Zoom*):** Melakukan zoom in atau zoom out.

---

## 3. Alur Perakitan Komputer (Mode Perakitan)

Simulator menerapkan standar urutan perakitan laboratorium komputer yang benar:

| Langkah | Komponen | Keterangan & Alasan Teknis |
|:---:|---|---|
| **1** | **Casing Komputer (PC Case)** | Rangka dasar dan rumah pelindung yang menampung dudukan (*standoff*) bagi seluruh perangkat keras. |
| **2** | **Catu Daya (PSU)** | Dipasang di kompartemen bawah (*shroud*) sebelum kabel motherboard menghalangi ruang kerja. |
| **3** | **Papan Induk (Motherboard)** | Tulang punggung sirkuit utama tempat menancapnya prosesor, memori, dan kartu ekspansi. |
| **4** | **Prosesor (CPU)** | Otak utama komputasi; harus dipasang ke dalam soket motherboard sebelum memasang pendingin. |
| **5** | **Pendingin CPU (Cooler)** | Pendingin udara (*Air Cooler*) atau cairan (*Liquid AIO*) yang menempel di atas IHS prosesor untuk menyerap kalor. |
| **6** | **Memori RAM** | Memori utama berkecepatan tinggi; dipasang pada slot DIMM (direkomendasikan Slot 2 & 4 untuk Dual-Channel). |
| **7** | **Penyimpanan (Storage SSD)** | Media penyimpanan M.2 NVMe berkecepatan tinggi yang ditancapkan langsung ke jalur PCIe motherboard. |
| **8** | **Kartu Grafis (GPU)** | Komponen ekspansi berbobot besar; dipasang terakhir pada slot PCIe x16 utama agar tidak menghalangi pemasangan kabel kecil. |

### Cara Memasang Komponen:
1. Klik tombol **Kategori Komponen** di panel kiri atas.
2. Pilih kategori yang bertanda badge **LANGKAH X** (langkah rekomendasi).
3. Pada panel katalog sebelah kanan, baca spesifikasi teknis komponen.
4. Klik tombol **"Pasang ke Rig →"**. Komponen akan meluncur (*slide-docking*) secara 3D ke posisinya dengan pendaran visual.

### Cara Melepas Komponen:
1. Buka kategori komponen yang sedang terpasang.
2. Klik tombol merah **"Lepas Komponen"**.
3. Komponen akan meluncur keluar dari soket dan dicopot dari rig PC.
4. *Catatan:* Motherboard tidak dapat dilepas sebelum komponen anak di atasnya (CPU, RAM, GPU, Cooler, Storage) dilepas terlebih dahulu.

---

## 4. Simulasi Kelistrikan & Booting Komputer

Agar komputer dapat menyala dan menampilkan desktop, ikuti urutan kelistrikan dunia nyata berikut:

1. **Nyalakan Stopkontak Listrik (Power Strip):**
   * Cari stopkontak putih 4 lubang di atas meja di sebelah kanan casing PC.
   * Klik saklar rocker merah. Saklar akan miring secara 3D dan lampu neon merah menyala terang. Indikator listrik di HUD akan berubah menjadi hijau menyala.
2. **Nyalakan Monitor:**
   * Klik tombol power kecil di sudut kanan bawah bezel monitor. Layar monitor akan menyala dan menampilkan pesan **"NO SIGNAL"** (karena PC belum dihidupkan).
3. **Hubungkan Keyboard Wireless:**
   * Klik dan drag (atau sentuh) **USB Dongle Wireless** berwarna hitam di atas meja.
   * Arahkan dan lepaskan di atas port USB bagian atas Casing PC. Muncul notifikasi bahwa keyboard wireless siap digunakan.
4. **Tekan Tombol Power PC:**
   * Klik tombol power di bagian atas Casing PC, atau klik tombol **"Nyalakan PC"** pada toolbar atas.
   * **Inisialisasi Booting:**
     - Seluruh kipas sasis, pendingin CPU, dan kipas kartu grafis mulai berputar.
     - Lampu RGB komponen memancarkan spektrum warna dinamis.
     - Layar monitor menampilkan **BIOS/UEFI POST** mendeteksi komponen nyata yang terpasang.
     - Jika SSD terpasang, animasi booting Windows/OS akan berputar.
     - Setelah beberapa detik, sistem operasi **VIRLAB OS Desktop** muncul menampilkan jendela *System Diagnostic*.
     - *Jika SSD belum dipasang*, monitor akan menampilkan pesan kesalahan teks konsol **"NO BOOTABLE DEVICE FOUND"**.

---

## 5. Mode Eksplorasi 3D & Titik Anatomi

1. Klik tombol **Eksplorasi 3D** (ikon kubus) pada bilah mode atas.
2. Panel katalog akan otomatis tertutup dan titik-titik anatomi bercahaya (*cyan glowing beacons*) akan muncul mengambang di atas komponen rig PC.
3. Klik salah satu titik anatomi (misalnya *Soket Prosesor*, *Slot PCIe SafeSlot*, *Konektor Daya GPU 12VHPWR*, dll.):
   * Kamera akan meluncur secara otomatis memperbesar dan memfokuskan pandangan ke bagian tersebut.
   * Kartu informasi (*Hotspot Detail Card*) akan muncul di pojok kiri bawah menjelaskan pengertian fisik, fungsi utama, dan urgensi teknis bagian tersebut.
   * Anda juga dapat mengklik langsung bagian fisik model 3D di layar untuk memfokuskan bagian tersebut.
4. Klik tombol **"Pelajari Kategori Lengkap"** pada kartu untuk langsung membuka modul edukasi 12 poin kategori terkait.

---

## 6. Pusat Pembelajaran Perangkat Keras (12 Poin)

1. Klik tombol **Pusat Edukasi** pada bilah mode atas (atau tombol buku di toolbar).
2. Jendela modul pembelajaran interaktif akan terbuka:
   * Pilih salah satu dari 8 kategori di sidebar kiri (*Casing, Motherboard, CPU, Cooler, RAM, GPU, Storage, PSU*).
   * Pelajari 12 standar aspek materi:
     1. *Pengertian Perangkat*
     2. *Fungsi Utama*
     3. *Kegunaan Sehari-hari*
     4. *Cara Kerja Sederhana*
     5. *Bagian-Bagian Fisik Komponen*
     6. *Spesifikasi Teknis*
     7. *Konektor & Antarmuka*
     8. *Lokasi Pemasangan*
     9. *Kompatibilitas Sistem*
     10. *Contoh Penggunaan*
     11. *Tips Perawatan Laboratorium*
     12. *Titik Anatomi 3D Terkait*
3. Klik tombol **"Lihat di Eksplorasi 3D"** untuk menutup modal dan langsung mengamati model 3D komponen tersebut di atas meja laboratorium.

---

## 7. Kuis Interaktif Perangkat Keras

1. Klik tombol **Kuis Hardware** (ikon medali emas) di bilah mode atas.
2. Jawab 10 pertanyaan berbobot pilihan ganda (A, B, C, D) yang menguji pemahaman Anda seputar fungsi, arsitektur, kompatibilitas, dan kelistrikan komputer.
3. Setelah memilih jawaban:
   * Pilihan Anda akan diverifikasi secara langsung (hijau jika benar, merah jika salah).
   * Kotak penjelasan edukatif akan muncul memaparkan pembahasan teknis mendalam mengenai jawaban tersebut.
   * Klik tombol **"Pertanyaan Selanjutnya →"** untuk melanjutkan.
4. Di akhir kuis, sistem menampilkan rekap skor nilai (skala 0 - 100), jumlah jawaban benar/salah, serta penganugerahan predikat kompetensi:
   * **80 - 100:** *Ahli Laboratorium Komputer*
   * **50 - 79:** *Teknisi Komputer Terampil*
   * **0 - 49:** *Siswa Magang Laboratorium*

---

## 8. Pengaturan Grafis, Lingkungan & Reset

### A. Mengatur Kualitas Grafis (Settings Modal)
1. Klik tombol **Pengaturan** (ikon roda gigi `⚙`) pada toolbar atas.
2. Pilih tingkat kualitas grafis:
   * **Rendah (Low):** Menonaktifkan bayangan (*shadow map off*), render pixel ratio 1.0. Sangat ringan untuk smartphone atau laptop hemat baterai.
   * **Sedang (Medium):** Mengaktifkan bayangan dasar (*BasicShadowMap*), render pixel ratio hingga 1.25. Seimbang dan optimal untuk tablet.
   * **Tinggi (High):** Mengaktifkan bayangan tepi lembut fotorealistik (*PCFSoftShadowMap 2048x2048*), render pixel ratio hingga 2.0. Kualitas visual maksimal untuk desktop/laptop bertenaga.

### B. Mengubah Suasana Pencahayaan Ruangan (Environment)
Gunakan tombol lampu di toolbar atas atau di dalam menu pengaturan:
* **Lab Bersih (Clean Lab - Default):** Pencahayaan studio laboratorium cerah dengan meja reflektif putih abu-abu.
* **Kamar Gamer RGB:** Suasana pencahayaan gelap futuristik yang menonjolkan pendaran lampu RGB internal casing PC.
* **Bengkel Kayu:** Pencahayaan hangat bernuansa meja kayu workstation.

### C. Reset Sudut Kamera
* Jika sudut kamera menjauh atau orientasi membingungkan saat navigasi bebas, klik tombol **Reset Kamera** (ikon video kamera di toolbar atas) untuk seketika mengembalikan sudut pandang ke pusat laboratorium secara mulus.

### D. Reset Rig Komputer
1. Klik tombol **Reset Rig** (ikon putar panah melingkar merah).
2. Pilih salah satu dari dua mode reset:
   * **Kosongkan Seluruh Rig (0/8):** Mencopot seluruh komponen dan kabel sehingga sasis meja menjadi kosong, memungkinkan Anda merakit komputer mandiri dari Langkah 1 (Casing).
   * **Rakit Showcase PC Flagship (8/8):** Memasang otomatis rig PC spesifikasi tertinggi lengkap dalam kondisi siap pakai.
