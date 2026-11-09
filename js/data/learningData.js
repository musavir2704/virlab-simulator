/**
 * VIRLAB-SIMULATOR: Hardware Learning System Data
 * Memuat materi edukasi lengkap 12 poin untuk 8 kategori komponen,
 * data hotspot anatomi interaktif 3D, serta bank soal kuis perangkat keras komputer.
 */

import * as THREE from 'three';
import { PC_OFFSET } from '../core/constants.js';

// 1. MATERI EDUKASI LENGKAP 12 POIN UNTUK SELURUH 8 KATEGORI
export const HARDWARE_LEARNING_CONTENT = {
    case: {
        id: 'case',
        name: 'Casing Komputer (PC Case / Chassis)',
        definition: 'Casing komputer adalah rangka eksternal berbahan logam (baja/aluminium) dan kaca tempered yang berfungsi sebagai rumah fisik dan pelindung mekanis bagi seluruh komponen sensitif komputer.',
        mainFunction: 'Menampung dan menyatukan seluruh komponen perangkat keras, menyediakan saluran pendinginan aliran udara (airflow), dan melindungi komponen dari debu, kotoran, benturan fisik, serta radiasi interferensi elektromagnetik (EMI).',
        usage: 'Digunakan dalam penggunaan sehari-hari untuk menjaga suhu komputer tetap dingin melalui ventilasi terarah, meredam suara bising kipas, dan memberikan estetika laboratorium profesional.',
        howItWorks: 'Bekerja dengan prinsip aliran udara konveksi termal: udara dingin dari luar disedot oleh kipas intake depan/bawah, dialirkan melintasi heatsink komponen yang panas, lalu udara panas dibuang keluar oleh kipas exhaust belakang/atas.',
        keyComponents: [
            'Rangka Utama Logam Baja (SECC Frame) & Dudukan Standoff Motherboard',
            'Panel Samping Kaca Tempered (Tempered Glass)',
            'Kompartemen Catu Daya Bawah (PSU Shroud)',
            'Bilah Perapi Kabel (Cable Management Bar & Grommets)',
            'Panel I/O Depan (Tombol Daya, USB-C, USB 3.0, Jack Audio)',
            'Filter Debu Magnetik & Kisi-kisi Ventilasi (Mesh)'
        ],
        techSpecs: 'Tersedia dalam berbagai faktor bentuk: Mini-ITX (Kompak), Mid-Tower ATX (Standar paling populer), dan Full-Tower / Super-Tower E-ATX (Ekstrem multi-GPU).',
        connectors: 'Kabel Front Panel Header (Power SW, Reset SW, Power LED, HDD LED), Header USB 3.0 19-pin, Header USB-C 20-pin, dan Header HD Audio.',
        installLocation: 'Diletakkan di atas meja laboratorium atau lantai kerja dengan sirkulasi udara bebas hambatan.',
        compatibility: 'Harus kompatibel dengan ukuran form factor Motherboard (ATX/mATX/ITX), panjang maksimal kartu grafis (GPU clearance), tinggi pendingin CPU, dan ukuran panjang radiator (120mm hingga 360mm).',
        useCases: 'Workstation desain, komputer laboratorium komputasi, stasiun riset data, dan PC gaming performa tinggi.',
        maintenanceTips: 'Bersihkan filter debu magnetik secara berkala setiap 1-2 bulan menggunakan kuas halus atau vacuum bertekanan rendah, dan pastikan jarak bagian belakang casing minimal 10-15 cm dari dinding.'
    },

    motherboard: {
        id: 'motherboard',
        name: 'Papan Induk (Motherboard / Mainboard)',
        definition: 'Motherboard adalah papan sirkuit cetak utama (Printed Circuit Board / PCB) berukuran besar dengan ribuan jalur konduktor tembaga yang menghubungkan dan memungkinkan seluruh komponen komputer saling berkomunikasi.',
        mainFunction: 'Sebagai tulang punggung sistem yang mengatur aliran data berkecepatan tinggi antar komponen, menyalurkan tegangan listrik dari PSU, dan memuat chip firmware BIOS/UEFI untuk inisialisasi booting awal.',
        usage: 'Menjadi tempat bertumpu dan menancapnya prosesor, RAM, kartu grafis, penyimpanan NVMe, dan periferal eksternal seperti keyboard, mouse, serta jaringan kabel LAN.',
        howItWorks: 'Menghubungkan komponen melalui arsitektur bus berkecepatan tinggi: jalur langsung PCIe lane ke CPU untuk kartu grafis dan SSD M.2, serta bus DMI menuju chipset untuk mengontrol I/O USB, audio, dan SATA.',
        keyComponents: [
            'Soket CPU (LGA / PGA Socket dengan tuas pengunci)',
            'Slot Memori DIMM (Dual-Channel DDR4 / DDR5)',
            'Slot Ekspansi PCIe x16 SafeSlot dengan pelindung logam',
            'Slot M.2 PCIe NVMe dengan pelat pendingin heatsink aluminium',
            'Modul Pengatur Tegangan Daya (VRM / Voltage Regulator Module)',
            'Chipset PCH (Platform Controller Hub) dengan heatsink pendingin',
            'Rear I/O Shield (Port USB, HDMI, DisplayPort, 2.5G LAN, Audio HD)'
        ],
        techSpecs: 'Mendukung standar ATX (305 x 244 mm), arsitektur PCIe Gen 4.0 / 5.0 hingga 128 GB/s bandwidth, memori DDR4/DDR5 hingga 192 GB, dan DrMOS VRM multi-fase.',
        connectors: 'Konektor Utama 24-Pin ATX, Konektor Daya CPU 8-Pin EPS12V, 4-6x Port SATA 6Gb/s, Header Kipas PWM 4-Pin, dan Header Addressable RGB (ARGB 5V).',
        installLocation: 'Disekrupkan secara presisi pada baut standoff logam di bagian pelat dalam sasis casing.',
        compatibility: 'Harus memiliki soket yang cocok dengan prosesor (misal AM4 untuk Ryzen 5000, AM5 untuk Ryzen 7000/9000) dan tipe slot yang sesuai dengan generasi RAM.',
        useCases: 'Pusat integrasi seluruh sistem komputasi modern baik kelas kantor, kreator konten, maupun komputer ilmiah.',
        maintenanceTips: 'Hindari menyentuh jalur sirkuit tanpa perlindungan anti-statis (ESD), periksa baut standoff agar tidak terjadi korsleting, dan perbarui firmware UEFI BIOS secara aman untuk kompatibilitas CPU baru.'
    },

    cpu: {
        id: 'cpu',
        name: 'Prosesor (CPU / Central Processing Unit)',
        definition: 'CPU adalah sirkuit terpadu mikroprosesor semikonduktor silikon yang bertindak sebagai otak utama komputer untuk mengeksekusi instruksi program dan kalkulasi matematika/logika.',
        mainFunction: 'Menjalankan siklus instruksi (Fetch, Decode, Execute, Writeback), mengelola sistem operasi, serta mengoordinasikan instruksi pemrosesan bagi seluruh perangkat keras lainnya.',
        usage: 'Menentukan kecepatan dan responsivitas komputer saat membuka aplikasi, kompilasi kode pemrograman, pemrosesan simulasi sains, kompresi data, dan rendering.',
        howItWorks: 'Berisi miliaran transistor mikroskopis (skala nanometer) yang terbagi menjadi Core pemroses, cache memori berkecepatan tinggi (L1, L2, L3 Cache), serta Memory Controller yang membaca instruksi dari RAM secara sekuensial dan paralel.',
        keyComponents: [
            'Integrated Heat Spreader (IHS) dari tembaga berlapis nikel',
            'Substrat PCB Silikon dengan titik kontak emas atau pin',
            'Core Inti Komputasi (Arithmetic Logic Unit & Floating Point Unit)',
            'Cache Memori Berjenjang (L1, L2, dan L3 GameCache berkapasitas besar)',
            'Integrated Memory Controller (IMC) & Root Complex PCIe'
        ],
        techSpecs: 'Frekuensi clock base hingga 4.5 GHz dan boost 5.7 GHz, 6 hingga 16 Cores fisik (12 hingga 32 Threads pemrosesan simultan), serta fabrikasi TSMC FinFET 5nm/7nm.',
        connectors: 'Dudukan pin PGA (Pin Grid Array - AM4) atau bantalan datar LGA (Land Grid Array - AM5 LGA 1718).',
        installLocation: 'Terpasang tepat di tengah soket CPU pada motherboard dengan pengait tuas retensi logam.',
        compatibility: 'Wajib cocok secara mutlak dengan jenis soket motherboard (Soket AM4 tidak dapat dipasang ke soket AM5 dan sebaliknya).',
        useCases: 'Pemrosesan data multi-tasking, komputasi sains, game modern, simulasi 3D, dan pemrosesan kompilasi software.',
        maintenanceTips: 'Ganti pasta termal (thermal paste) setiap 12-18 bulan, dan pastikan pendingin CPU terpasang rapat agar suhu operasional tidak melampaui batas TjMax (95°C).'
    },

    cooler: {
        id: 'cooler',
        name: 'Sistem Pendingin CPU (Cooler - Air & Liquid AIO)',
        definition: 'Cooler adalah perangkat pembuang energi panas yang dipasang rapat di atas Integrated Heat Spreader (IHS) prosesor untuk menjaga suhu kerja CPU tetap stabil dan aman.',
        mainFunction: 'Menyerap kalor panas yang dihasilkan oleh transistor prosesor saat bekerja dan mendisipasikannya ke udara bebas agar CPU terhindar dari panas berlebih (thermal throttling) atau kerusakan silikon.',
        usage: 'Menjaga kinerja prosesor tetap pada kecepatan Boost Clock maksimal tanpa penurunan performa akibat suhu tinggi saat beban kerja berat.',
        howItWorks: 'Pada Air Cooler, pipa tembaga (heatpipes) berisi cairan pendingin mikro yang menguap saat panas, membawa panas ke tumpukan sirip aluminium, lalu dihembus oleh kipas. Pada Liquid AIO, pompa mensirkulasikan cairan pendingin melalui selang tertutup menuju radiator 360mm yang didinginkan oleh 3 kipas PWM.',
        keyComponents: [
            'Pelat Dasar Kontak Tembaga Presisi (Cold Plate)',
            'Pipa Panas Tembaga Berongga Kapiler (Copper Heatpipes)',
            'Tumpukan Sirip Aluminium Tipis (Aluminum Fin Stack)',
            'Pompa Cairan Sirkular dengan Layar LCD (Khusus AIO)',
            'Radiator Aluminium 360mm & Selang Anyaman Nilon (Khusus AIO)',
            'Kipas Pendingin PWM (Pulse Width Modulation) dengan Bantalan FDB'
        ],
        techSpecs: 'Kapasitas disipasi daya panas (TDP) hingga 180W pada Air Cooler dan 300W+ pada Liquid Cooler AIO 360mm, kecepatan putaran kipas 600 - 2000 RPM dengan tingkat kebisingan rendah (< 28 dBA).',
        connectors: 'Konektor 4-Pin PWM CPU_FAN, 4-Pin AIO_PUMP, dan Header 3-Pin 5V Addressable RGB (ARGB).',
        installLocation: 'Dipasang menempel di atas prosesor pada motherboard, dengan radiator AIO dipasang di langit-langit sasis.',
        compatibility: 'Braket pemasangan harus cocok dengan jenis soket (AM4/AM5), serta ruang sasis casing harus muat menampung tinggi menara atau panjang radiator 360mm.',
        useCases: 'Mendinginkan prosesor saat rendering video 4K, sesi gaming durasi panjang, komputasi AI, dan simulasi fisika.',
        maintenanceTips: 'Bersihkan debu pada kisi-kisi radiator dan sirip heatsink menggunakan blower udara bertekanan, dan pastikan kabel pompa AIO selalu terhubung ke port AIO_PUMP di motherboard.'
    },

    ram: {
        id: 'ram',
        name: 'Memori Utama (RAM / Random Access Memory)',
        definition: 'RAM adalah memori penyimpanan elektronik berkecepatan sangat tinggi yang bersifat volatile (data hilang saat listrik padam), berfungsi sebagai tempat transit data dan instruksi yang sedang diproses oleh CPU.',
        mainFunction: 'Menyimpan kode program sistem operasi dan aplikasi yang sedang aktif agar CPU dapat mengakses data tersebut dalam orde nanodetik tanpa terhambat oleh kecepatan media penyimpanan permanen.',
        usage: 'Memungkinkan multitasking lancar saat membuka puluhan tab browser, aplikasi pemodelan 3D, game berat, dan software perkantoran secara bersamaan tanpa lag.',
        howItWorks: 'Menggunakan sel kapasitor mikro yang menyimpan bit data biner (0 dan 1). CPU berkomunikasi langsung dengan chip memori melalui saluran data multi-channel 64-bit atau 128-bit berkecepatan miliaran transfer per detik (MT/s).',
        keyComponents: [
            'Papan PCB Sirkuit Berkualitas Tinggi dengan Lapisan Ground Anti-Interferensi',
            'Chip IC Silikon DRAM (Dynamic Random Access Memory)',
            'Jari-Jari Kontak Konektor Berlapis Emas (Gold Pins)',
            'Celah Kunci Fisik (Alignment Notch pembatas generasi)',
            'Heatspreader Pendingin Aluminium Anodized',
            'Bilah Diffuser Akrilik RGB Terpencar (Pada seri RGB)',
            'Power Management IC (PMIC) terintegrasi pada modul DDR5'
        ],
        techSpecs: 'Generasi DDR4 (3200 MHz, CL16, 1.35V) dan DDR5 (6000 MHz, CL30, On-Die ECC, profil AMD EXPO / Intel XMP 3.0), konfigurasi Dual-Channel Kit (2x 8GB atau 2x 16GB).',
        connectors: 'Modul DIMM 288-Pin (DDR4 dan DDR5 memiliki jumlah pin 288 namun posisi lekukan notch kunci berbeda dan tidak saling kompatibel).',
        installLocation: 'Ditanamkan pada slot DIMM memori di motherboard (disarankan slot 2 dan 4 / A2 dan B2 untuk aktivasi mode Dual-Channel).',
        compatibility: 'Generasi DDR4 hanya cocok untuk motherboard DDR4 (AM4), sedangkan DDR5 hanya cocok untuk motherboard DDR5 (AM5).',
        useCases: 'Multitasking produktivitas, pemrosesan dataset besar di memori, rendering animasi, dan gaming kompetitif.',
        maintenanceTips: 'Selalu pasang memori berpasangan dengan merk dan kecepatan yang identik (Dual-Channel Kit), tekan kedua ujung modul secara bersamaan hingga klip mengunci, dan jangan menyentuh pin emas secara langsung.'
    },

    storage: {
        id: 'storage',
        name: 'Media Penyimpanan Permanen (SSD M.2 NVMe)',
        definition: 'SSD M.2 NVMe adalah media penyimpanan data digital berbasis chip memori flash non-volatile (data tetap tersimpan saat komputer dimatikan) yang memanfaatkan protokol NVMe berkecepatan tinggi melalui jalur bus PCIe.',
        mainFunction: 'Menyimpan file sistem operasi Windows/Linux, software aplikasi, game, dokumen, dan data laboratorium secara permanen dan menyajikannya ke memori sistem dengan latensi ultra-rendah.',
        usage: 'Mempercepat waktu booting komputer dari hitungan menit (pada HDD lama) menjadi hanya beberapa detik, serta melenyapkan waktu tunggu (loading screen) saat membuka software berat.',
        howItWorks: 'Berbeda dengan hard disk mekanik piringan berputar, SSD tidak memiliki bagian bergerak. Data disimpan dalam bentuk muatan elektron pada sel gerbang isolator chip 3D V-NAND Flash dan dikontrol oleh mikroprosesor controller mutakhir.',
        keyComponents: [
            'Form Factor M.2 2280 (Panjang 80 mm, Lebar 22 mm)',
            'Chip Pengontrol Utama (Flash Memory Controller)',
            'Chip Memori 3D V-NAND Flash TLC / MLC Bertingkat',
            'DRAM Cache Berkecepatan Tinggi untuk Tabel Pemetaan LBA',
            'Konektor Tepi Emas M-Key 75-Pin',
            'Braket Heatsink Pelindung Termal Aluminium (Thermal Guard)'
        ],
        techSpecs: 'Antarmuka bus PCIe Gen 4.0 x4 berkecepatan baca sekuensial hingga 7,450 MB/detik dan tulis 6,900 MB/detik, 1.5 juta IOPS, kapasitas 1 TB hingga 2 TB, dengan ketahanan hingga 1,200 TBW.',
        connectors: 'Slot M.2 Socket 3 (Key M) PCIe berkecepatan x4 lanes.',
        installLocation: 'Dipasang langsung rata dengan motherboard pada slot M.2 pertama yang terhubung langsung ke jalur PCIe prosesor.',
        compatibility: 'Kompatibel dengan semua motherboard modern yang memiliki slot M.2 NVMe PCIe 3.0 / 4.0 / 5.0 (kompatibel mundur).',
        useCases: 'Penyimpanan partisi boot OS, perpustakaan game definisi tinggi, database laboratorium, dan pengeditan video resolusi 4K/8K.',
        maintenanceTips: 'Pasang pelat heatsink pendingin bawaan motherboard dengan bantalan thermal pad agar SSD tidak mengalami pelambatan akibat panas (thermal throttling) saat transfer file besar.'
    },

    gpu: {
        id: 'gpu',
        name: 'Kartu Grafis Dedikasi (GPU / Graphics Processing Unit)',
        definition: 'GPU adalah kartu ekspansi pemroses paralel bertenaga tinggi yang didesain secara khusus untuk mempercepat komputasi kalkulasi grafis, manipulasi citra visual, rendering 3D, dan akselerasi kecerdasan buatan (AI).',
        mainFunction: 'Mengubah instruksi digital dari CPU menjadi data piksel warna beresolusi tinggi dan memancarkannya secara real-time ke layar monitor melalui antarmuka DisplayPort atau HDMI.',
        usage: 'Digunakan untuk simulasi 3D real-time seperti VIRLAB, game modern dengan teknologi Ray Tracing, penyuntingan efek visual video, pemodelan arsitektur CAD, dan pelatihan model AI.',
        howItWorks: 'Memiliki ribuan inti pemroses kecil (CUDA Cores / Stream Processors) yang bekerja secara paralel untuk menghitung matriks koordinat poligon 3D, pencahayaan shader, tekstur, dan pantulan sinar foton secara instan dalam memori VRAM berkecepatan terabyte per detik.',
        keyComponents: [
            'Prosesor Silikon Grafis (Die GPU NVIDIA Ampere / Ada Lovelace)',
            'Memori Video Khusus (VRAM GDDR6 / GDDR6X Bandwidth Tinggi)',
            'Rangkaian Sirkuit Daya VRM Fase Tinggi dengan Choke Tahan Panas',
            'Blok Pendingin Sirip Aluminium Masif & Pipa Panas Tembaga Komposit',
            '2 hingga 3 Kipas Pendingin Aksial (Axial-Tech Fans dengan Rotasi Dinamis)',
            'Pelat Belakang Logam (Rigid Metal Backplate dengan Ventilasi Udara)',
            'Braket I/O Baja Stainless Belakang (DisplayPort 1.4a & HDMI 2.1a)'
        ],
        techSpecs: 'Memiliki 4,864 hingga 16,384 CUDA Cores, VRAM 8 GB hingga 24 GB GDDR6X 384-bit (1.008 TB/s bandwidth), arsitektur Ada Lovelace / Ampere, dukungan DLSS 3 Frame Generation, dan TDP 200W hingga 450W.',
        connectors: 'Slot Antarmuka PCIe 4.0 x16, Konektor Daya 8-Pin PCIe Standar atau 16-Pin 12VHPWR (PCIe 5.0).',
        installLocation: 'Ditancapkan pada slot ekspansi PCIe x16 pertama motherboard dan dibaut ke slot braket belakang sasis casing.',
        compatibility: 'Membutuhkan motherboard dengan slot PCIe x16, daya catu daya PSU yang mencukupi (minimal 650W untuk 3060 Ti, minimal 1000W untuk 4090), dan panjang ruang sasis casing yang memadai.',
        useCases: 'Rendering visual 3D, laboratorium simulasi komputer, game AAA, kecerdasan buatan (Machine Learning), dan workstation animasi.',
        maintenanceTips: 'Pastikan kipas GPU bebas dari debu yang menyumbat, hindari kabel menyentuh bilah kipas, dan gunakan penopang anti-sag bracket jika memasang kartu grafis berbobot berat.'
    },

    psu: {
        id: 'psu',
        name: 'Catu Daya (PSU / Power Supply Unit)',
        definition: 'Power Supply Unit adalah perangkat keras pengonversi daya listrik yang mengubah arus bolak-balik tegangan tinggi (AC 220V dari colokan PLN) menjadi arus searah tegangan rendah (DC +12V, +5V, +3.3V) yang stabil dan terukur bagi seluruh komponen PC.',
        mainFunction: 'Menyuplai energi listrik yang bersih, stabil, dan terproteksi ke motherboard, prosesor, kartu grafis, kipas, dan media penyimpanan dengan efisiensi energi tinggi.',
        usage: 'Menjamin keandalan dan umur panjang seluruh komponen PC dengan meredam lonjakan tegangan, melindungi dari korsleting, dan memastikan sistem tidak mati mendadak saat beban kerja puncak.',
        howItWorks: 'Arus listrik AC masuk melalui soket IEC C14, disaring oleh rangkaian EMI filter, disearahkan oleh jembatan dioda, dialirkan ke kapasitor elektrolit primer 105°C buatan Jepang, lalu dikonversi oleh sirkuit switching frekuensi tinggi DC-to-DC menjadi rel tegangan presisi.',
        keyComponents: [
            'Casing Baja Pelindung SECC Kokoh Berlapisan Matte Black',
            'Kapasitor Elektrolit Berkualitas Industri 105°C (100% Japanese Capacitors)',
            'Kipas Pendingin 135mm Fluid Dynamic Bearing (FDB) dengan Mode Zero RPM',
            'Kisi-Kisi Honeycomb Ventilasi Pelindung Aliran Udara',
            'Sakelar Pemutus Daya Fisik AC Rocker (I/O)',
            'Soket Terminal Output Modular Penuh (Fully Modular Interface)',
            'Sirkuit Proteksi Lengkap (OVP, UVP, OCP, OTP, SCP, OPP)'
        ],
        techSpecs: 'Daya kontinu 750 Watt hingga 1300 Watt, sertifikasi efisiensi 80 PLUS Gold (90%) hingga 80 PLUS Titanium (94%), standar ATX 3.0 dengan kabel bawaan 12VHPWR 600W.',
        connectors: 'Kabel Utama 24-Pin ATX Motherboard, Kabel 8-Pin (4+4) EPS CPU, Kabel 8-Pin (6+2) PCIe, Kabel Native 16-Pin 12VHPWR, dan Kabel Daya SATA.',
        installLocation: 'Dipasang di dalam kompartemen PSU Shroud di bagian bawah sasis dengan kipas menghadap ke bawah menuju filter debu.',
        compatibility: 'Pilih kapasitas daya (watt) yang memiliki cadangan minimal 20-30% di atas total daya puncak komponen (CPU + GPU + perifer).',
        useCases: 'Fondasi pasokan energi untuk seluruh komputer gaming, workstation rekayasa, dan komputer riset sains.',
        maintenanceTips: 'Jangan pernah membongkar sasis internal PSU karena kapasitor menyimpan tegangan listrik mematikan, pastikan filter debu di bawah casing selalu bersih, dan gunakan colokan arde yang terpasang baik.'
    }
};

// 2. DATA TITIK ANATOMI INTERAKTIF 3D (ANATOMY HOTSPOTS)
export const ANATOMY_HOTSPOTS = [
    {
        id: 'hs_cpu_socket',
        title: 'Soket Prosesor (CPU Socket)',
        part: 'Motherboard',
        category: 'motherboard',
        worldPos: new THREE.Vector3(-0.33, 1.33, -0.12).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(-0.15, 1.38, 0.15).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.33, 1.33, -0.12).add(PC_OFFSET),
        description: 'Dudukan presisi berlubang pin matrix (PGA) atau ribuan lidah kontak emas (LGA) tempat prosesor ditancapkan.',
        functionality: 'Menghubungkan miliaran transistor prosesor ke jalur sirkuit memori dan bus ekspansi motherboard tanpa perlu disolder permanen.',
        importance: 'Memiliki tuas pengunci logam (lock lever) untuk memberikan tekanan kontak listrik yang merata pada seluruh pin prosesor.'
    },
    {
        id: 'hs_ram_slots',
        title: 'Slot Memori DIMM (RAM Slots)',
        part: 'Motherboard',
        category: 'ram',
        worldPos: new THREE.Vector3(-0.33, 1.33, 0.26).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(-0.12, 1.45, 0.5).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.33, 1.33, 0.26).add(PC_OFFSET),
        description: 'Empat slot memori bersejajar vertikal dengan klip pengunci bilateral di kedua ujungnya.',
        functionality: 'Menghubungkan modul memori utama ke Memory Controller terintegrasi di dalam prosesor.',
        importance: 'Mendukung mode Dual-Channel pada slot 2 dan 4 (A2 & B2) untuk menggandakan bandwidth transfer data memori.'
    },
    {
        id: 'hs_pcie_safeslot',
        title: 'Slot Utama PCIe x16 SafeSlot',
        part: 'Motherboard',
        category: 'gpu',
        worldPos: new THREE.Vector3(-0.33, 0.95, -0.05).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(-0.05, 1.05, 0.35).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.33, 0.95, -0.05).add(PC_OFFSET),
        description: 'Slot bus ekspansi berkecepatan tertinggi yang dilapisi selongsong pelindung logam baja tahan karat.',
        functionality: 'Menyalurkan data grafis antara kartu grafis (GPU) dan prosesor dengan kecepatan bus PCIe Gen 4.0/5.0 hingga puluhan gigabyte per detik.',
        importance: 'Pelindung logam SafeSlot mencegah slot patah atau bengkok akibat beban berat kartu grafis modern berpendingin masif.'
    },
    {
        id: 'hs_m2_slot',
        title: 'Slot Media Penyimpanan M.2 NVMe',
        part: 'Motherboard',
        category: 'storage',
        worldPos: new THREE.Vector3(-0.33, 0.83, -0.05).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(-0.12, 0.9, 0.2).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.33, 0.83, -0.05).add(PC_OFFSET),
        description: 'Slot antarmuka ringkas berukuran 22x80mm yang dilengkapi pelat pendingin heatsink aluminium.',
        functionality: 'Menancapkan SSD generasi modern langsung ke jalur PCIe x4 tanpa kabel SATA tambahan.',
        importance: 'Menghasilkan kecepatan baca file hingga 7,450 MB/detik, 14 kali lipat lebih kencang dibanding SSD SATA tradisional.'
    },
    {
        id: 'hs_vrm_heatsink',
        title: 'Pendingin VRM & Power Stages',
        part: 'Motherboard',
        category: 'motherboard',
        worldPos: new THREE.Vector3(-0.33, 1.48, -0.22).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(-0.1, 1.55, 0.1).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.33, 1.48, -0.22).add(PC_OFFSET),
        description: 'Balok heatsink aluminium bergaris sirip tebal di sekeliling soket CPU di atas deretan DrMOS MOSFET.',
        functionality: 'Mendinginkan rangkaian konverter tegangan VRM yang bertugas menurunkan tegangan +12V dari PSU menjadi sekitar 1.2V untuk inti prosesor.',
        importance: 'VRM yang dingin dan stabil menjamin prosesor dapat mempertahankan kecepatan Turbo Boost tanpa throttling.'
    },
    {
        id: 'hs_chipset_heatsink',
        title: 'Pendingin Chipset Motherboard (PCH)',
        part: 'Motherboard',
        category: 'motherboard',
        worldPos: new THREE.Vector3(-0.33, 0.63, 0.28).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(-0.1, 0.7, 0.55).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.33, 0.63, 0.28).add(PC_OFFSET),
        description: 'Heatsink pelindung di sudut kanan bawah motherboard dengan ukiran emblem logo.',
        functionality: 'Mengontrol lalu lintas data I/O untuk port SATA, port USB sekunder, audio, dan modul Wi-Fi/LAN.',
        importance: 'Menjaga temperatur hub chipset tetap rendah saat transfer data USB dan jaringan berlangsung serentak.'
    },
    {
        id: 'hs_rear_io',
        title: 'Blok Antarmuka Port Belakang (Rear I/O)',
        part: 'Motherboard',
        category: 'motherboard',
        worldPos: new THREE.Vector3(-0.33, 1.4, -0.45).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(-0.1, 1.5, -0.25).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.33, 1.4, -0.45).add(PC_OFFSET),
        description: 'Kumpulan port konektivitas eksternal yang terlindungi oleh pelat terintegrasi di bagian belakang casing.',
        functionality: 'Menyediakan colokan DisplayPort, HDMI, USB Type-C 40Gbps, USB 3.2 Gen 2, RJ45 2.5GbE LAN, dan audio optik.',
        importance: 'Memudahkan pengguna menghubungkan monitor, jaringan internet kabel, dan periferal multimedia.'
    },
    {
        id: 'hs_gpu_fans',
        title: 'Kipas Aksial & Shroud GPU',
        part: 'Kartu Grafis',
        category: 'gpu',
        worldPos: new THREE.Vector3(-0.16, 0.85, 0).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(0.3, 0.9, 0.3).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.16, 0.85, 0).add(PC_OFFSET),
        description: 'Sistem pendingin aktif 2 atau 3 kipas aksial dengan bilah aerodinamis yang berputar saat PC beroperasi.',
        functionality: 'Meniupkan udara dingin menembus tumpukan sirip pendingin aluminium dan pipa tembaga GPU.',
        importance: 'Dilengkapi teknologi 0dB Silent Fan yang otomatis berhenti berputar saat GPU dalam kondisi idle/suhu rendah.'
    },
    {
        id: 'hs_gpu_power',
        title: 'Konektor Daya GPU (12VHPWR / PCIe)',
        part: 'Kartu Grafis',
        category: 'gpu',
        worldPos: new THREE.Vector3(0.04, 1.05, -0.2).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(0.35, 1.15, 0.05).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(0.04, 1.05, -0.2).add(PC_OFFSET),
        description: 'Terminal soket daya arus tinggi di sisi samping atas kartu grafis.',
        functionality: 'Memasok daya listrik DC murni langsung dari PSU untuk memenuhi konsumsi daya kartu grafis (hingga 450 Watt).',
        importance: 'Menggunakan standar 16-pin 12VHPWR generasi baru dengan 4 pin sensor sinyal pintar untuk proteksi beban lebih.'
    },
    {
        id: 'hs_psu_intake',
        title: 'Grill Kipas & Ventilasi PSU',
        part: 'Power Supply',
        category: 'psu',
        worldPos: new THREE.Vector3(-0.14, 0.12, -0.48).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(0.25, 0.28, -0.25).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.14, 0.12, -0.48).add(PC_OFFSET),
        description: 'Kisi-kisi heksagonal sarang lebah (honeycomb) pelindung kipas pendingin 135mm di bagian bawah PSU.',
        functionality: 'Menghisap udara dingin dari bawah sasis untuk mendinginkan trafo dan kapasitor daya internal PSU.',
        importance: 'Sistem aliran udara mandiri yang terpisah dari ruang utama casing menjamin efisiensi konversi daya tetap prima.'
    },
    {
        id: 'hs_cooler_pump',
        title: 'Waterblock & Layar LCD AIO Cooler',
        part: 'Pendingin CPU',
        category: 'cooler',
        worldPos: new THREE.Vector3(-0.25, 1.33, -0.12).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(0.08, 1.38, 0.15).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.25, 1.33, -0.12).add(PC_OFFSET),
        description: 'Unit blok pendingin mikro sirip tembaga dengan motor pompa sentrifugal dan layar IPS LCD digital.',
        functionality: 'Menyerap kalor langsung dari IHS prosesor dan memompa cairan pendingin (coolant) menuju radiator untuk dibuang.',
        importance: 'Menampilkan telemetri suhu real-time serta menjaga CPU di bawah batas termal saat komputasi berat.'
    },
    {
        id: 'hs_case_front_mesh',
        title: 'Panel Aliran Udara Depan (Mesh Intake)',
        part: 'Casing Komputer',
        category: 'case',
        worldPos: new THREE.Vector3(-0.14, 0.95, 0.58).add(PC_OFFSET),
        cameraFocusPos: new THREE.Vector3(0.3, 1.1, 0.95).add(PC_OFFSET),
        cameraTargetPos: new THREE.Vector3(-0.14, 0.95, 0.58).add(PC_OFFSET),
        description: 'Panel kisi-kisi depan berlubang mikro dengan filter debu magnetik untuk asupan sirkulasi udara dingin.',
        functionality: 'Memaksimalkan volume udara dingin (CFM) yang masuk ke dalam sasis untuk mendinginkan radiator dan GPU.',
        importance: 'Mencegah akumulasi debu mikro masuk ke papan sirkuit dan menjaga tekanan udara positif di dalam casing.'
    }
];

// 3. BANK SOAL KUIS INTERAKTIF EDUKASI PERANGKAT KERAS (10 SOAL BERBOBOT)
export const HARDWARE_QUIZ_QUESTIONS = [
    {
        id: 1,
        question: 'Komponen apakah yang bertindak sebagai "otak utama" komputer yang bertugas mengeksekusi instruksi program dan kalkulasi logika?',
        options: [
            'Motherboard (Papan Induk)',
            'CPU (Central Processing Unit)',
            'RAM (Random Access Memory)',
            'PSU (Power Supply Unit)'
        ],
        correctIndex: 1,
        explanation: 'CPU adalah prosesor pusat yang bertindak sebagai otak komputer untuk mengambil, mendekode, dan mengeksekusi instruksi aritmatika dan logika program.'
    },
    {
        id: 2,
        question: 'Mengapa memori RAM bersifat "volatile" dalam sistem komputer modern?',
        options: [
            'Karena RAM dapat menyimpan data secara permanen selama bertahun-tahun',
            'Karena data di dalam RAM akan hilang seketika saat pasokan daya listrik terputus',
            'Karena RAM terbuat dari piringan magnetik yang berputar cepat',
            'Karena RAM hanya dapat dibaca satu kali saat proses instalasi Windows'
        ],
        correctIndex: 1,
        explanation: 'RAM bersifat volatile karena menggunakan sel kapasitor mikro yang membutuhkan tegangan listrik terus-menerus untuk mempertahankan muatan bit data.'
    },
    {
        id: 3,
        question: 'Pada pemasangan RAM Dual-Channel di motherboard 4 slot (Slot 1, 2, 3, 4), slot berapakah yang direkomendasikan secara standar untuk 2 keping memori?',
        options: [
            'Slot 1 dan Slot 2',
            'Slot 3 dan Slot 4',
            'Slot 2 dan Slot 4 (A2 & B2)',
            'Hanya boleh dipasang pada Slot 1'
        ],
        correctIndex: 2,
        explanation: 'Hampir seluruh pabrikan motherboard merekomendasikan Slot 2 dan 4 (A2 dan B2) untuk 2 keping RAM agar sinyal bus memori memiliki integritas dan terminasi gelombang optimal.'
    },
    {
        id: 4,
        question: 'Apa fungsi utama pelat logam penguat (SafeSlot Armor) pada slot utama PCIe x16 motherboard?',
        options: [
            'Mengubah arus listrik AC menjadi arus DC',
            'Memperkuat slot agar tidak patah atau bengkok akibat menahan bobot kartu grafis (GPU) yang berat',
            'Menyimpan file bootloader sistem operasi BIOS',
            'Menambah kapasitas memori cache prosesor'
        ],
        correctIndex: 1,
        explanation: 'SafeSlot memiliki selongsong pelindung logam yang terikat kuat ke PCB motherboard untuk mencegah kerusakan fisik akibat gravitasi dan getaran dari kartu grafis modern berbobot besar.'
    },
    {
        id: 5,
        question: 'Jika prosesor AMD Ryzen 9 7950X menggunakan Soket AM5, apakah prosesor tersebut dapat dipasang pada Motherboard ASUS TUF Gaming B550 (Soket AM4)?',
        options: [
            'Bisa, karena semua prosesor AMD memiliki soket yang sama',
            'Bisa, asalkan menggunakan kabel konverter tambahan',
            'Tidak bisa, karena AM5 menggunakan arsitektur soket LGA 1718 sedangkan AM4 menggunakan soket PGA 1331 dengan tata letak pin yang berbeda',
            'Bisa, asalkan menggunakan pendingin air radiator 360mm'
        ],
        correctIndex: 2,
        explanation: 'Tidak kompatibel. Soket AM4 bertipe PGA (pin berada di prosesor), sedangkan AM5 bertipe LGA (pin berada di dudukan soket motherboard) dengan perbedaan fisik total.'
    },
    {
        id: 6,
        question: 'Apa keunggulan utama SSD M.2 NVMe dibandingkan Hard Disk Drive (HDD) mekanik tradisional?',
        options: [
            'Kapasitas penyimpanannya selalu lebih murah dibanding HDD',
            'Kecepatan transfer data hingga puluhan kali lipat lebih cepat dan bebas dari komponen mekanik bergerak yang rentan goncangan',
            'Membutuhkan daya listrik AC 220V langsung dari colokan dinding',
            'Hanya dapat digunakan untuk menyimpan file musik dan video'
        ],
        correctIndex: 1,
        explanation: 'SSD NVMe menggunakan chip 3D NAND Flash berlatensi ultra-rendah melalui bus PCIe, menghasilkan kecepatan baca sekuensial hingga 7,000+ MB/s dibandingkan HDD yang hanya berkisar 150-200 MB/s.'
    },
    {
        id: 7,
        question: 'Apa yang akan terjadi pada sistem komputer jika pendingin CPU (Cooler) tidak dipasang di atas prosesor saat dinyalakan?',
        options: [
            'Komputer akan bekerja lebih cepat karena tidak ada hambatan udara',
            'Suhu CPU akan melonjak drastis dalam hitungan detik dan sistem seketika mematikan daya proteksi (Thermal Shutdown) untuk mencegah silikon terbakar',
            'Layar monitor otomatis menampilkan resolusi 4K tanpa kartu grafis',
            'Kapasitas RAM akan meningkat secara otomatis'
        ],
        correctIndex: 1,
        explanation: 'Transistor mikroprosesor menghasilkan panas konsentrasi tinggi. Tanpa pendingin, suhu silikon menembus 100°C dalam hitungan detik sehingga sensor internal memicu proteksi darurat pemadaman sistem.'
    },
    {
        id: 8,
        question: 'Apa fungsi utama Power Supply Unit (PSU) dalam sebuah unit komputer?',
        options: [
            'Menghasilkan sinyal tampilan gambar visual ke layar monitor',
            'Mengonversi arus bolak-balik AC 220V dari listrik dinding menjadi arus searah DC (+12V, +5V, +3.3V) yang stabil untuk komponen PC',
            'Mengatur frekuensi refresh rate pada monitor gaming',
            'Mendeteksi keberadaan virus dan malware pada sistem operasi'
        ],
        correctIndex: 1,
        explanation: 'PSU bertindak sebagai penyalur energi utama yang mengonversi arus bolak-balik bertegangan tinggi PLN menjadi rel tegangan searah DC stabil yang dibutuhkan sirkuit digital komputer.'
    },
    {
        id: 9,
        question: 'Apa arti sertifikasi efisiensi "80 PLUS Gold" pada sebuah Power Supply Unit (PSU)?',
        options: [
            'PSU tersebut berlapis emas murni 24 karat di bagian luarnya',
            'PSU mampu beroperasi dengan efisiensi energi minimal 87% hingga 90% pada beban kerja standar, sehingga lebih hemat listrik dan membuang lebih sedikit panas',
            'PSU hanya dapat digunakan selama 80 jam berturut-turut',
            'PSU hanya cocok untuk komputer yang digunakan bermain game balap'
        ],
        correctIndex: 1,
        explanation: 'Sertifikasi 80 PLUS Gold menjamin efisiensi konversi daya minimal 87-90% pada beban 20%, 50%, dan 100%, meminimalkan energi yang terbuang sia-sia menjadi panas.'
    },
    {
        id: 10,
        question: 'Pada proses booting awal komputer, urutan tahap manakah yang benar terjadi sejak tombol power ditekan hingga desktop muncul?',
        options: [
            'Desktop OS langsung muncul -> BIOS POST -> Power Strip dinyalakan',
            'Arus Listrik DC Aktif -> Inisialisasi Firmware BIOS POST (Hardware Check) -> Bootloader OS Memuat Kernel -> Desktop OS Siap Digunakan',
            'Aplikasi terbuka -> Kipas berhenti berputar -> BIOS POST',
            'Monitor memancarkan gambar -> CPU dimatikan -> Instalasi Windows'
        ],
        correctIndex: 1,
        explanation: 'Urutan baku booting: Pasokan daya DC mengalir -> Firmware BIOS/UEFI menjalankan POST (Power-On Self-Test) mendeteksi CPU/RAM/VGA -> Bootloader memuat kernel sistem operasi dari SSD -> Desktop OS siap interaksi.'
    }
];
