/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Printer, CheckCircle2, AlertTriangle } from 'lucide-react';
import { INITIAL_RPS_LIST, UNIKMA_HEADER_DEFAULT, MASTER_CPL_PRODI_SI } from './data/mockRpsData';
import { RPSDocument } from './types/rps';
import { validateObeRps } from './utils/obeValidator';
import { generateOfficialUnikmaPdf } from './utils/pdfGenerator';
import { LecturerProgressDashboard } from './components/LecturerProgressDashboard';
import { RpsEditorWorkspace } from './components/RpsEditorWorkspace';
import { UnikmaDocumentPreview } from './components/UnikmaDocumentPreview';
import { ArchitectureBlueprintView } from './components/ArchitectureBlueprintView';

type MainViewMode = 'dashboard' | 'editor' | 'preview' | 'architecture';

export default function App() {
  const [rpsList, setRpsList] = useState<RPSDocument[]>(INITIAL_RPS_LIST);
  const [selectedRpsId, setSelectedRpsId] = useState<string>(INITIAL_RPS_LIST[0].id);
  const [activeView, setActiveView] = useState<MainViewMode>('dashboard');

  const activeRps = useMemo(
    () => rpsList.find((r) => r.id === selectedRpsId) || rpsList[0],
    [rpsList, selectedRpsId]
  );

  const activeValidation = useMemo(() => validateObeRps(activeRps), [activeRps]);

  const handleUpdateActiveRps = (updated: RPSDocument) => {
    const newValidation = validateObeRps(updated);
    const allSigned =
      updated.otorisasi.dosenPengembang.statusOtorisasi === 'Terverifikasi QR' &&
      updated.otorisasi.koordinatorRmk.statusOtorisasi === 'Terverifikasi QR' &&
      updated.otorisasi.ketuaProdi.statusOtorisasi === 'Terverifikasi QR';

    const computedStatus = !newValidation.isValidObe
      ? 'Perlu Perbaikan OBE'
      : allSigned
      ? 'Terotorisasi Penuh'
      : 'Menunggu Otorisasi Kaprodi';

    const finalized: RPSDocument = {
      ...updated,
      status: computedStatus
    };

    setRpsList((prev) => prev.map((item) => (item.id === finalized.id ? finalized : item)));
  };

  const handleAuthorizeRole = (
    role: 'dosenPengembang' | 'koordinatorRmk' | 'ketuaProdi'
  ) => {
    const roleCode =
      role === 'dosenPengembang' ? 'DSN' : role === 'koordinatorRmk' ? 'RMK' : 'KPS';
    const randomHex = Math.floor(10000 + Math.random() * 90000)
      .toString(16)
      .toUpperCase();
    const updatedOtorisasi = {
      ...activeRps.otorisasi,
      [role]: {
        ...activeRps.otorisasi[role],
        statusOtorisasi: 'Terverifikasi QR' as const,
        tanggalOtorisasi: '27 September 2026',
        qrVerificationHash: `UNIKMA-QR-RPS-${activeRps.identitas.kodeMk}-${roleCode}-${randomHex}`
      }
    };

    handleUpdateActiveRps({
      ...activeRps,
      lastUpdated: 'Baru saja diotorisasi',
      otorisasi: updatedOtorisasi
    });
  };

  const handleQuickAuthorizeOrFix = (rpsId: string) => {
    const target = rpsList.find((r) => r.id === rpsId);
    if (!target) return;

    // 1. Fix any unmapped CPMKs
    const fixedCpmks = target.cpmkList.map((cpmk, i) => {
      if (!cpmk.mappedCplCodes || cpmk.mappedCplCodes.length === 0) {
        return {
          ...cpmk,
          mappedCplCodes: [target.cplProdi[i % target.cplProdi.length]?.kode || 'CPL01']
        };
      }
      return cpmk;
    });

    // 2. Balance 16-week total assessment weight to 100%
    const sumWeight = target.matriksPertemuan.reduce(
      (s, m) => s + (Number(m.bobotPenilaian) || 0),
      0
    );
    const diff = Number((100 - sumWeight).toFixed(2));
    const fixedMatrix = target.matriksPertemuan.map((m) =>
      m.mingguKe === 16
        ? { ...m, bobotPenilaian: Math.max(5, Number((m.bobotPenilaian + diff).toFixed(2))) }
        : m
    );

    // 3. Verify all 3 QR signatures
    const fixedDoc: RPSDocument = {
      ...target,
      status: 'Terotorisasi Penuh',
      progresPengisianPersen: 100,
      lastUpdated: 'Baru saja diotorisasi penuh',
      cpmkList: fixedCpmks,
      matriksPertemuan: fixedMatrix,
      otorisasi: {
        dosenPengembang: {
          ...target.otorisasi.dosenPengembang,
          statusOtorisasi: 'Terverifikasi QR',
          tanggalOtorisasi: '27 September 2026'
        },
        koordinatorRmk: {
          ...target.otorisasi.koordinatorRmk,
          statusOtorisasi: 'Terverifikasi QR',
          tanggalOtorisasi: '27 September 2026'
        },
        ketuaProdi: {
          ...target.otorisasi.ketuaProdi,
          statusOtorisasi: 'Terverifikasi QR',
          tanggalOtorisasi: '27 September 2026',
          qrVerificationHash: `UNIKMA-QR-RPS-${target.identitas.kodeMk}-KPS-99A4F`
        }
      }
    };

    setRpsList((prev) => prev.map((r) => (r.id === rpsId ? fixedDoc : r)));
  };

  const handleCreateNewRps = (
    namaMk: string,
    kodeMk: string,
    dosenNama: string,
    semester: number
  ) => {
    const newId = `rps-${kodeMk.toLowerCase()}-${Date.now()}`;
    const templateBase = INITIAL_RPS_LIST[0];
    const newDoc: RPSDocument = {
      ...templateBase,
      id: newId,
      status: 'Menunggu Otorisasi Kaprodi',
      lastUpdated: 'Baru saja dibuat',
      progresPengisianPersen: 100,
      institusi: UNIKMA_HEADER_DEFAULT,
      identitas: {
        namaMk,
        kodeMk: kodeMk.toUpperCase(),
        rumpunMk: 'Rekayasa & Pengembangan Sistem Informasi',
        bobotSksTeori: 2,
        bobotSksPraktikum: 1,
        semester,
        tanggalPenyusunan: '27 September 2026',
        tahunAkademik: '2026/2027 Ganjil',
        revisiKe: '01'
      },
      otorisasi: {
        ...templateBase.otorisasi,
        dosenPengembang: {
          nama: dosenNama,
          nidn: '0615098901',
          jabatan: 'Dosen Pengembang RPS',
          statusOtorisasi: 'Terverifikasi QR',
          tanggalOtorisasi: '27 September 2026',
          qrVerificationHash: `UNIKMA-QR-RPS-${kodeMk.toUpperCase()}-DSN-71B2C`
        },
        ketuaProdi: {
          ...templateBase.otorisasi.ketuaProdi,
          statusOtorisasi: 'Menunggu Tanda Tangan'
        }
      },
      cplProdi: [
        MASTER_CPL_PRODI_SI[0],
        MASTER_CPL_PRODI_SI[2],
        MASTER_CPL_PRODI_SI[3],
        MASTER_CPL_PRODI_SI[5]
      ]
    };

    setRpsList((prev) => [newDoc, ...prev]);
    setSelectedRpsId(newId);
    setActiveView('editor');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* ====================================================================
          TOP BAR CONTRACT: 3 Zones (Brand Wordmark — 4 Nav Links — Actions)
          ==================================================================== */}
      <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3.5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('dashboard');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
          >
            SIM-RPS OBE UNIKMA
          </a>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
                activeView === 'dashboard'
                  ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              Dashboard Progres
            </button>
            <button
              type="button"
              onClick={() => setActiveView('editor')}
              className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
                activeView === 'editor'
                  ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              Editor OBE
            </button>
            <button
              type="button"
              onClick={() => setActiveView('preview')}
              className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
                activeView === 'preview'
                  ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              Dokumen Resmi
            </button>
            <button
              type="button"
              onClick={() => setActiveView('architecture')}
              className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
                activeView === 'architecture'
                  ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-slate-900'
                  : 'hover:text-slate-900'
              }`}
            >
              Arsitektur & SQL
            </button>
          </nav>

          {/* Zone 3: Course Selector & Primary Print Action */}
          <div className="flex items-center gap-2.5">
            <select
              value={selectedRpsId}
              onChange={(e) => setSelectedRpsId(e.target.value)}
              aria-label="Pilih Mata Kuliah Aktif"
              className="max-w-[220px] sm:max-w-[260px] truncate px-3 py-1.5 text-xs font-medium bg-slate-100 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
            >
              {rpsList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.identitas.kodeMk} — {item.identitas.namaMk}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setActiveView('preview');
                generateOfficialUnikmaPdf(activeRps, activeValidation);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="no-print md:hidden flex items-center gap-1 px-4 py-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
        {(
          [
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'editor', label: 'Editor OBE' },
            { id: 'preview', label: 'Dokumen UNIKMA' },
            { id: 'architecture', label: 'Arsitektur & SQL' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveView(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeView === tab.id ? 'bg-slate-900 text-white' : 'text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contextual Institutional Bar (Hidden in Print) */}
      <div className="no-print bg-slate-900 text-slate-200 border-b border-slate-800 px-6 py-2.5 text-xs">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-slate-300">
            <span className="font-semibold text-white">Universitas Komputama (UNIKMA)</span>
            <span aria-hidden="true">·</span>
            <span>Fakultas Sains dan Teknologi</span>
            <span aria-hidden="true">·</span>
            <span>Program Studi S1 Sistem Informasi</span>
          </div>

          <div className="flex items-center gap-3 font-mono-num">
            <span>
              MK Aktif: <strong className="text-white">{activeRps.identitas.kodeMk}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Total Bobot:{' '}
              <strong
                className={
                  Math.abs(activeValidation.totalBobotAsesmen - 100) < 0.01
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }
              >
                {activeValidation.totalBobotAsesmen}%
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              {activeValidation.isValidObe ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">OBE Valid</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-semibold">Perlu Perbaikan OBE</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6">
        {activeView === 'dashboard' && (
          <LecturerProgressDashboard
            rpsList={rpsList}
            selectedRpsId={selectedRpsId}
            onSelectRpsForEdit={(id) => {
              setSelectedRpsId(id);
              setActiveView('editor');
            }}
            onSelectRpsForPreview={(id) => {
              setSelectedRpsId(id);
              setActiveView('preview');
            }}
            onQuickAuthorizeOrFix={handleQuickAuthorizeOrFix}
            onCreateNewRps={handleCreateNewRps}
          />
        )}

        {activeView === 'editor' && (
          <RpsEditorWorkspace
            rps={activeRps}
            validation={activeValidation}
            onUpdateRps={handleUpdateActiveRps}
            onSwitchToPreview={() => setActiveView('preview')}
          />
        )}

        {activeView === 'preview' && (
          <UnikmaDocumentPreview
            rps={activeRps}
            validation={activeValidation}
            onAuthorizeRole={handleAuthorizeRole}
          />
        )}

        {activeView === 'architecture' && (
          <ArchitectureBlueprintView
            activeRps={activeRps}
            validation={activeValidation}
          />
        )}
      </main>

      {/* Quiet Institutional Footer (Hidden in Print) */}
      <footer className="no-print border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            Lembaga Penjaminan Mutu (LPM) Universitas Komputama (UNIKMA) · Fakultas Sains dan Teknologi — Program Studi Sistem Informasi
          </div>
          <div className="font-mono-num">
            Kampus I Cimanggu · Kampus II Karangpucung · Kampus III Cilacap Utara
          </div>
        </div>
      </footer>
    </div>
  );
}
