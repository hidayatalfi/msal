export function formattedDate(dateString) {
  if (!dateString) return "";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function convertIndonesianDateToISO(indoDate) {
  const months = {
    Januari: "01",
    Februari: "02",
    Maret: "03",
    April: "04",
    Mei: "05",
    Juni: "06",
    Juli: "07",
    Agustus: "08",
    September: "09",
    Oktober: "10",
    November: "11",
    Desember: "12",
  };

  const [day, monthName, year] = indoDate.split(" ");
  const month = months[monthName];
  return `${year}-${month}-${day.padStart(2, "0")}`;
}

export function formattedDatetimeShortID(datetime) {
  const [datePart, timePartWithMs] = datetime.split("T");
  if (!timePartWithMs) {
    console.warn("format datetime tidak sesuai:", datetime);
    return "";
  }

  // Buang bagian miliseconds + 'Z'
  const timePart = timePartWithMs.replace("Z", "").split(".")[0]; // "01:55:14"

  const [year, monthNum, day] = datePart.split("-"); // ["2025","11","16"]
  const [hours, minutes] = timePart.split(":"); // ["01","55"]

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const month = months[parseInt(monthNum, 10) - 1];

  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

export function formattedDateShortID(datetime) {
  const date = new Date(datetime);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const formatted = `${day} ${month} ${year}`;
  return formatted;
}
