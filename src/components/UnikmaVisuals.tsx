import React from 'react';

export const UnikmaLogoEmblem: React.FC<{
  size?: number;
  showText?: boolean;
  className?: string;
}> = ({ size = 96, showText = true, className = '' }) => {
  return (
    <svg
      width={size}
      height={showText ? Math.round(size * 0.92) : Math.round(size * 0.72)}
      viewBox={showText ? '0 0 320 295' : '0 0 320 215'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Logo Resmi Universitas Komputama (UNIKMA)"
    >
      {/* =================================================================
          1. BOLA DUNIA HIJAU (GREEN WIREFRAME GLOBE) - #2F6F00
          ================================================================= */}
      <g>
        {/* Busur Atas Globe (Dari Kutub Kiri-Atas ke Kanan-Atas) */}
        <path
          d="M 134 45 C 168 20, 218 28, 244 68 C 216 39, 170 31, 134 45 Z"
          fill="#2F6F00"
        />

        {/* Busur Luar Kiri Globe */}
        <path
          d="M 134 45 C 102 74, 96 122, 118 160 C 107 123, 112 78, 134 45 Z"
          fill="#2F6F00"
        />

        {/* Garis Meridian Dalam 1 (Kiri) */}
        <path
          d="M 134 45 C 122 76, 125 106, 135 128 L 144 124 C 134 102, 129 74, 134 45 Z"
          fill="#2F6F00"
        />

        {/* Garis Meridian Dalam 2 (Tengah) */}
        <path
          d="M 134 45 C 158 58, 178 76, 189 96 L 197 89 C 184 69, 162 52, 134 45 Z"
          fill="#2F6F00"
        />

        {/* Garis Lintang Tengah-Atas (Melengkung dari Kiri-Tengah ke Kanan-Atas) */}
        <path
          d="M 108 131 C 145 123, 193 93, 224 52 C 197 82, 152 109, 107 119 Z"
          fill="#2F6F00"
        />

        {/* Busur Luar Bawah-Kanan Globe */}
        <path
          d="M 134 179 C 175 208, 232 192, 250 139 C 256 121, 256 101, 251 86 C 251 104, 247 124, 238 140 C 217 179, 173 190, 134 179 Z"
          fill="#2F6F00"
        />

        {/* Garis Lintang Dalam Bawah-Kanan */}
        <path
          d="M 134 179 C 173 181, 211 157, 232 121 C 207 149, 171 168, 134 179 Z"
          fill="#2F6F00"
        />

        {/* Segmen Meridian Bawah */}
        <path
          d="M 183 166 L 194 185 L 204 182 L 191 161 Z"
          fill="#2F6F00"
        />
      </g>

      {/* =================================================================
          2. ORBIT SABIT ORANYE & BINTANG (ORANGE SWOOSH & STAR) - #E57C04
          ================================================================= */}
      <g>
        {/* Lintasan Orbit Oranye Melengkung dari Kiri-Bawah Meruncing ke Kanan-Atas */}
        <path
          d="M 103 107 C 66 142, 60 179, 89 184 C 127 190, 204 128, 258 51 C 202 117, 134 162, 100 155 C 83 151, 86 131, 103 107 Z"
          fill="#E57C04"
        />

        {/* Bintang 5 Sudut Oranye di Ujung Kanan Atas */}
        <polygon
          points="265,28 268.2,35.6 276.5,36.2 270.1,41.5 272.1,49.5 265,45.1 257.9,49.5 259.9,41.5 253.5,36.2 261.8,35.6"
          fill="#E57C04"
        />
      </g>

      {/* =================================================================
          3. TIPOGRAFI RESMI: UNIVERSITAS KOMPUTAMA / UNIKMA (#282A74)
          ================================================================= */}
      {showText && (
        <g>
          <text
            x="162"
            y="224"
            textAnchor="middle"
            fill="#282A74"
            fontFamily="'Newsreader', 'Times New Roman', Georgia, serif"
            fontSize="14.5"
            fontWeight="700"
            letterSpacing="2.2"
          >
            UNIVERSITAS KOMPUTAMA
          </text>
          <text
            x="162"
            y="278"
            textAnchor="middle"
            fill="#282A74"
            fontFamily="'Newsreader', 'Times New Roman', Georgia, serif"
            fontSize="54"
            fontWeight="700"
            letterSpacing="1.5"
          >
            UNIKMA
          </text>
        </g>
      )}
    </svg>
  );
};

/**
 * Deterministic SVG QR Code Generator for UNIKMA Official Authorization Block
 */
export const UnikmaAuthorizationQr: React.FC<{
  hash: string;
  size?: number;
}> = ({ hash, size = 64 }) => {
  const gridCount = 13;
  const cells: boolean[][] = Array.from({ length: gridCount }, () =>
    Array.from({ length: gridCount }, () => false)
  );

  // Draw standard 3 finder patterns (top-left, top-right, bottom-left)
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

  // Populate remaining modules deterministically from hash string
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

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridCount + 2} ${gridCount + 2}`}
      className="border border-slate-300 bg-white p-0.5"
      role="img"
      aria-label={`QR Otorisasi ${hash}`}
    >
      <rect width={gridCount + 2} height={gridCount + 2} fill="#FFFFFF" />
      {cells.map((row, rIdx) =>
        row.map((filled, cIdx) =>
          filled ? (
            <rect
              key={`${rIdx}-${cIdx}`}
              x={cIdx + 1}
              y={rIdx + 1}
              width={0.95}
              height={0.95}
              fill="#0F172A"
            />
          ) : null
        )
      )}
    </svg>
  );
};
