import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  AlignmentType,
  VerticalAlign,
  WidthType,
  BorderStyle,
  ShadingType,
  PageOrientation,
  TableLayoutType
} from 'docx';
import { RPSDocument, OBEValidationSummary } from '../types/rps';
import {
  createUnikmaLogoDataUrl,
  createQrCodeDataUrl,
  dataUrlToUint8Array
} from './pdfGenerator';

const FONT_FAMILY = 'Times New Roman';

const STANDARD_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 6, color: '0F172A' },
  bottom: { style: BorderStyle.SINGLE, size: 6, color: '0F172A' },
  left: { style: BorderStyle.SINGLE, size: 6, color: '0F172A' },
  right: { style: BorderStyle.SINGLE, size: 6, color: '0F172A' }
};

const CELL_PADDING = {
  top: 80,
  bottom: 80,
  left: 110,
  right: 110
};

function makeParagraph(
  text: string,
  options?: {
    bold?: boolean;
    italics?: boolean;
    underline?: boolean;
    sizePt?: number;
    color?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    spacingAfter?: number;
    spacingBefore?: number;
  }
): Paragraph {
  const lines = (text || '').split('\n');
  const sizeHalfPt = (options?.sizePt || 9) * 2;
  return new Paragraph({
    alignment: options?.align || AlignmentType.LEFT,
    spacing: {
      before: options?.spacingBefore ?? 20,
      after: options?.spacingAfter ?? 40,
      line: 250
    },
    children: lines.flatMap((line, idx) => {
      const run = new TextRun({
        text: line,
        bold: options?.bold,
        italics: options?.italics,
        underline: options?.underline ? {} : undefined,
        size: sizeHalfPt,
        color: options?.color || '0F172A',
        font: FONT_FAMILY,
        break: idx > 0 ? 1 : undefined
      });
      return [run];
    })
  });
}

function makeCell(
  children: Paragraph[],
  options?: {
    colSpan?: number;
    rowSpan?: number;
    fillHex?: string;
    vAlign?: (typeof VerticalAlign)['TOP' | 'CENTER' | 'BOTTOM'];
    widthDxa?: number;
  }
): TableCell {
  return new TableCell({
    columnSpan: options?.colSpan,
    rowSpan: options?.rowSpan,
    verticalAlign: options?.vAlign || VerticalAlign.TOP,
    width: options?.widthDxa
      ? { size: options.widthDxa, type: WidthType.DXA }
      : undefined,
    margins: CELL_PADDING,
    borders: STANDARD_BORDERS,
    shading: options?.fillHex
      ? {
          type: ShadingType.CLEAR,
          color: 'auto',
          fill: options.fillHex
        }
      : undefined,
    children
  });
}

/**
 * Menghasilkan & Mengunduh Dokumen Resmi Microsoft Word (.docx) RPS OBE UNIKMA
 * Lengkap dengan Logo UNIKMA, QR Code Otorisasi 3 Pejabat, dan Tabel Presisi A4 Landscape.
 */
export async function generateOfficialUnikmaDocx(
  rps: RPSDocument,
  validation: OBEValidationSummary
): Promise<string> {
  const logoDataUrl = createUnikmaLogoDataUrl();
  const logoBytes = dataUrlToUint8Array(logoDataUrl);

  const qrDosenBytes = dataUrlToUint8Array(
    createQrCodeDataUrl(rps.otorisasi.dosenPengembang.qrVerificationHash)
  );
  const qrRmkBytes = dataUrlToUint8Array(
    createQrCodeDataUrl(rps.otorisasi.koordinatorRmk.qrVerificationHash)
  );
  const qrKaprodiBytes = dataUrlToUint8Array(
    createQrCodeDataUrl(rps.otorisasi.ketuaProdi.qrVerificationHash)
  );

  const totalSks = rps.identitas.bobotSksTeori + rps.identitas.bobotSksPraktikum;

  // Lebar total area cetak A4 Landscape (16838 - 1440 margin = 15398 DXA)
  const kopColWidths = [2198, 2200, 2200, 2200, 2200, 2200, 2200];

  // =========================================================================
  // 1. BARIS KOP INSTITUSI, IDENTITAS MK, & BLOK OTORISASI
  // =========================================================================
  const kopRows: TableRow[] = [
    // Baris 0: Logo UNIKMA + Nama Institusi & Alamat Kampus I, II, III + Kode Dokumen
    new TableRow({
      children: [
        makeCell(
          [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 40, after: 40 },
              children: [
                new ImageRun({
                  data: logoBytes,
                  transformation: { width: 112, height: 103 },
                  type: 'png'
                })
              ]
            })
          ],
          { rowSpan: 2, fillHex: 'FFFFFF', vAlign: VerticalAlign.CENTER, widthDxa: 2198 }
        ),
        makeCell(
          [
            makeParagraph(
              `${rps.institusi.namaUniversitas} (${rps.institusi.singkatan})`,
              {
                bold: true,
                sizePt: 13,
                color: 'FFFFFF',
                align: AlignmentType.CENTER,
                spacingAfter: 20
              }
            ),
            makeParagraph(
              `${rps.institusi.fakultas} — ${rps.institusi.programStudi}`,
              {
                bold: true,
                sizePt: 10,
                color: 'FCD34D',
                align: AlignmentType.CENTER,
                spacingAfter: 60
              }
            ),
            makeParagraph(
              `${rps.institusi.kampus1}\n${rps.institusi.kampus2}\n${rps.institusi.kampus3}`,
              {
                sizePt: 8,
                color: 'E2E8F0',
                align: AlignmentType.CENTER,
                spacingAfter: 30
              }
            ),
            makeParagraph(
              `Laman: ${rps.institusi.website}  |  Surel: ${rps.institusi.email}`,
              {
                bold: true,
                sizePt: 8,
                color: 'FDE68A',
                align: AlignmentType.CENTER,
                spacingAfter: 20
              }
            )
          ],
          { colSpan: 5, fillHex: '0F172A', vAlign: VerticalAlign.CENTER, widthDxa: 11000 }
        ),
        makeCell(
          [
            makeParagraph('KODE DOKUMEN MUTU', {
              bold: true,
              sizePt: 8.5,
              color: '0F172A',
              spacingAfter: 30
            }),
            makeParagraph(rps.institusi.kodeDokumenStandar, {
              bold: true,
              sizePt: 9,
              color: '1E3A8A',
              spacingAfter: 80
            }),
            makeParagraph(`Revisi Ke: ${rps.identitas.revisiKe}`, {
              sizePt: 8.5,
              color: '334155',
              spacingAfter: 20
            }),
            makeParagraph(`T.A.: ${rps.identitas.tahunAkademik}`, {
              bold: true,
              sizePt: 8.5,
              color: '0F172A'
            })
          ],
          { rowSpan: 2, fillHex: 'F8FAFC', vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        )
      ]
    }),

    // Baris 1: Banner Judul Dokumen RPS
    new TableRow({
      children: [
        makeCell(
          [
            makeParagraph(
              'RENCANA PEMBELAJARAN SEMESTER (RPS) BERBASIS OUTCOME-BASED EDUCATION (OBE)',
              {
                bold: true,
                sizePt: 10,
                color: 'FFFFFF',
                align: AlignmentType.CENTER,
                spacingBefore: 30,
                spacingAfter: 30
              }
            )
          ],
          { colSpan: 5, fillHex: '1E293B', vAlign: VerticalAlign.CENTER, widthDxa: 11000 }
        )
      ]
    }),

    // Baris 2: Header Tabel Identitas Mata Kuliah
    new TableRow({
      children: [
        makeCell([makeParagraph('MATA KULIAH (MK)', { bold: true, sizePt: 9 })], {
          colSpan: 2,
          fillHex: 'E2E8F0',
          vAlign: VerticalAlign.CENTER,
          widthDxa: 4398
        }),
        makeCell(
          [makeParagraph('KODE MK', { bold: true, sizePt: 9, align: AlignmentType.CENTER })],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        ),
        makeCell([makeParagraph('RUMPUN MK', { bold: true, sizePt: 9 })], {
          fillHex: 'E2E8F0',
          vAlign: VerticalAlign.CENTER,
          widthDxa: 2200
        }),
        makeCell(
          [makeParagraph('BOBOT (SKS)', { bold: true, sizePt: 9, align: AlignmentType.CENTER })],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        ),
        makeCell(
          [makeParagraph('SEMESTER', { bold: true, sizePt: 9, align: AlignmentType.CENTER })],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        ),
        makeCell(
          [
            makeParagraph('TGL PENYUSUNAN', {
              bold: true,
              sizePt: 9,
              align: AlignmentType.CENTER
            })
          ],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        )
      ]
    }),

    // Baris 3: Isi Tabel Identitas Mata Kuliah
    new TableRow({
      children: [
        makeCell([makeParagraph(rps.identitas.namaMk, { bold: true, sizePt: 10 })], {
          colSpan: 2,
          vAlign: VerticalAlign.CENTER,
          widthDxa: 4398
        }),
        makeCell(
          [
            makeParagraph(rps.identitas.kodeMk, {
              bold: true,
              sizePt: 9.5,
              align: AlignmentType.CENTER
            })
          ],
          { vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        ),
        makeCell([makeParagraph(rps.identitas.rumpunMk, { sizePt: 9 })], {
          vAlign: VerticalAlign.CENTER,
          widthDxa: 2200
        }),
        makeCell(
          [
            makeParagraph(
              `Total: ${totalSks} SKS\n(T = ${rps.identitas.bobotSksTeori} SKS | P = ${rps.identitas.bobotSksPraktikum} SKS)`,
              { bold: true, sizePt: 8.5, align: AlignmentType.CENTER }
            )
          ],
          { vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        ),
        makeCell(
          [
            makeParagraph(`${rps.identitas.semester}`, {
              bold: true,
              sizePt: 9.5,
              align: AlignmentType.CENTER
            })
          ],
          { vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        ),
        makeCell(
          [
            makeParagraph(rps.identitas.tanggalPenyusunan, {
              sizePt: 9,
              align: AlignmentType.CENTER
            })
          ],
          { vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        )
      ]
    }),

    // Baris 4: Header Blok Otorisasi
    new TableRow({
      children: [
        makeCell(
          [
            makeParagraph('OTORISASI /\nPENGESAHAN', {
              bold: true,
              sizePt: 9,
              align: AlignmentType.CENTER
            })
          ],
          { rowSpan: 2, fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2198 }
        ),
        makeCell(
          [
            makeParagraph('Dosen Pengembang RPS', {
              bold: true,
              sizePt: 9,
              align: AlignmentType.CENTER
            })
          ],
          { colSpan: 2, fillHex: 'F1F5F9', vAlign: VerticalAlign.CENTER, widthDxa: 4400 }
        ),
        makeCell(
          [
            makeParagraph('Koordinator RMK', {
              bold: true,
              sizePt: 9,
              align: AlignmentType.CENTER
            })
          ],
          { colSpan: 2, fillHex: 'F1F5F9', vAlign: VerticalAlign.CENTER, widthDxa: 4400 }
        ),
        makeCell(
          [
            makeParagraph('Ketua Program Studi SI', {
              bold: true,
              sizePt: 9,
              align: AlignmentType.CENTER
            })
          ],
          { colSpan: 2, fillHex: 'F1F5F9', vAlign: VerticalAlign.CENTER, widthDxa: 4400 }
        )
      ]
    }),

    // Baris 5: Isi Blok Otorisasi Lengkap dengan QR Code Pejabat
    new TableRow({
      children: [
        makeCell(
          [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 30, after: 20 },
              children: [
                new ImageRun({
                  data: qrDosenBytes,
                  transformation: { width: 58, height: 58 },
                  type: 'png'
                })
              ]
            }),
            makeParagraph(
              `[${rps.otorisasi.dosenPengembang.statusOtorisasi}${
                rps.otorisasi.dosenPengembang.tanggalOtorisasi
                  ? ` · ${rps.otorisasi.dosenPengembang.tanggalOtorisasi}`
                  : ''
              }]`,
              { sizePt: 7.5, color: '047857', bold: true, align: AlignmentType.CENTER }
            ),
            makeParagraph(rps.otorisasi.dosenPengembang.nama, {
              bold: true,
              underline: true,
              sizePt: 9,
              align: AlignmentType.CENTER,
              spacingAfter: 10
            }),
            makeParagraph(`NIDN. ${rps.otorisasi.dosenPengembang.nidn}`, {
              sizePt: 8,
              color: '334155',
              align: AlignmentType.CENTER
            })
          ],
          { colSpan: 2, vAlign: VerticalAlign.BOTTOM, widthDxa: 4400 }
        ),
        makeCell(
          [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 30, after: 20 },
              children: [
                new ImageRun({
                  data: qrRmkBytes,
                  transformation: { width: 58, height: 58 },
                  type: 'png'
                })
              ]
            }),
            makeParagraph(
              `[${rps.otorisasi.koordinatorRmk.statusOtorisasi}${
                rps.otorisasi.koordinatorRmk.tanggalOtorisasi
                  ? ` · ${rps.otorisasi.koordinatorRmk.tanggalOtorisasi}`
                  : ''
              }]`,
              { sizePt: 7.5, color: '047857', bold: true, align: AlignmentType.CENTER }
            ),
            makeParagraph(rps.otorisasi.koordinatorRmk.nama, {
              bold: true,
              underline: true,
              sizePt: 9,
              align: AlignmentType.CENTER,
              spacingAfter: 10
            }),
            makeParagraph(`NIDN. ${rps.otorisasi.koordinatorRmk.nidn}`, {
              sizePt: 8,
              color: '334155',
              align: AlignmentType.CENTER
            })
          ],
          { colSpan: 2, vAlign: VerticalAlign.BOTTOM, widthDxa: 4400 }
        ),
        makeCell(
          [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 30, after: 20 },
              children: [
                new ImageRun({
                  data: qrKaprodiBytes,
                  transformation: { width: 58, height: 58 },
                  type: 'png'
                })
              ]
            }),
            makeParagraph(
              `[${rps.otorisasi.ketuaProdi.statusOtorisasi}${
                rps.otorisasi.ketuaProdi.tanggalOtorisasi
                  ? ` · ${rps.otorisasi.ketuaProdi.tanggalOtorisasi}`
                  : ''
              }]`,
              { sizePt: 7.5, color: '047857', bold: true, align: AlignmentType.CENTER }
            ),
            makeParagraph(rps.otorisasi.ketuaProdi.nama, {
              bold: true,
              underline: true,
              sizePt: 9,
              align: AlignmentType.CENTER,
              spacingAfter: 10
            }),
            makeParagraph(`NIDN. ${rps.otorisasi.ketuaProdi.nidn}`, {
              sizePt: 8,
              color: '334155',
              align: AlignmentType.CENTER
            })
          ],
          { colSpan: 2, vAlign: VerticalAlign.BOTTOM, widthDxa: 4400 }
        )
      ]
    })
  ];

  // =========================================================================
  // 2. BARIS CAPAIAN PEMBELAJARAN (CPL, CPMK, SUB-CPMK)
  // =========================================================================
  const totalCpRows =
    rps.cplProdi.length + rps.cpmkList.length + rps.subCpmkList.length + 3;

  kopRows.push(
    new TableRow({
      children: [
        makeCell(
          [
            makeParagraph('CAPAIAN\nPEMBELAJARAN\n(CP)', {
              bold: true,
              sizePt: 9,
              align: AlignmentType.CENTER
            })
          ],
          { rowSpan: totalCpRows, fillHex: 'F1F5F9', vAlign: VerticalAlign.TOP, widthDxa: 2198 }
        ),
        makeCell(
          [
            makeParagraph(
              '1. Capaian Pembelajaran Lulusan Program Studi (CPL-PRODI) yang Dibebankan pada Mata Kuliah:',
              { bold: true, sizePt: 9 }
            )
          ],
          { colSpan: 6, fillHex: 'E2E8F0', widthDxa: 13200 }
        )
      ]
    })
  );

  rps.cplProdi.forEach((cpl) => {
    kopRows.push(
      new TableRow({
        children: [
          makeCell(
            [
              makeParagraph(cpl.kode, { bold: true, sizePt: 9, spacingAfter: 10 }),
              makeParagraph(cpl.ranah, { sizePt: 8, color: '475569' })
            ],
            { widthDxa: 2200 }
          ),
          makeCell(
            [
              makeParagraph(cpl.deskripsi, { sizePt: 9, spacingAfter: 20 }),
              makeParagraph(`Profil Lulusan Terkait: ${cpl.profilLulusanTerkait}`, {
                bold: true,
                sizePt: 8,
                color: '334155'
              })
            ],
            { colSpan: 5, widthDxa: 11000 }
          )
        ]
      })
    );
  });

  // Sub-header CPMK
  kopRows.push(
    new TableRow({
      children: [
        makeCell(
          [
            makeParagraph(
              '2. Capaian Pembelajaran Mata Kuliah (CPMK) — Penurunan dari CPL Program Studi:',
              { bold: true, sizePt: 9 }
            )
          ],
          { colSpan: 6, fillHex: 'E2E8F0', widthDxa: 13200 }
        )
      ]
    })
  );

  rps.cpmkList.forEach((cpmk) => {
    kopRows.push(
      new TableRow({
        children: [
          makeCell(
            [
              makeParagraph(cpmk.kode, { bold: true, sizePt: 9, spacingAfter: 10 }),
              makeParagraph(
                `→ ${cpmk.mappedCplCodes.length > 0 ? cpmk.mappedCplCodes.join(', ') : 'BELUM TERPETAKAN'}`,
                { sizePt: 8, color: '475569' }
              )
            ],
            { widthDxa: 2200 }
          ),
          makeCell([makeParagraph(cpmk.deskripsi, { sizePt: 9 })], {
            colSpan: 5,
            widthDxa: 11000
          })
        ]
      })
    );
  });

  // Sub-header Sub-CPMK
  kopRows.push(
    new TableRow({
      children: [
        makeCell(
          [
            makeParagraph(
              '3. Kemampuan Akhir Tiap Tahapan Belajar (Sub-CPMK) & Gradasi Taksonomi Bloom:',
              { bold: true, sizePt: 9 }
            )
          ],
          { colSpan: 6, fillHex: 'E2E8F0', widthDxa: 13200 }
        )
      ]
    })
  );

  rps.subCpmkList.forEach((sub) => {
    kopRows.push(
      new TableRow({
        children: [
          makeCell(
            [
              makeParagraph(sub.kode, { bold: true, sizePt: 9, spacingAfter: 10 }),
              makeParagraph(`→ ${sub.mappedCpmkCode} [${sub.taksonomiBloom}]`, {
                sizePt: 8,
                color: '475569'
              })
            ],
            { widthDxa: 2200 }
          ),
          makeCell([makeParagraph(sub.deskripsi, { sizePt: 9 })], {
            colSpan: 5,
            widthDxa: 11000
          })
        ]
      })
    );
  });

  // =========================================================================
  // 3. DESKRIPSI MK, BAHAN KAJIAN, PUSTAKA, MEDIA, TEAM TEACHING, CATATAN OBE
  // =========================================================================
  kopRows.push(
    // Deskripsi Singkat MK
    new TableRow({
      children: [
        makeCell([makeParagraph('Deskripsi Singkat MK', { bold: true, sizePt: 9 })], {
          fillHex: 'F1F5F9',
          widthDxa: 2198
        }),
        makeCell(
          [makeParagraph(rps.deskripsiMk, { sizePt: 9, align: AlignmentType.JUSTIFIED })],
          { colSpan: 6, widthDxa: 13200 }
        )
      ]
    }),
    // Bahan Kajian / Materi Pembelajaran
    new TableRow({
      children: [
        makeCell(
          [makeParagraph('Bahan Kajian / Materi Pembelajaran', { bold: true, sizePt: 9 })],
          { fillHex: 'F1F5F9', widthDxa: 2198 }
        ),
        makeCell(
          rps.pokokBahasan.map((item) => makeParagraph(item, { sizePt: 9, spacingAfter: 25 })),
          { colSpan: 6, widthDxa: 13200 }
        )
      ]
    }),
    // Pustaka Utama
    new TableRow({
      children: [
        makeCell([makeParagraph('Pustaka / Referensi', { bold: true, sizePt: 9 })], {
          rowSpan: 2,
          fillHex: 'F1F5F9',
          widthDxa: 2198
        }),
        makeCell([makeParagraph('Utama:', { bold: true, sizePt: 9 })], {
          fillHex: 'F8FAFC',
          widthDxa: 2200
        }),
        makeCell(
          rps.pustakaUtama.map((ref) => makeParagraph(ref, { sizePt: 8.5, spacingAfter: 25 })),
          { colSpan: 5, widthDxa: 11000 }
        )
      ]
    }),
    // Pustaka Tambahan
    new TableRow({
      children: [
        makeCell([makeParagraph('Tambahan:', { bold: true, sizePt: 9 })], {
          fillHex: 'F8FAFC',
          widthDxa: 2200
        }),
        makeCell(
          rps.pustakaTambahan.map((ref) =>
            makeParagraph(ref, { sizePt: 8.5, spacingAfter: 25 })
          ),
          { colSpan: 5, widthDxa: 11000 }
        )
      ]
    }),
    // Media Pembelajaran
    new TableRow({
      children: [
        makeCell([makeParagraph('Media Pembelajaran', { bold: true, sizePt: 9 })], {
          fillHex: 'F1F5F9',
          widthDxa: 2198
        }),
        makeCell(
          [
            makeParagraph('Perangkat Lunak (Software):', {
              bold: true,
              sizePt: 9,
              spacingAfter: 30
            }),
            ...rps.mediaPerangkatLunak.map((sw) =>
              makeParagraph(`• ${sw}`, { sizePt: 8.5, spacingAfter: 15 })
            )
          ],
          { colSpan: 3, widthDxa: 6600 }
        ),
        makeCell(
          [
            makeParagraph('Perangkat Keras (Hardware):', {
              bold: true,
              sizePt: 9,
              spacingAfter: 30
            }),
            ...rps.mediaPerangkatKeras.map((hw) =>
              makeParagraph(`• ${hw}`, { sizePt: 8.5, spacingAfter: 15 })
            )
          ],
          { colSpan: 3, widthDxa: 6600 }
        )
      ]
    }),
    // Dosen Pengampu (Team Teaching) & Mata Kuliah Prasyarat
    new TableRow({
      children: [
        makeCell(
          [makeParagraph('Dosen Pengampu (Team Teaching)', { bold: true, sizePt: 9 })],
          { fillHex: 'F1F5F9', widthDxa: 2198 }
        ),
        makeCell(
          rps.teamTeaching.map((tt, idx) =>
            makeParagraph(`${idx + 1}. ${tt}`, { sizePt: 8.5, spacingAfter: 20 })
          ),
          { colSpan: 2, widthDxa: 4400 }
        ),
        makeCell([makeParagraph('Mata Kuliah Prasyarat', { bold: true, sizePt: 9 })], {
          fillHex: 'F1F5F9',
          widthDxa: 2200
        }),
        makeCell(
          rps.mkSyarat.map((mk) =>
            makeParagraph(`• ${mk}`, { sizePt: 8.5, spacingAfter: 20 })
          ),
          { colSpan: 3, widthDxa: 6600 }
        )
      ]
    }),
    // Catatan Akademik & Kebijakan OBE
    new TableRow({
      children: [
        makeCell(
          [makeParagraph('Catatan Akademik & Kebijakan OBE', { bold: true, sizePt: 9 })],
          { fillHex: 'F1F5F9', widthDxa: 2198 }
        ),
        makeCell(
          [
            makeParagraph(`1. Keselarasan CPL & CPMK: ${rps.catatanAkademik.keselarasanCpl}`, {
              sizePt: 8.5,
              spacingAfter: 25
            }),
            makeParagraph(
              `2. Profil Lulusan Sasaran (${rps.catatanAkademik.kodeProfilLulusan}): ${rps.catatanAkademik.profilLulusanDeskripsi}`,
              { sizePt: 8.5, spacingAfter: 25 }
            ),
            makeParagraph(
              `3. Pendekatan Pembelajaran (IKU-7): ${rps.catatanAkademik.pendekatanPembelajaran} (Proporsi Asesmen Partisipatif CBL + Proyek Kolaboratif PjBL Aktual: ${validation.bobotIku7PartisipatifProyek}% dari total nilai akhir).`,
              { bold: true, sizePt: 8.5, spacingAfter: 25 }
            ),
            makeParagraph(
              `4. Integritas Akademik: ${rps.catatanAkademik.kebijakanIntegritasAkademik}`,
              { sizePt: 8.5 }
            )
          ],
          { colSpan: 6, fillHex: 'F8FAFC', widthDxa: 13200 }
        )
      ]
    })
  );

  const kopAndObeTable = new Table({
    width: { size: 15398, type: WidthType.DXA },
    columnWidths: kopColWidths,
    layout: TableLayoutType.FIXED,
    rows: kopRows
  });

  // =========================================================================
  // 4. TABEL MATRIKS PEMBELAJARAN 16 PERTEMUAN (HALAMAN BARU LANDSCAPE)
  // =========================================================================
  // Total = 15398 DXA
  const matrixColWidths = [798, 2500, 2600, 2100, 2200, 2200, 2100, 900];

  const matrixRows: TableRow[] = [
    // Header Banner Tabel Matriks
    new TableRow({
      tableHeader: true,
      children: [
        makeCell(
          [
            makeParagraph(
              `MATRIKS RENCANA PEMBELAJARAN SEMESTER (16 PERTEMUAN) — ${rps.identitas.kodeMk} ${rps.identitas.namaMk.toUpperCase()} — FAKULTAS SAINS DAN TEKNOLOGI UNIKMA`,
              {
                bold: true,
                sizePt: 9.5,
                color: 'FFFFFF',
                align: AlignmentType.CENTER
              }
            )
          ],
          { colSpan: 8, fillHex: '0F172A', vAlign: VerticalAlign.CENTER, widthDxa: 15398 }
        )
      ]
    }),

    // Header 8 Kolom Matriks
    new TableRow({
      tableHeader: true,
      children: [
        makeCell(
          [
            makeParagraph('Mg Ke-\n(1)', {
              bold: true,
              sizePt: 8.5,
              align: AlignmentType.CENTER
            })
          ],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 798 }
        ),
        makeCell(
          [
            makeParagraph('Kemampuan Akhir yang Direncanakan (Sub-CPMK)\n(2)', {
              bold: true,
              sizePt: 8.5,
              align: AlignmentType.CENTER
            })
          ],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2500 }
        ),
        makeCell(
          [
            makeParagraph('Materi Pembelajaran [Pokok Bahasan]\n(3)', {
              bold: true,
              sizePt: 8.5,
              align: AlignmentType.CENTER
            })
          ],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2600 }
        ),
        makeCell(
          [
            makeParagraph('Bentuk dan Metode Pembelajaran\n(4)', {
              bold: true,
              sizePt: 8.5,
              align: AlignmentType.CENTER
            })
          ],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2100 }
        ),
        makeCell(
          [
            makeParagraph('Indikator Penilaian\n(5)', {
              bold: true,
              sizePt: 8.5,
              align: AlignmentType.CENTER
            })
          ],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        ),
        makeCell(
          [
            makeParagraph('Pengalaman Pembelajaran (Estimasi Waktu TM / BT / BM)\n(6)', {
              bold: true,
              sizePt: 8.5,
              align: AlignmentType.CENTER
            })
          ],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2200 }
        ),
        makeCell(
          [
            makeParagraph('Kriteria & Bentuk Penilaian\n(7)', {
              bold: true,
              sizePt: 8.5,
              align: AlignmentType.CENTER
            })
          ],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 2100 }
        ),
        makeCell(
          [
            makeParagraph('Bobot (%)\n(8)', {
              bold: true,
              sizePt: 8.5,
              align: AlignmentType.CENTER
            })
          ],
          { fillHex: 'E2E8F0', vAlign: VerticalAlign.CENTER, widthDxa: 900 }
        )
      ]
    })
  ];

  // 16 Pertemuan Rows
  rps.matriksPertemuan.forEach((row) => {
    const isExam = row.tipePertemuan === 'UTS' || row.tipePertemuan === 'UAS';
    const rowFill = isExam ? 'FEF3C7' : 'FFFFFF';

    matrixRows.push(
      new TableRow({
        children: [
          makeCell(
            [
              makeParagraph(
                isExam ? `${row.mingguKe}\n(${row.tipePertemuan})` : `${row.mingguKe}`,
                {
                  bold: true,
                  sizePt: 9,
                  align: AlignmentType.CENTER,
                  color: isExam ? '92400E' : '0F172A'
                }
              )
            ],
            { fillHex: rowFill, vAlign: VerticalAlign.CENTER, widthDxa: 798 }
          ),
          makeCell(
            [
              makeParagraph(`${row.subCpmkKode} · Bloom: [${row.taksonomiBloom}]`, {
                bold: true,
                sizePt: 8,
                color: '1E3A8A',
                spacingAfter: 20
              }),
              makeParagraph(row.kemampuanAkhir, { sizePt: 8.5 })
            ],
            { fillHex: rowFill, widthDxa: 2500 }
          ),
          makeCell([makeParagraph(row.materiPembelajaran, { sizePt: 8.5 })], {
            fillHex: rowFill,
            widthDxa: 2600
          }),
          makeCell([makeParagraph(row.bentukMetodePembelajaran, { sizePt: 8.5 })], {
            fillHex: rowFill,
            widthDxa: 2100
          }),
          makeCell([makeParagraph(row.indikator, { sizePt: 8.5 })], {
            fillHex: rowFill,
            widthDxa: 2200
          }),
          makeCell(
            [
              makeParagraph(`TM: ${row.pengalamanBelajar.tm}`, {
                sizePt: 8,
                spacingAfter: 20
              }),
              makeParagraph(`BT: ${row.pengalamanBelajar.bt}`, {
                sizePt: 8,
                spacingAfter: 20
              }),
              makeParagraph(`BM: ${row.pengalamanBelajar.bm}`, { sizePt: 8 })
            ],
            { fillHex: rowFill, widthDxa: 2200 }
          ),
          makeCell(
            [
              makeParagraph(`[${row.kategoriAsesmen}]`, {
                bold: true,
                sizePt: 8,
                color: '334155',
                spacingAfter: 20
              }),
              makeParagraph(row.kriteriaBentukPenilaian, { sizePt: 8.5 })
            ],
            { fillHex: rowFill, widthDxa: 2100 }
          ),
          makeCell(
            [
              makeParagraph(`${row.bobotPenilaian}%`, {
                bold: true,
                sizePt: 9.5,
                align: AlignmentType.CENTER
              })
            ],
            { fillHex: rowFill, vAlign: VerticalAlign.CENTER, widthDxa: 900 }
          )
        ]
      })
    );
  });

  // Baris Total Bobot 100%
  const isWeight100 = Math.abs(validation.totalBobotAsesmen - 100) < 0.01;
  matrixRows.push(
    new TableRow({
      children: [
        makeCell(
          [
            makeParagraph(
              'TOTAL AKUMULASI BOBOT PENILAIAN (MINGGU KE-1 S/D MINGGU KE-16) — WAJIB 100%:',
              {
                bold: true,
                sizePt: 9,
                color: 'FFFFFF',
                align: AlignmentType.RIGHT
              }
            )
          ],
          { colSpan: 7, fillHex: '0F172A', vAlign: VerticalAlign.CENTER, widthDxa: 14498 }
        ),
        makeCell(
          [
            makeParagraph(`${validation.totalBobotAsesmen}%`, {
              bold: true,
              sizePt: 10,
              color: 'FFFFFF',
              align: AlignmentType.CENTER
            })
          ],
          {
            fillHex: isWeight100 ? '047857' : 'B91C1C',
            vAlign: VerticalAlign.CENTER,
            widthDxa: 900
          }
        )
      ]
    }),

    // Baris Keterangan Beban Waktu (TM/BT/BM) & Gradasi Taksonomi Bloom (C, A, P)
    new TableRow({
      children: [
        makeCell(
          [
            makeParagraph('A. KETERANGAN BEBAN WAKTU PEMBELAJARAN (SESUAI SN-DIKTI):', {
              bold: true,
              sizePt: 8.5,
              spacingAfter: 30
            }),
            makeParagraph(
              '• TM (Tatap Muka): 1 SKS = 50 menit per minggu per semester.\n' +
                '• BT (Tugas Terstruktur): 1 SKS = 60 menit kegiatan penugasan terstruktur per minggu per semester.\n' +
                '• BM (Belajar Mandiri): 1 SKS = 60 menit kegiatan belajar mandiri per minggu per semester.\n' +
                '• 1 SKS Praktikum (P): 170 menit kerja laboratorium/studio per minggu per semester.',
              { sizePt: 8 }
            )
          ],
          { colSpan: 4, fillHex: 'F8FAFC', widthDxa: 7998 }
        ),
        makeCell(
          [
            makeParagraph('B. KETERANGAN GRADASI TAKSONOMI BLOOM (C, A, P):', {
              bold: true,
              sizePt: 8.5,
              spacingAfter: 30
            }),
            makeParagraph(
              '• C (Cognitive / Kognitif): C1 (Mengingat), C2 (Memahami), C3 (Menerapkan), C4 (Menganalisis), C5 (Mengevaluasi), C6 (Mencipta/Merancang).\n' +
                '• A (Affective / Afektif): A1 (Menerima), A2 (Menanggapi), A3 (Menghargai), A4 (Mengorganisasikan), A5 (Karakterisasi Menurut Nilai).\n' +
                '• P (Psychomotor / Psikomotorik): P1 (Meniru/Imitasi), P2 (Manipulasi), P3 (Presisi), P4 (Artikulasi), P5 (Naturalisasi).',
              { sizePt: 8 }
            )
          ],
          { colSpan: 4, fillHex: 'F8FAFC', widthDxa: 7400 }
        )
      ]
    })
  );

  const matrixTable = new Table({
    width: { size: 15398, type: WidthType.DXA },
    columnWidths: matrixColWidths,
    layout: TableLayoutType.FIXED,
    rows: matrixRows
  });

  const doc = new Document({
    creator: 'SIM-RPS OBE Universitas Komputama (UNIKMA)',
    title: `RPS OBE UNIKMA - ${rps.identitas.kodeMk} ${rps.identitas.namaMk}`,
    description:
      'Dokumen Resmi Rencana Pembelajaran Semester (RPS) Berbasis Outcome-Based Education (OBE) Universitas Komputama',
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              width: 11906, // 21.0 cm (short edge in portrait, swapped by LANDSCAPE)
              height: 16838 // 29.7 cm
            },
            margin: {
              top: 680,
              bottom: 680,
              left: 720,
              right: 720
            }
          }
        },
        children: [
          kopAndObeTable,
          new Paragraph({
            text: '',
            pageBreakBefore: true
          }),
          matrixTable
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const safeCourseName = rps.identitas.namaMk.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `RPS_OBE_UNIKMA_${rps.identitas.kodeMk}_${safeCourseName}.docx`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return fileName;
}
