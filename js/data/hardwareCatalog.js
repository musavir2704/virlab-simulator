/**
 * VIRLAB-SIMULATOR: Technical Hardware Catalog
 * Katalog spesifikasi teknis perangkat keras komputer murni edukasi (Bebas dari sistem nominal harga).
 */

export const CATALOG = {
    case: [
        {
            id: 'c1',
            name: 'NZXT H510 Flow (Putih)',
            brand: 'NZXT',
            model: 'H510 Flow White Edition',
            type: 'case',
            formFactor: 'Mid-Tower ATX',
            color: 0xffffff,
            rgb: false,
            size: 'mid',
            specs: {
                'Form Factor': 'Mid-Tower ATX / Micro-ATX / Mini-ITX',
                'Dimensi (P x L x T)': '428 x 210 x 460 mm',
                'Panel Samping': 'Tempered Glass (Kaca Tempered)',
                'Panel Depan': 'Perforated Mesh (Aliran Udara Maksimal)',
                'Slot Ekspansi': '7 Slot PCIe',
                'Dukungan GPU': 'Maksimal panjang 381 mm',
                'Dukungan Pendingin': 'Depan hingga 280mm / Belakang 120mm',
                'Drive Bays': '2x 3.5" HDD, 2x 2.5" SSD'
            },
            highlights: ['Mid-Tower', 'Tempered Glass', 'High Airflow Mesh', 'Clean Cable Bar']
        },
        {
            id: 'c2',
            name: 'Corsair Obsidian 1000D',
            brand: 'Corsair',
            model: 'Obsidian 1000D Super-Tower',
            type: 'case',
            formFactor: 'Super-Tower E-ATX',
            color: 0x111111,
            rgb: true,
            size: 'full',
            specs: {
                'Form Factor': 'Super-Tower E-ATX / SSI-EEB / Dual System',
                'Dimensi (P x L x T)': '693 x 307 x 697 mm',
                'Panel Samping': 'Quad Smoked Tempered Glass',
                'Struktur Rangka': 'Baja Karbon Berkekuatan Tinggi + Aluminium',
                'Slot Ekspansi': '8 + 2 Slot Vertikal',
                'Dukungan GPU': 'Maksimal panjang 400 mm',
                'Dukungan Radiator': 'Hingga Dual 480mm Radiator',
                'Drive Bays': '5x 3.5" HDD, 6x 2.5" SSD'
            },
            highlights: ['Super-Tower', 'Dual System Support', 'Quad Tempered Glass', 'Integrated Commander PRO RGB']
        }
    ],

    motherboard: [
        {
            id: 'mb1',
            name: 'ASUS TUF Gaming B550-PLUS',
            brand: 'ASUS',
            model: 'TUF Gaming B550-PLUS ATX',
            type: 'motherboard',
            socket: 'AM4',
            chipset: 'AMD B550',
            formFactor: 'ATX',
            rgb: false,
            specs: {
                'Soket CPU': 'AMD Socket AM4 (Ryzen 3000 / 5000 Series)',
                'Chipset': 'AMD B550',
                'Tipe Memori': 'DDR4 Dual-Channel (Maks. 128 GB, 4x DIMM)',
                'Kecepatan RAM': 'Hingga 4400 MHz (O.C.)',
                'Slot PCIe': '1x PCIe 4.0 x16 (SafeSlot), 1x PCIe 3.0 x16, 3x PCIe 3.0 x1',
                'Slot M.2 Storage': '1x M.2 PCIe 4.0 x4, 1x M.2 PCIe 3.0 x4 (dengan Heatsink)',
                'Port SATA': '6x SATA 6Gb/s',
                'Power Delivery (VRM)': '8+2 DrMOS Power Stages dengan Heatsink Tebal'
            },
            highlights: ['Socket AM4', 'PCIe 4.0 Ready', 'DDR4 Memory', 'VRM Heatsink', 'TUF Military Grade']
        },
        {
            id: 'mb2',
            name: 'ASUS ROG Crosshair X670E Hero',
            brand: 'ASUS',
            model: 'ROG Crosshair X670E Hero Enthusiast',
            type: 'motherboard',
            socket: 'AM5',
            chipset: 'AMD X670E',
            formFactor: 'ATX',
            rgb: true,
            specs: {
                'Soket CPU': 'AMD Socket AM5 (Ryzen 7000 / 8000 / 9000 Series)',
                'Chipset': 'AMD X670E (Extreme)',
                'Tipe Memori': 'DDR5 Dual-Channel (Maks. 192 GB, 4x DIMM)',
                'Kecepatan RAM': 'Hingga 6400+ MHz (EXPO)',
                'Slot PCIe': '2x PCIe 5.0 x16, 1x PCIe 4.0 x16',
                'Slot M.2 Storage': '2x PCIe 5.0 M.2 + 3x PCIe 4.0 M.2 terintegrasi Heatsink',
                'Port SATA': '6x SATA 6Gb/s',
                'Power Delivery (VRM)': '18+2 Teamed Power Stages (110A Rating) + Polymo Lighting'
            },
            highlights: ['Socket AM5', 'PCIe 5.0 Generation', 'DDR5 Memory', 'Polymo RGB I/O', 'USB4 Type-C 40Gbps']
        }
    ],

    cpu: [
        {
            id: 'cpu1',
            name: 'AMD Ryzen 5 5600X',
            brand: 'AMD',
            model: 'Ryzen 5 5600X Desktop Processor',
            type: 'cpu',
            socket: 'AM4',
            architecture: 'Zen 3',
            specs: {
                'Arsitektur': 'Zen 3 (TSMC 7nm FinFET)',
                'Soket': 'AMD AM4',
                'Jumlah Inti (Cores)': '6 Cores',
                'Jumlah Untai (Threads)': '12 Threads',
                'Base Clock': '3.7 GHz',
                'Max Boost Clock': '4.6 GHz',
                'L3 Cache': '32 MB GameCache',
                'Thermal Design Power (TDP)': '65 Watt',
                'Dukungan PCIe': 'PCIe 4.0'
            },
            highlights: ['Zen 3 Architecture', '6 Cores / 12 Threads', '32MB L3 Cache', '65W Low TDP', 'Unlocked for Overclocking']
        },
        {
            id: 'cpu2',
            name: 'AMD Ryzen 9 7950X',
            brand: 'AMD',
            model: 'Ryzen 9 7950X Flagship Processor',
            type: 'cpu',
            socket: 'AM5',
            architecture: 'Zen 4',
            specs: {
                'Arsitektur': 'Zen 4 (TSMC 5nm Core + 6nm I/O Die)',
                'Soket': 'AMD AM5 (LGA 1718)',
                'Jumlah Inti (Cores)': '16 Cores',
                'Jumlah Untai (Threads)': '32 Threads',
                'Base Clock': '4.5 GHz',
                'Max Boost Clock': '5.7 GHz',
                'L3 Cache': '64 MB AMD 3D Cache',
                'Thermal Design Power (TDP)': '170 Watt',
                'Grafis Terintegrasi': 'AMD Radeon Graphics (2 CU RDNA 2)'
            },
            highlights: ['Zen 4 5nm Process', '16 Cores / 32 Threads', '5.7 GHz Boost Clock', '64MB L3 Cache', 'PCIe 5.0 Ready']
        }
    ],

    ram: [
        {
            id: 'ram1',
            name: 'Corsair Vengeance LPX 16GB',
            brand: 'Corsair',
            model: 'Vengeance LPX Dual Channel Kit',
            type: 'ram',
            memoryType: 'DDR4',
            capacity: '16GB (2x 8GB)',
            rgb: false,
            specs: {
                'Tipe Memori': 'DDR4 SDRAM',
                'Kapasitas': '16 GB (2x 8GB Dual-Channel Kit)',
                'Frekuensi Kecepatan': '3200 MHz',
                'Latency Timings': 'CL16-20-20-38',
                'Tegangan Operasional': '1.35 Volt',
                'Profil Kinerja': 'Intel XMP 2.0 / AMD D.O.C.P.',
                'Heatsink': 'Pure Anodized Aluminum Heatsink',
                'Tinggi Modul': 'Low-Profile 34 mm (Kompatibel dengan semua cooler)'
            },
            highlights: ['DDR4 3200MHz', 'Dual-Channel (2x8GB)', 'CL16 Latency', 'Low Profile Form Factor']
        },
        {
            id: 'ram2',
            name: 'G.Skill Trident Z5 RGB 32GB',
            brand: 'G.Skill',
            model: 'Trident Z5 RGB High-Performance Kit',
            type: 'ram',
            memoryType: 'DDR5',
            capacity: '32GB (2x 16GB)',
            rgb: true,
            specs: {
                'Tipe Memori': 'DDR5 SDRAM Next-Gen',
                'Kapasitas': '32 GB (2x 16GB Dual-Channel Kit)',
                'Frekuensi Kecepatan': '6000 MHz',
                'Latency Timings': 'CL30-40-40-96 (Ultra-Low Latency)',
                'Tegangan Operasional': '1.35 Volt',
                'Profil Kinerja': 'AMD EXPO & Intel XMP 3.0',
                'Power Management (PMIC)': 'On-Die On-Board Power Management IC',
                'Fitur Visual': 'Streamlined RGB Light Bar dengan Heatsink Brushed Metallic'
            },
            highlights: ['DDR5 6000MHz', 'Dual-Channel (2x16GB)', 'Tight CL30 Timing', 'Addressable RGB Diffuser']
        }
    ],

    gpu: [
        {
            id: 'gpu1',
            name: 'NVIDIA GeForce RTX 3060 Ti',
            brand: 'NVIDIA / Founders Edition',
            model: 'GeForce RTX 3060 Ti Dual Fan',
            type: 'gpu',
            architecture: 'Ampere',
            vram: '8 GB GDDR6',
            size: 1,
            rgb: false,
            specs: {
                'Arsitektur GPU': 'NVIDIA Ampere (GA104-200)',
                'CUDA Cores': '4864 Cores',
                'Ukuran Memori (VRAM)': '8 GB GDDR6',
                'Memory Bus Width': '256-bit (Kecepatan 14 Gbps, Bandwidth 448 GB/s)',
                'Base / Boost Clock': '1410 MHz / 1665 MHz',
                'Ray Tracing Cores': '38 RT Cores (Generasi ke-2)',
                'Tensor Cores': '152 Tensor Cores (Generasi ke-3, DLSS)',
                'Antarmuka Bus': 'PCIe 4.0 x16',
                'Konektor Daya': '1x 8-pin PCIe (Daya Rekomendasi: 600 Watt, TDP 200W)'
            },
            highlights: ['Ampere Architecture', '8GB GDDR6 256-bit', 'Ray Tracing & DLSS', '200W TDP', 'Dual Fan Axial']
        },
        {
            id: 'gpu2',
            name: 'ASUS ROG Strix GeForce RTX 4090',
            brand: 'ASUS / ROG Strix',
            model: 'ROG Strix GeForce RTX 4090 OC 24GB',
            type: 'gpu',
            architecture: 'Ada Lovelace',
            vram: '24 GB GDDR6X',
            size: 1.5,
            rgb: true,
            specs: {
                'Arsitektur GPU': 'NVIDIA Ada Lovelace (AD102-300 TSMC 4N)',
                'CUDA Cores': '16384 Cores',
                'Ukuran Memori (VRAM)': '24 GB GDDR6X Ultra-Speed',
                'Memory Bus Width': '384-bit (Kecepatan 21 Gbps, Bandwidth 1.008 TB/s)',
                'Base / Boost Clock': '2230 MHz / 2640 MHz (OC Mode)',
                'Ray Tracing Cores': '128 RT Cores (Generasi ke-3)',
                'Tensor Cores': '512 Tensor Cores (Generasi ke-4, DLSS 3 Frame Generation)',
                'Antarmuka Bus': 'PCIe 4.0 x16',
                'Konektor Daya': '1x 16-pin 12VHPWR (Rekomendasi PSU: 1000W+, TDP 450W)'
            },
            highlights: ['Ada Lovelace Flagship', '24GB GDDR6X 384-bit', 'DLSS 3 Frame Generation', 'Triple Axial-tech Fans', 'Vented Exoskeleton']
        }
    ],

    storage: [
        {
            id: 'st1',
            name: 'Samsung 980 1TB NVMe M.2 SSD',
            brand: 'Samsung',
            model: 'Samsung 980 NVMe SSD 1TB',
            type: 'storage',
            formFactor: 'M.2 2280',
            interface: 'PCIe Gen 3.0 x4, NVMe 1.4',
            capacity: '1 TB',
            specs: {
                'Form Factor': 'M.2 2280 (Panjang 80 mm, Lebar 22 mm)',
                'Antarmuka Bus': 'PCIe Gen 3.0 x4, Protokol NVMe 1.4',
                'Kapasitas': '1000 GB (1 TB)',
                'Kecepatan Baca Sekuensial': 'Hingga 3.500 MB/detik',
                'Kecepatan Tulis Sekuensial': 'Hingga 3.000 MB/detik',
                'Tipe Memori NAND': 'Samsung V-NAND 3-bit MLC (TLC)',
                'Pengontrol (Controller)': 'Samsung Pablo In-House Controller',
                'Daya Tahan (TBW)': '600 Terabytes Written'
            },
            highlights: ['NVMe M.2 PCIe 3.0', '1TB Capacity', '3500 MB/s Read Speed', 'V-NAND TLC Technology']
        },
        {
            id: 'st2',
            name: 'Samsung 990 PRO 2TB NVMe M.2 SSD',
            brand: 'Samsung',
            model: 'Samsung 990 PRO Flagship NVMe 2TB',
            type: 'storage',
            formFactor: 'M.2 2280',
            interface: 'PCIe Gen 4.0 x4, NVMe 2.0',
            capacity: '2 TB',
            specs: {
                'Form Factor': 'M.2 2280',
                'Antarmuka Bus': 'PCIe Gen 4.0 x4, Protokol NVMe 2.0',
                'Kapasitas': '2000 GB (2 TB)',
                'Kecepatan Baca Sekuensial': 'Hingga 7.450 MB/detik (Mendekati limit PCIe 4.0)',
                'Kecepatan Tulis Sekuensial': 'Hingga 6.900 MB/detik',
                'Kecepatan Acak (IOPS)': 'Hingga 1.400.000 IOPS Read / 1.550.000 IOPS Write',
                'DRAM Cache': '2 GB Low Power DDR4 SDRAM',
                'Daya Tahan (TBW)': '1.200 Terabytes Written'
            },
            highlights: ['PCIe 4.0 x4 Max Speed', '2TB Capacity', '7450 MB/s Read Speed', '2GB LPDDR4 Cache', 'Heatsink Thermal Guard']
        }
    ],

    cooler: [
        {
            id: 'cl1',
            name: 'Cooler Master Hyper 212 Halo',
            brand: 'Cooler Master',
            model: 'Hyper 212 Halo Black Air Cooler',
            type: 'cooler',
            coolerType: 'Air Cooler (Tower Heatsink)',
            isLiquid: false,
            rgb: false,
            specs: {
                'Tipe Pendinginan': 'Air Cooling Tower Heatsink',
                'Kompatibilitas Soket': 'AMD AM5 / AM4 & Intel LGA 1700 / 1200 / 115x',
                'Pipa Pendingin (Heat Pipes)': '4x Direct Contact Copper Heatpipes (6mm)',
                'Material Sirip': 'Aluminium Fin Stack berlapis Nickel-Plated Jet Black',
                'Ukuran Kipas': '120 x 120 x 25 mm Halo Fan',
                'Kecepatan Putaran Kipas': '650 - 2050 RPM (PWM Controlled)',
                'Aliran Udara (Airflow)': '51.88 CFM',
                'Kapasitas Pendinginan (Max TDP)': 'Hingga 180 Watt'
            },
            highlights: ['Air Cooler Tower', '4 Copper Heatpipes', '120mm PWM Fan', 'Quiet 27 dBA', '180W TDP Support']
        },
        {
            id: 'cl2',
            name: 'NZXT Kraken Z73 360mm AIO',
            brand: 'NZXT',
            model: 'Kraken Z73 RGB Liquid Cooler 360mm',
            type: 'cooler',
            coolerType: 'Liquid AIO (All-in-One)',
            isLiquid: true,
            rgb: true,
            specs: {
                'Tipe Pendinginan': 'Closed-Loop Liquid Cooler (AIO Radiator)',
                'Ukuran Radiator': '360 mm (394 x 121 x 27 mm Aluminium)',
                'Pompa (Pump)': 'Asetek Gen 7 Pump (800 - 2800 RPM Variable)',
                'Layar Waterblock': '2.36" Full-Color LCD Screen (Resolusi 320x320 60Hz)',
                'Selang Cairan': '400mm Ultra-Low Evaporation Rubber dengan Nylon Braided Sleeve',
                'Kipas Radiator': '3x 120mm Aer RGB 2 Fluid Dynamic Bearing Fans (500 - 1500 RPM)',
                'Kapasitas Pendinginan (Max TDP)': 'Mampu menangani beban panas 300+ Watt (Overclocking Ready)'
            },
            highlights: ['360mm Radiator', '3x 120mm RGB Fans', 'LCD Display on Pump', 'Liquid Closed-Loop', '300W+ Extreme TDP']
        }
    ],

    psu: [
        {
            id: 'psu1',
            name: 'Corsair RM750x 750W Gold',
            brand: 'Corsair',
            model: 'RM750x 80 PLUS Gold Fully Modular',
            type: 'psu',
            wattage: 750,
            efficiency: '80 PLUS Gold',
            modularity: 'Fully Modular',
            specs: {
                'Daya Maksimal': '750 Watt Terukur Kontinu',
                'Sertifikasi Efisiensi': '80 PLUS Gold (Hingga 90% Efisiensi Energi)',
                'Tipe Pengkabelan': 'Fully Modular (Pasang kabel yang diperlukan saja)',
                'Kapasitor': '100% Japanese 105°C Electrolytic Capacitors',
                'Ukuran Kipas': '135mm Magnetic Levitation Fan dengan Zero RPM Mode',
                'Konektor EPS (CPU)': '2x 8-pin (4+4) EPS12V',
                'Konektor PCIe (GPU)': '4x 8-pin (6+2) PCIe',
                'Sistem Proteksi': 'OVP, UVP, OCP, OTP, SCP, OPP'
            },
            highlights: ['750 Watt Continuous', '80 PLUS Gold Certified', 'Fully Modular', 'Zero RPM Silent Fan', 'Japanese 105°C Caps']
        },
        {
            id: 'psu2',
            name: 'Seasonic PRIME TX-1300 1300W Titanium',
            brand: 'Seasonic',
            model: 'PRIME TX-1300 Ultra Titanium ATX 3.0',
            type: 'psu',
            wattage: 1300,
            efficiency: '80 PLUS Titanium',
            modularity: 'Fully Modular',
            specs: {
                'Daya Maksimal': '1300 Watt Real Continuous Power',
                'Sertifikasi Efisiensi': '80 PLUS Titanium (Efisiensi 94% pada beban 50%)',
                'Standar Daya': 'ATX 3.0 & PCIe 5.0 Ready (Native 12VHPWR 600W Cable)',
                'Tipe Pengkabelan': 'Fully Modular dengan Premium Braided Cables',
                'Toleransi Regulasi Voltase': 'Micro Tolerance Load Regulation (< 0.5% Ripple)',
                'Kipas': '135mm Fluid Dynamic Bearing (FDB) dengan Premium Hybrid Fan Control',
                'Konektor PCIe': '1x Native 16-pin 12VHPWR + 6x 8-pin PCIe',
                'Garansi & Proteksi': 'Proteksi Industri Penuh (OPP, OVP, UVP, SCP, OCP, OTP)'
            },
            highlights: ['1300 Watt Flagship', '80 PLUS Titanium (94% Efficiency)', 'PCIe 5.0 12VHPWR Native', 'ATX 3.0 Standard', 'Ultra Low Noise']
        }
    ]
};
