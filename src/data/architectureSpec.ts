export const PRISMA_SCHEMA_SPEC = `// ============================================================================
// PRISMA SCHEMA: SISTEM MANAJEMEN RPS BERBASIS OBE UNIVERSITAS KOMPUTAMA (UNIKMA)
// Fakultas Sains dan Teknologi - Program Studi S1 Sistem Informasi
// Database: PostgreSQL 16
// ============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum RanahCpl {
  SIKAP
  PENGETAHUAN
  KETERAMPILAN_UMUM
  KETERAMPILAN_KHUSUS
}

enum RpsStatus {
  DRAFT
  SUBMITTED_RMK
  REVISION_REQUIRED
  WAITING_KAPRODI
  AUTHORIZED_PUBLISHED
}

enum MeetingType {
  REGULER
  UTS
  UAS
}

enum AssessmentCategory {
  CASE_METHOD_PARTICIPATIVE   // IKU-7: Partisipatif (CBL)
  TEAM_BASED_PROJECT          // IKU-7: Kolaboratif (PjBL)
  STRUCTURED_ASSIGNMENT_QUIZ  // Tugas Terstruktur / Kuis
  MIDTERM_EXAM_UTS            // Evaluasi Tengah Semester (Minggu 8)
  FINAL_EXAM_UAS              // Evaluasi Akhir Semester (Minggu 16)
}

enum AuthRole {
  DOSEN_PENGEMBANG
  KOORDINATOR_RMK
  KETUA_PRODI
}

enum SignStatus {
  PENDING
  REVISION
  SIGNED_QR_VERIFIED
}

// 1. Master Institusi & Kampus UNIKMA
model InstitutionProfile {
  id                  String         @id @default(uuid())
  namaUniversitas     String         @default("UNIVERSITAS KOMPUTAMA")
  singkatan           String         @default("UNIKMA")
  fakultas            String         @default("FAKULTAS SAINS DAN TEKNOLOGI")
  programStudi        String         @default("PROGRAM STUDI S1 SISTEM INFORMASI")
  alamatKampus1       String         // Jl. Raya Cimanggu - Majenang KM. 04, Cilacap
  alamatKampus2       String         // Jl. Raya Karangpucung - Sidareja KM. 02, Cilacap
  alamatKampus3       String         // Jl. Perintis Kemerdekaan No. 48, Cilacap
  kodeFormulirMutu    String         @default("FM-LPM-UNIKMA-AKD-04/R2")
  rpsDocuments        RpsDocument[]
  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt

  @@map("institution_profiles")
}

// 2. Master Dosen & Pejabat Otorisasi (RMK / Kaprodi)
model Lecturer {
  id                  String             @id @default(uuid())
  nidn                String             @unique
  nipYayasan          String?            @unique
  namaLengkapGelar    String
  emailInstitusi      String             @unique
  jabatanFungsional   String?
  isKaprodi           Boolean            @default(false)
  isKoordinatorRmk    Boolean            @default(false)
  rumpunBidangIlmu    String?
  rpsDeveloped        RpsDocument[]      @relation("LeadDeveloper")
  rpsTeamTeachings    RpsTeamTeaching[]
  rpsAuthorizations   RpsAuthorization[]
  createdAt           DateTime           @default(now())

  @@map("lecturers")
}

// 3. Master Profil Lulusan (PL) & Capaian Pembelajaran Lulusan (CPL Prodi SI)
model GraduateProfile {
  id                  String      @id @default(uuid())
  kodePl              String      @unique // e.g., PL01, PL02, PL03
  namaProfil          String      // e.g., Information Systems Analyst
  deskripsi           String      @db.Text
  cpls                CplMaster[]

  @@map("graduate_profiles")
}

model CplMaster {
  id                  String          @id @default(uuid())
  kodeCpl             String          @unique // e.g., CPL01, CPL04, CPL07, CPL10
  ranah               RanahCpl
  deskripsi           String          @db.Text
  graduateProfileId   String
  graduateProfile     GraduateProfile @relation(fields: [graduateProfileId], references: [id])
  rpsCplMappings      RpsCplMapping[]
  cpmkCplPivots       RpsCpmkCplPivot[]

  @@map("cpl_masters")
}

// 4. Master Mata Kuliah & Prasyarat
model Course {
  id                  String            @id @default(uuid())
  kodeMk              String            @unique // e.g., K572101
  namaMk              String
  rumpunMk            String
  sksTeori            Int               @default(2)
  sksPraktikum        Int               @default(1)
  semester            Int
  rpsDocuments        RpsDocument[]
  prerequisites       CoursePrerequisite[] @relation("TargetCourse")
  requiredFor         CoursePrerequisite[] @relation("PrerequisiteCourse")

  @@map("courses")
}

model CoursePrerequisite {
  id                  String   @id @default(uuid())
  courseId            String
  prerequisiteId      String
  course              Course   @relation("TargetCourse", fields: [courseId], references: [id], onDelete: Cascade)
  prerequisite        Course   @relation("PrerequisiteCourse", fields: [prerequisiteId], references: [id], onDelete: Restrict)

  @@unique([courseId, prerequisiteId])
  @@map("course_prerequisites")
}

// 5. Dokumen Utama RPS (Header, Deskripsi, Catatan Akademik OBE)
model RpsDocument {
  id                        String              @id @default(uuid())
  institutionId             String
  courseId                  String
  leadLecturerId            String
  tahunAkademik             String              // e.g., "2026/2027 Ganjil"
  revisiKe                  String              @default("01")
  tanggalPenyusunan         DateTime            @default(now())
  status                    RpsStatus           @default(DRAFT)
  progresPersen             Int                 @default(0)
  deskripsiMk               String              @db.Text
  pokokBahasanJson          Json                // Array of core topics
  mediaPerangkatLunakJson   Json                // Software list
  mediaPerangkatKerasJson   Json                // Hardware list
  pendekatanPembelajaran    String              // CBL / PjBL / Hybrid
  keselarasanCplNarasi      String              @db.Text
  kodeProfilLulusan         String
  deskripsiProfilLulusan    String              @db.Text
  totalBobotTervalidasi     Decimal             @default(0.00) @db.Decimal(5, 2)
  isObeValid                Boolean             @default(false)

  institution               InstitutionProfile  @relation(fields: [institutionId], references: [id])
  course                    Course              @relation(fields: [courseId], references: [id])
  leadLecturer              Lecturer            @relation("LeadDeveloper", fields: [leadLecturerId], references: [id])
  cplMappings               RpsCplMapping[]
  cpmks                     RpsCpmk[]
  subCpmks                  RpsSubCpmk[]
  weeklyMatrices            RpsWeeklyMatrix[]
  references                RpsReference[]
  teamTeachings             RpsTeamTeaching[]
  authorizations            RpsAuthorization[]
  updatedAt                 DateTime            @updatedAt

  @@unique([courseId, tahunAkademik, revisiKe])
  @@map("rps_documents")
}

// 6. Pemetaan CPL yang Dibebankan pada RPS
model RpsCplMapping {
  id            String      @id @default(uuid())
  rpsId         String
  cplId         String
  rps           RpsDocument @relation(fields: [rpsId], references: [id], onDelete: Cascade)
  cpl           CplMaster   @relation(fields: [cplId], references: [id], onDelete: Restrict)

  @@unique([rpsId, cplId])
  @@map("rps_cpl_mappings")
}

// 7. Capaian Pembelajaran Mata Kuliah (CPMK) & Relasi M:N ke CPL
model RpsCpmk {
  id                String            @id @default(uuid())
  rpsId             String
  kodeCpmk          String            // e.g., CPMK1, CPMK2, CPMK3, CPMK4
  deskripsi         String            @db.Text
  bobotTargetPersen Decimal           @default(0.00) @db.Decimal(5, 2)
  rps               RpsDocument       @relation(fields: [rpsId], references: [id], onDelete: Cascade)
  cplPivots         RpsCpmkCplPivot[]
  subCpmks          RpsSubCpmk[]

  @@unique([rpsId, kodeCpmk])
  @@map("rps_cpmks")
}

model RpsCpmkCplPivot {
  id        String    @id @default(uuid())
  cpmkId    String
  cplId     String
  cpmk      RpsCpmk   @relation(fields: [cpmkId], references: [id], onDelete: Cascade)
  cpl       CplMaster @relation(fields: [cplId], references: [id], onDelete: Restrict)

  @@unique([cpmkId, cplId])
  @@map("rps_cpmk_cpl_pivots")
}

// 8. Kemampuan Akhir yang Direncanakan (Sub-CPMK) & Gradasi Bloom
model RpsSubCpmk {
  id              String            @id @default(uuid())
  rpsId           String
  cpmkId          String
  kodeSubCpmk     String            // e.g., Sub-CPMK1 .. Sub-CPMK7
  deskripsi       String            @db.Text
  taksonomiBloom  String            // e.g., "C4, A3, P3"
  rps             RpsDocument       @relation(fields: [rpsId], references: [id], onDelete: Cascade)
  cpmk            RpsCpmk           @relation(fields: [cpmkId], references: [id], onDelete: Cascade)
  weeklyMeetings  RpsWeeklyMatrix[]

  @@unique([rpsId, kodeSubCpmk])
  @@map("rps_sub_cpmks")
}

// 9. Matriks Pembelajaran 16 Pertemuan (Minggu 1 - 16 termasuk UTS & UAS)
model RpsWeeklyMatrix {
  id                        String             @id @default(uuid())
  rpsId                     String
  subCpmkId                 String?            // Nullable khusus baris UTS (M8) & UAS (M16)
  mingguKe                  Int                // Constraint: 1 <= mingguKe <= 16
  tipePertemuan             MeetingType        @default(REGULER)
  kemampuanAkhir            String             @db.Text
  materiPembelajaran        String             @db.Text
  bentukMetodePembelajaran  String             @db.Text
  indikatorPenilaian        String             @db.Text
  pengalamanBelajarTm       String             // Tatap Muka (1 sks = 50')
  pengalamanBelajarBt       String             // Tugas Terstruktur (1 sks = 60')
  pengalamanBelajarBm       String             // Belajar Mandiri (1 sks = 60')
  kriteriaBentukPenilaian   String             @db.Text
  kategoriAsesmen           AssessmentCategory
  taksonomiBloom            String             // C1-C6, A1-A5, P1-P5
  bobotPenilaian            Decimal            @db.Decimal(5, 2) // Total M1..M16 wajib = 100.00%

  rps                       RpsDocument        @relation(fields: [rpsId], references: [id], onDelete: Cascade)
  subCpmk                   RpsSubCpmk?        @relation(fields: [subCpmkId], references: [id], onDelete: SetNull)

  @@unique([rpsId, mingguKe])
  @@map("rps_weekly_matrices")
}

// 10. Pustaka (Utama & Tambahan), Team Teaching, dan Blok Otorisasi QR
model RpsReference {
  id            String      @id @default(uuid())
  rpsId         String
  jenisPustaka  String      // "UTAMA" | "TAMBAHAN"
  sitasiApa     String      @db.Text
  urutan        Int
  rps           RpsDocument @relation(fields: [rpsId], references: [id], onDelete: Cascade)

  @@map("rps_references")
}

model RpsTeamTeaching {
  id          String      @id @default(uuid())
  rpsId       String
  lecturerId  String
  peran       String      @default("Anggota Tim Pengampu")
  rps         RpsDocument @relation(fields: [rpsId], references: [id], onDelete: Cascade)
  lecturer    Lecturer    @relation(fields: [lecturerId], references: [id])

  @@unique([rpsId, lecturerId])
  @@map("rps_team_teachings")
}

model RpsAuthorization {
  id                  String      @id @default(uuid())
  rpsId               String
  lecturerId          String
  roleOtorisasi       AuthRole    // DOSEN_PENGEMBANG | KOORDINATOR_RMK | KETUA_PRODI
  status              SignStatus  @default(PENDING)
  qrVerificationHash  String      @unique
  catatanRevisi       String?     @db.Text
  signedAt            DateTime?
  rps                 RpsDocument @relation(fields: [rpsId], references: [id], onDelete: Cascade)
  lecturer            Lecturer    @relation(fields: [lecturerId], references: [id])

  @@unique([rpsId, roleOtorisasi])
  @@map("rps_authorizations")
}`;

export const SQL_DDL_SPEC = `-- ============================================================================
-- POSTGRESQL 16 DDL + OBE INTEGRITY TRIGGERS
-- Universitas Komputama (UNIKMA) - Fakultas Sains dan Teknologi
-- ============================================================================

CREATE TABLE rps_weekly_matrices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rps_id UUID NOT NULL REFERENCES rps_documents(id) ON DELETE CASCADE,
    sub_cpmk_id UUID REFERENCES rps_sub_cpmks(id) ON DELETE SET NULL,
    minggu_ke SMALLINT NOT NULL CHECK (minggu_ke BETWEEN 1 AND 16),
    tipe_pertemuan VARCHAR(16) NOT NULL CHECK (tipe_pertemuan IN ('REGULER', 'UTS', 'UAS')),
    kemampuan_akhir TEXT NOT NULL,
    materi_pembelajaran TEXT NOT NULL,
    bentuk_metode_pembelajaran TEXT NOT NULL,
    indikator_penilaian TEXT NOT NULL,
    pengalaman_belajar_tm VARCHAR(255) NOT NULL, -- 1 SKS = 50 Menit TM
    pengalaman_belajar_bt VARCHAR(255) NOT NULL, -- 1 SKS = 60 Menit BT
    pengalaman_belajar_bm VARCHAR(255) NOT NULL, -- 1 SKS = 60 Menit BM
    kriteria_bentuk_penilaian TEXT NOT NULL,
    kategori_asesmen VARCHAR(40) NOT NULL,
    taksonomi_bloom VARCHAR(32) NOT NULL,        -- Gradasi C1-C6, A1-A5, P1-P5
    bobot_penilaian NUMERIC(5,2) NOT NULL CHECK (bobot_penilaian >= 0 AND bobot_penilaian <= 100),
    CONSTRAINT uq_rps_minggu UNIQUE (rps_id, minggu_ke),
    -- Constraint wajib UTS di minggu 8 & UAS di minggu 16
    CONSTRAINT chk_uts_uas_week CHECK (
        (minggu_ke = 8 AND tipe_pertemuan = 'UTS') OR
        (minggu_ke = 16 AND tipe_pertemuan = 'UAS') OR
        (minggu_ke NOT IN (8, 16) AND tipe_pertemuan = 'REGULER')
    )
);

-- TRIGGER FUNCTION: Memvalidasi Akumulasi Total Bobot 16 Pertemuan = 100%
-- saat status dokumen RPS akan diubah menjadi AUTHORIZED_PUBLISHED
CREATE OR REPLACE FUNCTION fn_validate_obe_rps_before_publish()
RETURNS TRIGGER AS $$
DECLARE
    v_total_bobot NUMERIC(5,2);
    v_jumlah_minggu INT;
    v_unmapped_cpmk INT;
BEGIN
    IF NEW.status = 'AUTHORIZED_PUBLISHED' THEN
        -- 1. Cek jumlah pertemuan wajib 16 minggu dan total bobot = 100.00%
        SELECT COALESCE(SUM(bobot_penilaian), 0), COUNT(*)
        INTO v_total_bobot, v_jumlah_minggu
        FROM rps_weekly_matrices
        WHERE rps_id = NEW.id;

        IF v_jumlah_minggu <> 16 THEN
            RAISE EXCEPTION 'OBE_VALIDATION_ERROR: Matriks pertemuan wajib berjumlah 16 minggu (saat ini: % minggu).', v_jumlah_minggu;
        END IF;

        IF v_total_bobot <> 100.00 THEN
            RAISE EXCEPTION 'OBE_VALIDATION_ERROR: Total akumulasi bobot penilaian wajib tepat 100.00%% (saat ini: %%)', v_total_bobot;
        END IF;

        -- 2. Cek apakah ada CPMK yang tidak terikat ke CPL Prodi
        SELECT COUNT(*)
        INTO v_unmapped_cpmk
        FROM rps_cpmks c
        LEFT JOIN rps_cpmk_cpl_pivots p ON p.cpmk_id = c.id
        WHERE c.rps_id = NEW.id AND p.id IS NULL;

        IF v_unmapped_cpmk > 0 THEN
            RAISE EXCEPTION 'OBE_VALIDATION_ERROR: Terdapat % CPMK yang belum dipetakan ke CPL Program Studi.', v_unmapped_cpmk;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_obe_rps_publish
BEFORE UPDATE OF status ON rps_documents
FOR EACH ROW
EXECUTE FUNCTION fn_validate_obe_rps_before_publish();`;

export const BACKEND_VALIDATION_SPEC = `// ============================================================================
// BACKEND SERVICE & CONTROLLER: OBE VALIDATION & QR AUTHORIZATION ENGINE
// File: src/services/obeValidation.service.ts
// ============================================================================

import { Request, Response } from 'express';
import crypto from 'crypto';

export interface ObeValidationPayload {
  kodeMk: string;
  cplCodes: string[];
  cpmkList: Array<{ kode: string; mappedCplCodes: string[] }>;
  subCpmkList: Array<{ kode: string; mappedCpmkCode: string; taksonomiBloom: string }>;
  matriksPertemuan: Array<{
    mingguKe: number;
    tipePertemuan: 'REGULER' | 'UTS' | 'UAS';
    subCpmkKode: string;
    kategoriAsesmen: string;
    bobotPenilaian: number;
  }>;
}

export class ObeCurriculumValidatorService {
  /**
   * Memvalidasi kesesuaian dokumen RPS terhadap standar OBE UNIKMA & IKU-7 Dikti
   */
  public static validateRpsPayload(payload: ObeValidationPayload) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Validasi Akumulasi Total Bobot Penilaian = 100%
    const totalBobot = Number(
      payload.matriksPertemuan.reduce((sum, m) => sum + Number(m.bobotPenilaian || 0), 0).toFixed(2)
    );
    if (Math.abs(totalBobot - 100) > 0.001) {
      errors.push(
        \`[VAL-BOBOT-100] Total bobot penilaian 16 pertemuan adalah \${totalBobot}% (Wajib tepat 100.00%).\`
      );
    }

    // 2. Validasi Keterikatan Setiap CPMK ke Minimal 1 CPL Prodi
    const registeredCpls = new Set(payload.cplCodes);
    for (const cpmk of payload.cpmkList) {
      const validLinks = cpmk.mappedCplCodes.filter((code) => registeredCpls.has(code));
      if (validLinks.length === 0) {
        errors.push(
          \`[VAL-CPMK-CPL] \${cpmk.kode} tidak memiliki keterikatan ke CPL Program Studi manapun.\`
        );
      }
    }

    // 3. Validasi Ketercapaian Seluruh CPL yang Dibebankan (No Orphan CPL)
    const usedCpls = new Set(payload.cpmkList.flatMap((c) => c.mappedCplCodes));
    for (const cplCode of payload.cplCodes) {
      if (!usedCpls.has(cplCode)) {
        errors.push(
          \`[VAL-CPL-ORPHAN] \${cplCode} dibebankan pada MK namun belum diturunkan ke CPMK manapun.\`
        );
      }
    }

    // 4. Validasi Posisi Evaluasi UTS (Minggu 8) & UAS (Minggu 16)
    const m8 = payload.matriksPertemuan.find((m) => m.mingguKe === 8);
    const m16 = payload.matriksPertemuan.find((m) => m.mingguKe === 16);
    if (!m8 || m8.tipePertemuan !== 'UTS' || m8.bobotPenilaian <= 0) {
      errors.push('[VAL-UTS-M8] Minggu ke-8 wajib berupa Evaluasi Tengah Semester (UTS) dengan bobot > 0%.');
    }
    if (!m16 || m16.tipePertemuan !== 'UAS' || m16.bobotPenilaian <= 0) {
      errors.push('[VAL-UAS-M16] Minggu ke-16 wajib berupa Evaluasi Akhir Semester (UAS) dengan bobot > 0%.');
    }

    // 5. Validasi Proporsi Case-Based & Project-Based Learning (IKU-7 >= 50%)
    const bobotIku7 = payload.matriksPertemuan
      .filter((m) => m.kategoriAsesmen.includes('Partisipatif') || m.kategoriAsesmen.includes('Kolaboratif'))
      .reduce((sum, m) => sum + Number(m.bobotPenilaian || 0), 0);

    if (bobotIku7 < 50) {
      warnings.push(
        \`[VAL-IKU7-RATIO] Proporsi asesmen Partisipatif (CBL) + Proyek (PjBL) baru mencapai \${bobotIku7}% (Standar IKU-7 >= 50%).\`
      );
    }

    return {
      valid: errors.length === 0,
      totalBobot,
      bobotIku7,
      errors,
      warnings,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Menghasilkan Hash QR Otorisasi Kriptografis Pejabat Akademik UNIKMA
   */
  public static generateAuthorizationQrHash(kodeMk: string, nidn: string, role: string): string {
    const hmac = crypto
      .createHash('sha256')
      .update(\`UNIKMA-FST-SI:\${kodeMk}:\${nidn}:\${role}:\${Date.now()}\`)
      .digest('hex')
      .substring(0, 8)
      .toUpperCase();
    return \`UNIKMA-QR-RPS-\${kodeMk}-\${role}-\${hmac}\`;
  }
}`;

export const PYTHON_DOCX_GENERATOR_SPEC = `# ============================================================================
# PYTHON-DOCX GENERATOR SCRIPT: EXPORT DATA RPS KE DOKUMEN WORD RESMI UNIKMA
# File: scripts/unikma_rps_docx_generator.py
# ============================================================================

from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_shading(cell, color_hex: str):
    """Memberikan warna latar belakang sel tabel sesuai standar form mutu UNIKMA"""
    shading_elm = OxmlElement('w:shd')
    shading_elm.set(qn('w:val'), 'clear')
    shading_elm.set(qn('w:color'), 'auto')
    shading_elm.set(qn('w:fill'), color_hex)
    cell._tc.get_or_add_tcPr().append(shading_elm)

def generate_unikma_rps_docx(rps_data: dict, output_path: str):
    doc = Document()

    # Konfigurasi Halaman A4 Landscape untuk Matriks 16 Pertemuan UNIKMA
    section = doc.sections[0]
    section.page_width = Cm(29.7)
    section.page_height = Cm(21.0)
    section.top_margin = Cm(1.2)
    section.bottom_margin = Cm(1.2)
    section.left_margin = Cm(1.5)
    section.right_margin = Cm(1.5)

    # 1. TABEL HEADER KOP INSTITUSI & IDENTITAS MATA KULIAH
    header_table = doc.add_table(rows=4, cols=7)
    header_table.style = 'Table Grid'
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Baris 0: Logo & Identitas Universitas Komputama (Kampus I, II, III)
    cell_logo = header_table.cell(0, 0)
    cell_logo.text = "LOGO\\nUNIKMA"
    cell_inst = header_table.cell(0, 1).merge(header_table.cell(0, 5))
    set_cell_shading(cell_inst, "0F172A")
    p_inst = cell_inst.paragraphs[0]
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = p_inst.add_run(
        f"{rps_data['institusi']['namaUniversitas']} ({rps_data['institusi']['singkatan']})\\n"
        f"{rps_data['institusi']['fakultas']} - {rps_data['institusi']['programStudi']}\\n"
    )
    run_title.bold = True
    run_title.font.size = Pt(11)
    run_title.font.color.rgb = RGBColor(255, 255, 255)

    run_addr = p_inst.add_run(
        f"{rps_data['institusi']['kampus1']}\\n"
        f"{rps_data['institusi']['kampus2']}\\n"
        f"{rps_data['institusi']['kampus3']}"
    )
    run_addr.font.size = Pt(7.5)
    run_addr.font.color.rgb = RGBColor(226, 232, 240)

    cell_doc_code = header_table.cell(0, 6)
    cell_doc_code.text = f"Kode Dokumen:\\n{rps_data['institusi']['kodeDokumenStandar']}"

    # Baris 1: Judul RENCANA PEMBELAJARAN SEMESTER (RPS)
    cell_rps_banner = header_table.cell(1, 0).merge(header_table.cell(1, 6))
    set_cell_shading(cell_rps_banner, "1E293B")
    p_banner = cell_rps_banner.paragraphs[0]
    p_banner.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_banner = p_banner.add_run("RENCANA PEMBELAJARAN SEMESTER (RPS)")
    r_banner.bold = True
    r_banner.font.size = Pt(12)
    r_banner.font.color.rgb = RGBColor(255, 255, 255)

    # Baris 2 & 3: Identitas Mata Kuliah (Nama MK, Kode MK, Rumpun MK, Bobot SKS, Semester, Tgl Penyusunan)
    headers_mk = ["MATA KULIAH (MK)", "KODE MK", "RUMPUN MK", "BOBOT (SKS)", "SEMESTER", "TGL PENYUSUNAN", "REVISI"]
    ident = rps_data['identitas']
    values_mk = [
        ident['namaMk'],
        ident['kodeMk'],
        ident['rumpunMk'],
        f"T={ident['bobotSksTeori']} SKS | P={ident['bobotSksPraktikum']} SKS",
        str(ident['semester']),
        ident['tanggalPenyusunan'],
        ident['revisiKe']
    ]
    for idx, text in enumerate(headers_mk):
        c = header_table.cell(2, idx)
        set_cell_shading(c, "E2E8F0")
        c.text = text
        header_table.cell(3, idx).text = values_mk[idx]

    doc.add_paragraph()

    # 2. TABEL MATRIKS PEMBELAJARAN 16 PERTEMUAN
    cols_title = [
        "Mg Ke-",
        "Kemampuan Akhir yang Direncanakan (Sub-CPMK)",
        "Materi Pembelajaran [Pustaka]",
        "Bentuk & Metode Pembelajaran",
        "Indikator Penilaian",
        "Pengalaman Belajar (TM / BT / BM)",
        "Kriteria & Bentuk Penilaian",
        "Bobot (%)"
    ]
    matrix_table = doc.add_table(rows=1, cols=8)
    matrix_table.style = 'Table Grid'
    hdr_cells = matrix_table.rows[0].cells
    for i, col_name in enumerate(cols_title):
        hdr_cells[i].text = col_name
        set_cell_shading(hdr_cells[i], "0F172A")

    for row in rps_data['matriksPertemuan']:
        r_cells = matrix_table.add_row().cells
        r_cells[0].text = str(row['mingguKe'])
        r_cells[1].text = f"[{row['subCpmkKode']} | {row['taksonomiBloom']}]\\n{row['kemampuanAkhir']}"
        r_cells[2].text = row['materiPembelajaran']
        r_cells[3].text = row['bentukMetodePembelajaran']
        r_cells[4].text = row['indikator']
        pb = row['pengalamanBelajar']
        r_cells[5].text = f"TM: {pb['tm']}\\nBT: {pb['bt']}\\nBM: {pb['bm']}"
        r_cells[6].text = row['kriteriaBentukPenilaian']
        r_cells[7].text = f"{row['bobotPenilaian']}%"

    # Footer Keterangan Tatap Muka & Gradasi Taksonomi Bloom
    footer_note = doc.add_paragraph(
        "Keterangan Beban Waktu Pembelajaran (SN-Dikti): 1 SKS = 50' Tatap Muka (TM), "
        "60' Tugas Terstruktur (BT), 60' Belajar Mandiri (BM). | "
        "Gradasi Taksonomi Bloom: C (Kognitif: C1-Mengingat s/d C6-Mencipta), "
        "A (Afektif: A1-Menerima s/d A5-Mengamalkan), P (Psikomotorik: P1-Meniru s/d P5-Naturalisasi)."
    )
    footer_note.style.font.size = Pt(8.5)
    doc.save(output_path)
    return output_path`;
