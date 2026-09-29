import React, { useState } from 'react';
import {
  Database,
  Server,
  FileCode,
  Copy,
  Check,
  Play,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  PRISMA_SCHEMA_SPEC,
  SQL_DDL_SPEC,
  BACKEND_VALIDATION_SPEC,
  PYTHON_DOCX_GENERATOR_SPEC
} from '../data/architectureSpec';
import { RPSDocument, OBEValidationSummary } from '../types/rps';

interface ArchitectureBlueprintViewProps {
  activeRps: RPSDocument;
  validation: OBEValidationSummary;
}

export const ArchitectureBlueprintView: React.FC<ArchitectureBlueprintViewProps> = ({
  activeRps,
  validation
}) => {
  const [selectedSpecTab, setSelectedSpecTab] = useState<
    'prisma-sql' | 'backend-api' | 'docx-engine'
  >('prisma-sql');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [simulatedApiResponse, setSimulatedApiResponse] = useState<string | null>(null);

  const handleCopyCode = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunApiSimulation = () => {
    const responsePayload = {
      status: validation.isValidObe ? 200 : 422,
      endpoint: `POST /api/v1/rps/${activeRps.identitas.kodeMk}/validate-obe`,
      institution: 'Universitas Komputama (UNIKMA) - FST Prodi Sistem Informasi',
      course: {
        kodeMk: activeRps.identitas.kodeMk,
        namaMk: activeRps.identitas.namaMk,
        totalSks: activeRps.identitas.bobotSksTeori + activeRps.identitas.bobotSksPraktikum
      },
      obeCompliance: {
        isValidObe: validation.isValidObe,
        complianceScore: `${validation.skorKepatuhan}%`,
        totalAssessmentWeight: `${validation.totalBobotAsesmen}%`,
        iku7ParticipativeProjectWeight: `${validation.bobotIku7PartisipatifProyek}%`,
        unmappedCpmkCodes: validation.unmappedCpmkCodes,
        orphanCplCodes: validation.orphanCplCodes
      },
      rulesChecked: validation.rules.map((r) => ({
        code: r.kodeAturan,
        passed: r.passed,
        currentValue: r.nilaiSaatIni,
        message: r.pesanDetail
      })),
      evaluatedAt: new Date().toISOString()
    };

    setSimulatedApiResponse(JSON.stringify(responsePayload, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Top Blueprint Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="text-xs text-slate-500">
              Dokumentasi Teknis Senior Full-Stack & Kurikulum Engineer · Standar OBE UNIKMA
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Arsitektur Basis Data Relasional, Logika Backend Validator OBE, & Template Engine Dokumen
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setSelectedSpecTab('prisma-sql')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedSpecTab === 'prisma-sql'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              1. Skema Database (Prisma & SQL DDL)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSpecTab('backend-api')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedSpecTab === 'backend-api'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server className="w-4 h-4" />
              2. Backend API & Simulator Validasi OBE
            </button>
            <button
              type="button"
              onClick={() => setSelectedSpecTab('docx-engine')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedSpecTab === 'docx-engine'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-4 h-4" />
              3. Script Generator Python-docx & React
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SPEC 1: PRISMA SCHEMA & POSTGRESQL DDL + TRIGGERS
          ==================================================================== */}
      {selectedSpecTab === 'prisma-sql' && (
        <div className="space-y-6">
          {/* Entity Relationship Summary Table */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Peta Relasi Entitas Basis Data (ERD Tabel Relasional OBE UNIKMA)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-semibold">
                    <th className="border border-slate-200 p-2.5 text-left">Nama Tabel</th>
                    <th className="border border-slate-200 p-2.5 text-left">Kardinalitas & Relasi</th>
                    <th className="border border-slate-200 p-2.5 text-left">Fungsi & Constraint Integritas OBE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="border border-slate-200 p-2.5 font-mono-num font-bold">institution_profiles</td>
                    <td className="border border-slate-200 p-2.5 font-mono-num">1 : N → rps_documents</td>
                    <td className="border border-slate-200 p-2.5">Menyimpan Kop Resmi UNIKMA, Fakultas Sains & Teknologi, Prodi SI, dan Alamat Kampus I, II, III.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2.5 font-mono-num font-bold">cpl_masters & graduate_profiles</td>
                    <td className="border border-slate-200 p-2.5 font-mono-num">M : N ↔ rps_cpmks</td>
                    <td className="border border-slate-200 p-2.5">Master Profil Lulusan (PL01..PL03) dan CPL Prodi (CPL01..CPL10) sesuai ranah Sikap, Pengetahuan, KU, KK.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2.5 font-mono-num font-bold">rps_cpmks & rps_cpmk_cpl_pivots</td>
                    <td className="border border-slate-200 p-2.5 font-mono-num">1 : N → rps_sub_cpmks</td>
                    <td className="border border-slate-200 p-2.5">Menjamin setiap CPMK wajib terikat ke minimal 1 CPL melalui tabel pivot relasional.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2.5 font-mono-num font-bold">rps_weekly_matrices</td>
                    <td className="border border-slate-200 p-2.5 font-mono-num">16 Baris / RPS Document</td>
                    <td className="border border-slate-200 p-2.5">Constraint <code className="font-mono-num">minggu_ke BETWEEN 1 AND 16</code>, Minggu 8 = UTS, Minggu 16 = UAS, dan Trigger <code className="font-mono-num">SUM(bobot_penilaian) = 100.00</code>.</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-2.5 font-mono-num font-bold">rps_authorizations</td>
                    <td className="border border-slate-200 p-2.5 font-mono-num">3 Pejabat / RPS Document</td>
                    <td className="border border-slate-200 p-2.5">Menyimpan status otorisasi & hash QR kriptografis untuk Dosen Pengembang, Koordinator RMK, dan Ketua Prodi SI.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prisma Schema Box */}
            <div className="bg-slate-900 text-slate-100 rounded-lg border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
                <span className="font-mono-num text-xs font-semibold text-amber-400">
                  prisma/schema.prisma (PostgreSQL ORM)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode('prisma', PRISMA_SCHEMA_SPEC)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
                >
                  {copiedId === 'prisma' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'prisma' ? 'Tersalin' : 'Salin Schema'}
                </button>
              </div>
              <pre className="p-4 text-[11px] font-mono-num leading-relaxed overflow-x-auto max-h-[540px] text-slate-200">
                <code>{PRISMA_SCHEMA_SPEC}</code>
              </pre>
            </div>

            {/* PostgreSQL Trigger & DDL Box */}
            <div className="bg-slate-900 text-slate-100 rounded-lg border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
                <span className="font-mono-num text-xs font-semibold text-sky-400">
                  migrations/01_obe_constraints_and_triggers.sql
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode('sql', SQL_DDL_SPEC)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
                >
                  {copiedId === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'sql' ? 'Tersalin' : 'Salin SQL DDL'}
                </button>
              </div>
              <pre className="p-4 text-[11px] font-mono-num leading-relaxed overflow-x-auto max-h-[540px] text-slate-200">
                <code>{SQL_DDL_SPEC}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SPEC 2: BACKEND OBE VALIDATION LOGIC & LIVE API TESTER
          ==================================================================== */}
      {selectedSpecTab === 'backend-api' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
              <span className="font-mono-num text-xs font-semibold text-amber-400">
                src/services/obeValidation.service.ts
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode('backend', BACKEND_VALIDATION_SPEC)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
              >
                {copiedId === 'backend' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'backend' ? 'Tersalin' : 'Salin Kode Service'}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono-num leading-relaxed overflow-x-auto max-h-[560px] text-slate-200">
              <code>{BACKEND_VALIDATION_SPEC}</code>
            </pre>
          </div>

          {/* Interactive Live API Endpoint Simulator */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Simulator Endpoint Validasi OBE
                </h3>
                <p className="text-xs text-slate-500 font-mono-num">
                  POST /api/v1/rps/{activeRps.identitas.kodeMk}/validate-obe
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunApiSimulation}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                Uji Validasi Payload Aktif
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mata Kuliah Aktif:</span>
                <span className="font-semibold text-slate-900">
                  {activeRps.identitas.kodeMk} — {activeRps.identitas.namaMk}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status HTTP Prediksi:</span>
                <span
                  className={`font-mono-num font-bold ${
                    validation.isValidObe ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {validation.isValidObe ? '200 OK (OBE_COMPLIANT)' : '422 UNPROCESSABLE_ENTITY'}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono-num text-[11px] overflow-x-auto max-h-[380px]">
              <pre>
                {simulatedApiResponse ||
                  JSON.stringify(
                    {
                      info: 'Klik tombol "Uji Validasi Payload Aktif" untuk mengeksekusi validator OBE terhadap dokumen RPS yang sedang aktif.',
                      targetCourse: activeRps.identitas.kodeMk,
                      currentTotalBobot: `${validation.totalBobotAsesmen}%`
                    },
                    null,
                    2
                  )}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SPEC 3: PYTHON-DOCX DOCUMENT GENERATOR SCRIPT
          ==================================================================== */}
      {selectedSpecTab === 'docx-engine' && (
        <div className="bg-slate-900 text-slate-100 rounded-lg border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <span className="font-mono-num text-xs font-semibold text-emerald-400">
              scripts/unikma_rps_docx_generator.py (Python-docx Official UNIKMA Layout Generator)
            </span>
            <button
              type="button"
              onClick={() => handleCopyCode('python', PYTHON_DOCX_GENERATOR_SPEC)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
            >
              {copiedId === 'python' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId === 'python' ? 'Tersalin' : 'Salin Script Python-docx'}
            </button>
          </div>
          <pre className="p-5 text-xs font-mono-num leading-relaxed overflow-x-auto text-slate-200">
            <code>{PYTHON_DOCX_GENERATOR_SPEC}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
