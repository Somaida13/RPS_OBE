import { RPSDocument, OBEValidationSummary, OBEValidationRuleResult } from '../types/rps';

/**
 * Mesin Validasi Aturan Kurikulum Outcome-Based Education (OBE)
 * Standar Lembaga Penjaminan Mutu (LPM) Universitas Komputama (UNIKMA)
 * & Pedoman Penyusunan Kurikulum Pendidikan Tinggi (KPT / IKU-7)
 */
export function validateObeRps(rps: RPSDocument): OBEValidationSummary {
  const rules: OBEValidationRuleResult[] = [];

  // 1. Akumulasi Bobot Penilaian 16 Pertemuan === 100%
  const totalBobotAsesmen = Number(
    rps.matriksPertemuan.reduce((acc, row) => acc + (Number(row.bobotPenilaian) || 0), 0).toFixed(2)
  );
  const isBobot100 = Math.abs(totalBobotAsesmen - 100) < 0.01;
  const selisihBobot = Number((100 - totalBobotAsesmen).toFixed(2));

  rules.push({
    ruleId: 'OBE-RULE-01',
    kodeAturan: 'VAL-BOBOT-100',
    namaAturan: 'Akumulasi Total Bobot Penilaian 16 Pertemuan',
    passed: isBobot100,
    severity: 'CRITICAL',
    nilaiSaatIni: `${totalBobotAsesmen}%`,
    targetStandar: '100%',
    pesanDetail: isBobot100
      ? 'Total akumulasi bobot penilaian dari minggu ke-1 hingga minggu ke-16 tepat 100%.'
      : `Total bobot saat ini ${totalBobotAsesmen}% (${selisihBobot > 0 ? `kurang ${selisihBobot}%` : `lebih ${Math.abs(selisihBobot)}%`}). Wajib tepat 100%.`,
    rekomendasiPerbaikan: isBobot100
      ? undefined
      : `Sesuaikan bobot pertemuan atau gunakan tombol "Normalisasi Bobot ke 100%" pada tab Matriks 16 Pertemuan.`
  });

  // 2. Keterikatan Setiap CPMK ke Minimal 1 CPL Prodi (Backward Design Traceability)
  const validCplCodes = new Set(rps.cplProdi.map((c) => c.kode));
  const unmappedCpmkCodes = rps.cpmkList
    .filter((cpmk) => !cpmk.mappedCplCodes || cpmk.mappedCplCodes.filter((code) => validCplCodes.has(code)).length === 0)
    .map((cpmk) => cpmk.kode);

  const isAllCpmkMapped = rps.cpmkList.length > 0 && unmappedCpmkCodes.length === 0;
  rules.push({
    ruleId: 'OBE-RULE-02',
    kodeAturan: 'VAL-CPMK-CPL',
    namaAturan: 'Keterikatan CPMK terhadap CPL Program Studi',
    passed: isAllCpmkMapped,
    severity: 'CRITICAL',
    nilaiSaatIni: isAllCpmkMapped
      ? `${rps.cpmkList.length}/${rps.cpmkList.length} CPMK Terpetakan`
      : `${unmappedCpmkCodes.length} CPMK Belum Terikat (${unmappedCpmkCodes.join(', ')})`,
    targetStandar: '100% CPMK Terikat CPL',
    pesanDetail: isAllCpmkMapped
      ? 'Seluruh Capaian Pembelajaran Mata Kuliah (CPMK) diturunkan secara sah dari CPL Prodi Sistem Informasi.'
      : `Ditemukan CPMK yatim (orphan) yang tidak berelasi ke CPL manapun: ${unmappedCpmkCodes.join(', ')}.`,
    rekomendasiPerbaikan: isAllCpmkMapped
      ? undefined
      : `Petakan ${unmappedCpmkCodes.join(', ')} ke minimal satu kode CPL pada tab Komponen Kurikulum OBE.`
  });

  // 3. Keterikatan Seluruh CPL yang Dibebankan ke Minimal 1 CPMK (No Orphan CPL)
  const referencedCplCodes = new Set(rps.cpmkList.flatMap((c) => c.mappedCplCodes));
  const orphanCplCodes = rps.cplProdi
    .filter((cpl) => !referencedCplCodes.has(cpl.kode))
    .map((cpl) => cpl.kode);

  const isNoOrphanCpl = rps.cplProdi.length > 0 && orphanCplCodes.length === 0;
  rules.push({
    ruleId: 'OBE-RULE-03',
    kodeAturan: 'VAL-CPL-COVERAGE',
    namaAturan: 'Ketercapaian Seluruh CPL yang Dibebankan pada MK',
    passed: isNoOrphanCpl,
    severity: 'CRITICAL',
    nilaiSaatIni: isNoOrphanCpl
      ? `${rps.cplProdi.length}/${rps.cplProdi.length} CPL Terdistribusi`
      : `CPL Belum Diturunkan: ${orphanCplCodes.join(', ')}`,
    targetStandar: 'Semua CPL Dibebankan Memiliki CPMK',
    pesanDetail: isNoOrphanCpl
      ? 'Setiap CPL Prodi yang dibebankan pada mata kuliah ini telah diturunkan menjadi minimal 1 CPMK.'
      : `Terdapat CPL Prodi (${orphanCplCodes.join(', ')}) pada dokumen RPS yang belum diturunkan ke CPMK manapun.`,
    rekomendasiPerbaikan: isNoOrphanCpl
      ? undefined
      : `Hubungkan ${orphanCplCodes.join(', ')} pada salah satu CPMK di matriks pemetaan CPL-CPMK.`
  });

  // 4. Keterikatan Sub-CPMK ke CPMK Induk & Distribusi di Matriks Mingguan
  const validCpmkCodes = new Set(rps.cpmkList.map((c) => c.kode));
  const unmappedSubCpmkCodes = rps.subCpmkList
    .filter((sub) => !sub.mappedCpmkCode || !validCpmkCodes.has(sub.mappedCpmkCode))
    .map((sub) => sub.kode);

  const regularMeetings = rps.matriksPertemuan.filter((m) => m.tipePertemuan === 'REGULER');
  const meetingsWithoutSubCpmk = regularMeetings.filter((m) => !m.subCpmkKode || m.subCpmkKode.trim() === '');

  const isSubCpmkValid =
    rps.subCpmkList.length > 0 && unmappedSubCpmkCodes.length === 0 && meetingsWithoutSubCpmk.length === 0;

  rules.push({
    ruleId: 'OBE-RULE-04',
    kodeAturan: 'VAL-SUBCPMK-CHAIN',
    namaAturan: 'Rantai Penurunan CPMK → Sub-CPMK → Pertemuan Mingguan',
    passed: isSubCpmkValid,
    severity: 'CRITICAL',
    nilaiSaatIni: isSubCpmkValid
      ? `${rps.subCpmkList.length} Sub-CPMK & ${regularMeetings.length} Minggu Terhubung`
      : `${unmappedSubCpmkCodes.length} Sub-CPMK / ${meetingsWithoutSubCpmk.length} Minggu Bermasalah`,
    targetStandar: '100% Rantai Utuh',
    pesanDetail: isSubCpmkValid
      ? 'Seluruh Sub-CPMK menginduk ke CPMK yang sah dan terdistribusi penuh pada pertemuan reguler.'
      : 'Terdapat Sub-CPMK tanpa induk CPMK atau pertemuan reguler yang belum mencantumkan kode Sub-CPMK.',
    rekomendasiPerbaikan: isSubCpmkValid
      ? undefined
      : 'Pastikan setiap Sub-CPMK terhubung ke CPMK1..n dan setiap minggu reguler memiliki Sub-CPMK.'
  });

  // 5. Struktur Wajib UTS (Minggu ke-8) dan UAS (Minggu ke-16)
  const minggu8 = rps.matriksPertemuan.find((m) => m.mingguKe === 8);
  const minggu16 = rps.matriksPertemuan.find((m) => m.mingguKe === 16);
  const isUtsUasValid =
    Boolean(minggu8 && minggu8.tipePertemuan === 'UTS' && minggu8.bobotPenilaian > 0) &&
    Boolean(minggu16 && minggu16.tipePertemuan === 'UAS' && minggu16.bobotPenilaian > 0);

  const bobotUts = minggu8?.bobotPenilaian || 0;
  const bobotUas = minggu16?.bobotPenilaian || 0;

  rules.push({
    ruleId: 'OBE-RULE-05',
    kodeAturan: 'VAL-UTS-UAS-POS',
    namaAturan: 'Posisi & Bobot Evaluasi UTS (Minggu 8) dan UAS (Minggu 16)',
    passed: isUtsUasValid,
    severity: 'CRITICAL',
    nilaiSaatIni: `UTS M8 (${bobotUts}%) · UAS M16 (${bobotUas}%)`,
    targetStandar: 'Minggu 8 = UTS (>0%) & Minggu 16 = UAS (>0%)',
    pesanDetail: isUtsUasValid
      ? `Evaluasi Tengah Semester (UTS) terjadwal pada Minggu ke-8 (${bobotUts}%) dan Evaluasi Akhir Semester (UAS) pada Minggu ke-16 (${bobotUas}%).`
      : 'Minggu ke-8 wajib bertipe UTS dan Minggu ke-16 wajib bertipe UAS dengan bobot > 0%.',
    rekomendasiPerbaikan: isUtsUasValid
      ? undefined
      : 'Tetapkan Minggu ke-8 sebagai UTS dan Minggu ke-16 sebagai UAS beserta bobot asesmennya.'
  });

  // 6. Kepatuhan IKU-7 Pendidikan Tinggi (Bobot Partisipatif CBL + Proyek PjBL >= 50%)
  const bobotIku7PartisipatifProyek = Number(
    rps.matriksPertemuan
      .filter(
        (m) =>
          m.kategoriAsesmen === 'Partisipatif (Case Method)' ||
          m.kategoriAsesmen === 'Kolaboratif (Team-Based Project)'
      )
      .reduce((acc, m) => acc + (Number(m.bobotPenilaian) || 0), 0)
      .toFixed(2)
  );

  const bobotTugasKuis = Number(
    rps.matriksPertemuan
      .filter((m) => m.kategoriAsesmen === 'Kuis & Tugas Terstruktur')
      .reduce((acc, m) => acc + (Number(m.bobotPenilaian) || 0), 0)
      .toFixed(2)
  );

  const isIku7Compliant = bobotIku7PartisipatifProyek >= 50;
  rules.push({
    ruleId: 'OBE-RULE-06',
    kodeAturan: 'VAL-IKU7-CBL-PJBL',
    namaAturan: 'Proporsi Asesmen Partisipatif (CBL) & Proyek Kolaboratif (PjBL)',
    passed: isIku7Compliant,
    severity: 'WARNING',
    nilaiSaatIni: `${bobotIku7PartisipatifProyek}% (CBL + PjBL)`,
    targetStandar: '≥ 50% Total Nilai Akhir',
    pesanDetail: isIku7Compliant
      ? `Memenuhi standar IKU-7 Kemdiktisaintek & OBE UNIKMA: ${bobotIku7PartisipatifProyek}% nilai akhir berasal dari aktivitas partisipatif studi kasus dan/atau berbasis proyek.`
      : `Proporsi Case Method + Team-Based Project baru mencapai ${bobotIku7PartisipatifProyek}% (di bawah ambang batas 50% IKU-7).`,
    rekomendasiPerbaikan: isIku7Compliant
      ? undefined
      : 'Tingkatkan porsi penilaian Partisipatif (Case Method) atau Kolaboratif (Team-Based Project) hingga minimal 50%.'
  });

  // 7. Kelengkapan 16 Pertemuan, Estimasi Waktu (TM/BT/BM), & Taksonomi Bloom
  const jumlahPertemuanTerisi = rps.matriksPertemuan.filter(
    (m) =>
      m.kemampuanAkhir.trim() !== '' &&
      m.materiPembelajaran.trim() !== '' &&
      m.indikator.trim() !== '' &&
      m.pengalamanBelajar.tm.trim() !== '' &&
      m.taksonomiBloom.trim() !== ''
  ).length;

  const isFull16Meetings = rps.matriksPertemuan.length === 16 && jumlahPertemuanTerisi === 16;
  rules.push({
    ruleId: 'OBE-RULE-07',
    kodeAturan: 'VAL-16-MINGGU',
    namaAturan: 'Kelengkapan Matriks 16 Pertemuan, Beban TM/BT/BM & Gradasi Bloom',
    passed: isFull16Meetings,
    severity: 'CRITICAL',
    nilaiSaatIni: `${jumlahPertemuanTerisi}/16 Pertemuan Lengkap`,
    targetStandar: '16/16 Pertemuan Lengkap',
    pesanDetail: isFull16Meetings
      ? 'Seluruh 16 minggu pertemuan memiliki Sub-CPMK, Materi, Indikator, alokasi waktu TM/BT/BM (1 sks = 50\'/60\'/60\'), dan level Taksonomi Bloom (C/A/P).'
      : `Baru ${jumlahPertemuanTerisi} dari 16 minggu pertemuan yang terisi lengkap.`,
    rekomendasiPerbaikan: isFull16Meetings
      ? undefined
      : 'Lengkapi deskripsi materi, indikator, estimasi waktu TM/BT/BM, dan kode Taksonomi Bloom pada setiap minggu.'
  });

  // 8. Kelengkapan Blok Otorisasi 3 Pejabat Akademik UNIKMA
  const isOtorisasiComplete =
    Boolean(rps.otorisasi.dosenPengembang.nama.trim()) &&
    Boolean(rps.otorisasi.koordinatorRmk.nama.trim()) &&
    Boolean(rps.otorisasi.ketuaProdi.nama.trim());

  const verifiedCount = [
    rps.otorisasi.dosenPengembang.statusOtorisasi,
    rps.otorisasi.koordinatorRmk.statusOtorisasi,
    rps.otorisasi.ketuaProdi.statusOtorisasi
  ].filter((s) => s === 'Terverifikasi QR').length;

  rules.push({
    ruleId: 'OBE-RULE-08',
    kodeAturan: 'VAL-OTORISASI-UNIKMA',
    namaAturan: 'Blok Otorisasi Pejabat Akademik & QR Digital UNIKMA',
    passed: isOtorisasiComplete,
    severity: 'WARNING',
    nilaiSaatIni: `${verifiedCount}/3 Pejabat Terverifikasi QR`,
    targetStandar: 'Dosen Pengembang, Koordinator RMK, Kaprodi SI',
    pesanDetail: isOtorisasiComplete
      ? `Blok otorisasi lengkap (${verifiedCount}/3 tanda tangan QR terverifikasi).`
      : 'Identitas Dosen Pengembang RPS, Koordinator RMK, atau Ketua Prodi SI belum lengkap.'
  });

  const criticalFailed = rules.filter((r) => r.severity === 'CRITICAL' && !r.passed).length;
  const passedCount = rules.filter((r) => r.passed).length;
  const skorKepatuhan = Math.round((passedCount / rules.length) * 100);

  return {
    isValidObe: criticalFailed === 0,
    skorKepatuhan,
    totalBobotAsesmen,
    bobotIku7PartisipatifProyek,
    bobotUts,
    bobotUas,
    bobotTugasKuis,
    jumlahPertemuanTerisi,
    unmappedCpmkCodes,
    orphanCplCodes,
    unmappedSubCpmkCodes,
    rules
  };
}
