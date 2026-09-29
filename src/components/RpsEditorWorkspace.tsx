import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Wand2,
  Plus,
  Trash2,
  ShieldCheck,
  BookOpen,
  Layers,
  Calendar,
  FileText
} from 'lucide-react';
import {
  RPSDocument,
  OBEValidationSummary,
  AssessmentCategory,
  CPLItem
} from '../types/rps';
import { MASTER_CPL_PRODI_SI } from '../data/mockRpsData';

interface RpsEditorWorkspaceProps {
  rps: RPSDocument;
  validation: OBEValidationSummary;
  onUpdateRps: (updated: RPSDocument) => void;
  onSwitchToPreview: () => void;
}

export const RpsEditorWorkspace: React.FC<RpsEditorWorkspaceProps> = ({
  rps,
  validation,
  onUpdateRps,
  onSwitchToPreview
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'identitas' | 'kurikulum-obe' | 'pustaka-catatan' | 'matriks-16'
  >('kurikulum-obe');

  // One-click Auto-Fix OBE Violations (Fixes total weight to 100% & maps any orphan CPMK to CPL)
  const handleAutoFixObe = () => {
    const updatedCpmks = rps.cpmkList.map((cpmk, idx) => {
      if (!cpmk.mappedCplCodes || cpmk.mappedCplCodes.length === 0) {
        const fallbackCpl =
          rps.cplProdi[idx % rps.cplProdi.length]?.kode || rps.cplProdi[0]?.kode || 'CPL01';
        return {
          ...cpmk,
          mappedCplCodes: [fallbackCpl]
        };
      }
      return cpmk;
    });

    // Ensure all loaded CPLs are referenced at least once
    const usedCpls = new Set(updatedCpmks.flatMap((c) => c.mappedCplCodes));
    rps.cplProdi.forEach((cpl) => {
      if (!usedCpls.has(cpl.kode) && updatedCpmks.length > 0) {
        updatedCpmks[0] = {
          ...updatedCpmks[0],
          mappedCplCodes: Array.from(new Set([...updatedCpmks[0].mappedCplCodes, cpl.kode]))
        };
      }
    });

    // Normalize 16-week assessment weights so sum == 100%
    const currentTotal = rps.matriksPertemuan.reduce(
      (acc, m) => acc + (Number(m.bobotPenilaian) || 0),
      0
    );
    const diff = Number((100 - currentTotal).toFixed(2));
    const updatedMatriks = rps.matriksPertemuan.map((m) => {
      if (m.mingguKe === 16) {
        const adjusted = Math.max(5, Number((m.bobotPenilaian + diff).toFixed(2)));
        return { ...m, tipePertemuan: 'UAS' as const, bobotPenilaian: adjusted };
      }
      if (m.mingguKe === 8) {
        return { ...m, tipePertemuan: 'UTS' as const };
      }
      return m;
    });

    onUpdateRps({
      ...rps,
      status: 'Menunggu Otorisasi Kaprodi',
      progresPengisianPersen: 100,
      lastUpdated: 'Baru saja diperbarui',
      cpmkList: updatedCpmks,
      matriksPertemuan: updatedMatriks
    });
  };

  const handleToggleCplInCourse = (cplItem: CPLItem) => {
    const exists = rps.cplProdi.some((c) => c.kode === cplItem.kode);
    if (exists && rps.cplProdi.length <= 1) return; // Keep at least 1 CPL
    const nextCpls = exists
      ? rps.cplProdi.filter((c) => c.kode !== cplItem.kode)
      : [...rps.cplProdi, cplItem];

    onUpdateRps({
      ...rps,
      cplProdi: nextCpls,
      lastUpdated: 'Baru saja diperbarui'
    });
  };

  const handleToggleCpmkCplLink = (cpmkKode: string, cplKode: string) => {
    const updatedCpmks = rps.cpmkList.map((cpmk) => {
      if (cpmk.kode !== cpmkKode) return cpmk;
      const hasLink = cpmk.mappedCplCodes.includes(cplKode);
      const nextCodes = hasLink
        ? cpmk.mappedCplCodes.filter((c) => c !== cplKode)
        : [...cpmk.mappedCplCodes, cplKode];
      return { ...cpmk, mappedCplCodes: nextCodes };
    });

    onUpdateRps({
      ...rps,
      cpmkList: updatedCpmks,
      lastUpdated: 'Baru saja diperbarui'
    });
  };

  const handleAddCpmk = () => {
    const nextNum = rps.cpmkList.length + 1;
    const defaultCpl = rps.cplProdi[0]?.kode || 'CPL01';
    onUpdateRps({
      ...rps,
      cpmkList: [
        ...rps.cpmkList,
        {
          kode: `CPMK${nextNum}`,
          deskripsi: `Mampu menerapkan kompetensi capaian pembelajaran mata kuliah ke-${nextNum} secara terukur (${defaultCpl}).`,
          mappedCplCodes: [defaultCpl],
          bobotTargetPersen: 20
        }
      ],
      lastUpdated: 'Baru saja diperbarui'
    });
  };

  const handleUpdateWeekWeight = (mingguKe: number, newWeight: number) => {
    const safeWeight = Math.max(0, Math.min(100, Number(newWeight) || 0));
    const nextMatrix = rps.matriksPertemuan.map((m) =>
      m.mingguKe === mingguKe ? { ...m, bobotPenilaian: safeWeight } : m
    );
    onUpdateRps({
      ...rps,
      matriksPertemuan: nextMatrix,
      lastUpdated: 'Baru saja diperbarui'
    });
  };

  const handleUpdateWeekField = (
    mingguKe: number,
    field:
      | 'subCpmkKode'
      | 'kemampuanAkhir'
      | 'materiPembelajaran'
      | 'bentukMetodePembelajaran'
      | 'indikator'
      | 'kriteriaBentukPenilaian'
      | 'kategoriAsesmen'
      | 'taksonomiBloom',
    value: string
  ) => {
    const nextMatrix = rps.matriksPertemuan.map((m) =>
      m.mingguKe === mingguKe ? { ...m, [field]: value } : m
    );
    onUpdateRps({
      ...rps,
      matriksPertemuan: nextMatrix,
      lastUpdated: 'Baru saja diperbarui'
    });
  };

  return (
    <div className="space-y-6">
      {/* Real-Time OBE Validation Status Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5 text-xs text-slate-500 font-mono-num">
              <span>KODE MK: {rps.identitas.kodeMk}</span>
              <span aria-hidden="true">·</span>
              <span>SEMESTER {rps.identitas.semester}</span>
              <span aria-hidden="true">·</span>
              <span>
                {rps.identitas.bobotSksTeori + rps.identitas.bobotSksPraktikum} SKS ({rps.identitas.bobotSksTeori}T/{rps.identitas.bobotSksPraktikum}P)
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Editor & Validator Kurikulum OBE: {rps.identitas.namaMk}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!validation.isValidObe && (
              <button
                type="button"
                onClick={handleAutoFixObe}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                Auto-Fix Validasi OBE (100% Bobot & Relasi CPL)
              </button>
            )}
            <button
              type="button"
              onClick={onSwitchToPreview}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Lihat & Cetak Dokumen Resmi UNIKMA
            </button>
          </div>
        </div>

        {/* 8 OBE Rules Live Check Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {validation.rules.map((rule) => (
            <div
              key={rule.ruleId}
              className={`p-3 rounded-lg border text-xs ${
                rule.passed
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : rule.severity === 'CRITICAL'
                  ? 'bg-red-50/80 border-red-300 text-red-950'
                  : 'bg-amber-50/80 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono-num font-semibold text-[11px] text-slate-500">
                  {rule.kodeAturan}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-[11px]">
                  {rule.passed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">LOLOS</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span className="text-red-700">PERLU PERBAIKAN</span>
                    </>
                  )}
                </span>
              </div>
              <div className="font-semibold text-slate-900 leading-snug mb-1">
                {rule.namaAturan}
              </div>
              <div className="font-mono-num text-[11px] font-medium text-slate-700">
                Aktual: <strong>{rule.nilaiSaatIni}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Navigation Tabs for the 4 Sections of UNIKMA RPS */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setActiveSubTab('identitas')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'identitas'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          1. Header Institusi, Identitas MK & Otorisasi
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('kurikulum-obe')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'kurikulum-obe'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          2. Pemetaan CPL ↔ CPMK ↔ Sub-CPMK
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('pustaka-catatan')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'pustaka-catatan'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          3. Deskripsi, Pustaka, Media & Catatan Akademik
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('matriks-16')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'matriks-16'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          4. Matriks 16 Pertemuan (Bobot: {validation.totalBobotAsesmen}%)
        </button>
      </div>

      {/* ====================================================================
          TAB 1: HEADER INSTITUSI, IDENTITAS MATA KULIAH & BLOK OTORISASI
          ==================================================================== */}
      {activeSubTab === 'identitas' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Identitas Mata Kuliah & Header Resmi Universitas Komputama (UNIKMA)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perubahan pada form ini langsung memperbarui dokumen resmi RPS UNIKMA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Mata Kuliah</label>
              <input
                type="text"
                value={rps.identitas.namaMk}
                onChange={(e) =>
                  onUpdateRps({
                    ...rps,
                    identitas: { ...rps.identitas, namaMk: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kode Mata Kuliah</label>
              <input
                type="text"
                value={rps.identitas.kodeMk}
                onChange={(e) =>
                  onUpdateRps({
                    ...rps,
                    identitas: { ...rps.identitas, kodeMk: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono-num focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rumpun Mata Kuliah (RMK)</label>
              <input
                type="text"
                value={rps.identitas.rumpunMk}
                onChange={(e) =>
                  onUpdateRps({
                    ...rps,
                    identitas: { ...rps.identitas, rumpunMk: e.target.value }
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bobot SKS Teori (T)</label>
              <input
                type="number"
                min={0}
                max={6}
                value={rps.identitas.bobotSksTeori}
                onChange={(e) =>
                  onUpdateRps({
                    ...rps,
                    identitas: { ...rps.identitas, bobotSksTeori: Number(e.target.value) || 0 }
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono-num focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bobot SKS Praktikum (P)</label>
              <input
                type="number"
                min={0}
                max={6}
                value={rps.identitas.bobotSksPraktikum}
                onChange={(e) =>
                  onUpdateRps({
                    ...rps,
                    identitas: { ...rps.identitas, bobotSksPraktikum: Number(e.target.value) || 0 }
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono-num focus:outline-none focus:border-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={rps.identitas.semester}
                  onChange={(e) =>
                    onUpdateRps({
                      ...rps,
                      identitas: { ...rps.identitas, semester: Number(e.target.value) || 1 }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono-num focus:outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tanggal Penyusunan</label>
                <input
                  type="text"
                  value={rps.identitas.tanggalPenyusunan}
                  onChange={(e) =>
                    onUpdateRps({
                      ...rps,
                      identitas: { ...rps.identitas, tanggalPenyusunan: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              Blok Otorisasi Pejabat Akademik (Dosen Pengembang, Koordinator RMK, Ketua Prodi SI)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {(
                [
                  { key: 'dosenPengembang', label: 'Dosen Pengembang RPS' },
                  { key: 'koordinatorRmk', label: 'Koordinator RMK' },
                  { key: 'ketuaProdi', label: 'Ketua Program Studi SI' }
                ] as const
              ).map(({ key, label }) => {
                const person = rps.otorisasi[key];
                return (
                  <div key={key} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{label}</span>
                      <span
                        className={`font-mono-num text-[11px] font-semibold ${
                          person.statusOtorisasi === 'Terverifikasi QR'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {person.statusOtorisasi}
                      </span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={person.nama}
                        onChange={(e) =>
                          onUpdateRps({
                            ...rps,
                            otorisasi: {
                              ...rps.otorisasi,
                              [key]: { ...person, nama: e.target.value }
                            }
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">NIDN</label>
                      <input
                        type="text"
                        value={person.nidn}
                        onChange={(e) =>
                          onUpdateRps({
                            ...rps,
                            otorisasi: {
                              ...rps.otorisasi,
                              [key]: { ...person, nidn: e.target.value }
                            }
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-mono-num"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 2: KOMPONEN KURIKULUM OBE (PEMETAAN CPL <-> CPMK <-> SUB-CPMK)
          ==================================================================== */}
      {activeSubTab === 'kurikulum-obe' && (
        <div className="space-y-6">
          {/* CPL Selection from Prodi SI Master */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  A. Pemetaan CPL Program Studi Sistem Informasi yang Dibebankan pada Mata Kuliah
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih kode CPL Prodi SI UNIKMA yang menjadi tanggung jawab mata kuliah ini (misal: CPL01, CPL04, CPL07, CPL10).
                </p>
              </div>
              <span className="text-xs font-mono-num font-semibold text-slate-700">
                Terpilih: {rps.cplProdi.map((c) => c.kode).join(', ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MASTER_CPL_PRODI_SI.map((cpl) => {
                const isSelected = rps.cplProdi.some((c) => c.kode === cpl.kode);
                return (
                  <div
                    key={cpl.kode}
                    onClick={() => handleToggleCplInCourse(cpl)}
                    className={`p-3.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono-num font-bold text-sm">
                        {cpl.kode} · {cpl.ranah}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          isSelected ? 'text-amber-300' : 'text-slate-500'
                        }`}
                      >
                        {isSelected ? '✓ Dibebankan pada MK' : '+ Klik untuk membebankan'}
                      </span>
                    </div>
                    <p className={isSelected ? 'text-slate-200 leading-relaxed' : 'text-slate-600 leading-relaxed'}>
                      {cpl.deskripsi}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CPMK & Matrix Mapping to CPL */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  B. Penurunan CPL ke Capaian Pembelajaran Mata Kuliah (CPMK) & Matriks Keterikatan
                </h3>
                <p className="text-xs text-slate-500">
                  Aturan OBE: Setiap CPMK wajib berelasi ke minimal 1 CPL Prodi, dan setiap CPL yang dipilih wajib diturunkan ke minimal 1 CPMK.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCpmk}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah CPMK
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-semibold">
                    <th className="border border-slate-200 p-2.5 text-left w-24">Kode CPMK</th>
                    <th className="border border-slate-200 p-2.5 text-left">
                      Rumusan Capaian Pembelajaran Mata Kuliah (CPMK)
                    </th>
                    {rps.cplProdi.map((cpl) => (
                      <th
                        key={cpl.kode}
                        className="border border-slate-200 p-2.5 text-center font-mono-num w-20"
                      >
                        {cpl.kode}
                      </th>
                    ))}
                    <th className="border border-slate-200 p-2.5 text-center w-14">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rps.cpmkList.map((cpmk, idx) => {
                    const isUnmapped = cpmk.mappedCplCodes.length === 0;
                    return (
                      <tr
                        key={cpmk.kode}
                        className={isUnmapped ? 'bg-red-50/70' : 'bg-white'}
                      >
                        <td className="border border-slate-200 p-2.5 font-mono-num font-bold text-slate-900 align-top">
                          <div>{cpmk.kode}</div>
                          {isUnmapped && (
                            <div className="text-[10px] text-red-600 font-semibold mt-1">
                              Wajib pilih CPL!
                            </div>
                          )}
                        </td>
                        <td className="border border-slate-200 p-2.5 align-top">
                          <textarea
                            rows={2}
                            value={cpmk.deskripsi}
                            onChange={(e) => {
                              const next = [...rps.cpmkList];
                              next[idx] = { ...cpmk, deskripsi: e.target.value };
                              onUpdateRps({ ...rps, cpmkList: next });
                            }}
                            className="w-full p-2 text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                          />
                        </td>
                        {rps.cplProdi.map((cpl) => {
                          const checked = cpmk.mappedCplCodes.includes(cpl.kode);
                          return (
                            <td
                              key={cpl.kode}
                              className="border border-slate-200 p-2.5 text-center align-middle"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleToggleCpmkCplLink(cpmk.kode, cpl.kode)}
                                className="w-4 h-4 accent-slate-900 cursor-pointer"
                                aria-label={`Petakan ${cpmk.kode} ke ${cpl.kode}`}
                              />
                            </td>
                          );
                        })}
                        <td className="border border-slate-200 p-2.5 text-center align-middle">
                          <button
                            type="button"
                            disabled={rps.cpmkList.length <= 1}
                            onClick={() => {
                              const next = rps.cpmkList.filter((c) => c.kode !== cpmk.kode);
                              onUpdateRps({ ...rps, cpmkList: next });
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                            title="Hapus CPMK"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-CPMK & Gradasi Taksonomi Bloom */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                C. Kemampuan Akhir Tiap Tahapan Belajar (Sub-CPMK) & Gradasi Bloom (C, A, P)
              </h3>
              <p className="text-xs text-slate-500">
                Penurunan dari CPMK menjadi Sub-CPMK mingguan beserta level Taksonomi Bloom (C1-C6 Kognitif, A1-A5 Afektif, P1-P5 Psikomotorik).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-semibold">
                    <th className="border border-slate-200 p-2.5 text-left w-28">Kode Sub-CPMK</th>
                    <th className="border border-slate-200 p-2.5 text-left w-32">Induk CPMK</th>
                    <th className="border border-slate-200 p-2.5 text-left w-36">Gradasi Bloom</th>
                    <th className="border border-slate-200 p-2.5 text-left">Deskripsi Kemampuan Akhir (Sub-CPMK)</th>
                  </tr>
                </thead>
                <tbody>
                  {rps.subCpmkList.map((sub, idx) => (
                    <tr key={sub.kode} className="bg-white">
                      <td className="border border-slate-200 p-2.5 font-mono-num font-bold text-slate-900">
                        {sub.kode}
                      </td>
                      <td className="border border-slate-200 p-2.5">
                        <select
                          value={sub.mappedCpmkCode}
                          onChange={(e) => {
                            const next = [...rps.subCpmkList];
                            next[idx] = { ...sub, mappedCpmkCode: e.target.value };
                            onUpdateRps({ ...rps, subCpmkList: next });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono-num bg-white"
                        >
                          {rps.cpmkList.map((c) => (
                            <option key={c.kode} value={c.kode}>
                              {c.kode}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-slate-200 p-2.5">
                        <input
                          type="text"
                          value={sub.taksonomiBloom}
                          onChange={(e) => {
                            const next = [...rps.subCpmkList];
                            next[idx] = { ...sub, taksonomiBloom: e.target.value };
                            onUpdateRps({ ...rps, subCpmkList: next });
                          }}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono-num"
                          placeholder="C4, A3, P3"
                        />
                      </td>
                      <td className="border border-slate-200 p-2.5">
                        <input
                          type="text"
                          value={sub.deskripsi}
                          onChange={(e) => {
                            const next = [...rps.subCpmkList];
                            next[idx] = { ...sub, deskripsi: e.target.value };
                            onUpdateRps({ ...rps, subCpmkList: next });
                          }}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 3: DESKRIPSI MK, PUSTAKA, MEDIA PEMBELAJARAN & CATATAN AKADEMIK
          ==================================================================== */}
      {activeSubTab === 'pustaka-catatan' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5 text-xs">
          <div>
            <label className="block font-bold text-slate-900 mb-1">
              Deskripsi Singkat Mata Kuliah
            </label>
            <textarea
              rows={3}
              value={rps.deskripsiMk}
              onChange={(e) => onUpdateRps({ ...rps, deskripsiMk: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-md leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                Pustaka Utama (1 baris per referensi APA Style)
              </label>
              <textarea
                rows={4}
                value={rps.pustakaUtama.join('\n')}
                onChange={(e) =>
                  onUpdateRps({
                    ...rps,
                    pustakaUtama: e.target.value.split('\n').filter((l) => l.trim() !== '')
                  })
                }
                className="w-full p-3 border border-slate-300 rounded-md leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                Pustaka Tambahan / Pendukung
              </label>
              <textarea
                rows={4}
                value={rps.pustakaTambahan.join('\n')}
                onChange={(e) =>
                  onUpdateRps({
                    ...rps,
                    pustakaTambahan: e.target.value.split('\n').filter((l) => l.trim() !== '')
                  })
                }
                className="w-full p-3 border border-slate-300 rounded-md leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-200">
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                Kode Profil Lulusan (PL)
              </label>
              <input
                type="text"
                value={rps.catatanAkademik.kodeProfilLulusan}
                onChange={(e) =>
                  onUpdateRps({
                    ...rps,
                    catatanAkademik: {
                      ...rps.catatanAkademik,
                      kodeProfilLulusan: e.target.value
                    }
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono-num"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-900 mb-1">
                Pendekatan Pembelajaran OBE (Standar IKU-7)
              </label>
              <select
                value={rps.catatanAkademik.pendekatanPembelajaran}
                onChange={(e) =>
                  onUpdateRps({
                    ...rps,
                    catatanAkademik: {
                      ...rps.catatanAkademik,
                      pendekatanPembelajaran: e.target.value as any
                    }
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
              >
                <option value="Case-Based Learning (CBL)">Case-Based Learning (CBL)</option>
                <option value="Project-Based Learning (PjBL)">Project-Based Learning (PjBL)</option>
                <option value="Hybrid Case-Based & Project-Based Learning">
                  Hybrid Case-Based & Project-Based Learning
                </option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 4: MATRIKS PEMBELAJARAN 16 PERTEMUAN (MINGGU 1 - 16 + UTS/UAS)
          ==================================================================== */}
      {activeSubTab === 'matriks-16' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Matriks Rencana Pembelajaran 16 Pertemuan (Termasuk UTS Minggu 8 & UAS Minggu 16)
              </h3>
              <p className="text-xs text-slate-500">
                Total akumulasi bobot penilaian wajib tepat 100%. Proporsi CBL + PjBL saat ini:{' '}
                <strong className="font-mono-num text-slate-800">
                  {validation.bobotIku7PartisipatifProyek}%
                </strong>
                .
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`px-3.5 py-2 rounded-lg font-mono-num text-xs font-bold border ${
                  Math.abs(validation.totalBobotAsesmen - 100) < 0.01
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}
              >
                Total Bobot: {validation.totalBobotAsesmen}% / 100%
              </div>
              {Math.abs(validation.totalBobotAsesmen - 100) >= 0.01 && (
                <button
                  type="button"
                  onClick={handleAutoFixObe}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  Normalisasi Bobot ke 100%
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="border border-slate-700 p-2 text-center w-14">Mg</th>
                  <th className="border border-slate-700 p-2 text-left w-36">Sub-CPMK & Bloom</th>
                  <th className="border border-slate-700 p-2 text-left w-60">Kemampuan Akhir & Materi</th>
                  <th className="border border-slate-700 p-2 text-left w-48">Metode & Pengalaman (TM/BT/BM)</th>
                  <th className="border border-slate-700 p-2 text-left w-48">Indikator & Kriteria</th>
                  <th className="border border-slate-700 p-2 text-left w-44">Kategori Asesmen (IKU-7)</th>
                  <th className="border border-slate-700 p-2 text-center w-24">Bobot (%)</th>
                </tr>
              </thead>
              <tbody>
                {rps.matriksPertemuan.map((row) => {
                  const isExam = row.tipePertemuan === 'UTS' || row.tipePertemuan === 'UAS';
                  return (
                    <tr
                      key={row.mingguKe}
                      className={isExam ? 'bg-amber-50/70' : 'bg-white hover:bg-slate-50/80'}
                    >
                      <td className="border border-slate-200 p-2 text-center font-mono-num font-bold text-slate-900 align-top">
                        <div>M-{row.mingguKe}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{row.tipePertemuan}</div>
                      </td>
                      <td className="border border-slate-200 p-2 align-top space-y-1.5">
                        <input
                          type="text"
                          value={row.subCpmkKode}
                          onChange={(e) =>
                            handleUpdateWeekField(row.mingguKe, 'subCpmkKode', e.target.value)
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded font-mono-num text-[11px] font-bold"
                          title="Kode Sub-CPMK"
                        />
                        <input
                          type="text"
                          value={row.taksonomiBloom}
                          onChange={(e) =>
                            handleUpdateWeekField(row.mingguKe, 'taksonomiBloom', e.target.value)
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded font-mono-num text-[11px]"
                          placeholder="C4, P3"
                          title="Gradasi Taksonomi Bloom"
                        />
                      </td>
                      <td className="border border-slate-200 p-2 align-top space-y-1.5">
                        <textarea
                          rows={2}
                          value={row.kemampuanAkhir}
                          onChange={(e) =>
                            handleUpdateWeekField(row.mingguKe, 'kemampuanAkhir', e.target.value)
                          }
                          className="w-full p-1.5 border border-slate-300 rounded text-[11px]"
                        />
                        <textarea
                          rows={2}
                          value={row.materiPembelajaran}
                          onChange={(e) =>
                            handleUpdateWeekField(row.mingguKe, 'materiPembelajaran', e.target.value)
                          }
                          className="w-full p-1.5 border border-slate-200 bg-slate-50 rounded text-[11px]"
                        />
                      </td>
                      <td className="border border-slate-200 p-2 align-top space-y-1 text-[11px]">
                        <textarea
                          rows={2}
                          value={row.bentukMetodePembelajaran}
                          onChange={(e) =>
                            handleUpdateWeekField(
                              row.mingguKe,
                              'bentukMetodePembelajaran',
                              e.target.value
                            )
                          }
                          className="w-full p-1.5 border border-slate-300 rounded text-[11px]"
                        />
                        <div className="text-[10px] text-slate-600 font-mono-num">
                          <div>TM: {row.pengalamanBelajar.tm}</div>
                          <div>BT: {row.pengalamanBelajar.bt}</div>
                          <div>BM: {row.pengalamanBelajar.bm}</div>
                        </div>
                      </td>
                      <td className="border border-slate-200 p-2 align-top space-y-1.5">
                        <textarea
                          rows={2}
                          value={row.indikator}
                          onChange={(e) =>
                            handleUpdateWeekField(row.mingguKe, 'indikator', e.target.value)
                          }
                          className="w-full p-1.5 border border-slate-300 rounded text-[11px]"
                        />
                        <textarea
                          rows={2}
                          value={row.kriteriaBentukPenilaian}
                          onChange={(e) =>
                            handleUpdateWeekField(
                              row.mingguKe,
                              'kriteriaBentukPenilaian',
                              e.target.value
                            )
                          }
                          className="w-full p-1.5 border border-slate-200 bg-slate-50 rounded text-[11px]"
                        />
                      </td>
                      <td className="border border-slate-200 p-2 align-top">
                        <select
                          value={row.kategoriAsesmen}
                          onChange={(e) =>
                            handleUpdateWeekField(
                              row.mingguKe,
                              'kategoriAsesmen',
                              e.target.value as AssessmentCategory
                            )
                          }
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-[11px] bg-white"
                        >
                          <option value="Partisipatif (Case Method)">Partisipatif (Case Method)</option>
                          <option value="Kolaboratif (Team-Based Project)">
                            Kolaboratif (Team-Based Project)
                          </option>
                          <option value="Kuis & Tugas Terstruktur">Kuis & Tugas Terstruktur</option>
                          <option value="UTS">UTS (Minggu 8)</option>
                          <option value="UAS">UAS (Minggu 16)</option>
                        </select>
                      </td>
                      <td className="border border-slate-200 p-2 align-top text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={row.bobotPenilaian}
                          onChange={(e) =>
                            handleUpdateWeekWeight(row.mingguKe, Number(e.target.value))
                          }
                          className="w-16 px-2 py-1.5 text-center border border-slate-300 rounded font-mono-num font-bold text-slate-900"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
