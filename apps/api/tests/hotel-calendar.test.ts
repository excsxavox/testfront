import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  compareHotelLocalDates,
  hotelStayHalfOpenIntervalsOverlap,
  isValidIanaTimeZoneId,
  parseHotelLocalCalendarDate,
  validateStayHalfOpenInterval,
} from "../src/domain/shared/hotel-calendar.js";

describe("hotel calendar (TZ hotel + YYYY-MM-DD)", () => {
  it("rejects invalid IANA timezone for interval validation", () => {
    const r = validateStayHalfOpenInterval({
      hotelTimezoneIana: "Not/A/Zone",
      checkInDate: "2026-06-01",
      checkOutDate: "2026-06-02",
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error, "invalid_timezone");
  });

  it("accepts valid timezone and valid half-open stay", () => {
    const r = validateStayHalfOpenInterval({
      hotelTimezoneIana: "Europe/Madrid",
      checkInDate: "2026-06-01",
      checkOutDate: "2026-06-03",
    });
    assert.equal(r.ok, true);
  });

  it("rejects check-out on or before check-in (calendar hotel)", () => {
    const same = validateStayHalfOpenInterval({
      hotelTimezoneIana: "Europe/Madrid",
      checkInDate: "2026-06-10",
      checkOutDate: "2026-06-10",
    });
    assert.equal(same.ok, false);
    if (!same.ok) assert.equal(same.error, "check_out_not_after_check_in");

    const before = validateStayHalfOpenInterval({
      hotelTimezoneIana: "Europe/Madrid",
      checkInDate: "2026-06-10",
      checkOutDate: "2026-06-09",
    });
    assert.equal(before.ok, false);
    if (!before.ok) assert.equal(before.error, "check_out_not_after_check_in");
  });

  it("rejects impossible calendar dates", () => {
    const r = validateStayHalfOpenInterval({
      hotelTimezoneIana: "Europe/Madrid",
      checkInDate: "2026-02-30",
      checkOutDate: "2026-03-01",
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.error, "invalid_check_in_date");
  });

  it("lexicographic order matches chronological order for YMD", () => {
    assert.equal(compareHotelLocalDates("2026-01-02", "2026-01-10"), -1);
    assert.equal(compareHotelLocalDates("2026-12-31", "2026-01-01"), 1);
    assert.equal(compareHotelLocalDates("2026-05-01", "2026-05-01"), 0);
  });

  it("overlap on half-open [in, out) uses hotel calendar strings only", () => {
    assert.equal(
      hotelStayHalfOpenIntervalsOverlap("2026-06-01", "2026-06-03", "2026-06-03", "2026-06-05"),
      false,
    );
    assert.equal(
      hotelStayHalfOpenIntervalsOverlap("2026-06-01", "2026-06-03", "2026-06-02", "2026-06-04"),
      true,
    );
  });

  it("parseHotelLocalCalendarDate accepts trim and rejects bad format", () => {
    assert.deepEqual(parseHotelLocalCalendarDate("  2026-01-15  "), { year: 2026, month: 1, day: 15 });
    assert.equal(parseHotelLocalCalendarDate("2026/01/15"), null);
  });

  it("isValidIanaTimeZoneId accepts Europe/Madrid", () => {
    assert.equal(isValidIanaTimeZoneId("Europe/Madrid"), true);
  });
});
