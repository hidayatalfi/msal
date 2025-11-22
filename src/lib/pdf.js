// app/lib/pdf.js
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// ===== Helpers dasar =====
const textWidth = (font, text, size) =>
  font.widthOfTextAtSize(String(text || ""), size);

function drawCenter(page, font, text, y, size, color = rgb(0, 0, 0)) {
  const w = page.getWidth();
  const tw = textWidth(font, text, size);
  const x = (w - tw) / 2;
  page.drawText(String(text), { x, y, size, font, color });
  return { x, width: tw };
}

// Tambahkan parameter lineGap (default 6)
function drawJustifiedParagraph(
  page,
  font,
  text,
  x,
  yStart,
  maxWidth,
  size,
  lineGap = 6,
) {
  const words = String(text || "")
    .trim()
    .split(/\s+/);
  const lines = [];
  let line = "";

  const width = (s) => textWidth(font, s, size);

  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (width(test) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  let y = yStart;
  for (let i = 0; i < lines.length; i++) {
    const isLast = i === lines.length - 1;
    const ln = lines[i];

    if (isLast) {
      page.drawText(ln, { x, y, size, font });
    } else {
      const parts = ln.split(" ");
      if (parts.length <= 1) {
        page.drawText(ln, { x, y, size, font });
      } else {
        const wordsW = parts.reduce(
          (acc, w) => acc + textWidth(font, w, size),
          0,
        );
        const gaps = parts.length - 1;
        const extra = maxWidth - wordsW;
        const gap = extra / gaps;

        const normalSpace = textWidth(font, " ", size);
        if (gap < normalSpace * 0.8 || gap > normalSpace * 3.0) {
          page.drawText(ln, { x, y, size, font });
        } else {
          let cx = x;
          for (let j = 0; j < parts.length; j++) {
            const wtxt = parts[j];
            page.drawText(wtxt, { x: cx, y, size, font });
            const wl = textWidth(font, wtxt, size);
            if (j < parts.length - 1) cx += wl + gap;
          }
        }
      }
    }

    // gunakan lineGap di sini
    y -= size + lineGap;
  }
  return y;
}

function drawTable3(page, font, fontBold, x, yTop, rows, widths, rowH, size) {
  const stroke = rgb(0, 0, 0);
  const headerFill = rgb(242 / 255, 242 / 255, 242 / 255);
  const totalW = widths.reduce((a, b) => a + b, 0);

  // Header background
  page.drawRectangle({
    x,
    y: yTop - rowH,
    width: totalW,
    height: rowH,
    color: headerFill,
  });

  // Horizontal lines
  for (let r = 0; r <= rows.length; r++) {
    const yy = yTop - r * rowH;
    page.drawLine({
      start: { x, y: yy },
      end: { x: x + totalW, y: yy },
      color: stroke,
      thickness: 0.5,
    });
  }

  // Vertical lines
  let vx = x;
  for (let c = 0; c <= widths.length; c++) {
    page.drawLine({
      start: { x: vx, y: yTop },
      end: { x: vx, y: yTop - rowH * rows.length },
      color: stroke,
      thickness: 0.5,
    });
    vx += widths[c] ?? 0;
  }

  // Header text (center) — GUNAKAN fontBold
  let cx = x;
  const header = rows[0];
  for (let i = 0; i < header.length; i++) {
    const cell = String(header[i] ?? "");
    const cw = widths[i];
    const tw = textWidth(fontBold, cell, size); // ← pakai fontBold untuk ukur
    const tx = cx + (cw - tw) / 2;
    page.drawText(cell, {
      x: tx,
      y: yTop - rowH + (rowH - size) / 2,
      size,
      font: fontBold, // ← pakai fontBold untuk gambar
      color: rgb(0, 0, 0),
    });
    cx += cw;
  }

  // Body (kolom 0 kiri; kolom 1–2 center) — tetap pakai font biasa
  let by = yTop - rowH;
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];

    // kolom 0 (left)
    page.drawText(String(row[0] ?? ""), {
      x: x + 6,
      y: by - rowH + (rowH - size) / 2,
      size,
      font, // font biasa
      color: rgb(0, 0, 0),
    });

    // kolom 1 (center)
    const c1 = String(row[1] ?? "");
    const t1 = textWidth(font, c1, size);
    const c1x = x + widths[0] + (widths[1] - t1) / 2;
    page.drawText(c1, {
      x: c1x,
      y: by - rowH + (rowH - size) / 2,
      size,
      font, // font biasa
    });

    // kolom 2 (center)
    const c2 = String(row[2] ?? "");
    const t2 = textWidth(font, c2, size);
    const c2x = x + widths[0] + widths[1] + (widths[2] - t2) / 2;
    page.drawText(c2, {
      x: c2x,
      y: by - rowH + (rowH - size) / 2,
      size,
      font, // font biasa
    });

    by -= rowH;
  }

  return yTop - rowH * rows.length;
}

// Muat logo dari data URL atau path/URL publik
async function loadLogoBytes(logo) {
  if (!logo) return null;
  if (typeof logo === "string" && logo.startsWith("data:image/")) {
    const r = await fetch(logo);
    return new Uint8Array(await r.arrayBuffer());
  }
  // Path relatif -> jadi absolut
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const abs = new URL(logo, base).toString();
  const r = await fetch(abs);
  return new Uint8Array(await r.arrayBuffer());
}

// Tambahkan opsi global: { lineGap }
export async function buildSuratPdf(letter, options = {}) {
  const { lineGap = 3 } = options; // default 6pt

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesB = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const w = page.getWidth();
  const h = page.getHeight();
  const margin = { top: 60, left: 70, right: 70, bottom: 60 };
  let y = h - margin.top;

  // LOGO (opsional)
  if (letter.logo) {
    const bytes = await loadLogoBytes(letter.logo);
    if (bytes) {
      let img;
      try {
        img = await pdfDoc.embedPng(bytes);
      } catch {
        img = await pdfDoc.embedJpg(bytes);
      }

      let widthImage = 55,
        heightImage = 55,
        yAdjust = 65,
        yLogo = 50;

      if (letter.companyID === "MSAL") {
        widthImage = 60;
        heightImage = 60;
        yAdjust = 65;
      } else if (letter.companyID === "PSAM") {
        widthImage = 90;
        heightImage = 90;
        yAdjust = 90;
        yLogo = 20;
      } else if (letter.companyID === "PEAK") {
        widthImage = 70;
        heightImage = 70;
        yAdjust = 75;
        yLogo = 10;
      } else if (letter.companyID === "KPP") {
        widthImage = 40;
        heightImage = 40;
        yAdjust = 58;
      } else if (letter.companyID === "WCJU") {
        widthImage = 180;
        heightImage = 30;
        yAdjust = 62;
      } else if (letter.companyID === "MAPA") {
        widthImage = 55;
        heightImage = 55;
        yAdjust = 58;
      }

      y += yLogo;
      page.drawImage(img, {
        x: margin.left,
        y: y - heightImage,
        width: widthImage,
        height: heightImage,
      });
      y -= yAdjust;
    }
  }

  // Judul
  drawCenter(page, timesB, "SURAT KEPUTUSAN", y, 12);
  y -= 18;

  // Nomor surat
  drawCenter(page, times, `No. ${letter.letterNumber}`, y, 12);
  y -= 38;

  // Tentang + jenis
  drawCenter(page, times, "Tentang", y, 12);
  y -= 16;
  drawCenter(page, timesB, String(letter.type || "Mutasi"), y, 12);
  y -= 22;

  const left = margin.left;
  const right = margin.right;
  const maxWidth = w - left - right;

  // Menimbang
  page.drawText("Menimbang", { x: left, y, size: 12, font: times });
  page.drawText(":", { x: left + 70, y, size: 12, font: times });
  page.drawText("1.", { x: left + 80, y, size: 12, font: times });
  y =
    drawJustifiedParagraph(
      page,
      times,
      "Perlunya tenaga-tenaga profesional sebagai penunjang tujuan Perusahaan sesuai dengan jabatan dan tanggung jawab masing-masing.",
      left + 100,
      y,
      maxWidth - 100,
      12,
      lineGap, // pakai lineGap
    ) - 2;
  y -= 6;
  // Mengingat
  page.drawText("Mengingat", { x: left, y, size: 12, font: times });
  page.drawText(":", { x: left + 70, y, size: 12, font: times });
  page.drawText("1.", { x: left + 80, y, size: 12, font: times });
  y =
    drawJustifiedParagraph(
      page,
      times,
      `Surat permohonan/usulan dari Manajemen MSAL Group mengenai usulan Perubahan Status Karyawan Saudar${letter.employee.gender === "Laki-Laki" ? "a" : "i"} ${letter.employee.name || ""}.`,
      left + 100,
      y,
      maxWidth - 100,
      12,
      lineGap,
    ) + 12;

  y -= 28;
  // Memutuskan
  drawCenter(page, timesB, "Memutuskan", y, 12);
  y -= 25;
  // Menetapkan
  page.drawText("Menetapkan", { x: left, y, size: 12, font: times });
  page.drawText(":", { x: left + 70, y, size: 12, font: times });
  y =
    drawJustifiedParagraph(
      page,
      timesB,
      `Perubahan Status Kekaryawanan Saudar${letter.employee.gender === "Laki-Laki" ? "a" : "i"} ${letter.employee.name || ""}.`,
      left + 100,
      y,
      maxWidth - 100,
      12,
      lineGap,
    ) + 12;
  y -= 28;
  // Poin 1
  page.drawText("1.", { x: left, y, size: 12, font: times });
  y =
    drawJustifiedParagraph(
      page,
      times,
      `Saudar${letter.employee.gender === "Laki-Laki" ? "a" : "i"} ${letter.employee.name || ""} diubah status kekaryawanannya dengan rincian sebagai berikut:`,
      left + 18,
      y,
      maxWidth - 18,
      12,
      lineGap,
    ) + 12;
  y -= 6;
  // Tabel
  const rows = [
    ["Deskripsi", "Status Sebelumnya", "Status Sekarang"],
    [
      "Posisi",
      letter.employee.lastPosition || "-",
      letter.employee.currentPosition || "-",
    ],
    [
      "Lokasi",
      letter.employee.lastLocation || "-",
      letter.employee.currentLocation || "-",
    ],
    [
      "Div./Sub Div./Dept.",
      letter.employee.lastDepartment || "-",
      letter.employee.currentDepartment || "-",
    ],
    [
      "Perusahaan",
      letter.employee.lastCompany || "-",
      letter.employee.currentCompany || "-",
    ],
    [
      "Golongan",
      letter.employee.lastRank || "-",
      letter.employee.currentRank || "-",
    ],
    [
      "Status Karyawan",
      letter.employee.lastStatus || "-",
      letter.employee.currentStatus || "-",
    ],
  ];
  const base = [120, 150, 150];
  const usable = maxWidth - 20;
  const scale = usable / base.reduce((a, b) => a + b, 0);
  const widths = base.map((v) => v * scale);
  const tableX = left + 20;
  const tableTop = y;
  const rowH = 22;

  const afterTableY = drawTable3(
    page,
    times,
    timesB,
    tableX,
    tableTop,
    rows,
    widths,
    rowH,
    12,
  );
  y = afterTableY - 20;

  // Poin 2
  page.drawText("2.", { x: left, y, size: 12, font: times });
  y =
    drawJustifiedParagraph(
      page,
      times,
      "Seluruh surat keputusan atau surat-surat resmi lainnya yang pernah dikeluarkan sebelum ini dan bertentangan dengan isi keputusan ini dinyatakan tidak berlaku lagi.",
      left + 18,
      y,
      maxWidth - 18,
      12,
      lineGap,
    ) + 6;
  y -= 12;
  // Poin 3
  page.drawText("3.", { x: left, y, size: 12, font: times });
  y =
    drawJustifiedParagraph(
      page,
      times,
      "Jika dikemudian hari ternyata terdapat kekeliruan dalam surat keputusan ini, akan diadakan perbaikan sebagaimana mestinya.",
      left + 18,
      y,
      maxWidth - 18,
      12,
      lineGap,
    ) + 6;
  y -= 12;
  // Poin 4
  page.drawText("4.", { x: left, y, size: 12, font: times });
  y =
    drawJustifiedParagraph(
      page,
      times,
      `Keputusan ini berlaku sejak tanggal ${letter.effectiveDateDisplay || ""}.`,
      left + 18,
      y,
      maxWidth - 18,
      12,
      lineGap,
    ) + 12;
  y -= 26;
  // Tanda tangan
  // const centerX = w / 2;
  drawCenter(page, times, `Ditetapkan di ${letter.city || ""}`, y, 12);
  y -= 14;
  drawCenter(page, times, `Tanggal ${letter.letterDateDisplay || ""}`, y, 12);
  y -= 14;
  drawCenter(page, times, `Ditetapkan Oleh,`, y, 12);
  y -= 80;

  const mgr = String(letter.manager || "");
  const mW = textWidth(timesB, mgr, 12);
  const mX = (w - mW) / 2;
  page.drawText(mgr, { x: mX, y, size: 12, font: timesB });
  page.drawLine({
    start: { x: mX + 1, y: y - 2 },
    end: { x: mX + mW + 1, y: y - 2 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  y -= 14;
  drawCenter(page, times, String(letter.position || ""), y, 12);

  // Footer kanan bawah
  const footer1 = "Jl. Radio Dalam Raya no.87A, Jakarta Selatan 12140";
  const footer2 = "phone +6221 723 1999,  faximile +6221 723 1819";
  const color1 = rgb(31 / 255, 20 / 255, 96 / 255);
  const colorHL = rgb(172 / 255, 193 / 255, 66 / 255);

  const f1w = textWidth(times, footer1, 9);
  page.drawText(footer1, {
    x: w - f1w - margin.right,
    y: 30,
    size: 9,
    font: times,
    color: color1,
  });

  let fx = w - textWidth(times, footer2, 9) - margin.right;
  const yF = 20;
  const tokens = footer2.split(/(\s+)/);
  for (const tk of tokens) {
    const word = tk || "";
    const isHL =
      word.trim().toLowerCase() === "phone" ||
      word.trim().toLowerCase() === "faximile";
    page.drawText(word, {
      x: fx,
      y: yF,
      size: 9,
      font: times,
      color: isHL ? colorHL : color1,
    });
    fx += textWidth(times, word, 9);
  }

  return await pdfDoc.save();
}
