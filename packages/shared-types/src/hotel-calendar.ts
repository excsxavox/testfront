/**
 * Calendario de estancia del hotel: fechas almacenadas como `YYYY-MM-DD` (TEXT en SQLite)
 * e interpretadas siempre según `hotel_settings.timezone_iana` del establecimiento.
 *
 * Intervalo de ocupación semántico: [check_in_date, check_out_date) — la noche de salida
 * no cuenta como ocupada.
 *
 * Las comparaciones de intervalos y solapes operan sobre esas fechas de calendario del hotel.
 * No se mezclan instantes UTC del huésped con cadenas de fecha sin pasar por esta capa.
 */

const YMD = /^(\d{4})-(\d{2})-(\d{2})$/;

export type HotelLocalDateString = string;

/** Valida que `zone` sea aceptada por el motor de zonas horarias del runtime (IANA típica). */
export function isValidIanaTimeZoneId(zone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Comprueba formato `YYYY-MM-DD` y que el día exista en calendario gregoriano (civil).
 * Para el piloto, el calendario civil del hotel coincide con gregoriano (p. ej. España).
 */
export function parseHotelLocalCalendarDate(ymd: string): { year: number; month: number; day: number } | null {
  const m = YMD.exec(ymd.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const t = Date.UTC(year, month - 1, day);
  const d = new Date(t);
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return null;
  return { year, month, day };
}

/** Orden lexicográfico = orden cronológico para `YYYY-MM-DD` válidas. */
export function compareHotelLocalDates(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * `true` si los intervalos de estancia en calendario hotel [in, out) se solapan.
 * Solo considera reservas con el mismo modelo de fechas en TZ del hotel (persistencia + dominio).
 */
export function hotelStayHalfOpenIntervalsOverlap(
  checkInA: string,
  checkOutA: string,
  checkInB: string,
  checkOutB: string,
): boolean {
  return !(compareHotelLocalDates(checkOutA, checkInB) <= 0 || compareHotelLocalDates(checkOutB, checkInA) <= 0);
}

export type StayIntervalValidationError =
  | "invalid_timezone"
  | "invalid_check_in_date"
  | "invalid_check_out_date"
  | "check_out_not_after_check_in";

/**
 * Valida fechas de estancia para el hotel: existencia en calendario y salida estrictamente posterior a entrada.
 * `hotelTimezoneIana` MUST coincidir con `hotel_settings.timezone_iana` usada al persistir/leer fechas.
 */
export function validateStayHalfOpenInterval(params: {
  hotelTimezoneIana: string;
  checkInDate: string;
  checkOutDate: string;
}): { ok: true } | { ok: false; error: StayIntervalValidationError } {
  const { hotelTimezoneIana, checkInDate, checkOutDate } = params;
  if (!isValidIanaTimeZoneId(hotelTimezoneIana)) {
    return { ok: false, error: "invalid_timezone" };
  }
  if (!parseHotelLocalCalendarDate(checkInDate)) {
    return { ok: false, error: "invalid_check_in_date" };
  }
  if (!parseHotelLocalCalendarDate(checkOutDate)) {
    return { ok: false, error: "invalid_check_out_date" };
  }
  if (compareHotelLocalDates(checkOutDate, checkInDate) <= 0) {
    return { ok: false, error: "check_out_not_after_check_in" };
  }
  return { ok: true };
}
