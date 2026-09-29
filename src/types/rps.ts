export type RanahCPL = 'Sikap (S)' | 'Pengetahuan (P)' | 'Keterampilan Umum (KU)' | 'Keterampilan Khusus (KK)';

export type StatusRPS = 'Terotorisasi Penuh' | 'Menunggu Otorisasi Kaprodi' | 'Perlu Perbaikan OBE' | 'Draft Pengisian';

export interface InstitutionHeader {
  namaUniversitas: string;
  singkatan: string;
  fakultas: string;
  programStudi: string;
  jenjang: string;
  akreditasi: string;
  kampus1: string;
  kampus2: string;
  kampus3: string;
  website: string;
  email: string;
  kodeDokumenStandar: string;
}

export interface CourseIdentity {
  namaMk: string;
  kodeMk: string;
  rumpunMk: string;
  bobotSksTeori: number;
  bobotSksPraktikum: number;
  semester: number;
  tanggalPenyusunan: string;
  tahunAkademik: string;
  revisiKe: string;
}

export interface OfficialPerson {
  nama: string;
  nidn: string;
  jabatan: string;
  statusOtorisasi: 'Terverifikasi QR' | 'Menunggu Tanda Tangan' | 'Revisi';
  tanggalOtorisasi?: string;
  qrVerificationHash: string;
}

export interface AuthorizationBlock {
  dosenPengembang: OfficialPerson;
  koordinatorRmk: OfficialPerson;
  ketuaProdi: OfficialPerson;
}

export interface CPLItem {
  kode: string; // e.g., CPL01, CPL04, CPL07, CPL10
  ranah: RanahCPL;
  deskripsi: string;
  profilLulusanTerkait: string; // e.g., PL01 - System Analyst, PL02 - Enterprise Architect
}

export interface CPMKItem {
  kode: string; // e.g., CPMK1, CPMK2, CPMK3, CPMK4
  deskripsi: string;
  mappedCplCodes: string[]; // Must map to >= 1 CPL code
  bobotTargetPersen?: number;
}

export interface SubCPMKItem {
  kode: string; // e.g., Sub-CPMK1 .. Sub-CPMK7
  deskripsi: string;
  mappedCpmkCode: string; // Must map to 1 CPMK code
  taksonomiBloom: string; // e.g., C2, C3, C4, C5, C6, A3, P3, P4
}

export interface AcademicNotes {
  keselarasanCpl: string;
  kodeProfilLulusan: string;
  profilLulusanDeskripsi: string;
  pendekatanPembelajaran: 'Case-Based Learning (CBL)' | 'Project-Based Learning (PjBL)' | 'Hybrid Case-Based & Project-Based Learning';
  targetIku7Persen: number;
  kebijakanIntegritasAkademik: string;
}

export type MeetingType = 'REGULER' | 'UTS' | 'UAS';
export type AssessmentCategory = 'Partisipatif (Case Method)' | 'Kolaboratif (Team-Based Project)' | 'Kuis & Tugas Terstruktur' | 'UTS' | 'UAS';

export interface WeeklyMeeting {
  mingguKe: number; // 1 to 16
  tipePertemuan: MeetingType;
  subCpmkKode: string; // Sub-CPMK code or 'EVAL-UTS' / 'EVAL-UAS'
  kemampuanAkhir: string; // Kemampuan Akhir yang Direncanakan (Sub-CPMK)
  materiPembelajaran: string;
  bentukMetodePembelajaran: string;
  indikator: string;
  pengalamanBelajar: {
    tm: string; // Tatap Muka (1 sks = 50')
    bt: string; // Tugas Terstruktur (1 sks = 60')
    bm: string; // Belajar Mandiri (1 sks = 60')
  };
  kriteriaBentukPenilaian: string;
  kategoriAsesmen: AssessmentCategory;
  taksonomiBloom: string; // e.g., C3, A2, P3
  bobotPenilaian: number; // Percentage (0 - 100), total 1..16 must equal 100
}

export interface RPSDocument {
  id: string;
  status: StatusRPS;
  lastUpdated: string;
  progresPengisianPersen: number;
  institusi: InstitutionHeader;
  identitas: CourseIdentity;
  otorisasi: AuthorizationBlock;
  cplProdi: CPLItem[];
  cpmkList: CPMKItem[];
  subCpmkList: SubCPMKItem[];
  deskripsiMk: string;
  pokokBahasan: string[];
  pustakaUtama: string[];
  pustakaTambahan: string[];
  mediaPerangkatLunak: string[];
  mediaPerangkatKeras: string[];
  teamTeaching: string[];
  mkSyarat: string[];
  catatanAkademik: AcademicNotes;
  matriksPertemuan: WeeklyMeeting[];
}

export interface OBEValidationRuleResult {
  ruleId: string;
  kodeAturan: string;
  namaAturan: string;
  passed: boolean;
  severity: 'CRITICAL' | 'WARNING';
  nilaiSaatIni: string;
  targetStandar: string;
  pesanDetail: string;
  rekomendasiPerbaikan?: string;
}

export interface OBEValidationSummary {
  isValidObe: boolean;
  skorKepatuhan: number; // 0 - 100
  totalBobotAsesmen: number; // Must be 100
  bobotIku7PartisipatifProyek: number; // CBL + PjBL weight (>= 50% recommended by Dikti)
  bobotUts: number;
  bobotUas: number;
  bobotTugasKuis: number;
  jumlahPertemuanTerisi: number;
  unmappedCpmkCodes: string[];
  orphanCplCodes: string[];
  unmappedSubCpmkCodes: string[];
  rules: OBEValidationRuleResult[];
}
