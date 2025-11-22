export function parseFileName(filename) {
  // Hapus ekstensi .pdf (case insensitive)
  filename = filename.replace(/\.pdf$/i, "");

  // Pisahkan berdasarkan spasi, -, atau _
  //   const parts = filename.split(/[\s\-_]+/);
  let parts = filename.split(" ");

  // Ambil 3 kata pertama jika ada
  const jenis = parts[0] || "";
  const nomor = parts[1] || "";
  const perusahaan = parts[2] || "";

  return {
    jenis,
    nomor,
    perusahaan,
  };
}
