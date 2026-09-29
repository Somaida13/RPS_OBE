import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RPSDocument, OBEValidationSummary } from '../types/rps';

/**
 * Mengonversi Data URL PNG (base64) menjadi Uint8Array untuk ImageRun pada dokumen Word (.docx)
 */
export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || '';
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Merender Logo Resmi UNIKMA (Globe Hijau + Orbit & Bintang Oranye + Tipografi Biru Tua)
 * ke Data URL PNG beresolusi tinggi untuk disematkan ke dalam dokumen PDF & Word (.docx).
 */
export function createUnikmaLogoDataUrl(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 590;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Latar belakang putih bersih
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(2, 2); // Skala 2x dari koordinat 320x295

  // 1. BOLA DUNIA HIJAU (#2F6F00)
  ctx.fillStyle = '#2F6F00';
  const greenPaths = [
    'M 134 45 C 168 20, 218 28, 244 68 C 216 39, 170 31, 134 45 Z',
    'M 134 45 C 102 74, 96 122, 118 160 C 107 123, 112 78, 134 45 Z',
    'M 134 45 C 122 76, 125 106, 135 128 L 144 124 C 134 102, 129 74, 134 45 Z',
    'M 134 45 C 158 58, 178 76, 189 96 L 197 89 C 184 69, 162 52, 134 45 Z',
    'M 108 131 C 145 123, 193 93, 224 52 C 197 82, 152 109, 107 119 Z',
    'M 134 179 C 175 208, 232 192, 250 139 C 256 121, 256 101, 251 86 C 251 104, 247 124, 238 140 C 217 179, 173 190, 134 179 Z',
    'M 134 179 C 173 181, 211 157, 232 121 C 207 149, 171 168, 134 179 Z',
    'M 183 166 L 194 185 L 204 182 L 191 161 Z'
  ];
  for (const d of greenPaths) {
    const p = new Path2D(d);
    ctx.fill(p);
  }

  // 2. LINTASAN ORBIT SABIT & BINTANG ORANYE (#E57C04)
  ctx.fillStyle = '#E57C04';
  const swooshPath = new Path2D(
    'M 103 107 C 66 142, 60 179, 89 184 C 127 190, 204 128, 258 51 C 202 117, 134 162, 100 155 C 83 151, 86 131, 103 107 Z'
  );
  ctx.fill(swooshPath);

  const starPoints = [
    [265, 28],
    [268.2, 35.6],
    [276.5, 36.2],
    [270.1, 41.5],
    [272.1, 49.5],
    [265, 45.1],
    [257.9, 49.5],
    [259.9, 41.5],
    [253.5, 36.2],
    [261.8, 35.6]
  ];
  ctx.beginPath();
  starPoints.forEach(([x, y], idx) => {
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();

  // 3. TIPOGRAFI RESMI UNIVERSITAS KOMPUTAMA / UNIKMA (#282A74)
  ctx.fillStyle = '#282A74';
  ctx.textAlign = 'center';
  ctx.font = 'bold 14.5px Georgia, "Times New Roman", serif';
  ctx.fillText('U N I V E R S I T A S   K O M P U T A M A', 162, 224);

  ctx.font = 'bold 54px Georgia, "Times New Roman", serif';
  ctx.fillText('UNIKMA', 162, 276);

  ctx.restore();
  return canvas.toDataURL('image/png');
}

/**
 * Merender QR Code Otorisasi Pejabat UNIKMA ke Data URL PNG
 */
export function createQrCodeDataUrl(hash: string): string {
  const gridCount = 13;
  const cells: boolean[][] = Array.from({ length: gridCount }, () =>
    Array.from({ length: gridCount }, () => false)
  );

  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const isBorder = r === 0 || r === 3 || c === 0 || c === 3;
        const isCenter = r >= 1 && r <= 2 && c >= 1 && c <= 2;
        if (r0 + r < gridCount && c0 + c < gridCount) {
          cells[r0 + r][c0 + c] = isBorder || isCenter;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, gridCount - 4);
  drawFinder(gridCount - 4, 0);

  let seed = 0;
  for (let i = 0; i < hash.length; i++) {
    seed = (seed * 31 + hash.charCodeAt(i)) % 1000003;
  }

  for (let r = 0; r < gridCount; r++) {
    for (let c = 0; c < gridCount; c++) {
      const inTopLeft = r < 5 && c < 5;
      const inTopRight = r < 5 && c >= gridCount - 5;
      const inBottomLeft = r >= gridCount - 5 && c < 5;
      if (!inTopLeft && !inTopRight && !inBottomLeft) {
        seed = (seed * 16807 + r * 17 + c * 31) % 2147483647;
        cells[r][c] = seed % 2 === 0;
      }
    }
  }

  const scale = 12;
  const size = (gridCount + 2) * scale;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  ctx.fillStyle = '#0F172A';
  for (let r = 0; r < gridCount; r++) {
    for (let c = 0; c < gridCount; c++) {
      if (cells[r][c]) {
        ctx.fillRect((c + 1) * scale, (r + 1) * scale, scale, scale);
      }
    }
  }

  return canvas.toDataURL('image/png');
}

/**
 * Menghasilkan & Mengunduh File PDF Resmi RPS OBE Universitas Komputama (A4 Landscape)
 */
export function generateOfficialUnikmaPdf(
  rps: RPSDocument,
  validation: OBEValidationSummary
): string {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const logoDataUrl = createUnikmaLogoDataUrl();
  const qrDosenUrl = createQrCodeDataUrl(rps.otorisasi.dosenPengembang.qrVerificationHash);
  const qrRmkUrl = createQrCodeDataUrl(rps.otorisasi.koordinatorRmk.qrVerificationHash);
  const qrKaprodiUrl = createQrCodeDataUrl(rps.otorisasi.ketuaProdi.qrVerificationHash);

  const totalSks = rps.identitas.bobotSksTeori + rps.identitas.bobotSksPraktikum;

  // =========================================================================
  // TABEL 1: KOP INSTITUSI, IDENTITAS MATA KULIAH, OTORISASI, & KOMPONEN OBE
  // =========================================================================
  const kopAndObeBody: any[] = [
    // Baris 0: Kop Institusi UNIKMA
    [
      {
        content: '', // Digambar dengan logo UNIKMA di didDrawCell
        rowSpan: 2,
        styles: {
          halign: 'center',
          valign: 'middle',
          fillColor: [255, 255, 255],
          minCellHeight: 30
        }
      },
      {
        content:
          `${rps.institusi.namaUniversitas} (${rps.institusi.singkatan})\n` +
          `${rps.institusi.fakultas} — ${rps.institusi.programStudi}\n` +
          `${rps.institusi.kampus1}\n` +
          `${rps.institusi.kampus2}\n` +
          `${rps.institusi.kampus3}\n` +
          `Laman: ${rps.institusi.website} | Surel: ${rps.institusi.email}`,
        colSpan: 5,
        styles: {
          halign: 'center',
          valign: 'middle',
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8
        }
      },
      {
        content:
          `KODE DOKUMEN MUTU:\n${rps.institusi.kodeDokumenStandar}\n\n` +
          `Revisi Ke: ${rps.identitas.revisiKe}\n` +
          `T.A.: ${rps.identitas.tahunAkademik}`,
        rowSpan: 2,
        styles: {
          halign: 'left',
          valign: 'middle',
          fillColor: [248, 250, 252],
          textColor: [15, 23, 42],
          fontStyle: 'bold',
          fontSize: 7.5
        }
      }
    ],
    // Baris 1: Banner Judul Dokumen
    [
      {
        content: 'RENCANA PEMBELAJARAN SEMESTER (RPS) BERBASIS OUTCOME-BASED EDUCATION (OBE)',
        colSpan: 5,
        styles: {
          halign: 'center',
          valign: 'middle',
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5
        }
      }
    ],
    // Baris 2: Header Identitas MK
    [
      {
        content: 'MATA KULIAH (MK)',
        colSpan: 2,
        styles: { fillColor: [226, 232, 240], fontStyle: 'bold', halign: 'left' }
      },
      {
        content: 'KODE MK',
        styles: { fillColor: [226, 232, 240], fontStyle: 'bold', halign: 'center' }
      },
      {
        content: 'RUMPUN MK',
        styles: { fillColor: [226, 232, 240], fontStyle: 'bold', halign: 'left' }
      },
      {
        content: 'BOBOT (SKS)',
        styles: { fillColor: [226, 232, 240], fontStyle: 'bold', halign: 'center' }
      },
      {
        content: 'SEMESTER',
        styles: { fillColor: [226, 232, 240], fontStyle: 'bold', halign: 'center' }
      },
      {
        content: 'TGL PENYUSUNAN',
        styles: { fillColor: [226, 232, 240], fontStyle: 'bold', halign: 'center' }
      }
    ],
    // Baris 3: Data Identitas MK
    [
      {
        content: rps.identitas.namaMk,
        colSpan: 2,
        styles: { fontStyle: 'bold', fontSize: 8.5, halign: 'left' }
      },
      {
        content: rps.identitas.kodeMk,
        styles: { fontStyle: 'bold', halign: 'center' }
      },
      {
        content: rps.identitas.rumpunMk,
        styles: { halign: 'left' }
      },
      {
        content: `Total: ${totalSks} SKS\n(T=${rps.identitas.bobotSksTeori} SKS | P=${rps.identitas.bobotSksPraktikum} SKS)`,
        styles: { halign: 'center' }
      },
      {
        content: `${rps.identitas.semester}`,
        styles: { fontStyle: 'bold', halign: 'center' }
      },
      {
        content: rps.identitas.tanggalPenyusunan,
        styles: { halign: 'center' }
      }
    ],
    // Baris 4: Header Blok Otorisasi
    [
      {
        content: 'OTORISASI /\nPENGESAHAN',
        rowSpan: 2,
        styles: {
          fillColor: [226, 232, 240],
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle'
        }
      },
      {
        content: 'Dosen Pengembang RPS',
        colSpan: 2,
        styles: { fillColor: [241, 245, 249], fontStyle: 'bold', halign: 'center' }
      },
      {
        content: 'Koordinator RMK',
        colSpan: 2,
        styles: { fillColor: [241, 245, 249], fontStyle: 'bold', halign: 'center' }
      },
      {
        content: 'Ketua Program Studi SI',
        colSpan: 2,
        styles: { fillColor: [241, 245, 249], fontStyle: 'bold', halign: 'center' }
      }
    ],
    // Baris 5: Isi Blok Otorisasi & QR
    [
      {
        content: `\n\n\n\n\n[${rps.otorisasi.dosenPengembang.statusOtorisasi}]\n${rps.otorisasi.dosenPengembang.nama}\nNIDN. ${rps.otorisasi.dosenPengembang.nidn}`,
        colSpan: 2,
        styles: { halign: 'center', valign: 'bottom', minCellHeight: 26 }
      },
      {
        content: `\n\n\n\n\n[${rps.otorisasi.koordinatorRmk.statusOtorisasi}]\n${rps.otorisasi.koordinatorRmk.nama}\nNIDN. ${rps.otorisasi.koordinatorRmk.nidn}`,
        colSpan: 2,
        styles: { halign: 'center', valign: 'bottom', minCellHeight: 26 }
      },
      {
        content: `\n\n\n\n\n[${rps.otorisasi.ketuaProdi.statusOtorisasi}]\n${rps.otorisasi.ketuaProdi.nama}\nNIDN. ${rps.otorisasi.ketuaProdi.nidn}`,
        colSpan: 2,
        styles: { halign: 'center', valign: 'bottom', minCellHeight: 26 }
      }
    ]
  ];

  // Tambahkan bagian Capaian Pembelajaran (CPL, CPMK, Sub-CPMK)
  const totalCpRows =
    rps.cplProdi.length + rps.cpmkList.length + rps.subCpmkList.length + 3;

  kopAndObeBody.push([
    {
      content: 'CAPAIAN\nPEMBELAJARAN\n(CP)',
      rowSpan: totalCpRows,
      styles: {
        fillColor: [241, 245, 249],
        fontStyle: 'bold',
        halign: 'center',
        valign: 'top'
      }
    },
    {
      content:
        '1. Capaian Pembelajaran Lulusan Program Studi (CPL-PRODI) yang Dibebankan pada Mata Kuliah:',
      colSpan: 6,
      styles: { fillColor: [226, 232, 240], fontStyle: 'bold' }
    }
  ]);

  rps.cplProdi.forEach((cpl) => {
    kopAndObeBody.push([
      {
        content: `${cpl.kode}\n(${cpl.ranah})`,
        styles: { fontStyle: 'bold', width: 28 }
      },
      {
        content: `${cpl.deskripsi}\n[Profil Lulusan Terkait: ${cpl.profilLulusanTerkait}]`,
        colSpan: 5
      }
    ]);
  });

  kopAndObeBody.push([
    {
      content:
        '2. Capaian Pembelajaran Mata Kuliah (CPMK) — Penurunan dari CPL Program Studi:',
      colSpan: 6,
      styles: { fillColor: [226, 232, 240], fontStyle: 'bold' }
    }
  ]);

  rps.cpmkList.forEach((cpmk) => {
    kopAndObeBody.push([
      {
        content: `${cpmk.kode}\n-> (${cpmk.mappedCplCodes.join(', ') || 'Belum Terikat'})`,
        styles: { fontStyle: 'bold' }
      },
      {
        content: cpmk.deskripsi,
        colSpan: 5
      }
    ]);
  });

  kopAndObeBody.push([
    {
      content:
        '3. Kemampuan Akhir Tiap Tahapan Belajar (Sub-CPMK) & Gradasi Taksonomi Bloom:',
      colSpan: 6,
      styles: { fillColor: [226, 232, 240], fontStyle: 'bold' }
    }
  ]);

  rps.subCpmkList.forEach((sub) => {
    kopAndObeBody.push([
      {
        content: `${sub.kode}\n-> ${sub.mappedCpmkCode} [${sub.taksonomiBloom}]`,
        styles: { fontStyle: 'bold' }
      },
      {
        content: sub.deskripsi,
        colSpan: 5
      }
    ]);
  });

  // Deskripsi Singkat MK, Bahan Kajian, Pustaka, Media, Team Teaching, Catatan Akademik
  kopAndObeBody.push(
    [
      {
        content: 'Deskripsi Singkat MK',
        styles: { fillColor: [241, 245, 249], fontStyle: 'bold' }
      },
      { content: rps.deskripsiMk, colSpan: 6 }
    ],
    [
      {
        content: 'Bahan Kajian / Materi Pembelajaran',
        styles: { fillColor: [241, 245, 249], fontStyle: 'bold' }
      },
      { content: rps.pokokBahasan.join('\n'), colSpan: 6 }
    ],
    [
      {
        content: 'Pustaka / Referensi',
        rowSpan: 2,
        styles: { fillColor: [241, 245, 249], fontStyle: 'bold' }
      },
      { content: 'Utama:', styles: { fillColor: [248, 250, 252], fontStyle: 'bold' } },
      { content: rps.pustakaUtama.join('\n'), colSpan: 5 }
    ],
    [
      { content: 'Tambahan:', styles: { fillColor: [248, 250, 252], fontStyle: 'bold' } },
      { content: rps.pustakaTambahan.join('\n'), colSpan: 5 }
    ],
    [
      {
        content: 'Media Pembelajaran',
        styles: { fillColor: [241, 245, 249], fontStyle: 'bold' }
      },
      {
        content: `Perangkat Lunak (Software):\n• ${rps.mediaPerangkatLunak.join('\n• ')}`,
        colSpan: 3
      },
      {
        content: `Perangkat Keras (Hardware):\n• ${rps.mediaPerangkatKeras.join('\n• ')}`,
        colSpan: 3
      }
    ],
    [
      {
        content: 'Dosen Pengampu (Team Teaching)',
        styles: { fillColor: [241, 245, 249], fontStyle: 'bold' }
      },
      { content: rps.teamTeaching.join('\n'), colSpan: 2 },
      {
        content: 'Mata Kuliah Prasyarat',
        styles: { fillColor: [241, 245, 249], fontStyle: 'bold' }
      },
      { content: rps.mkSyarat.join('\n'), colSpan: 3 }
    ],
    [
      {
        content: 'Catatan Akademik & Kebijakan OBE',
        styles: { fillColor: [241, 245, 249], fontStyle: 'bold' }
      },
      {
        content:
          `1. Keselarasan CPL & CPMK: ${rps.catatanAkademik.keselarasanCpl}\n` +
          `2. Profil Lulusan Sasaran (${rps.catatanAkademik.kodeProfilLulusan}): ${rps.catatanAkademik.profilLulusanDeskripsi}\n` +
          `3. Pendekatan Pembelajaran (IKU-7): ${rps.catatanAkademik.pendekatanPembelajaran} (Proporsi CBL + PjBL Aktual: ${validation.bobotIku7PartisipatifProyek}% dari total nilai akhir).\n` +
          `4. Integritas Akademik: ${rps.catatanAkademik.kebijakanIntegritasAkademik}`,
        colSpan: 6,
        styles: { fillColor: [248, 250, 252] }
      }
    ]
  );

  autoTable(doc, {
    startY: 10,
    margin: { left: 10, right: 10, top: 10, bottom: 12 },
    body: kopAndObeBody,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [15, 23, 42],
      lineColor: [15, 23, 42],
      lineWidth: 0.25,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 34 },
      1: { cellWidth: 36 }
    },
    didDrawCell: (data) => {
      // Sematkan Logo UNIKMA di Sel (Baris 0, Kolom 0)
      if (data.section === 'body' && data.row.index === 0 && data.column.index === 0 && logoDataUrl) {
        const imgW = 28;
        const imgH = 25.8;
        const x = data.cell.x + (data.cell.width - imgW) / 2;
        const y = data.cell.y + (data.cell.height - imgH) / 2;
        doc.addImage(logoDataUrl, 'PNG', x, y, imgW, imgH);
      }

      // Sematkan QR Code Otorisasi pada Baris 5
      if (data.section === 'body' && data.row.index === 5) {
        const qrSize = 12.5;
        if (data.column.index === 1 && qrDosenUrl) {
          const x = data.cell.x + (data.cell.width - qrSize) / 2;
          const y = data.cell.y + 1.8;
          doc.addImage(qrDosenUrl, 'PNG', x, y, qrSize, qrSize);
        }
        if (data.column.index === 3 && qrRmkUrl) {
          const x = data.cell.x + (data.cell.width - qrSize) / 2;
          const y = data.cell.y + 1.8;
          doc.addImage(qrRmkUrl, 'PNG', x, y, qrSize, qrSize);
        }
        if (data.column.index === 5 && qrKaprodiUrl) {
          const x = data.cell.x + (data.cell.width - qrSize) / 2;
          const y = data.cell.y + 1.8;
          doc.addImage(qrKaprodiUrl, 'PNG', x, y, qrSize, qrSize);
        }
      }
    }
  });

  // =========================================================================
  // TABEL 2: MATRIKS RENCANA PEMBELAJARAN SEMESTER (16 PERTEMUAN)
  // =========================================================================
  doc.addPage('a4', 'landscape');

  const matrixBody: any[] = rps.matriksPertemuan.map((row) => {
    const isExam = row.tipePertemuan === 'UTS' || row.tipePertemuan === 'UAS';
    const rowFill: [number, number, number] = isExam ? [254, 243, 199] : [255, 255, 255];

    return [
      {
        content: isExam ? `${row.mingguKe}\n(${row.tipePertemuan})` : `${row.mingguKe}`,
        styles: { halign: 'center', fontStyle: 'bold', fillColor: rowFill }
      },
      {
        content: `[${row.subCpmkKode} | Bloom: ${row.taksonomiBloom}]\n${row.kemampuanAkhir}`,
        styles: { fillColor: rowFill }
      },
      {
        content: row.materiPembelajaran,
        styles: { fillColor: rowFill }
      },
      {
        content: row.bentukMetodePembelajaran,
        styles: { fillColor: rowFill }
      },
      {
        content: row.indikator,
        styles: { fillColor: rowFill }
      },
      {
        content: `TM: ${row.pengalamanBelajar.tm}\nBT: ${row.pengalamanBelajar.bt}\nBM: ${row.pengalamanBelajar.bm}`,
        styles: { fillColor: rowFill }
      },
      {
        content: `[${row.kategoriAsesmen}]\n${row.kriteriaBentukPenilaian}`,
        styles: { fillColor: rowFill }
      },
      {
        content: `${row.bobotPenilaian}%`,
        styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fillColor: rowFill }
      }
    ];
  });

  // Baris Total Akumulasi Bobot 100%
  matrixBody.push([
    {
      content: 'TOTAL AKUMULASI BOBOT PENILAIAN (MINGGU KE-1 S/D MINGGU KE-16) — WAJIB 100%:',
      colSpan: 7,
      styles: {
        halign: 'right',
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      }
    },
    {
      content: `${validation.totalBobotAsesmen}%`,
      styles: {
        halign: 'center',
        fillColor: Math.abs(validation.totalBobotAsesmen - 100) < 0.01 ? [4, 120, 87] : [185, 28, 28],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      }
    }
  ]);

  // Baris Keterangan Beban Waktu (TM/BT/BM) & Gradasi Taksonomi Bloom (C, A, P)
  matrixBody.push([
    {
      content:
        'A. KETERANGAN BEBAN WAKTU PEMBELAJARAN (SN-DIKTI):\n' +
        '• TM (Tatap Muka): 1 SKS = 50 menit/minggu/semester.\n' +
        '• BT (Tugas Terstruktur): 1 SKS = 60 menit/minggu/semester.\n' +
        '• BM (Belajar Mandiri): 1 SKS = 60 menit/minggu/semester.\n' +
        '• 1 SKS Praktikum (P): 170 menit kerja laboratorium/studio per minggu.',
      colSpan: 4,
      styles: { fillColor: [248, 250, 252], fontSize: 7 }
    },
    {
      content:
        'B. KETERANGAN GRADASI TAKSONOMI BLOOM (C, A, P):\n' +
        '• C (Cognitive / Kognitif): C1 (Mengingat), C2 (Memahami), C3 (Menerapkan), C4 (Menganalisis), C5 (Mengevaluasi), C6 (Mencipta/Merancang).\n' +
        '• A (Affective / Afektif): A1 (Menerima), A2 (Menanggapi), A3 (Menghargai), A4 (Mengorganisasikan), A5 (Karakterisasi Menurut Nilai).\n' +
        '• P (Psychomotor / Psikomotorik): P1 (Meniru/Imitasi), P2 (Manipulasi), P3 (Presisi), P4 (Artikulasi), P5 (Naturalisasi).',
      colSpan: 4,
      styles: { fillColor: [248, 250, 252], fontSize: 7 }
    }
  ]);

  autoTable(doc, {
    startY: 10,
    margin: { left: 10, right: 10, top: 10, bottom: 12 },
    head: [
      [
        {
          content:
            `MATRIKS RENCANA PEMBELAJARAN SEMESTER (16 PERTEMUAN) — ${rps.identitas.kodeMk} ${rps.identitas.namaMk.toUpperCase()} — FAKULTAS SAINS DAN TEKNOLOGI UNIKMA`,
          colSpan: 8,
          styles: {
            halign: 'center',
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8
          }
        }
      ],
      [
        'Mg\nKe-\n(1)',
        'Kemampuan Akhir yang Direncanakan (Sub-CPMK)\n(2)',
        'Materi Pembelajaran [Pokok Bahasan]\n(3)',
        'Bentuk dan Metode Pembelajaran\n(4)',
        'Indikator Penilaian\n(5)',
        'Pengalaman Pembelajaran (Estimasi Waktu TM / BT / BM)\n(6)',
        'Kriteria & Bentuk Penilaian\n(7)',
        'Bobot\n(%)\n(8)'
      ]
    ],
    body: matrixBody,
    theme: 'grid',
    headStyles: {
      fillColor: [226, 232, 240],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      fontSize: 7.2,
      lineColor: [15, 23, 42],
      lineWidth: 0.25
    },
    styles: {
      font: 'helvetica',
      fontSize: 7,
      cellPadding: 1.8,
      textColor: [15, 23, 42],
      lineColor: [15, 23, 42],
      lineWidth: 0.22,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 13 },
      1: { cellWidth: 44 },
      2: { cellWidth: 46 },
      3: { cellWidth: 38 },
      4: { cellWidth: 40 },
      5: { cellWidth: 42 },
      6: { cellWidth: 39 },
      7: { cellWidth: 15 }
    }
  });

  // Tambahkan Footer Nomor Halaman Resmi UNIKMA di Setiap Halaman
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Dokumen Resmi RPS OBE Universitas Komputama (UNIKMA) · ${rps.institusi.kodeDokumenStandar} · ${rps.identitas.kodeMk} ${rps.identitas.namaMk}`,
      10,
      204
    );
    doc.text(`Halaman ${i} dari ${pageCount}`, 287, 204, { align: 'right' });
  }

  const safeCourseName = rps.identitas.namaMk.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `RPS_OBE_UNIKMA_${rps.identitas.kodeMk}_${safeCourseName}.pdf`;
  doc.save(fileName);
  return fileName;
}
