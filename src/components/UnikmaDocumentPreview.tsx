import React, { useRef, useState } from 'react';
import { Printer, FileDown, FileCode2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { RPSDocument, OBEValidationSummary } from '../types/rps';
import { UnikmaLogoEmblem, UnikmaAuthorizationQr } from './UnikmaVisuals';
import { generateOfficialUnikmaPdf } from '../utils/pdfGenerator';
import { generateOfficialUnikmaDocx } from '../utils/docxGenerator';

interface UnikmaDocumentPreviewProps {
  rps: RPSDocument;
  validation: OBEValidationSummary;
  onAuthorizeRole: (role: 'dosenPengembang' | 'koordinatorRmk' | 'ketuaProdi') => void;
}

export const UnikmaDocumentPreview: React.FC<UnikmaDocumentPreviewProps> = ({
  rps,
  validation,
  onAuthorizeRole
}) => {
  const docContainerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState<string | null>(null);

  const handlePrintPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const fileName = generateOfficialUnikmaPdf(rps, validation);
      setDownloadedFileName(fileName);
      setTimeout(() => setDownloadedFileName(null), 6000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleExportWordDoc = async () => {
    setIsGeneratingDocx(true);
    try {
      const fileName = await generateOfficialUnikmaDocx(rps, validation);
      setDownloadedFileName(fileName);
      setTimeout(() => setDownloadedFileName(null), 6000);
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      standard: 'OBE-UNIKMA-FST-SI-v2026',
      validationSummary: validation,
      rpsDocument: rps
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RPS_DATA_${rps.identitas.kodeMk}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalSks = rps.identitas.bobotSksTeori + rps.identitas.bobotSksPraktikum;

  return (
    <div className="space-y-5">
      {/* Action Bar (Hidden in Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-lg p-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold text-slate-900">
              Dokumen Resmi Rencana Pembelajaran Semester (RPS) — Templat Standar UNIKMA
            </h2>
            <span className="text-xs text-slate-500 font-mono-num">
              · {rps.institusi.kodeDokumenStandar}
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Format A4 Landscape presisi sesuai pedoman Lembaga Penjaminan Mutu (LPM) Universitas Komputama.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileCode2 className="w-4 h-4" />
            Export JSON Mentah
          </button>
          <button
            type="button"
            disabled={isGeneratingDocx}
            onClick={handleExportWordDoc}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-800 bg-amber-50 border border-amber-300 hover:bg-amber-100 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-amber-700" />
            {isGeneratingDocx ? 'Menyusun Word (.docx)...' : 'Download Word (.docx)'}
          </button>
          <button
            type="button"
            disabled={isGeneratingPdf}
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            {isGeneratingPdf ? 'Menyusun PDF Resmi...' : 'Cetak / Simpan PDF Resmi (.pdf)'}
          </button>
        </div>
      </div>

      {/* Document Download Confirmation Banner */}
      {downloadedFileName && (
        <div className="no-print flex items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Dokumen Resmi UNIKMA berhasil dibuat dan diunduh:{' '}
              <strong className="font-mono-num">{downloadedFileName}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDownloadedFileName(null)}
            className="text-emerald-700 hover:text-emerald-950 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* OBE Compliance Alert Banner if any rule fails */}
      {!validation.isValidObe && (
        <div className="no-print flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">
              Peringatan Validasi OBE: Dokumen ini memiliki aturan kritis yang belum terpenuhi (Total Bobot: {validation.totalBobotAsesmen}%).
            </p>
            <p className="text-red-700">
              Silakan perbaiki melalui tab Editor RPS atau klik Normalisasi Bobot agar dokumen memenuhi syarat otorisasi Kaprodi.
            </p>
          </div>
        </div>
      )}

      {/* OFFICIAL UNIKMA PAPER SHEET */}
      <div
        ref={docContainerRef}
        className="print-only-container bg-white border border-slate-300 rounded-lg p-6 md:p-8 text-slate-950 overflow-x-auto"
      >
        {/* ================================================================
            BAGIAN 1: HEADER INSTITUSI, ALAMAT KAMPUS I/II/III & IDENTITAS MK
            ================================================================ */}
        <table className="unikma-doc-table w-full border-collapse border-2 border-slate-900 text-xs">
          <tbody>
            {/* Row 1: Logo, Identitas UNIKMA & Alamat Kampus I, II, III, Kode Dokumen */}
            <tr>
              <td
                rowSpan={2}
                className="border border-slate-900 p-2.5 text-center align-middle w-36 bg-white"
              >
                <div className="flex flex-col items-center justify-center">
                  <UnikmaLogoEmblem size={116} showText={true} />
                </div>
              </td>
              <td
                colSpan={5}
                className="border border-slate-900 bg-slate-900 text-white px-4 py-2.5 text-center align-middle"
              >
                <div className="font-serif-doc text-base md:text-lg font-bold tracking-wide uppercase">
                  {rps.institusi.namaUniversitas} ({rps.institusi.singkatan})
                </div>
                <div className="text-xs font-semibold tracking-wider text-amber-300 uppercase mt-0.5">
                  {rps.institusi.fakultas} — {rps.institusi.programStudi}
                </div>
                <div className="mt-1.5 pt-1.5 border-t border-slate-700 text-[10px] leading-relaxed text-slate-200 space-y-0.5">
                  <div>{rps.institusi.kampus1}</div>
                  <div>{rps.institusi.kampus2}</div>
                  <div>{rps.institusi.kampus3}</div>
                  <div className="text-amber-200 font-mono-num">
                    Laman: {rps.institusi.website} · Surel: {rps.institusi.email}
                  </div>
                </div>
              </td>
              <td
                rowSpan={2}
                className="border border-slate-900 p-2.5 w-44 bg-slate-50 align-middle text-[11px]"
              >
                <div className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-1">
                  KODE DOKUMEN MUTU
                </div>
                <div className="font-mono-num font-semibold text-slate-800">
                  {rps.institusi.kodeDokumenStandar}
                </div>
                <div className="mt-2 text-[10px] text-slate-600">
                  Revisi Ke: <span className="font-mono-num font-bold text-slate-900">{rps.identitas.revisiKe}</span>
                </div>
                <div className="text-[10px] text-slate-600">
                  T.A.: <span className="font-semibold text-slate-900">{rps.identitas.tahunAkademik}</span>
                </div>
              </td>
            </tr>

            {/* Row 2: Judul Dokumen */}
            <tr>
              <td
                colSpan={5}
                className="border border-slate-900 bg-slate-800 text-white py-1.5 px-3 text-center font-bold tracking-widest text-xs uppercase"
              >
                RENCANA PEMBELAJARAN SEMESTER (RPS) BERBASIS OUTCOME-BASED EDUCATION (OBE)
              </td>
            </tr>

            {/* Row 3: Header Tabel Identitas Mata Kuliah */}
            <tr className="bg-slate-200 font-bold text-slate-900 text-center">
              <td colSpan={2} className="border border-slate-900 py-1.5 px-2.5 text-left">
                MATA KULIAH (MK)
              </td>
              <td className="border border-slate-900 py-1.5 px-2.5">KODE MK</td>
              <td className="border border-slate-900 py-1.5 px-2.5">RUMPUN MK</td>
              <td className="border border-slate-900 py-1.5 px-2.5">BOBOT (SKS)</td>
              <td className="border border-slate-900 py-1.5 px-2.5">SEMESTER</td>
              <td className="border border-slate-900 py-1.5 px-2.5">TGL PENYUSUNAN</td>
            </tr>

            {/* Row 4: Nilai Tabel Identitas Mata Kuliah */}
            <tr className="bg-white text-center font-medium">
              <td colSpan={2} className="border border-slate-900 py-2 px-2.5 text-left font-bold text-slate-900 text-sm">
                {rps.identitas.namaMk}
              </td>
              <td className="border border-slate-900 py-2 px-2.5 font-mono-num font-bold text-slate-900">
                {rps.identitas.kodeMk}
              </td>
              <td className="border border-slate-900 py-2 px-2.5 text-left">
                {rps.identitas.rumpunMk}
              </td>
              <td className="border border-slate-900 py-2 px-2.5 font-mono-num">
                <div>Total: <strong>{totalSks} SKS</strong></div>
                <div className="text-[11px] text-slate-600">
                  (T = {rps.identitas.bobotSksTeori} SKS · P = {rps.identitas.bobotSksPraktikum} SKS)
                </div>
              </td>
              <td className="border border-slate-900 py-2 px-2.5 font-mono-num font-bold">
                {rps.identitas.semester} (Empat/Lima/Enam)
              </td>
              <td className="border border-slate-900 py-2 px-2.5 font-mono-num">
                {rps.identitas.tanggalPenyusunan}
              </td>
            </tr>

            {/* Row 5 & 6: BLOK OTORISASI PEJABAT AKADEMIK & QR CODE */}
            <tr className="bg-slate-100">
              <td
                rowSpan={2}
                className="border border-slate-900 p-2.5 font-bold text-slate-900 align-middle text-center bg-slate-200"
              >
                OTORISASI / PENGESAHAN
              </td>
              <td colSpan={2} className="border border-slate-900 py-1.5 px-2.5 font-bold text-center">
                Dosen Pengembang RPS
              </td>
              <td colSpan={2} className="border border-slate-900 py-1.5 px-2.5 font-bold text-center">
                Koordinator RMK
              </td>
              <td colSpan={2} className="border border-slate-900 py-1.5 px-2.5 font-bold text-center">
                Ketua Program Studi SI
              </td>
            </tr>
            <tr className="bg-white">
              {/* Dosen Pengembang */}
              <td colSpan={2} className="border border-slate-900 p-3 text-center align-bottom">
                <div className="flex flex-col items-center justify-between min-h-28 gap-2">
                  {rps.otorisasi.dosenPengembang.statusOtorisasi === 'Terverifikasi QR' ? (
                    <div className="flex flex-col items-center gap-1">
                      <UnikmaAuthorizationQr hash={rps.otorisasi.dosenPengembang.qrVerificationHash} size={56} />
                      <span className="text-[10px] font-mono-num text-emerald-700 font-semibold">
                        TERVERIFIKASI QR · {rps.otorisasi.dosenPengembang.tanggalOtorisasi}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-2">
                      <span className="text-[11px] text-amber-700 font-medium">
                        [{rps.otorisasi.dosenPengembang.statusOtorisasi}]
                      </span>
                      <button
                        type="button"
                        onClick={() => onAuthorizeRole('dosenPengembang')}
                        className="no-print px-2.5 py-1 text-[11px] font-medium bg-slate-900 text-white rounded hover:bg-slate-700 cursor-pointer"
                      >
                        Tanda Tangani QR
                      </button>
                    </div>
                  )}
                  <div>
                    <div className="font-bold underline text-slate-900">
                      {rps.otorisasi.dosenPengembang.nama}
                    </div>
                    <div className="font-mono-num text-[11px] text-slate-700">
                      NIDN. {rps.otorisasi.dosenPengembang.nidn}
                    </div>
                  </div>
                </div>
              </td>

              {/* Koordinator RMK */}
              <td colSpan={2} className="border border-slate-900 p-3 text-center align-bottom">
                <div className="flex flex-col items-center justify-between min-h-28 gap-2">
                  {rps.otorisasi.koordinatorRmk.statusOtorisasi === 'Terverifikasi QR' ? (
                    <div className="flex flex-col items-center gap-1">
                      <UnikmaAuthorizationQr hash={rps.otorisasi.koordinatorRmk.qrVerificationHash} size={56} />
                      <span className="text-[10px] font-mono-num text-emerald-700 font-semibold">
                        TERVERIFIKASI QR · {rps.otorisasi.koordinatorRmk.tanggalOtorisasi}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-2">
                      <span className="text-[11px] text-amber-700 font-medium">
                        [{rps.otorisasi.koordinatorRmk.statusOtorisasi}]
                      </span>
                      <button
                        type="button"
                        onClick={() => onAuthorizeRole('koordinatorRmk')}
                        className="no-print px-2.5 py-1 text-[11px] font-medium bg-slate-900 text-white rounded hover:bg-slate-700 cursor-pointer"
                      >
                        Verifikasi RMK (QR)
                      </button>
                    </div>
                  )}
                  <div>
                    <div className="font-bold underline text-slate-900">
                      {rps.otorisasi.koordinatorRmk.nama}
                    </div>
                    <div className="font-mono-num text-[11px] text-slate-700">
                      NIDN. {rps.otorisasi.koordinatorRmk.nidn}
                    </div>
                  </div>
                </div>
              </td>

              {/* Ketua Prodi SI */}
              <td colSpan={2} className="border border-slate-900 p-3 text-center align-bottom">
                <div className="flex flex-col items-center justify-between min-h-28 gap-2">
                  {rps.otorisasi.ketuaProdi.statusOtorisasi === 'Terverifikasi QR' ? (
                    <div className="flex flex-col items-center gap-1">
                      <UnikmaAuthorizationQr hash={rps.otorisasi.ketuaProdi.qrVerificationHash} size={56} />
                      <span className="text-[10px] font-mono-num text-emerald-700 font-semibold">
                        TERVERIFIKASI QR · {rps.otorisasi.ketuaProdi.tanggalOtorisasi}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-2">
                      <span className="text-[11px] text-amber-700 font-medium">
                        [{rps.otorisasi.ketuaProdi.statusOtorisasi}]
                      </span>
                      <button
                        type="button"
                        onClick={() => onAuthorizeRole('ketuaProdi')}
                        className="no-print px-2.5 py-1 text-[11px] font-medium bg-slate-900 text-white rounded hover:bg-slate-700 cursor-pointer"
                      >
                        Otorisasi Kaprodi (QR)
                      </button>
                    </div>
                  )}
                  <div>
                    <div className="font-bold underline text-slate-900">
                      {rps.otorisasi.ketuaProdi.nama}
                    </div>
                    <div className="font-mono-num text-[11px] text-slate-700">
                      NIDN. {rps.otorisasi.ketuaProdi.nidn}
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            {/* ================================================================
                BAGIAN 2: KOMPONEN KURIKULUM OBE (CPL, CPMK, SUB-CPMK, DESKRIPSI, PUSTAKA, CATATAN)
                ================================================================ */}
            {/* CPL PRODI */}
            <tr className="bg-slate-200 font-bold">
              <td
                rowSpan={rps.cplProdi.length + rps.cpmkList.length + rps.subCpmkList.length + 3}
                className="border border-slate-900 p-2.5 align-top text-center bg-slate-100 font-bold"
              >
                CAPAIAN PEMBELAJARAN (CP)
              </td>
              <td colSpan={6} className="border border-slate-900 py-1.5 px-2.5 bg-slate-200 text-slate-900">
                1. Capaian Pembelajaran Lulusan Program Studi (CPL-PRODI) yang Dibebankan pada Mata Kuliah:
              </td>
            </tr>
            {rps.cplProdi.map((cpl) => (
              <tr key={cpl.kode} className="bg-white">
                <td className="border border-slate-900 py-1.5 px-2.5 font-mono-num font-bold text-slate-900 w-28">
                  <div>{cpl.kode}</div>
                  <div className="text-[10px] font-normal text-slate-600">{cpl.ranah}</div>
                </td>
                <td colSpan={5} className="border border-slate-900 py-1.5 px-2.5 text-slate-800">
                  <div>{cpl.deskripsi}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Profil Lulusan Terkait: <strong className="text-slate-700">{cpl.profilLulusanTerkait}</strong>
                  </div>
                </td>
              </tr>
            ))}

            {/* CPMK */}
            <tr className="bg-slate-200 font-bold">
              <td colSpan={6} className="border border-slate-900 py-1.5 px-2.5 text-slate-900">
                2. Capaian Pembelajaran Mata Kuliah (CPMK) — Penurunan dari CPL Program Studi:
              </td>
            </tr>
            {rps.cpmkList.map((cpmk) => (
              <tr key={cpmk.kode} className="bg-white">
                <td className="border border-slate-900 py-1.5 px-2.5 font-mono-num font-bold text-slate-900">
                  <div>{cpmk.kode}</div>
                  <div className="text-[10px] font-normal text-slate-600">
                    → {cpmk.mappedCplCodes.length > 0 ? cpmk.mappedCplCodes.join(', ') : 'BELUM TERPETAKAN'}
                  </div>
                </td>
                <td colSpan={5} className="border border-slate-900 py-1.5 px-2.5 text-slate-800">
                  {cpmk.deskripsi}
                </td>
              </tr>
            ))}

            {/* SUB-CPMK */}
            <tr className="bg-slate-200 font-bold">
              <td colSpan={6} className="border border-slate-900 py-1.5 px-2.5 text-slate-900">
                3. Kemampuan Akhir Tiap Tahapan Belajar (Sub-CPMK) & Gradasi Taksonomi Bloom:
              </td>
            </tr>
            {rps.subCpmkList.map((sub) => (
              <tr key={sub.kode} className="bg-white">
                <td className="border border-slate-900 py-1.5 px-2.5 font-mono-num font-bold text-slate-900">
                  <div>{sub.kode}</div>
                  <div className="text-[10px] font-normal text-slate-600">
                    → {sub.mappedCpmkCode} [{sub.taksonomiBloom}]
                  </div>
                </td>
                <td colSpan={5} className="border border-slate-900 py-1.5 px-2.5 text-slate-800">
                  {sub.deskripsi}
                </td>
              </tr>
            ))}

            {/* Deskripsi Singkat MK */}
            <tr>
              <td className="border border-slate-900 p-2.5 font-bold bg-slate-100">
                Deskripsi Singkat MK
              </td>
              <td colSpan={6} className="border border-slate-900 p-2.5 leading-relaxed text-justify">
                {rps.deskripsiMk}
              </td>
            </tr>

            {/* Bahan Kajian / Materi Pembelajaran */}
            <tr>
              <td className="border border-slate-900 p-2.5 font-bold bg-slate-100">
                Bahan Kajian / Materi Pembelajaran
              </td>
              <td colSpan={6} className="border border-slate-900 p-2.5">
                <ul className="space-y-1">
                  {rps.pokokBahasan.map((item, idx) => (
                    <li key={idx} className="leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>

            {/* Pustaka Utama & Tambahan */}
            <tr>
              <td rowSpan={2} className="border border-slate-900 p-2.5 font-bold bg-slate-100">
                Pustaka / Referensi
              </td>
              <td className="border border-slate-900 p-2 font-bold bg-slate-50">
                Utama:
              </td>
              <td colSpan={5} className="border border-slate-900 p-2">
                <div className="space-y-1">
                  {rps.pustakaUtama.map((ref, idx) => (
                    <div key={idx}>{ref}</div>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 font-bold bg-slate-50">
                Tambahan:
              </td>
              <td colSpan={5} className="border border-slate-900 p-2">
                <div className="space-y-1">
                  {rps.pustakaTambahan.map((ref, idx) => (
                    <div key={idx}>{ref}</div>
                  ))}
                </div>
              </td>
            </tr>

            {/* Media Pembelajaran */}
            <tr>
              <td className="border border-slate-900 p-2.5 font-bold bg-slate-100">
                Media Pembelajaran
              </td>
              <td colSpan={3} className="border border-slate-900 p-2.5">
                <div className="font-bold text-slate-900 mb-1">Perangkat Lunak (Software):</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800">
                  {rps.mediaPerangkatLunak.map((sw, i) => (
                    <li key={i}>{sw}</li>
                  ))}
                </ul>
              </td>
              <td colSpan={3} className="border border-slate-900 p-2.5">
                <div className="font-bold text-slate-900 mb-1">Perangkat Keras (Hardware):</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800">
                  {rps.mediaPerangkatKeras.map((hw, i) => (
                    <li key={i}>{hw}</li>
                  ))}
                </ul>
              </td>
            </tr>

            {/* Dosen Pengampu (Team Teaching) & Mata Kuliah Syarat */}
            <tr>
              <td className="border border-slate-900 p-2.5 font-bold bg-slate-100">
                Dosen Pengampu (Team Teaching)
              </td>
              <td colSpan={2} className="border border-slate-900 p-2.5">
                <ol className="list-decimal list-inside space-y-0.5">
                  {rps.teamTeaching.map((tt, i) => (
                    <li key={i}>{tt}</li>
                  ))}
                </ol>
              </td>
              <td className="border border-slate-900 p-2.5 font-bold bg-slate-100">
                Mata Kuliah Prasyarat
              </td>
              <td colSpan={3} className="border border-slate-900 p-2.5">
                <ul className="list-disc list-inside space-y-0.5">
                  {rps.mkSyarat.map((mk, i) => (
                    <li key={i}>{mk}</li>
                  ))}
                </ul>
              </td>
            </tr>

            {/* Catatan Akademik OBE (Keselarasan CPL, Profil Lulusan, Pendekatan CBL/PjBL) */}
            <tr>
              <td className="border border-slate-900 p-2.5 font-bold bg-slate-100">
                Catatan Akademik & Kebijakan OBE
              </td>
              <td colSpan={6} className="border border-slate-900 p-2.5 bg-slate-50 space-y-1.5">
                <div>
                  <span className="font-bold text-slate-900">1. Keselarasan CPL & CPMK: </span>
                  <span>{rps.catatanAkademik.keselarasanCpl}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">
                    2. Profil Lulusan Sasaran ({rps.catatanAkademik.kodeProfilLulusan}):{' '}
                  </span>
                  <span>{rps.catatanAkademik.profilLulusanDeskripsi}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">3. Pendekatan Pembelajaran (IKU-7): </span>
                  <span className="font-semibold text-slate-900">
                    {rps.catatanAkademik.pendekatanPembelajaran}
                  </span>{' '}
                  (Proporsi Asesmen Partisipatif CBL + Proyek Kolaboratif PjBL Aktual:{' '}
                  <strong className="font-mono-num">{validation.bobotIku7PartisipatifProyek}%</strong> dari total nilai akhir).
                </div>
                <div>
                  <span className="font-bold text-slate-900">4. Integritas Akademik: </span>
                  <span>{rps.catatanAkademik.kebijakanIntegritasAkademik}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ================================================================
            BAGIAN 3: MATRIKS PEMBELAJARAN 16 PERTEMUAN (TABEL DETAIL)
            ================================================================ */}
        <div className="mt-5">
          <div className="bg-slate-900 text-white text-center font-bold py-2 px-3 text-xs tracking-wider uppercase border-2 border-b-0 border-slate-900">
            MATRIKS RENCANA PEMBELAJARAN SEMESTER (16 PERTEMUAN) — FAKULTAS SAINS DAN TEKNOLOGI UNIKMA
          </div>
          <table className="unikma-doc-table w-full border-collapse border-2 border-slate-900 text-[11px]">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold text-center">
                <th className="border border-slate-900 p-2 w-12">
                  Mg Ke-
                  <div className="font-mono-num text-[9px] font-normal">(1)</div>
                </th>
                <th className="border border-slate-900 p-2 w-48">
                  Kemampuan Akhir yang Direncanakan (Sub-CPMK)
                  <div className="font-mono-num text-[9px] font-normal">(2)</div>
                </th>
                <th className="border border-slate-900 p-2 w-52">
                  Materi Pembelajaran [Pokok Bahasan]
                  <div className="font-mono-num text-[9px] font-normal">(3)</div>
                </th>
                <th className="border border-slate-900 p-2 w-44">
                  Bentuk dan Metode Pembelajaran
                  <div className="font-mono-num text-[9px] font-normal">(4)</div>
                </th>
                <th className="border border-slate-900 p-2 w-44">
                  Indikator Penilaian
                  <div className="font-mono-num text-[9px] font-normal">(5)</div>
                </th>
                <th className="border border-slate-900 p-2 w-48">
                  Pengalaman Pembelajaran (Estimasi Waktu TM / BT / BM)
                  <div className="font-mono-num text-[9px] font-normal">(6)</div>
                </th>
                <th className="border border-slate-900 p-2 w-44">
                  Kriteria & Bentuk Penilaian
                  <div className="font-mono-num text-[9px] font-normal">(7)</div>
                </th>
                <th className="border border-slate-900 p-2 w-20">
                  Bobot Penilaian (%)
                  <div className="font-mono-num text-[9px] font-normal">(8)</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rps.matriksPertemuan.map((row) => {
                const isExam = row.tipePertemuan === 'UTS' || row.tipePertemuan === 'UAS';
                return (
                  <tr
                    key={row.mingguKe}
                    className={isExam ? 'bg-amber-50/90 font-medium' : 'bg-white'}
                  >
                    <td className="border border-slate-900 p-2 text-center font-mono-num font-bold text-slate-900">
                      <div>{row.mingguKe}</div>
                      {isExam && (
                        <div className="text-[10px] font-bold text-amber-800 mt-0.5">
                          {row.tipePertemuan}
                        </div>
                      )}
                    </td>
                    <td className="border border-slate-900 p-2 align-top">
                      <div className="font-mono-num font-bold text-slate-900 text-[10px] mb-1">
                        {row.subCpmkKode} · Bloom: [{row.taksonomiBloom}]
                      </div>
                      <div className="leading-snug text-slate-800">{row.kemampuanAkhir}</div>
                    </td>
                    <td className="border border-slate-900 p-2 align-top whitespace-pre-line leading-snug text-slate-800">
                      {row.materiPembelajaran}
                    </td>
                    <td className="border border-slate-900 p-2 align-top whitespace-pre-line leading-snug text-slate-800">
                      {row.bentukMetodePembelajaran}
                    </td>
                    <td className="border border-slate-900 p-2 align-top whitespace-pre-line leading-snug text-slate-800">
                      {row.indikator}
                    </td>
                    <td className="border border-slate-900 p-2 align-top space-y-1 text-slate-800">
                      <div>
                        <strong className="font-mono-num text-slate-900">TM:</strong> {row.pengalamanBelajar.tm}
                      </div>
                      <div>
                        <strong className="font-mono-num text-slate-900">BT:</strong> {row.pengalamanBelajar.bt}
                      </div>
                      <div>
                        <strong className="font-mono-num text-slate-900">BM:</strong> {row.pengalamanBelajar.bm}
                      </div>
                    </td>
                    <td className="border border-slate-900 p-2 align-top whitespace-pre-line leading-snug text-slate-800">
                      <div className="text-[10px] font-semibold text-slate-700 mb-1">
                        [{row.kategoriAsesmen}]
                      </div>
                      {row.kriteriaBentukPenilaian}
                    </td>
                    <td className="border border-slate-900 p-2 text-center align-middle font-mono-num font-bold text-xs text-slate-900">
                      {row.bobotPenilaian}%
                    </td>
                  </tr>
                );
              })}

              {/* TOTAL AKUMULASI BOBOT 16 PERTEMUAN */}
              <tr className="bg-slate-900 text-white font-bold">
                <td colSpan={7} className="border border-slate-900 py-2 px-3 text-right uppercase tracking-wider">
                  Total Akumulasi Bobot Penilaian (Minggu Ke-1 s/d Minggu Ke-16) — Wajib 100%:
                </td>
                <td
                  className={`border border-slate-900 py-2 px-2 text-center font-mono-num text-sm ${
                    Math.abs(validation.totalBobotAsesmen - 100) < 0.01
                      ? 'bg-emerald-700 text-white'
                      : 'bg-red-700 text-white'
                  }`}
                >
                  {validation.totalBobotAsesmen}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ================================================================
            BAGIAN 4: KETERANGAN TATAP MUKA (TM/BT/BM) & GRADASI BLOOM (C, A, P)
            ================================================================ */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] border-2 border-slate-900 p-3 bg-slate-50">
          <div className="space-y-1">
            <div className="font-bold text-slate-900 uppercase">
              A. Keterangan Beban Waktu Pembelajaran (Sesuai SN-Dikti):
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-800">
              <li>
                <strong className="font-mono-num">TM (Tatap Muka):</strong> 1 SKS = <strong className="font-mono-num">50 menit</strong> per minggu per semester.
              </li>
              <li>
                <strong className="font-mono-num">BT (Tugas Terstruktur):</strong> 1 SKS = <strong className="font-mono-num">60 menit</strong> kegiatan penugasan terstruktur per minggu per semester.
              </li>
              <li>
                <strong className="font-mono-num">BM (Belajar Mandiri):</strong> 1 SKS = <strong className="font-mono-num">60 menit</strong> kegiatan belajar mandiri per minggu per semester.
              </li>
              <li>
                <strong className="font-mono-num">1 SKS Praktikum (P):</strong> <strong className="font-mono-num">170 menit</strong> kerja laboratorium/studio per minggu per semester.
              </li>
            </ul>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-slate-900 uppercase">
              B. Keterangan Gradasi Taksonomi Bloom (C, A, P):
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-800">
              <li>
                <strong className="font-mono-num">C (Cognitive / Kognitif):</strong> C1 (Mengingat), C2 (Memahami), C3 (Menerapkan), C4 (Menganalisis), C5 (Mengevaluasi), C6 (Mencipta/Merancang).
              </li>
              <li>
                <strong className="font-mono-num">A (Affective / Afektif):</strong> A1 (Menerima), A2 (Menanggapi), A3 (Menghargai), A4 (Mengorganisasikan), A5 (Karakterisasi Menurut Nilai).
              </li>
              <li>
                <strong className="font-mono-num">P (Psychomotor / Psikomotorik):</strong> P1 (Meniru/Imitasi), P2 (Manipulasi), P3 (Presisi), P4 (Artikulasi), P5 (Naturalisasi).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
