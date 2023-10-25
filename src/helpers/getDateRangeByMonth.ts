type SpanishMonth =
  | "Enero"
  | "Febrero"
  | "Marzo"
  | "Abril"
  | "Mayo"
  | "Junio"
  | "Julio"
  | "Agosto"
  | "Septiembre"
  | "Octubre"
  | "Noviembre"
  | "Diciembre";

export function getStartAndEndDateForMonth(month: SpanishMonth): {
  startDate: Date;
  endDate: Date;
} {
  // Define a mapping of month names to their respective number of days
  const daysInMonth: { [key in SpanishMonth]: number } = {
    Enero: 31,
    Febrero: 28, // Note: February has 28 days for simplicity (not considering leap years)
    Marzo: 31,
    Abril: 30,
    Mayo: 31,
    Junio: 30,
    Julio: 31,
    Agosto: 31,
    Septiembre: 30,
    Octubre: 31,
    Noviembre: 30,
    Diciembre: 31,
  };

  // Calculate the start date (1st day of the month)
  const startDate = new Date(
    new Date().getFullYear(),
    Object.keys(daysInMonth).indexOf(month),
    1
  );

  // Calculate the end date (last day of the month)
  const endDate = new Date(
    new Date().getFullYear(),
    Object.keys(daysInMonth).indexOf(month),
    daysInMonth[month]
  );

  return { startDate, endDate };
}
