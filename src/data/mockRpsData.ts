import { RPSDocument, InstitutionHeader, CPLItem } from '../types/rps';

export const UNIKMA_HEADER_DEFAULT: InstitutionHeader = {
  namaUniversitas: 'UNIVERSITAS KOMPUTAMA',
  singkatan: 'UNIKMA',
  fakultas: 'FAKULTAS SAINS DAN TEKNOLOGI',
  programStudi: 'PROGRAM STUDI S1 SISTEM INFORMASI',
  jenjang: 'Strata Satu (S-1)',
  akreditasi: 'Baik Sekali (LAM INFOKOM)',
  kampus1: 'Kampus I: Jl. Raya Cimanggu - Majenang KM. 04, Cilempuyang, Cimanggu, Kab. Cilacap, Jawa Tengah 53256',
  kampus2: 'Kampus II: Jl. Raya Karangpucung - Sidareja KM. 02, Karangpucung, Kab. Cilacap, Jawa Tengah 53255',
  kampus3: 'Kampus III: Jl. Perintis Kemerdekaan No. 48, Gumilir, Cilacap Utara, Kab. Cilacap, Jawa Tengah 53231',
  website: 'www.unikma.ac.id · fst.unikma.ac.id',
  email: 'prodi.si@unikma.ac.id',
  kodeDokumenStandar: 'FM-LPM-UNIKMA-AKD-04/R2'
};

export const MASTER_CPL_PRODI_SI: CPLItem[] = [
  {
    kode: 'CPL01',
    ranah: 'Sikap (S)',
    deskripsi:
      'Menunjukkan sikap bertanggungjawab atas pekerjaan di bidang keahlian sistem informasi secara mandiri serta menjunjung tinggi etika profesi, integritas akademik, dan tata nilai luhur bangsa.',
    profilLulusanTerkait: 'PL01 - Information Systems Analyst'
  },
  {
    kode: 'CPL02',
    ranah: 'Pengetahuan (P)',
    deskripsi:
      'Menguasai konsep teoretis bidang pengetahuan Sistem Informasi secara umum dan konsep rekayasa sistem, basis data, serta tata kelola proses bisnis organisasi secara mendalam.',
    profilLulusanTerkait: 'PL01 - Information Systems Analyst'
  },
  {
    kode: 'CPL04',
    ranah: 'Pengetahuan (P)',
    deskripsi:
      'Menguasai metodologi analisis kebutuhan bisnis, pemodelan proses organisasi (BPMN), serta perancangan arsitektur sistem informasi terintegrasi berbasis standar industri.',
    profilLulusanTerkait: 'PL02 - Enterprise & Business Process Specialist'
  },
  {
    kode: 'CPL07',
    ranah: 'Keterampilan Umum (KU)',
    deskripsi:
      'Mampu menerapkan pemikiran logis, kritis, sistematis, dan inovatif dalam konteks pengembangan atau implementasi ilmu pengetahuan dan teknologi informasi yang memperhatikan nilai humaniora.',
    profilLulusanTerkait: 'PL01 - Information Systems Analyst'
  },
  {
    kode: 'CPL09',
    ranah: 'Keterampilan Khusus (KK)',
    deskripsi:
      'Mampu merencanakan, mengelola, mengendalikan risiko, dan mengevaluasi proyek pengembangan sistem informasi menggunakan kerangka kerja PMBOK dan Agile/Scrum.',
    profilLulusanTerkait: 'PL03 - IT Project & Governance Coordinator'
  },
  {
    kode: 'CPL10',
    ranah: 'Keterampilan Khusus (KK)',
    deskripsi:
      'Mampu merancang, memvalidasi, dan mendokumentasikan spesifikasi perangkat lunak dan cetak biru sistem informasi korporasi menggunakan Unified Modeling Language (UML 2.5) dan prototipe antarmuka fungsional.',
    profilLulusanTerkait: 'PL01 - Information Systems Analyst'
  }
];

export const INITIAL_RPS_LIST: RPSDocument[] = [
  {
    id: 'rps-k572101',
    status: 'Terotorisasi Penuh',
    lastUpdated: '2026-09-26 14:30 WIB',
    progresPengisianPersen: 100,
    institusi: UNIKMA_HEADER_DEFAULT,
    identitas: {
      namaMk: 'Analisis dan Perancangan Sistem Informasi',
      kodeMk: 'K572101',
      rumpunMk: 'Rekayasa & Pengembangan Sistem Informasi',
      bobotSksTeori: 2,
      bobotSksPraktikum: 1,
      semester: 4,
      tanggalPenyusunan: '12 Agustus 2026',
      tahunAkademik: '2026/2027 Ganjil',
      revisiKe: '02'
    },
    otorisasi: {
      dosenPengembang: {
        nama: 'Dr. Ir. Hasymi Al-Kautsar, S.Kom., M.Kom.',
        nidn: '0614088601',
        jabatan: 'Dosen Pengembang RPS',
        statusOtorisasi: 'Terverifikasi QR',
        tanggalOtorisasi: '14 Agustus 2026',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572101-DSN-98F2A'
      },
      koordinatorRmk: {
        nama: 'Rizky Pratama Wijaya, S.Kom., M.Cs.',
        nidn: '0622118803',
        jabatan: 'Koordinator RMK Rekayasa SI',
        statusOtorisasi: 'Terverifikasi QR',
        tanggalOtorisasi: '15 Agustus 2026',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572101-RMK-44C1B'
      },
      ketuaProdi: {
        nama: 'Dr. Siti Nurhaliza Pramesti, S.T., M.Kom.',
        nidn: '0609038402',
        jabatan: 'Ketua Program Studi S1 Sistem Informasi',
        statusOtorisasi: 'Terverifikasi QR',
        tanggalOtorisasi: '16 Agustus 2026',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572101-KPS-77E9D'
      }
    },
    cplProdi: [
      MASTER_CPL_PRODI_SI[0], // CPL01
      MASTER_CPL_PRODI_SI[2], // CPL04
      MASTER_CPL_PRODI_SI[3], // CPL07
      MASTER_CPL_PRODI_SI[5]  // CPL10
    ],
    cpmkList: [
      {
        kode: 'CPMK1',
        deskripsi:
          'Mampu menganalisis permasalahan proses bisnis organisasi dan mengelisitasi kebutuhan fungsional maupun non-fungsional secara sistematis dengan etika profesi yang bertanggung jawab (CPL01, CPL04).',
        mappedCplCodes: ['CPL01', 'CPL04'],
        bobotTargetPersen: 20
      },
      {
        kode: 'CPMK2',
        deskripsi:
          'Mampu memodelkan proses bisnis saat ini (As-Is) dan usulan (To-Be) menggunakan BPMN 2.0 serta menyusun analisis kelayakan sistem secara logis dan kritis (CPL04, CPL07).',
        mappedCplCodes: ['CPL04', 'CPL07'],
        bobotTargetPersen: 25
      },
      {
        kode: 'CPMK3',
        deskripsi:
          'Mampu merancang model analisis dan arsitektur sistem berorientasi objek menggunakan diagram UML 2.5 (Use Case, Activity, Sequence, Class Diagram) secara presisi (CPL07, CPL10).',
        mappedCplCodes: ['CPL07', 'CPL10'],
        bobotTargetPersen: 30
      },
      {
        kode: 'CPMK4',
        deskripsi:
          'Mampu merancang skema basis data relasional, arsitektur antarmuka pengguna (UI/UX), dan menyusun dokumen System Requirements Specification (SRS) berstandar IEEE 830 / ISO/IEC/IEEE 29148 (CPL01, CPL10).',
        mappedCplCodes: ['CPL01', 'CPL10'],
        bobotTargetPersen: 25
      }
    ],
    subCpmkList: [
      {
        kode: 'Sub-CPMK1',
        deskripsi: 'Mampu menjelaskan konsep dasar SDLC, peran System Analyst, dan metodologi pengembangan Agile vs Waterfall.',
        mappedCpmkCode: 'CPMK1',
        taksonomiBloom: 'C2, A2'
      },
      {
        kode: 'Sub-CPMK2',
        deskripsi: 'Mampu mengidentifikasi masalah bisnis menggunakan kerangka PIECES dan melakukan elisitasi kebutuhan (fungsional & non-fungsional).',
        mappedCpmkCode: 'CPMK1',
        taksonomiBloom: 'C4, A3, P2'
      },
      {
        kode: 'Sub-CPMK3',
        deskripsi: 'Mampu memodelkan proses bisnis As-Is dan To-Be menggunakan Business Process Model and Notation (BPMN 2.0) serta analisis kelayakan TELOS.',
        mappedCpmkCode: 'CPMK2',
        taksonomiBloom: 'C4, P3'
      },
      {
        kode: 'Sub-CPMK4',
        deskripsi: 'Mampu merancang Use Case Diagram, Use Case Scenario spesifikasi lengkap, dan Activity Diagram berdasarkan proses bisnis To-Be.',
        mappedCpmkCode: 'CPMK3',
        taksonomiBloom: 'C5, P4'
      },
      {
        kode: 'Sub-CPMK5',
        deskripsi: 'Mampu merancang interaksi objek menggunakan Sequence Diagram (Boundary-Control-Entity) dan struktur kelas menggunakan Class Diagram.',
        mappedCpmkCode: 'CPMK3',
        taksonomiBloom: 'C5, P4'
      },
      {
        kode: 'Sub-CPMK6',
        deskripsi: 'Mampu mentransformasi Class Diagram menjadi desain basis data relasional (ERD/Physical Data Model) yang ternormalisasi (3NF) dan merancang arsitektur API.',
        mappedCpmkCode: 'CPMK4',
        taksonomiBloom: 'C6, P4'
      },
      {
        kode: 'Sub-CPMK7',
        deskripsi: 'Mampu merancang prototipe High-Fidelity UI/UX, melakukan pengujian ketergunaan (Usability Testing), dan mempresentasikan dokumen SRS utuh.',
        mappedCpmkCode: 'CPMK4',
        taksonomiBloom: 'C6, A4, P5'
      }
    ],
    deskripsiMk:
      'Mata kuliah Analisis dan Perancangan Sistem Informasi (K572101) membekali mahasiswa Program Studi Sistem Informasi Fakultas Sains dan Teknologi Universitas Komputama dengan kompetensi komprehensif dalam menganalisis permasalahan organisasi, memodelkan proses bisnis menggunakan BPMN 2.0, mengelisitasi spesifikasi kebutuhan perangkat lunak, serta merancang cetak biru sistem informasi berorientasi objek menggunakan UML 2.5 hingga penyusunan dokumen SRS (Software Requirements Specification) dan prototipe fungsional melalui pendekatan Case-Based Learning (CBL) dan Project-Based Learning (PjBL).',
    pokokBahasan: [
      '1. Konsep Dasar Sistem Informasi, Peran System Analyst, dan Siklus Hidup Pengembangan Sistem (SDLC: Waterfall, Iterative, Agile Scrum)',
      '2. Identifikasi Masalah Organisasi (Kerangka PIECES) dan Studi Kelayakan Sistem (TELOS: Technical, Economic, Legal, Operational, Schedule)',
      '3. Teknik Elisitasi Kebutuhan (Wawancara, Observasi, JAD, Kuesioner) serta Spesifikasi Kebutuhan Fungsional & Non-Fungsional (FURPS+)',
      '4. Pemodelan Proses Bisnis Organisasi (As-Is & To-Be) menggunakan Standar BPMN 2.0',
      '5. Pemodelan Fungsional Berorientasi Objek: Use Case Diagram, Narasi Skenario Use Case, dan Activity Diagram (Swimlane)',
      '6. Pemodelan Dinamis & Struktural UML 2.5: Sequence Diagram (Pola BCE), Statechart Diagram, dan Domain/Design Class Diagram',
      '7. Perancangan Basis Data Relasional, Normalisasi (1NF-3NF), Physical Data Model, dan Spesifikasi Kontrak Integrasi Layanan (REST API)',
      '8. Perancangan Antarmuka Pengguna (UI/UX Wireframing & Prototyping), Pengujian Black-Box/Usability, dan Penyusunan Dokumen SRS Standar IEEE 29148'
    ],
    pustakaUtama: [
      '1. Dennis, A., Wixom, B. H., & Tegarden, D. (2021). Systems Analysis and Design: An Object-Oriented Approach with UML (6th ed.). John Wiley & Sons.',
      '2. Satzinger, J. W., Jackson, R. B., & Burd, S. D. (2019). Systems Analysis and Design in a Changing World (8th ed.). Cengage Learning.',
      '3. Kendall, K. E., & Kendall, J. E. (2020). Systems Analysis and Design (10th ed.). Pearson Education.'
    ],
    pustakaTambahan: [
      '4. ISO/IEC/IEEE 29148:2018 — Systems and software engineering — Life cycle processes — Requirements engineering.',
      '5. Dumas, M., La Rosa, M., Mendling, J., & Reijers, H. A. (2018). Fundamentals of Business Process Management (2nd ed.). Springer.',
      '6. Al-Kautsar, H., & Wijaya, R. P. (2025). Modul Praktikum Pemodelan UML 2.5 & BPMN Studi Kasus Korporasi Daerah. Cilacap: LPPM Universitas Komputama Press.'
    ],
    mediaPerangkatLunak: [
      'Visual Paradigm Community / Enterprise Edition',
      'Bizagi Modeler (BPMN 2.0)',
      'Draw.io / Diagrams.net',
      'Figma (UI/UX Prototyping)',
      'DBeaver & PostgreSQL 16',
      'LMS e-Learning UNIKMA (simakad.unikma.ac.id)'
    ],
    mediaPerangkatKeras: [
      'PC / Workstation Laboratorium Rekayasa Sistem Informasi FST UNIKMA',
      'LCD Smart Projector & Interactive Whiteboard',
      'Perangkat Laptop Mahasiswa'
    ],
    teamTeaching: [
      'Dr. Ir. Hasymi Al-Kautsar, S.Kom., M.Kom. (Koordinator Pengampu)',
      'Rizky Pratama Wijaya, S.Kom., M.Cs. (Anggota Tim Pengampu)'
    ],
    mkSyarat: [
      'K571203 - Pengantar Sistem dan Teknologi Informasi',
      'K571302 - Sistem Basis Data',
      'K571305 - Algoritma dan Pemrograman Terstruktur'
    ],
    catatanAkademik: {
      keselarasanCpl:
        'Mata kuliah ini menjadi tulang punggung pencapaian CPL01 (Sikap Profesional), CPL04 (Analisis & Pemodelan Bisnis), CPL07 (Berpikir Kritis & Sistematis), dan CPL10 (Perancangan Arsitektur & Dokumen Spesifikasi Sistem). Setiap CPMK diturunkan secara terukur ke dalam 7 Sub-CPMK dan dipetakan penuh pada 16 pertemuan.',
      kodeProfilLulusan: 'PL01 & PL02',
      profilLulusanDeskripsi:
        'Information Systems Analyst (PL01) & Enterprise Business Process Specialist (PL02) yang mampu menjembatani kebutuhan strategis organisasi menjadi rancangan teknis sistem informasi yang presisi.',
      pendekatanPembelajaran: 'Hybrid Case-Based & Project-Based Learning',
      targetIku7Persen: 60,
      kebijakanIntegritasAkademik:
        'Seluruh artefak diagram UML, model BPMN, dan dokumen SRS wajib merupakan karya orisinal kelompok studi kasus lapangan di mitra UMKM/Instansi wilayah Cilacap-Banyumas dan lolos verifikasi keaslian desain oleh dosen pengampu.'
    },
    matriksPertemuan: [
      {
        mingguKe: 1,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK1',
        kemampuanAkhir:
          'Mampu menjelaskan kontrak perkuliahan OBE, konsep dasar Sistem Informasi, peran System Analyst, dan membandingkan karakteristik metodologi SDLC (Waterfall, Iterative, Agile Scrum) (Sub-CPMK1).',
        materiPembelajaran:
          '1. Kontrak Belajar & Penjelasan RPS OBE UNIKMA\n2. Konsep Sistem, Subsistem, dan Karakteristik SI Korporasi\n3. Peran & Kompetensi System Analyst\n4. Komparasi Metodologi SDLC (Waterfall, Prototyping, Spiral, Agile Scrum)',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah Tatap Muka & Diskusi Interaktif\nMetode: Contextual Instruction & Small Group Discussion',
        indikator:
          '1. Ketepatan menjelaskan tahapan SDLC\n2. Ketepatan memilih metodologi SDLC berdasarkan karakteristik risiko proyek',
        pengalamanBelajar: {
          tm: '2x50\' (Diskusi konsep SDLC & studi kasus kegagalan proyek SI)',
          bt: '2x60\' (Resume matriks komparasi 4 metodologi SDLC)',
          bm: '2x60\' (Membaca Bab 1 Dennis et al. & eksplorasi studi kasus)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Analitik Ketepatan Konsep\nBentuk Non-Tes: Ringkasan Komparasi SDLC & Keaktifan Diskusi',
        kategoriAsesmen: 'Kuis & Tugas Terstruktur',
        taksonomiBloom: 'C2, A2',
        bobotPenilaian: 3
      },
      {
        mingguKe: 2,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK2',
        kemampuanAkhir:
          'Mampu mengidentifikasi akar permasalahan sistem berjalan pada organisasi menggunakan kerangka kerja PIECES (Performance, Information, Economy, Control, Efficiency, Service) (Sub-CPMK2).',
        materiPembelajaran:
          '1. Teknik Investigasi Awal & Definisi Masalah Bisnis\n2. Analisis Kerangka PIECES (Performance, Information, Economy, Control, Efficiency, Service)\n3. Penyusunan System Request & Ruang Lingkup Proyek',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Praktikum Analisis Kasus\nMetode: Case-Based Learning (CBL) — Analisis Kasus Nyata Organisasi',
        indikator:
          '1. Ketajaman memetakan gejala vs akar masalah pada 6 dimensi PIECES\n2. Kelengkapan dokumen System Request awal',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum (Bedah kasus layanan akademik/RSUD)',
          bt: '3x60\' (Menyusun Tabel Analisis PIECES pada objek studi kasus kelompok)',
          bm: '3x60\' (Observasi lapangan / wawancara awal mitra studi kasus)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Case Method (PIECES)\nBentuk Non-Tes: Laporan Analisis Masalah PIECES & System Request',
        kategoriAsesmen: 'Partisipatif (Case Method)',
        taksonomiBloom: 'C4, A3',
        bobotPenilaian: 5
      },
      {
        mingguKe: 3,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK2',
        kemampuanAkhir:
          'Mampu melakukan elisitasi kebutuhan sistem dan merumuskan daftar kebutuhan fungsional serta non-fungsional (FURPS+) yang terukur (Sub-CPMK2).',
        materiPembelajaran:
          '1. Teknik Elisitasi Kebutuhan: Wawancara, JAD, Observasi, Analisis Dokumen\n2. Perumusan Kebutuhan Fungsional (User Stories & Pernyataan Kebutuhan)\n3. Spesifikasi Kebutuhan Non-Fungsional (Functionality, Usability, Reliability, Performance, Security)',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Simulasi Elisitasi\nMetode: Case-Based Learning (Roleplay Stakeholder Interview)',
        indikator:
          '1. Ketepatan instrumen wawancara/observasi\n2. Keterukuran spesifikasi kebutuhan fungsional dan non-fungsional tanpa ambiguitas',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum (Simulasi elisitasi kebutuhan klien)',
          bt: '3x60\' (Menyusun matriks Traceability Kebutuhan Fungsional & Non-Fungsional)',
          bm: '3x60\' (Studi standar IEEE 29148 tentang kriteria kebutuhan yang baik)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Kualitas Spesifikasi Kebutuhan\nBentuk Non-Tes: Dokumen Daftar Kebutuhan (Requirements Backlog)',
        kategoriAsesmen: 'Partisipatif (Case Method)',
        taksonomiBloom: 'C4, P2',
        bobotPenilaian: 5
      },
      {
        mingguKe: 4,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK3',
        kemampuanAkhir:
          'Mampu memodelkan proses bisnis berjalan (As-Is) dan proses bisnis usulan (To-Be) menggunakan standar Business Process Model and Notation (BPMN 2.0) (Sub-CPMK3).',
        materiPembelajaran:
          '1. Elemen Inti BPMN 2.0: Pool, Lane, Task, Event (Start, Intermediate, End), Gateway (XOR, AND, OR)\n2. Pemodelan Proses Bisnis As-Is & Identifikasi Bottleneck\n3. Rekayasa Ulang Proses Bisnis Usulan (To-Be) Berbasis Otomasi SI',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Praktikum Laboratorium\nMetode: Case-Based Learning dengan Bizagi Modeler',
        indikator:
          '1. Kepatuhan sintaks dan semantik BPMN 2.0 (bebas deadlock/infinite loop)\n2. Efisiensi alur proses bisnis To-Be dibanding As-Is',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum Lab (Hands-on Bizagi Modeler)',
          bt: '3x60\' (Membuat diagram BPMN As-Is dan To-Be studi kasus kelompok)',
          bm: '3x60\' (Validasi aturan sintaks BPMN 2.0)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Validasi Model BPMN 2.0\nBentuk Non-Tes: Artefak File Bizagi BPMN As-Is & To-Be',
        kategoriAsesmen: 'Partisipatif (Case Method)',
        taksonomiBloom: 'C4, P3',
        bobotPenilaian: 5
      },
      {
        mingguKe: 5,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK3',
        kemampuanAkhir:
          'Mampu menyusun analisis kelayakan sistem informasi meliputi aspek TELOS (Technical, Economic, Legal, Operational, Schedule) beserta perhitungan ROI/NPV/Payback Period (Sub-CPMK3).',
        materiPembelajaran:
          '1. Kerangka Analisis Kelayakan TELOS\n2. Analisis Biaya-Manfaat (Cost-Benefit Analysis): Tangible & Intangible Benefits\n3. Perhitungan Payback Period, Net Present Value (NPV), dan Return on Investment (ROI)',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Latihan Studi Kasus Finansial TI\nMetode: Case-Based Learning & Problem Solving',
        indikator:
          '1. Ketepatan perhitungan tabel arus kas proyek SI (NPV, ROI, Payback Period)\n2. Ketepatan rekomendasi keputusan kelayakan sistem',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum (Simulasi spreadsheet kelayakan investasi SI)',
          bt: '3x60\' (Menyusun bab Studi Kelayakan TELOS untuk proyek kelompok)',
          bm: '3x60\' (Mengkaji komponen biaya lisensi, cloud server, dan pemeliharaan)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Ketepatan Kalkulasi & Rasionalitas Estimasi\nBentuk Tes & Non-Tes: Kuis 1 (Analisis Kelayakan) & Worksheet TELOS',
        kategoriAsesmen: 'Kuis & Tugas Terstruktur',
        taksonomiBloom: 'C4, P3',
        bobotPenilaian: 4
      },
      {
        mingguKe: 6,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK4',
        kemampuanAkhir:
          'Mampu merancang Use Case Diagram dan menyusun spesifikasi Use Case Scenario (Normal Course, Alternative Course, Exception) secara utuh (Sub-CPMK4).',
        materiPembelajaran:
          '1. Konsep Pemodelan Fungsional UML 2.5: Actor, Use Case, System Boundary\n2. Relasi Use Case: Association, <<include>>, <<extend>>, Generalization\n3. Penyusunan Tabel Spesifikasi Use Case (Pre-condition, Main Flow, Alternative Flow, Post-condition)',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Praktikum Pemodelan UML\nMetode: Project-Based Learning (PjBL) — Tahap 1 Spesifikasi Fungsional',
        indikator:
          '1. Ketepatan penggunaan relasi <<include>> dan <<extend>>\n2. Konsistensi antara kebutuhan fungsional dengan daftar Use Case dan skenarionya',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum Visual Paradigm',
          bt: '3x60\' (Merancang Use Case Diagram & minimal 6 Use Case Scenario utama)',
          bm: '3x60\' (Review silang konsistensi aktor dan use case antar anggota tim)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Penilaian Desain UML Use Case\nBentuk Non-Tes: Artefak Use Case Diagram & Dokumen Use Case Description',
        kategoriAsesmen: 'Kolaboratif (Team-Based Project)',
        taksonomiBloom: 'C5, P4',
        bobotPenilaian: 5
      },
      {
        mingguKe: 7,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK4',
        kemampuanAkhir:
          'Mampu merancang Activity Diagram dengan partisi Swimlane (Actor vs System) yang merepresentasikan alur logika setiap Use Case (Sub-CPMK4).',
        materiPembelajaran:
          '1. Notasi Activity Diagram UML 2.5: Initial Node, Action, Control Flow, Decision/Merge, Fork/Join, Activity Final\n2. Pemetaan Skenario Use Case ke Swimlane Activity Diagram\n3. Review & Presentasi Progres Proyek Tahap Analisis (Bab 1-3 SRS)',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah, Praktikum & Presentasi Milestone 1\nMetode: Project-Based Learning (PjBL) & Peer Review',
        indikator:
          '1. Kesejajaran langkah Main/Alternative Flow Use Case dengan Swimlane Activity Diagram\n2. Ketepatan penggunaan Decision/Merge dan Fork/Join',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum & Presentasi Progres Bab Analisis',
          bt: '3x60\' (Menyelesaikan seluruh Activity Diagram sesuai jumlah Use Case)',
          bm: '3x60\' (Persiapan kompilasi artefak analisis untuk Evaluasi Tengah Semester)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Konsistensi Use Case ke Activity Diagram\nBentuk Non-Tes: Penilaian Progres PjBL Tahap 1',
        kategoriAsesmen: 'Kolaboratif (Team-Based Project)',
        taksonomiBloom: 'C5, P4',
        bobotPenilaian: 5
      },
      {
        mingguKe: 8,
        tipePertemuan: 'UTS',
        subCpmkKode: 'EVAL-UTS',
        kemampuanAkhir:
          'Evaluasi Tengah Semester (UTS): Mengukur ketercapaian CPMK1, CPMK2, dan sebagian CPMK3 (Sub-CPMK1 s/d Sub-CPMK4) melalui ujian studi kasus analisis sistem dan pemodelan BPMN/Use Case/Activity Diagram.',
        materiPembelajaran:
          'Ujian Tertulis & Praktik Studi Kasus Komprehensif Materi Pertemuan 1 s/d 7 (SDLC, PIECES, Elisitasi Kebutuhan, BPMN 2.0, Studi Kelayakan TELOS, Use Case & Activity Diagram)',
        bentukMetodePembelajaran:
          'Bentuk: Evaluasi Tengah Semester (UTS) Terjadwal\nMetode: Ujian Studi Kasus Terbuka Terstruktur (Case-Based Exam)',
        indikator:
          'Ketepatan menjawab soal analisis kasus, ketepatan pemodelan BPMN 2.0, serta ketepatan perancangan Use Case & Activity Diagram dalam batas waktu ujian.',
        pengalamanBelajar: {
          tm: '1x120\' (Pelaksanaan Ujian Tengah Semester Terjadwal Fakultas)',
          bt: 'Penyerahan berkas lembar jawaban & file diagram UTS',
          bm: 'Evaluasi mandiri hasil UTS'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Pedoman Penskoran & Rubrik UTS Standar Prodi SI UNIKMA\nBentuk Tes: Ujian Tertulis & Praktik Pemodelan',
        kategoriAsesmen: 'UTS',
        taksonomiBloom: 'C4, C5, P4',
        bobotPenilaian: 15
      },
      {
        mingguKe: 9,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK5',
        kemampuanAkhir:
          'Mampu merancang Sequence Diagram menggunakan pola arsitektur BCE (Boundary, Control, Entity) untuk memodelkan interaksi antar objek secara kronologis (Sub-CPMK5).',
        materiPembelajaran:
          '1. Konsep Object Interaction & Lifeline pada Sequence Diagram\n2. Stereotype Objek: Actor, <<boundary>>, <<control>>, <<entity>>\n3. Message Types (Synchronous, Asynchronous, Return, Self-Call) dan Combined Fragments (alt, opt, loop)',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Praktikum Lab\nMetode: Project-Based Learning (PjBL) — Pemodelan Interaksi Objek',
        indikator:
          '1. Ketepatan pemisahan tanggung jawab objek Boundary, Control, dan Entity\n2. Ketepatan penggunaan fragment alt/loop sesuai skenario bisnis',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum Visual Paradigm (Sequence Diagram)',
          bt: '3x60\' (Merancang Sequence Diagram untuk seluruh Use Case proyek)',
          bm: '3x60\' (Mempelajari Bab 8 Dennis et al. tentang Interaction Diagrams)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Ketepatan Lifeline & Message Sequence\nBentuk Non-Tes: Artefak Sequence Diagram Proyek',
        kategoriAsesmen: 'Kolaboratif (Team-Based Project)',
        taksonomiBloom: 'C5, P4',
        bobotPenilaian: 6
      },
      {
        mingguKe: 10,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK5',
        kemampuanAkhir:
          'Mampu merancang Class Diagram (Domain Model & Design Class Diagram) lengkap dengan atribut, visibilitas, tipe data, operasi/method, dan multiplisitas relasi (Sub-CPMK5).',
        materiPembelajaran:
          '1. Identifikasi Kelas dari Sequence Diagram & Kata Benda Kebutuhan\n2. Enkapsulasi, Visibilitas (-, +, #), Atribut, dan Signature Method\n3. Relasi Antar Kelas: Association, Aggregation, Composition, Generalization/Inheritance, Multiplicity',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Praktikum Lab\nMetode: Project-Based Learning (PjBL) — Pemodelan Struktur Kelas',
        indikator:
          '1. Konsistensi penuh antara objek Entity/Control di Sequence Diagram dengan Class Diagram\n2. Ketepatan penentuan kardinalitas/multiplicity dan jenis relasi (Composition vs Aggregation)',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum Pemodelan Class Diagram & Code Generation',
          bt: '3x60\' (Menyusun Design Class Diagram utuh proyek kelompok)',
          bm: '3x60\' (Eksplorasi prinsip SOLID dasar dalam perancangan kelas)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Konsistensi Struktural UML\nBentuk Non-Tes: Artefak Design Class Diagram',
        kategoriAsesmen: 'Kolaboratif (Team-Based Project)',
        taksonomiBloom: 'C5, P4',
        bobotPenilaian: 6
      },
      {
        mingguKe: 11,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK6',
        kemampuanAkhir:
          'Mampu mentransformasi Class Diagram menjadi skema basis data relasional (Logical & Physical Data Model) yang memenuhi kaidah normalisasi hingga 3NF/BCNF (Sub-CPMK6).',
        materiPembelajaran:
          '1. Aturan Mapping Object-Relational (Class ke Tabel, Relasi 1:N, M:N ke Tabel Junction)\n2. Evaluasi Normalisasi Skema (1NF, 2NF, 3NF, BCNF)\n3. Perancangan Kamus Data (Data Dictionary), Indexing, dan Referential Integrity Constraints',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Praktikum Basis Data\nMetode: Project-Based Learning (PjBL) dengan DBeaver & PostgreSQL',
        indikator:
          '1. Skema tabel bebas anomali penyisipan, pembaruan, dan penghapusan (3NF)\n2. Kesiapan skrip SQL DDL yang dapat dieksekusi tanpa error',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum Forward Engineering ERD ke DDL SQL',
          bt: '3x60\' (Menyusun Physical Data Model, Kamus Data, dan file SQL DDL)',
          bm: '3x60\' (Uji eksekusi DDL dan relasi foreign key pada PostgreSQL)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Desain Skema Basis Data & Normalisasi\nBentuk Non-Tes: Skema PDM, Kamus Data & File SQL DDL',
        kategoriAsesmen: 'Kolaboratif (Team-Based Project)',
        taksonomiBloom: 'C6, P4',
        bobotPenilaian: 6
      },
      {
        mingguKe: 12,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK6',
        kemampuanAkhir:
          'Mampu merancang arsitektur deployment sistem (Deployment & Component Diagram) serta spesifikasi kontrak layanan RESTful API (Sub-CPMK6).',
        materiPembelajaran:
          '1. Arsitektur Perangkat Lunak Modern: Monolith Modular, Three-Tier, dan Microservices\n2. Pemodelan Component Diagram & Deployment Diagram UML 2.5\n3. Perancangan Spesifikasi Endpoint REST API (Method, URI, Request/Response JSON Payload, Status Code)',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Praktikum Arsitektur\nMetode: Case-Based & Project-Based Learning',
        indikator:
          '1. Ketepatan topologi Deployment Diagram (Client, Web Server, App Server, DB Server)\n2. Kelengkapan kontrak spesifikasi endpoint API utama',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum Perancangan Kontrak API & Deployment',
          bt: '3x60\' (Menyusun Deployment Diagram & Spesifikasi Endpoint API Proyek)',
          bm: '3x60\' (Mempelajari standar OpenAPI / Swagger 3.0)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Kelayakan Arsitektur & Standar RESTful\nBentuk Tes & Non-Tes: Kuis 2 (UML Lanjut & DB) + Dokumen Arsitektur',
        kategoriAsesmen: 'Kuis & Tugas Terstruktur',
        taksonomiBloom: 'C6, P4',
        bobotPenilaian: 5
      },
      {
        mingguKe: 13,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK7',
        kemampuanAkhir:
          'Mampu merancang arsitektur informasi, navigasi layar, wireframe, dan prototipe antarmuka pengguna (High-Fidelity UI/UX) yang mematuhi 10 prinsip Usability Heuristics Nielsen (Sub-CPMK7).',
        materiPembelajaran:
          '1. Prinsip Desain Antarmuka Pengguna (8 Golden Rules Shneiderman & 10 Heuristics Nielsen)\n2. Pemetaan User Flow & Information Architecture dari Use Case\n3. Pembuatan Design System & Interactive High-Fidelity Prototype di Figma',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Studio Praktikum UI/UX\nMetode: Project-Based Learning (PjBL) dengan Figma',
        indikator:
          '1. Konsistensi komponen UI dengan atribut pada Class Diagram dan alur Sequence Diagram\n2. Kepatuhan terhadap prinsip heuristik usability dan aksesibilitas kontras warna',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum Studio Desain Prototipe Figma',
          bt: '3x60\' (Membangun prototipe interaktif seluruh layar utama proyek)',
          bm: '3x60\' (Menghubungkan interaksi antar frame Figma untuk simulasi alur)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Heuristik UI/UX & Konsistensi Data\nBentuk Non-Tes: Tautan & Dokumentasi Prototipe Interaktif Figma',
        kategoriAsesmen: 'Kolaboratif (Team-Based Project)',
        taksonomiBloom: 'C6, P5',
        bobotPenilaian: 5
      },
      {
        mingguKe: 14,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK7',
        kemampuanAkhir:
          'Mampu menyusun rencana pengujian sistem (Test Plan), skenario Black-Box Testing, dan melakukan evaluasi Usability Testing (System Usability Scale / SUS) (Sub-CPMK7).',
        materiPembelajaran:
          '1. Konsep Verifikasi & Validasi Desain Sistem (Requirements Traceability Matrix / RTM)\n2. Penyusunan Test Case Black-Box (Equivalence Partitioning & Boundary Value Analysis)\n3. Pengujian Prototipe kepada Pengguna Akhir menggunakan metode System Usability Scale (SUS)',
        bentukMetodePembelajaran:
          'Bentuk: Kuliah & Praktikum Pengujian\nMetode: Project-Based Learning (PjBL) — Validasi Pengguna',
        indikator:
          '1. Kelengkapan matriks keterlacakan (RTM) dari CPL → CPMK → Kebutuhan → Use Case → UI → Test Case\n2. Pelaksanaan uji prototipe dan analisis skor SUS',
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum Penyusunan RTM & Skenario Uji',
          bt: '3x60\' (Melaksanakan pengujian prototipe dengan responden mitra & menghitung skor SUS)',
          bm: '3x60\' (Menyempurnakan desain berdasarkan umpan balik pengguna)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Kelengkapan RTM & Validitas Pengujian\nBentuk Non-Tes: Dokumen Test Plan, RTM, dan Hasil Evaluasi SUS',
        kategoriAsesmen: 'Kolaboratif (Team-Based Project)',
        taksonomiBloom: 'C6, A4, P5',
        bobotPenilaian: 5
      },
      {
        mingguKe: 15,
        tipePertemuan: 'REGULER',
        subCpmkKode: 'Sub-CPMK7',
        kemampuanAkhir:
          'Mampu mengintegrasikan seluruh artefak analisis dan perancangan ke dalam Dokumen Spesifikasi Kebutuhan Perangkat Lunak (SRS Standar IEEE 29148) dan mempresentasikannya secara profesional (Sub-CPMK7).',
        materiPembelajaran:
          '1. Struktur Standar Dokumen SRS (Software Requirements Specification) & SDD (Software Design Description)\n2. Audit Konsistensi Silang Antar-Diagram (BPMN ↔ Use Case ↔ Activity ↔ Sequence ↔ Class ↔ ERD ↔ UI)\n3. Sidang Presentasi Proyek Akhir Kelompok (Exhibition & Design Defense)',
        bentukMetodePembelajaran:
          'Bentuk: Seminar Presentasi Proyek & Tanya Jawab Kritis\nMetode: Project-Based Learning (PjBL) — Final Project Defense',
        indikator:
          '1. Keutuhan dan kerapian dokumen SRS sesuai templat Prodi SI UNIKMA\n2. Ketepatan argumentasi teknis saat mempertahankan rancangan arsitektur di hadapan penguji',
        pengalamanBelajar: {
          tm: '2x50\' + 1x170\' (Presentasi Proyek Akhir & Review Komprehensif Dosen)',
          bt: '3x60\' (Finalisasi revisi dokumen SRS & pengemasan repositori artefak desain)',
          bm: '3x60\' (Refleksi pembelajaran dan persiapan Evaluasi Akhir Semester)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Rubrik Penilaian Proyek Akhir PjBL & Presentasi Individu\nBentuk Non-Tes: Dokumen SRS Final, Prototipe, dan Performa Presentasi',
        kategoriAsesmen: 'Kolaboratif (Team-Based Project)',
        taksonomiBloom: 'C6, A4, P5',
        bobotPenilaian: 5
      },
      {
        mingguKe: 16,
        tipePertemuan: 'UAS',
        subCpmkKode: 'EVAL-UAS',
        kemampuanAkhir:
          'Evaluasi Akhir Semester (UAS): Mengukur ketercapaian komprehensif CPMK3 dan CPMK4 (Sub-CPMK5 s/d Sub-CPMK7) meliputi perancangan Sequence Diagram, Class Diagram, Normalisasi Basis Data, Arsitektur Sistem, dan Pengujian.',
        materiPembelajaran:
          'Ujian Komprehensif Akhir Semester Materi Pertemuan 9 s/d 15 (Sequence Diagram BCE, Design Class Diagram, Mapping ERD & Normalisasi 3NF, Arsitektur Deployment & REST API, Heuristik UI/UX, dan RTM/Black-Box Testing)',
        bentukMetodePembelajaran:
          'Bentuk: Evaluasi Akhir Semester (UAS) Terjadwal\nMetode: Ujian Tertulis Komprehensif & Validasi Dokumen SRS Final',
        indikator:
          'Ketepatan merancang model struktural/dinamis UML 2.5, ketepatan transformasi skema basis data 3NF, serta pemenuhan standar mutu dokumen SRS.',
        pengalamanBelajar: {
          tm: '1x120\' (Pelaksanaan Ujian Akhir Semester Terjadwal Fakultas Sains dan Teknologi)',
          bt: 'Pengumpulan berkas ujian & pengesahan bundel SRS final',
          bm: 'Evaluasi akhir capaian pembelajaran mata kuliah (Portofolio OBE)'
        },
        kriteriaBentukPenilaian:
          'Kriteria: Pedoman Penskoran & Rubrik UAS Standar Prodi SI UNIKMA\nBentuk Tes: Ujian Tertulis Komprehensif & Portofolio Desain',
        kategoriAsesmen: 'UAS',
        taksonomiBloom: 'C5, C6, P5',
        bobotPenilaian: 15
      }
    ]
  },
  {
    id: 'rps-k572104',
    status: 'Menunggu Otorisasi Kaprodi',
    lastUpdated: '2026-09-27 09:15 WIB',
    progresPengisianPersen: 100,
    institusi: UNIKMA_HEADER_DEFAULT,
    identitas: {
      namaMk: 'Manajemen Proyek Sistem Informasi',
      kodeMk: 'K572104',
      rumpunMk: 'Tata Kelola & Manajemen Sistem Informasi',
      bobotSksTeori: 2,
      bobotSksPraktikum: 1,
      semester: 5,
      tanggalPenyusunan: '18 Agustus 2026',
      tahunAkademik: '2026/2027 Ganjil',
      revisiKe: '01'
    },
    otorisasi: {
      dosenPengembang: {
        nama: 'Hendra Kusuma Wardhana, S.Kom., M.M.S.I.',
        nidn: '0619058702',
        jabatan: 'Dosen Pengembang RPS',
        statusOtorisasi: 'Terverifikasi QR',
        tanggalOtorisasi: '19 Agustus 2026',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572104-DSN-11A8C'
      },
      koordinatorRmk: {
        nama: 'Dr. Bambang Sutrisno, S.E., S.Kom., M.Kom.',
        nidn: '0603048101',
        jabatan: 'Koordinator RMK Tata Kelola & Manajemen SI',
        statusOtorisasi: 'Terverifikasi QR',
        tanggalOtorisasi: '20 Agustus 2026',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572104-RMK-52D4F'
      },
      ketuaProdi: {
        nama: 'Dr. Siti Nurhaliza Pramesti, S.T., M.Kom.',
        nidn: '0609038402',
        jabatan: 'Ketua Program Studi S1 Sistem Informasi',
        statusOtorisasi: 'Menunggu Tanda Tangan',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572104-KPS-PENDING'
      }
    },
    cplProdi: [
      MASTER_CPL_PRODI_SI[0], // CPL01
      MASTER_CPL_PRODI_SI[3], // CPL07
      MASTER_CPL_PRODI_SI[4]  // CPL09
    ],
    cpmkList: [
      {
        kode: 'CPMK1',
        deskripsi: 'Mampu menyusun Project Charter dan mendefinisikan ruang lingkup proyek SI menggunakan Work Breakdown Structure (WBS) (CPL01, CPL09).',
        mappedCplCodes: ['CPL01', 'CPL09'],
        bobotTargetPersen: 25
      },
      {
        kode: 'CPMK2',
        deskripsi: 'Mampu menyusun jadwal proyek kritis (CPM/Gantt Chart) dan rencana anggaran biaya menggunakan metode Earned Value Management (EVM) (CPL07, CPL09).',
        mappedCplCodes: ['CPL07', 'CPL09'],
        bobotTargetPersen: 35
      },
      {
        kode: 'CPMK3',
        deskripsi: 'Mampu mengelola risiko proyek TI, manajemen mutu, serta mengimplementasikan kerangka Agile Scrum dalam eksekusi proyek (CPL01, CPL07, CPL09).',
        mappedCplCodes: ['CPL01', 'CPL07', 'CPL09'],
        bobotTargetPersen: 40
      }
    ],
    subCpmkList: [
      { kode: 'Sub-CPMK1', deskripsi: 'Menjelaskan kerangka PMBOK 7th Edition & siklus hidup proyek TI.', mappedCpmkCode: 'CPMK1', taksonomiBloom: 'C2, A2' },
      { kode: 'Sub-CPMK2', deskripsi: 'Menyusun Project Charter dan Work Breakdown Structure (WBS).', mappedCpmkCode: 'CPMK1', taksonomiBloom: 'C4, P3' },
      { kode: 'Sub-CPMK3', deskripsi: 'Menghitung jalur kritis (Critical Path Method) dan penjadwalan jaringan.', mappedCpmkCode: 'CPMK2', taksonomiBloom: 'C4, P4' },
      { kode: 'Sub-CPMK4', deskripsi: 'Menganalisis kinerja biaya dan jadwal menggunakan Earned Value Management (CPI/SPI).', mappedCpmkCode: 'CPMK2', taksonomiBloom: 'C5, P4' },
      { kode: 'Sub-CPMK5', deskripsi: 'Menyusun matriks manajemen risiko proyek TI, pengadaan, dan penutupan proyek.', mappedCpmkCode: 'CPMK3', taksonomiBloom: 'C6, A4, P5' }
    ],
    deskripsiMk:
      'Mata kuliah ini mempelajari prinsip, proses, dan perangkat tata kelola proyek pengembangan Sistem Informasi berstandar PMBOK (Project Management Body of Knowledge) dan Agile Scrum, mencakup inisiasi, perencanaan WBS, estimasi jadwal CPM, manajemen anggaran EVM, manajemen risiko, hingga penutupan proyek.',
    pokokBahasan: [
      '1. Pengantar Manajemen Proyek TI & Kerangka Kerja PMBOK vs Agile',
      '2. Manajemen Integrasi Proyek & Penyusunan Project Charter',
      '3. Manajemen Ruang Lingkup (Scope) & Work Breakdown Structure (WBS)',
      '4. Manajemen Waktu Proyek: Gantt Chart, PERT, dan Critical Path Method (CPM)',
      '5. Manajemen Biaya Proyek & Analisis Earned Value Management (EVM)',
      '6. Manajemen Kualitas, Sumber Daya (Matriks RACI), dan Komunikasi Proyek',
      '7. Manajemen Risiko Proyek TI, Manajemen Pengadaan (SLA/Kontrak), dan Project Closure'
    ],
    pustakaUtama: [
      '1. Schwalbe, K. (2019). Information Technology Project Management (9th ed.). Cengage Learning.',
      '2. Project Management Institute. (2021). A Guide to the Project Management Body of Knowledge (PMBOK Guide) (7th ed.). PMI.'
    ],
    pustakaTambahan: [
      '3. Marchewka, J. T. (2016). Information Technology Project Management: Providing Measurable Organizational Value (5th ed.). Wiley.'
    ],
    mediaPerangkatLunak: ['Microsoft Project / ProjectLibre', 'Jira Software & Trello', 'Spreadsheet EVM Analyzer'],
    mediaPerangkatKeras: ['Komputer Laboratorium Manajemen SI UNIKMA', 'LCD Proyektor Interaktif'],
    teamTeaching: ['Hendra Kusuma Wardhana, S.Kom., M.M.S.I.'],
    mkSyarat: ['K572101 - Analisis dan Perancangan Sistem Informasi'],
    catatanAkademik: {
      keselarasanCpl: 'Mendukung penuh pencapaian CPL01, CPL07, dan CPL09 untuk menghasilkan lulusan berkualifikasi IT Project Coordinator.',
      kodeProfilLulusan: 'PL03',
      profilLulusanDeskripsi: 'IT Project & Governance Coordinator yang mampu merencanakan dan mengendalikan proyek TI tepat waktu, tepat mutu, dan sesuai anggaran.',
      pendekatanPembelajaran: 'Project-Based Learning (PjBL)',
      targetIku7Persen: 60,
      kebijakanIntegritasAkademik: 'Dokumen Project Management Plan wajib disusun berdasarkan studi kasus proyek nyata dan menggunakan data estimasi yang terverifikasi.'
    },
    matriksPertemuan: Array.from({ length: 16 }, (_, idx) => {
      const m = idx + 1;
      if (m === 8) {
        return {
          mingguKe: 8,
          tipePertemuan: 'UTS',
          subCpmkKode: 'EVAL-UTS',
          kemampuanAkhir: 'Evaluasi Tengah Semester (UTS): Uji kompetensi penyusunan Project Charter, WBS, dan perhitungan CPM.',
          materiPembelajaran: 'Materi Pertemuan 1 s/d 7 (Inisiasi, Project Charter, WBS, Penjadwalan CPM)',
          bentukMetodePembelajaran: 'Ujian Tertulis & Studi Kasus Penjadwalan Proyek',
          indikator: 'Ketepatan menyusun WBS dan menghitung lintasan kritis (Critical Path) proyek SI.',
          pengalamanBelajar: { tm: '1x120\' Ujian Terjadwal', bt: 'Lembar Jawaban UTS', bm: 'Evaluasi Mandiri' },
          kriteriaBentukPenilaian: 'Rubrik Penskoran UTS Prodi SI',
          kategoriAsesmen: 'UTS',
          taksonomiBloom: 'C4, P4',
          bobotPenilaian: 15
        };
      }
      if (m === 16) {
        return {
          mingguKe: 16,
          tipePertemuan: 'UAS',
          subCpmkKode: 'EVAL-UAS',
          kemampuanAkhir: 'Evaluasi Akhir Semester (UAS): Uji komprehensif analisis EVM, Manajemen Risiko, dan Dokumen Project Management Plan.',
          materiPembelajaran: 'Materi Pertemuan 9 s/d 15 (EVM, Kualitas, RACI, Risiko, Pengadaan, Agile Scrum)',
          bentukMetodePembelajaran: 'Ujian Tertulis & Validasi Portofolio PMP',
          indikator: 'Ketepatan perhitungan CPI/SPI pada EVM dan kelengkapan dokumen Project Management Plan.',
          pengalamanBelajar: { tm: '1x120\' Ujian Terjadwal', bt: 'Bundel PMP Final', bm: 'Refleksi Capaian' },
          kriteriaBentukPenilaian: 'Rubrik Penskoran UAS Prodi SI',
          kategoriAsesmen: 'UAS',
          taksonomiBloom: 'C5, C6, P5',
          bobotPenilaian: 15
        };
      }
      return {
        mingguKe: m,
        tipePertemuan: 'REGULER',
        subCpmkKode: m <= 3 ? 'Sub-CPMK1' : m <= 5 ? 'Sub-CPMK2' : m <= 7 ? 'Sub-CPMK3' : m <= 11 ? 'Sub-CPMK4' : 'Sub-CPMK5',
        kemampuanAkhir: `Mampu menguasai kompetensi perencanaan dan pengendalian proyek SI minggu ke-${m} sesuai tahapan PMBOK & Agile Scrum.`,
        materiPembelajaran: `Pokok Bahasan Manajemen Proyek Sistem Informasi Minggu ke-${m} (Teori & Studi Kasus Praktikum ProjectLibre/Jira)`,
        bentukMetodePembelajaran: 'Kuliah Interaktif, Praktikum ProjectLibre & Project-Based Learning (PjBL)',
        indikator: `Ketepatan penyusunan artefak manajemen proyek minggu ke-${m} sesuai standar PMBOK.`,
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum',
          bt: '3x60\' Penyusunan Artefak Proyek Kelompok',
          bm: '3x60\' Studi Literatur PMBOK 7th Ed'
        },
        kriteriaBentukPenilaian: 'Rubrik Penilaian Artefak Proyek & Partisipasi Diskusi Kasus',
        kategoriAsesmen: m % 3 === 0 ? 'Kuis & Tugas Terstruktur' : m < 8 ? 'Partisipatif (Case Method)' : 'Kolaboratif (Team-Based Project)',
        taksonomiBloom: m < 8 ? 'C4, P3' : 'C5, P4',
        bobotPenilaian: 5
      };
    })
  },
  {
    id: 'rps-k572108',
    status: 'Perlu Perbaikan OBE',
    lastUpdated: '2026-09-27 11:40 WIB',
    progresPengisianPersen: 88,
    institusi: UNIKMA_HEADER_DEFAULT,
    identitas: {
      namaMk: 'Arsitektur Enterprise & Proses Bisnis',
      kodeMk: 'K572108',
      rumpunMk: 'Enterprise Systems & Governance',
      bobotSksTeori: 3,
      bobotSksPraktikum: 0,
      semester: 6,
      tanggalPenyusunan: '20 Agustus 2026',
      tahunAkademik: '2026/2027 Ganjil',
      revisiKe: '01'
    },
    otorisasi: {
      dosenPengembang: {
        nama: 'Nadia Putri Maharani, S.Kom., M.T.',
        nidn: '0628099001',
        jabatan: 'Dosen Pengembang RPS',
        statusOtorisasi: 'Terverifikasi QR',
        tanggalOtorisasi: '21 Agustus 2026',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572108-DSN-63B9A'
      },
      koordinatorRmk: {
        nama: 'Dr. Bambang Sutrisno, S.E., S.Kom., M.Kom.',
        nidn: '0603048101',
        jabatan: 'Koordinator RMK Tata Kelola & Manajemen SI',
        statusOtorisasi: 'Revisi',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572108-RMK-REV'
      },
      ketuaProdi: {
        nama: 'Dr. Siti Nurhaliza Pramesti, S.T., M.Kom.',
        nidn: '0609038402',
        jabatan: 'Ketua Program Studi S1 Sistem Informasi',
        statusOtorisasi: 'Menunggu Tanda Tangan',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572108-KPS-WAIT'
      }
    },
    cplProdi: [
      MASTER_CPL_PRODI_SI[1], // CPL02
      MASTER_CPL_PRODI_SI[2], // CPL04
      MASTER_CPL_PRODI_SI[5]  // CPL10
    ],
    cpmkList: [
      {
        kode: 'CPMK1',
        deskripsi: 'Mampu memahami konsep Enterprise Architecture dan membandingkan kerangka kerja TOGAF ADM, Zachman Framework, dan FEAF (CPL02).',
        mappedCplCodes: ['CPL02'],
        bobotTargetPersen: 20
      },
      {
        kode: 'CPMK2',
        deskripsi: 'Mampu memodelkan Architecture Vision, Business Architecture, dan Information Systems Architecture (Data & Application) menggunakan ArchiMate (CPL04, CPL10).',
        mappedCplCodes: ['CPL04', 'CPL10'],
        bobotTargetPersen: 45
      },
      {
        kode: 'CPMK3',
        deskripsi: 'Mampu merancang Technology Architecture, Opportunities & Solutions, serta Migration Planning (Roadmap TI Korporasi) (CPL04, CPL10).',
        mappedCplCodes: ['CPL04', 'CPL10'],
        bobotTargetPersen: 20
      },
      {
        kode: 'CPMK4',
        deskripsi: 'Mampu mengevaluasi tata kelola implementasi Enterprise Architecture (Architecture Governance) dan manajemen perubahan organisasi.',
        mappedCplCodes: [], // Sengaja kosong agar terdeteksi oleh OBE Validator sebagai CPMK belum terikat CPL!
        bobotTargetPersen: 15
      }
    ],
    subCpmkList: [
      { kode: 'Sub-CPMK1', deskripsi: 'Menjelaskan konsep Enterprise Architecture & fase TOGAF ADM.', mappedCpmkCode: 'CPMK1', taksonomiBloom: 'C2, A2' },
      { kode: 'Sub-CPMK2', deskripsi: 'Merancang Architecture Vision & Business Architecture dengan ArchiMate.', mappedCpmkCode: 'CPMK2', taksonomiBloom: 'C4, P3' },
      { kode: 'Sub-CPMK3', deskripsi: 'Merancang Data Architecture & Application Architecture korporasi.', mappedCpmkCode: 'CPMK2', taksonomiBloom: 'C5, P4' },
      { kode: 'Sub-CPMK4', deskripsi: 'Merancang Technology Architecture & Gap Analysis.', mappedCpmkCode: 'CPMK3', taksonomiBloom: 'C5, P4' },
      { kode: 'Sub-CPMK5', deskripsi: 'Menyusun IT Roadmap & Architecture Governance.', mappedCpmkCode: 'CPMK4', taksonomiBloom: 'C6, A4' }
    ],
    deskripsiMk:
      'Mata kuliah Arsitektur Enterprise & Proses Bisnis membahas penyelarasan strategi bisnis dan teknologi informasi organisasi menggunakan kerangka kerja TOGAF ADM 10 dan bahasa pemodelan ArchiMate 3.2.',
    pokokBahasan: [
      '1. Konsep Dasar Enterprise Architecture & Penyelarasan Strategis Bisnis-TI',
      '2. Kerangka Kerja TOGAF ADM, Zachman, dan Bahasa Pemodelan ArchiMate 3.2',
      '3. Preliminary Phase, Architecture Vision, dan Value Chain Analysis',
      '4. Business Architecture, Data Architecture, dan Application Architecture',
      '5. Technology Architecture, Gap Analysis, dan IT Migration Roadmap'
    ],
    pustakaUtama: [
      '1. The Open Group. (2022). TOGAF Standard, 10th Edition. Van Haren Publishing.',
      '2. Lankhorst, M. (2017). Enterprise Architecture at Work: Modelling, Communication and Analysis (4th ed.). Springer.'
    ],
    pustakaTambahan: [
      '3. Bernard, S. A. (2020). An Introduction to Holistic Enterprise Architecture (4th ed.). AuthorHouse.'
    ],
    mediaPerangkatLunak: ['Archi (ArchiMate Modelling Tool)', 'Bizagi Modeler'],
    mediaPerangkatKeras: ['Ruang Kelas Multimedia FST UNIKMA'],
    teamTeaching: ['Nadia Putri Maharani, S.Kom., M.T.'],
    mkSyarat: ['K572101 - Analisis dan Perancangan Sistem Informasi'],
    catatanAkademik: {
      keselarasanCpl: 'Mendukung CPL02, CPL04, dan CPL10 untuk profil Enterprise & Business Process Specialist.',
      kodeProfilLulusan: 'PL02',
      profilLulusanDeskripsi: 'Enterprise & Business Process Specialist yang mampu menyusun cetak biru arsitektur enterprise (Masterplan TI).',
      pendekatanPembelajaran: 'Case-Based Learning (CBL)',
      targetIku7Persen: 55,
      kebijakanIntegritasAkademik: 'Cetak biru arsitektur wajib mengacu pada profil organisasi studi kasus yang disetujui dosen pengampu.'
    },
    matriksPertemuan: Array.from({ length: 16 }, (_, idx) => {
      const m = idx + 1;
      if (m === 8) {
        return {
          mingguKe: 8,
          tipePertemuan: 'UTS',
          subCpmkKode: 'EVAL-UTS',
          kemampuanAkhir: 'Evaluasi Tengah Semester (UTS): Ujian pemodelan TOGAF Preliminary s/d Business Architecture.',
          materiPembelajaran: 'Materi Pertemuan 1 s/d 7 (TOGAF ADM, Value Chain, Business Architecture ArchiMate)',
          bentukMetodePembelajaran: 'Ujian Studi Kasus Arsitektur Bisnis',
          indikator: 'Ketepatan pemodelan Business Layer pada ArchiMate.',
          pengalamanBelajar: { tm: '3x50\' Ujian Terjadwal', bt: 'Lembar Jawaban UTS', bm: 'Evaluasi Mandiri' },
          kriteriaBentukPenilaian: 'Rubrik UTS Prodi SI',
          kategoriAsesmen: 'UTS',
          taksonomiBloom: 'C4, P3',
          bobotPenilaian: 15
        };
      }
      if (m === 16) {
        return {
          mingguKe: 16,
          tipePertemuan: 'UAS',
          subCpmkKode: 'EVAL-UAS',
          kemampuanAkhir: 'Evaluasi Akhir Semester (UAS): Ujian komprehensif Data, Application, Technology Architecture & IT Roadmap.',
          materiPembelajaran: 'Materi Pertemuan 9 s/d 15 (ISA, Technology Architecture, Gap Analysis, Migration Plan)',
          bentukMetodePembelajaran: 'Ujian Tertulis & Sidang Blueprint EA',
          indikator: 'Keutuhan dokumen Masterplan Enterprise Architecture.',
          pengalamanBelajar: { tm: '3x50\' Ujian Terjadwal', bt: 'Dokumen Blueprint EA', bm: 'Evaluasi Akhir' },
          kriteriaBentukPenilaian: 'Rubrik UAS Prodi SI',
          kategoriAsesmen: 'UAS',
          taksonomiBloom: 'C6, P4',
          bobotPenilaian: 10 // Sengaja 10% (sehingga total bobot 95% - kurang 5%) agar pengguna melihat deteksi error OBE Validator secara langsung
        };
      }
      return {
        mingguKe: m,
        tipePertemuan: 'REGULER',
        subCpmkKode: m <= 3 ? 'Sub-CPMK1' : m <= 7 ? 'Sub-CPMK2' : m <= 11 ? 'Sub-CPMK3' : m <= 13 ? 'Sub-CPMK4' : 'Sub-CPMK5',
        kemampuanAkhir: `Mampu merancang artefak TOGAF ADM & ArchiMate pada pertemuan minggu ke-${m}.`,
        materiPembelajaran: `Fase TOGAF ADM & Pemodelan ArchiMate Minggu ke-${m}`,
        bentukMetodePembelajaran: 'Kuliah Tatap Muka & Case-Based Learning (CBL)',
        indikator: `Ketepatan katalog, matriks, dan diagram TOGAF minggu ke-${m}.`,
        pengalamanBelajar: {
          tm: '3x50\' Tatap Muka & Diskusi Kasus',
          bt: '3x60\' Pemodelan ArchiMate',
          bm: '3x60\' Studi Standar TOGAF 10'
        },
        kriteriaBentukPenilaian: 'Rubrik Katalog & Diagram TOGAF',
        kategoriAsesmen: m % 4 === 0 ? 'Kuis & Tugas Terstruktur' : 'Partisipatif (Case Method)',
        taksonomiBloom: 'C5, P4',
        bobotPenilaian: 5
      };
    })
  },
  {
    id: 'rps-k572112',
    status: 'Terotorisasi Penuh',
    lastUpdated: '2026-09-25 16:20 WIB',
    progresPengisianPersen: 100,
    institusi: UNIKMA_HEADER_DEFAULT,
    identitas: {
      namaMk: 'Keamanan Siber & Audit Sistem Informasi',
      kodeMk: 'K572112',
      rumpunMk: 'Infrastruktur, Keamanan & Audit TI',
      bobotSksTeori: 2,
      bobotSksPraktikum: 1,
      semester: 6,
      tanggalPenyusunan: '10 Agustus 2026',
      tahunAkademik: '2026/2027 Ganjil',
      revisiKe: '02'
    },
    otorisasi: {
      dosenPengembang: {
        nama: 'Agung Prasetyo Nugroho, S.Kom., M.Eng., CEH.',
        nidn: '0611028504',
        jabatan: 'Dosen Pengembang RPS',
        statusOtorisasi: 'Terverifikasi QR',
        tanggalOtorisasi: '12 Agustus 2026',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572112-DSN-88D3E'
      },
      koordinatorRmk: {
        nama: 'Dr. Bambang Sutrisno, S.E., S.Kom., M.Kom.',
        nidn: '0603048101',
        jabatan: 'Koordinator RMK Tata Kelola & Manajemen SI',
        statusOtorisasi: 'Terverifikasi QR',
        tanggalOtorisasi: '13 Agustus 2026',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572112-RMK-29F1A'
      },
      ketuaProdi: {
        nama: 'Dr. Siti Nurhaliza Pramesti, S.T., M.Kom.',
        nidn: '0609038402',
        jabatan: 'Ketua Program Studi S1 Sistem Informasi',
        statusOtorisasi: 'Terverifikasi QR',
        tanggalOtorisasi: '14 Agustus 2026',
        qrVerificationHash: 'UNIKMA-QR-RPS-K572112-KPS-91C7B'
      }
    },
    cplProdi: [
      MASTER_CPL_PRODI_SI[0], // CPL01
      MASTER_CPL_PRODI_SI[3], // CPL07
      MASTER_CPL_PRODI_SI[4]  // CPL09
    ],
    cpmkList: [
      {
        kode: 'CPMK1',
        deskripsi: 'Mampu menganalisis ancaman keamanan informasi berdasarkan prinsip CIA Triad dan standar ISO/IEC 27001:2022 dengan menjunjung tinggi etika profesi (CPL01, CPL07).',
        mappedCplCodes: ['CPL01', 'CPL07'],
        bobotTargetPersen: 30
      },
      {
        kode: 'CPMK2',
        deskripsi: 'Mampu melakukan asesmen kerentanan aplikasi web (OWASP Top 10) dan merancang kontrol mitigasi teknis secara sistematis (CPL07, CPL09).',
        mappedCplCodes: ['CPL07', 'CPL09'],
        bobotTargetPersen: 35
      },
      {
        kode: 'CPMK3',
        deskripsi: 'Mampu merencanakan dan melaksanakan audit Sistem Informasi menggunakan kerangka kerja COBIT 2019 serta menyusun laporan temuan dan rekomendasi audit (CPL01, CPL09).',
        mappedCplCodes: ['CPL01', 'CPL09'],
        bobotTargetPersen: 35
      }
    ],
    subCpmkList: [
      { kode: 'Sub-CPMK1', deskripsi: 'Menjelaskan prinsip CIA Triad, manajemen risiko keamanan, dan kontrol ISO/IEC 27001:2022.', mappedCpmkCode: 'CPMK1', taksonomiBloom: 'C3, A3' },
      { kode: 'Sub-CPMK2', deskripsi: 'Menguji kerentanan aplikasi web berdasarkan OWASP Top 10 dan menyusun rekomendasi patching.', mappedCpmkCode: 'CPMK2', taksonomiBloom: 'C5, P4' },
      { kode: 'Sub-CPMK3', deskripsi: 'Melaksanakan prosedur audit SI berbasis risiko menggunakan domain EDM dan APO/DSS pada COBIT 2019.', mappedCpmkCode: 'CPMK3', taksonomiBloom: 'C6, A4, P5' }
    ],
    deskripsiMk:
      'Mata kuliah ini mengintegrasikan kompetensi pengujian keamanan informasi (ISO 27001 & OWASP Top 10) dengan metodologi Audit Sistem Informasi berbasis risiko menggunakan standar ISACA COBIT 2019.',
    pokokBahasan: [
      '1. Prinsip Keamanan Informasi (CIA Triad), Etika Keamanan Siber & UU PDP',
      '2. Sistem Manajemen Keamanan Informasi (SMKI) Berbasis ISO/IEC 27001:2022 & Indeks KAMI BSSN',
      '3. Keamanan Aplikasi Web (OWASP Top 10) & Vulnerability Assessment',
      '4. Standar Audit Sistem Informasi ISACA & Kerangka Kerja COBIT 2019',
      '5. Pengumpulan Bukti Audit, Kertas Kerja Audit (Working Paper), dan Penyusunan Laporan Audit SI'
    ],
    pustakaUtama: [
      '1. Whitman, M. E., & Mattord, H. J. (2021). Principles of Information Security (7th ed.). Cengage Learning.',
      '2. ISACA. (2019). COBIT 2019 Framework: Governance and Management Objectives. ISACA.'
    ],
    pustakaTambahan: [
      '3. ISO/IEC 27001:2022 — Information security, cybersecurity and privacy protection.'
    ],
    mediaPerangkatLunak: ['OWASP ZAP', 'Wireshark', 'Toolkit Indeks KAMI BSSN & COBIT 2019 Design Factors'],
    mediaPerangkatKeras: ['Laboratorium Keamanan Jaringan & Audit SI FST UNIKMA'],
    teamTeaching: ['Agung Prasetyo Nugroho, S.Kom., M.Eng., CEH.'],
    mkSyarat: ['K571402 - Jaringan Komputer', 'K572101 - Analisis dan Perancangan Sistem Informasi'],
    catatanAkademik: {
      keselarasanCpl: 'Memenuhi CPL01, CPL07, dan CPL09 untuk kompetensi keamanan dan audit tata kelola TI.',
      kodeProfilLulusan: 'PL03',
      profilLulusanDeskripsi: 'IT Governance & Security Auditor yang beretika dan menguasai standar ISO 27001 serta COBIT 2019.',
      pendekatanPembelajaran: 'Hybrid Case-Based & Project-Based Learning',
      targetIku7Persen: 60,
      kebijakanIntegritasAkademik: 'Seluruh praktik pengujian kerentanan wajib dilakukan di dalam lingkungan sandbox laboratorium terisolasi.'
    },
    matriksPertemuan: Array.from({ length: 16 }, (_, idx) => {
      const m = idx + 1;
      if (m === 8) {
        return {
          mingguKe: 8,
          tipePertemuan: 'UTS',
          subCpmkKode: 'EVAL-UTS',
          kemampuanAkhir: 'Evaluasi Tengah Semester (UTS): Uji kompetensi SMKI ISO 27001:2022 dan analisis kerentanan OWASP Top 10.',
          materiPembelajaran: 'Materi Pertemuan 1 s/d 7 (CIA Triad, ISO 27001, Indeks KAMI, OWASP Top 10)',
          bentukMetodePembelajaran: 'Ujian Tertulis & Praktikum Lab Vulnerability Assessment',
          indikator: 'Ketepatan analisis celah keamanan dan pemetaan kontrol Annex A ISO 27001.',
          pengalamanBelajar: { tm: '1x120\' Ujian Terjadwal', bt: 'Laporan Hasil Uji Lab', bm: 'Evaluasi Mandiri' },
          kriteriaBentukPenilaian: 'Rubrik UTS Keamanan & Audit SI',
          kategoriAsesmen: 'UTS',
          taksonomiBloom: 'C4, P4',
          bobotPenilaian: 15
        };
      }
      if (m === 16) {
        return {
          mingguKe: 16,
          tipePertemuan: 'UAS',
          subCpmkKode: 'EVAL-UAS',
          kemampuanAkhir: 'Evaluasi Akhir Semester (UAS): Sidang laporan akhir Audit Sistem Informasi berbasis COBIT 2019 & Indeks KAMI.',
          materiPembelajaran: 'Materi Pertemuan 9 s/d 15 (Perencanaan Audit, Kertas Kerja COBIT 2019, Capability Level, Rekomendasi Audit)',
          bentukMetodePembelajaran: 'Ujian Komprehensif & Sidang Kertas Kerja Audit SI',
          indikator: 'Ketepatan penentuan Capability Level dan kualitas rekomendasi tindak lanjut audit.',
          pengalamanBelajar: { tm: '1x120\' Ujian Terjadwal', bt: 'Bundel Laporan Audit SI', bm: 'Refleksi Akhir' },
          kriteriaBentukPenilaian: 'Rubrik UAS Audit SI Prodi SI UNIKMA',
          kategoriAsesmen: 'UAS',
          taksonomiBloom: 'C6, A4, P5',
          bobotPenilaian: 15
        };
      }
      return {
        mingguKe: m,
        tipePertemuan: 'REGULER',
        subCpmkKode: m <= 4 ? 'Sub-CPMK1' : m <= 7 ? 'Sub-CPMK2' : 'Sub-CPMK3',
        kemampuanAkhir: `Mampu melaksanakan tahapan asesmen keamanan siber dan prosedur audit SI minggu ke-${m}.`,
        materiPembelajaran: `Pokok Bahasan Keamanan Siber & Audit SI Minggu ke-${m}`,
        bentukMetodePembelajaran: 'Kuliah, Praktikum Sandbox & Project-Based Audit Simulation',
        indikator: `Ketepatan kertas kerja dan laporan praktikum minggu ke-${m}.`,
        pengalamanBelajar: {
          tm: '2x50\' Teori + 1x170\' Praktikum',
          bt: '3x60\' Penyusunan Kertas Kerja Audit',
          bm: '3x60\' Studi Standar ISO 27001 & COBIT 2019'
        },
        kriteriaBentukPenilaian: 'Rubrik Praktikum & Kertas Kerja Audit',
        kategoriAsesmen: m % 4 === 0 ? 'Kuis & Tugas Terstruktur' : m < 8 ? 'Partisipatif (Case Method)' : 'Kolaboratif (Team-Based Project)',
        taksonomiBloom: 'C5, P4',
        bobotPenilaian: 5
      };
    })
  }
];
