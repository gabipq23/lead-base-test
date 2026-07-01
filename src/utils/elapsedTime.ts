// utils/elapsedTime.ts
export function parseBrazilianDate(dateStr: string): number {
  const [datePart, timePart] = dateStr.split(", ");
  if (!datePart || !timePart) return NaN;

  const [day, month, year] = datePart.split("/");
  const [hours, minutes, seconds] = timePart.split(":");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds),
  ).getTime();
}

export function getElapsedMs(
  createdAt: string,
  reservedAt?: string | null,
  isReserved?: boolean,
  now?: number,
): number {
  const createdMs = parseBrazilianDate(createdAt);
  if (Number.isNaN(createdMs)) return 0;

  const reservedMs =
    isReserved && reservedAt ? parseBrazilianDate(reservedAt) : null;

  const diffMs =
    reservedMs != null
      ? reservedMs - createdMs
      : (now ?? Date.now()) - createdMs;

  return Math.max(0, diffMs);
}
