// src/lib/letterNumber.js

export function formatSerialNumber(serial) {
  // A: 3 digit sampai 999, lalu angka apa adanya untuk 1000+
  if (serial < 1000) {
    return String(serial).padStart(3, "0");
  }
  return String(serial);
}

const ROMAN_MONTHS = [
  null, // index 0 tidak dipakai
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

export function monthToRoman(month) {
  // month: 1-12
  return ROMAN_MONTHS[month] || "";
}
