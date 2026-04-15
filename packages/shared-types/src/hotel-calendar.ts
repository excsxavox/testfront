const CALENDAR_YMD = /^\d{4}-\d{2}-\d{2}$/;

export type HotelCalendarErrorCode =
  | "INVALID_TIMEZONE"
  | "INVALID_DATE_FORMAT"
  | "INVALID_CALENDAR_DATE"
  | "CHECK_OUT_NOT_AFTER_CHECK_IN";

export type ValidateStayHalfOpenIntervalResult =
  | { ok: true }
  | { ok: false; code: HotelCalendarErrorCode };

function splitYmd(ymd: string): [number, number, number] | null {
  if (!CALENDAR_YMD.test(ymd)) return null;
  const [y, m, d] = ymd.split("-").map((p) => Number(p));
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
  return [y, m, d];
}

/** True if `yyyy-mm-dd` is a real Gregorian calendar day (interpretación civil, no instante). */
export function isValidGregorianCalendarDate(ymd: string): boolean {
  const parts = splitYmd(ymd);
  if (!parts) return false;
  const [y, m, d] = parts;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/**
 * Comprueba si el motor reconoce el identificador IANA (p. ej. `Europe/Madrid`).
 * Debe ejecutarse antes de interpretar fechas con `Intl` en esa zona.
 */
export function isValidIanaTimeZoneId(timeZoneIana: string): boolean {
  const id = timeZoneIana.trim();
  if (!id) return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: id });
    return true;
  } catch {
    return false;
  }
}

const hotelLocalYmdFormatterFor = (timeZoneIana: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZoneIana,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

/**
 * Primer instante UTC (resolución 1 min) en el que el calendario local del hotel ya muestra `ymd`.
 * Sirve como ancla consistente para ordenar fechas «del hotel» cuando las cadenas son `YYYY-MM-DD`.
 */
export function startOfHotelLocalCalendarDateUtcMillis(
  timeZoneIana: string,
  ymd: string,
): { ok: true; epochMs: number } | { ok: false; code: HotelCalendarErrorCode } {
  if (!isValidIanaTimeZoneId(timeZoneIana)) return { ok: false, code: "INVALID_TIMEZONE" };
  if (!CALENDAR_YMD.test(ymd)) return { ok: false, code: "INVALID_DATE_FORMAT" };
  if (!isValidGregorianCalendarDate(ymd)) return { ok: false, code: "INVALID_CALENDAR_DATE" };

  const [y, m, d] = splitYmd(ymd) as [number, number, number];
  const formatter = hotelLocalYmdFormatterFor(timeZoneIana);
  const center = Date.UTC(y, m - 1, d, 12, 0, 0);
  const stepMs = 60_000;
  const windowMs = 96 * 60 * 60 * 1000;

  for (let ms = center - windowMs; ms <= center + windowMs; ms += stepMs) {
    if (formatter.format(new Date(ms)) === ymd) {
      return { ok: true, epochMs: ms };
    }
  }

  return { ok: false, code: "INVALID_CALENDAR_DATE" };
}

export function parseHotelLocalCalendarDate(
  timeZoneIana: string,
  ymd: string,
): { ok: true; epochMs: number } | { ok: false; code: HotelCalendarErrorCode } {
  return startOfHotelLocalCalendarDateUtcMillis(timeZoneIana, ymd);
}

/**
 * Orden total de fechas de calendario del hotel. Requiere fechas civiles válidas.
 * @returns negativo si a < b, cero si iguales, positivo si a > b
 */
export function compareHotelLocalDates(a: string, b: string, timeZoneIana: string): number {
  const sa = startOfHotelLocalCalendarDateUtcMillis(timeZoneIana, a);
  const sb = startOfHotelLocalCalendarDateUtcMillis(timeZoneIana, b);
  if (!sa.ok || !sb.ok) {
    return 0;
  }
  return sa.epochMs - sb.epochMs;
}

/**
 * Estancia como intervalo medio abierto en noches de calendario del hotel: `[check_in, check_out)`.
 */
export function validateStayHalfOpenInterval(
  timeZoneIana: string,
  checkIn: string,
  checkOut: string,
): ValidateStayHalfOpenIntervalResult {
  if (!isValidIanaTimeZoneId(timeZoneIana)) return { ok: false, code: "INVALID_TIMEZONE" };
  if (!CALENDAR_YMD.test(checkIn) || !CALENDAR_YMD.test(checkOut)) {
    return { ok: false, code: "INVALID_DATE_FORMAT" };
  }
  if (!isValidGregorianCalendarDate(checkIn) || !isValidGregorianCalendarDate(checkOut)) {
    return { ok: false, code: "INVALID_CALENDAR_DATE" };
  }
  if (checkOut <= checkIn) {
    return { ok: false, code: "CHECK_OUT_NOT_AFTER_CHECK_IN" };
  }
  return { ok: true };
}

/**
 * Solape entre dos estancias confirmadas como intervalos `[in, out)` en fechas de calendario del hotel.
 */
export function hotelStayHalfOpenIntervalsOverlap(
  timeZoneIana: string,
  a: { checkIn: string; checkOut: string },
  b: { checkIn: string; checkOut: string },
):
  | { ok: true; overlap: boolean }
  | { ok: false; code: HotelCalendarErrorCode; message: string } {
  const va = validateStayHalfOpenInterval(timeZoneIana, a.checkIn, a.checkOut);
  if (!va.ok) return { ok: false, code: va.code, message: "Intervalo A inválido" };
  const vb = validateStayHalfOpenInterval(timeZoneIana, b.checkIn, b.checkOut);
  if (!vb.ok) return { ok: false, code: vb.code, message: "Intervalo B inválido" };

  const overlap = a.checkIn < b.checkOut && b.checkIn < a.checkOut;
  return { ok: true, overlap };
}
