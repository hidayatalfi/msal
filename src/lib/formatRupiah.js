export function formatRupiah(angka) {
  const nominal = Number(angka);
  return (
    "Rp " +
    nominal.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}
