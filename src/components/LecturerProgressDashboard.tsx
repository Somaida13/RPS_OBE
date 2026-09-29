import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Edit3,
  Plus,
  ShieldCheck,
  Wand2
} from 'lucide-react';
import { RPSDocument, StatusRPS } from '../types/rps';
import { validateObeRps } from '../utils/obeValidator';
import { UnikmaLogoEmblem } from './UnikmaVisuals';

interface LecturerProgressDashboardProps {
  rpsList: RPSDocument[];
  selectedRpsId: string;
  onSelectRpsForEdit: (id: string) => void;
  onSelectRpsForPreview: (id: string) => void;
  onQuickAuthorizeOrFix: (id: string) => void;
  onCreateNewRps: (namaMk: string, kodeMk: string, dosenNama: string, semester: number) => void;
}

export const LecturerProgressDashboard: React.FC<LecturerProgressDashboardProps> = ({
  rpsList,
  selectedRpsId,
  onSelectRpsForEdit,
  onSelectRpsForPreview,
  onQuickAuthorizeOrFix,
  onCreateNewRps
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | StatusRPS>('ALL');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newNamaMk, setNewNamaMk] = useState('');
  const [newKodeMk, setNewKodeMk] = useState('K572120');
  const [newDosen, setNewDosen] = useState('Dr. Ir. Hasymi Al-Kautsar, S.Kom., M.Kom.');
  const [newSemester, setNewSemester] = useState(5);

  const enrichedList = rpsList.map((rps) => ({
    rps,
    validation: validateObeRps(rps)
  }));

  const filteredList = enrichedList.filter(({ rps }) => {
    const matchesSearch =
      rps.identitas.namaMk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rps.identitas.kodeMk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rps.otorisasi.dosenPengembang.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rps.identitas.rumpunMk.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || rps.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Aggregate metrics
  const totalCourses = enrichedList.length;
  const totalObeValid = enrichedList.filter((item) => item.validation.isValidObe).length;
  const totalAuthorized = enrichedList.filter(
    (item) => item.rps.status === 'Terotorisasi Penuh'
  ).length;
  const avgIku7Ratio = Math.round(
    enrichedList.reduce((acc, item) => acc + item.validation.bobotIku7PartisipatifProyek, 0) /
      Math.max(1, totalCourses)
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNamaMk.trim() || !newKodeMk.trim()) return;
    onCreateNewRps(newNamaMk.trim(), newKodeMk.trim(), newDosen.trim(), newSemester);
    setNewNamaMk('');
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Strip — Clean Single-Elevation Grid */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-4 max-w-3xl">
            <UnikmaLogoEmblem size={84} showText={true} className="shrink-0" />
            <div className="space-y-1">
              <div className="text-xs text-slate-500">
                Fakultas Sains dan Teknologi · Program Studi S1 Sistem Informasi · Tahun Akademik 2026/2027
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Dashboard Pemantauan Real-Time Penyusunan & Validasi RPS Berbasis OBE
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Buat Dokumen RPS Baru
          </button>
        </div>

        {/* Inline Create New RPS Drawer */}
        {showNewModal && (
          <form
            onSubmit={handleCreateSubmit}
            className="my-5 p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-4 text-xs"
          >
            <div className="font-bold text-slate-900">
              Inisialisasi Dokumen RPS Baru (Templat Otomatis 16 Pertemuan Standar UNIKMA)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode MK</label>
                <input
                  type="text"
                  required
                  value={newKodeMk}
                  onChange={(e) => setNewKodeMk(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono-num"
                  placeholder="K572120"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Nama Mata Kuliah</label>
                <input
                  type="text"
                  required
                  value={newNamaMk}
                  onChange={(e) => setNewNamaMk(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                  placeholder="Contoh: Pemrograman Web Berbasis Framework"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={newSemester}
                  onChange={(e) => setNewSemester(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-mono-num"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="w-full md:w-1/2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Dosen Pengembang RPS
                </label>
                <input
                  type="text"
                  required
                  value={newDosen}
                  onChange={(e) => setNewDosen(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded"
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md cursor-pointer"
                >
                  Simpan & Buka Editor RPS
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 4 Key Institutional OBE Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-5">
          <div className="space-y-1">
            <div className="text-xs text-slate-500">Total Dokumen RPS Terdaftar</div>
            <div className="text-2xl font-bold font-mono-num text-slate-900">
              {totalCourses} Mata Kuliah
            </div>
            <div className="text-xs text-slate-600">
              100% terintegrasi dengan matriks 16 pertemuan
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-6">
            <div className="text-xs text-slate-500">Kepatuhan Validasi Aturan OBE</div>
            <div className="text-2xl font-bold font-mono-num text-emerald-700">
              {totalObeValid} / {totalCourses} Valid
            </div>
            <div className="text-xs text-slate-600">
              Bobot asesmen = 100% & rantai CPL–CPMK utuh
            </div>
          </div>

          <div className="space-y-1 lg:border-l lg:border-slate-200 lg:pl-6">
            <div className="text-xs text-slate-500">Status Otorisasi QR Kaprodi SI</div>
            <div className="text-2xl font-bold font-mono-num text-slate-900">
              {totalAuthorized} / {totalCourses} Sah
            </div>
            <div className="text-xs text-slate-600">
              Tanda tangan digital Dosen, RMK & Kaprodi
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-6">
            <div className="text-xs text-slate-500">Rata-rata Proporsi CBL + PjBL (IKU-7)</div>
            <div className="text-2xl font-bold font-mono-num text-slate-900">
              {avgIku7Ratio}%
            </div>
            <div className="text-xs text-slate-600">
              Melampaui ambang batas minimum 50% SN-Dikti
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Live Monitoring Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Segmented Interactive Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                { value: 'ALL', label: 'Semua Mata Kuliah' },
                { value: 'Terotorisasi Penuh', label: 'Terotorisasi Penuh' },
                { value: 'Menunggu Otorisasi Kaprodi', label: 'Menunggu Kaprodi' },
                { value: 'Perlu Perbaikan OBE', label: 'Perlu Perbaikan OBE' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.value
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Kode MK, Mata Kuliah, Dosen..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        {/* High-Density Lecturer Progress Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-200 text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-3 text-left">Mata Kuliah & Rumpun (RMK)</th>
                <th className="py-3 px-3 text-left">Dosen Pengembang RPS</th>
                <th className="py-3 px-3 text-left">Pemetaan CPL & CPMK</th>
                <th className="py-3 px-3 text-right">Total Bobot</th>
                <th className="py-3 px-3 text-right">Rasio IKU-7</th>
                <th className="py-3 px-3 text-left">Status Validasi OBE & Otorisasi</th>
                <th className="py-3 px-3 text-right">Tindakan Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map(({ rps, validation }) => {
                const isSelected = rps.id === selectedRpsId;
                const totalSks = rps.identitas.bobotSksTeori + rps.identitas.bobotSksPraktikum;
                return (
                  <tr
                    key={rps.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-slate-100/90' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-3 align-top">
                      <div className="font-bold text-slate-900 text-sm">
                        {rps.identitas.namaMk}
                      </div>
                      <div className="text-xs text-slate-500 font-mono-num mt-0.5">
                        {rps.identitas.kodeMk} · Sem {rps.identitas.semester} · {totalSks} SKS ({rps.identitas.bobotSksTeori}T/{rps.identitas.bobotSksPraktikum}P) · {rps.identitas.rumpunMk}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 align-top">
                      <div className="font-semibold text-slate-900">
                        {rps.otorisasi.dosenPengembang.nama}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono-num mt-0.5">
                        NIDN. {rps.otorisasi.dosenPengembang.nidn} · Update: {rps.lastUpdated}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 align-top">
                      <div className="font-mono-num font-semibold text-slate-800">
                        {rps.cplProdi.map((c) => c.kode).join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono-num mt-0.5">
                        {rps.cpmkList.length} CPMK · {rps.subCpmkList.length} Sub-CPMK · 16 Pertemuan
                      </div>
                    </td>

                    <td className="py-3.5 px-3 align-top text-right font-mono-num">
                      <div
                        className={`font-bold text-sm ${
                          Math.abs(validation.totalBobotAsesmen - 100) < 0.01
                            ? 'text-emerald-700'
                            : 'text-red-600'
                        }`}
                      >
                        {validation.totalBobotAsesmen}%
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Target: 100%
                      </div>
                    </td>

                    <td className="py-3.5 px-3 align-top text-right font-mono-num">
                      <div className="font-bold text-slate-900 text-sm">
                        {validation.bobotIku7PartisipatifProyek}%
                      </div>
                      <div className="text-[11px] text-slate-500">
                        CBL + PjBL
                      </div>
                    </td>

                    <td className="py-3.5 px-3 align-top">
                      {validation.isValidObe ? (
                        <div className="space-y-0.5">
                          <div className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{rps.status}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            8/8 Aturan OBE Terpenuhi
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <div className="inline-flex items-center gap-1.5 font-semibold text-red-700">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>Perlu Perbaikan OBE</span>
                          </div>
                          <div className="text-[11px] text-red-600">
                            Bobot {validation.totalBobotAsesmen}% / {validation.unmappedCpmkCodes.length} CPMK belum terikat
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 align-top text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {(!validation.isValidObe || rps.status !== 'Terotorisasi Penuh') && (
                          <button
                            type="button"
                            onClick={() => onQuickAuthorizeOrFix(rps.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap cursor-pointer"
                            title="Perbaiki Otomatis & Otorisasi QR"
                          >
                            {!validation.isValidObe ? (
                              <>
                                <Wand2 className="w-3.5 h-3.5" />
                                Auto-Fix OBE
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Otorisasi QR
                              </>
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectRpsForEdit(rps.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit RPS
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectRpsForPreview(rps.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Dokumen UNIKMA
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
