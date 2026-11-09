/**
 * VIRLAB-SIMULATOR: Category Definitions & Assembly Workflow
 * Mendefinisikan 8 kategori utama hardware komputer beserta panduan urutan perakitan standar laboratorium.
 */

export const CATEGORIES = [
    {
        id: 'case',
        icon: 'fa-box',
        label: 'Casing PC',
        step: 1,
        description: 'Rangka dan pelindung utama seluruh komponen komputer serta pengatur sirkulasi udara.'
    },
    {
        id: 'motherboard',
        icon: 'fa-chess-board',
        label: 'Motherboard',
        step: 2,
        description: 'Papan sirkuit utama pusat penghubung dan jalur komunikasi seluruh komponen komputer.'
    },
    {
        id: 'cpu',
        icon: 'fa-microchip',
        label: 'Prosesor (CPU)',
        step: 3,
        description: 'Otak pemroses instruksi komputasi dan pengendali logika sistem komputer.'
    },
    {
        id: 'cooler',
        icon: 'fa-fan',
        label: 'Pendingin (Cooler)',
        step: 4,
        description: 'Sistem pendinginan untuk menjaga suhu prosesor tetap dalam batas aman saat bekerja.'
    },
    {
        id: 'ram',
        icon: 'fa-memory',
        label: 'Memori (RAM)',
        step: 5,
        description: 'Media penyimpanan data berkecepatan tinggi yang bersifat sementara (volatile).'
    },
    {
        id: 'storage',
        icon: 'fa-hdd',
        label: 'Penyimpanan (SSD/HDD)',
        step: 6,
        description: 'Media penyimpanan permanen (non-volatile) untuk sistem operasi, aplikasi, dan berkas data.'
    },
    {
        id: 'gpu',
        icon: 'fa-video',
        label: 'Kartu Grafis (GPU)',
        step: 7,
        description: 'Pemroses rendering grafis, video, komputasi visual, dan akselerasi 3D.'
    },
    {
        id: 'psu',
        icon: 'fa-plug',
        label: 'Power Supply (PSU)',
        step: 8,
        description: 'Penyuplai daya listrik arus searah (DC) yang stabil untuk seluruh komponen komputer.'
    }
];

export const ASSEMBLY_STEPS = [
    {
        step: 1,
        category: 'case',
        title: 'Langkah 1: Siapkan Casing PC',
        why: 'Casing adalah fondasi fisik utama tempat standoff motherboard, dudukan PSU, dan saluran pendinginan berada.',
        tip: 'Pastikan ruang kerja bersih dan posisikan sasis pada meja perakitan.'
    },
    {
        step: 2,
        category: 'motherboard',
        title: 'Langkah 2: Pasang Motherboard',
        why: 'Motherboard menghubungkan seluruh bus data antar komponen melalui sirkuit PCB terpadu.',
        tip: 'Posisikan I/O shield tepat di lubang belakang sasis dan sejajarkan dengan 9 lubang standoff baut.'
    },
    {
        step: 3,
        category: 'cpu',
        title: 'Langkah 3: Pasang Prosesor (CPU)',
        why: 'CPU adalah otak komputer. Pemasangan CPU harus dilakukan hati-hati tanpa menekan pin soket.',
        tip: 'Sejajarkan tanda segitiga emas di sudut CPU dengan segitiga penanda pada soket motherboard.'
    },
    {
        step: 4,
        category: 'cooler',
        title: 'Langkah 4: Pasang Pendingin CPU (Cooler)',
        why: 'Tanpa pendingin, CPU akan mengalami panas berlebih (thermal throttling) atau shutdown protektif dalam hitungan detik.',
        tip: 'Pastikan pelat kontak termal menempel rapat pada permukaan IHS prosesor.'
    },
    {
        step: 5,
        category: 'ram',
        title: 'Langkah 5: Pasang Memori RAM',
        why: 'RAM menyediakan ruang kerja aktif bagi prosesor untuk mengeksekusi instruksi program.',
        tip: 'Gunakan konfigurasi Dual-Channel (Slot 2 & 4) dan pastikan lekukan notch pas sebelum mengunci.'
    },
    {
        step: 6,
        category: 'storage',
        title: 'Langkah 6: Pasang Media Penyimpanan (SSD NVMe)',
        why: 'Media penyimpanan permanen menampung bootloader BIOS, sistem operasi, serta data pengguna.',
        tip: 'Tancapkan M.2 SSD dengan sudut kemiringan sekitar 30 derajat lalu kencangkan baut penguncinya.'
    },
    {
        step: 7,
        category: 'gpu',
        title: 'Langkah 7: Pasang Kartu Grafis (GPU)',
        why: 'GPU memproses komputasi visual dan menghasilkan sinyal video resolusi tinggi ke monitor.',
        tip: 'Masukkan ke slot PCIe x16 utama (SafeSlot) hingga klip retensi berbunyi klik mengunci.'
    },
    {
        step: 8,
        category: 'psu',
        title: 'Langkah 8: Pasang Power Supply Unit (PSU)',
        why: 'PSU mengonversi tegangan AC listrik dinding menjadi rel voltase DC stabil (+12V, +5V, +3.3V).',
        tip: 'Arahkan kipas intake PSU ke bawah menuju filter debu sasis untuk aliran udara mandiri.'
    }
];

export function getStepForCategory(catId) {
    return ASSEMBLY_STEPS.find(s => s.category === catId);
}

export function getNextRecommendedStep(installedState) {
    for (const stepInfo of ASSEMBLY_STEPS) {
        if (!installedState[stepInfo.category]) {
            return stepInfo;
        }
    }
    return null; // Semua komponen telah terpasang lengkap
}
