/**
 * Reexport: la lógica canónica vive en `@piloto/shared-types` para alinear dominio (API) y cliente web.
 */
export {
  compareHotelLocalDates,
  hotelStayHalfOpenIntervalsOverlap,
  isValidIanaTimeZoneId,
  parseHotelLocalCalendarDate,
  validateStayHalfOpenInterval,
  type HotelLocalDateString,
  type StayIntervalValidationError,
} from "@piloto/shared-types";
