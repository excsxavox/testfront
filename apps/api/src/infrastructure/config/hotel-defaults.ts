/**
 * Zona horaria IANA por defecto del piloto (España), alineada con `hotel_settings.timezone_iana` en BD.
 * La interpretación de `check_in_date` / `check_out_date` debe usar siempre la TZ activa en `hotel_settings`.
 */
export const HOTEL_DEFAULT_TIMEZONE_IANA = "Europe/Madrid";
