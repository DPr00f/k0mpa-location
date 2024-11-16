import { expect, it } from "vitest";
import { isLocked } from "./utils";
import { setHours, setMinutes } from "date-fns";

it("Should show unlocked between 10:00 and 19:00", () => {
  const unlockAt = "10:00";
  const lockAt = "19:00";

  const date = setHours(setMinutes(new Date(), 0), 15);
  const isLockedBetween = isLocked({ lockAt, unlockAt, customDate: date });

  expect(isLockedBetween).toBe(false);
});

it("Should show locked after 19:00", () => {
  const unlockAt = "10:00";
  const lockAt = "19:00";

  const date = setHours(setMinutes(new Date(), 1), 19);
  const isLockedBetween = isLocked({ lockAt, unlockAt, customDate: date });

  expect(isLockedBetween).toBe(true);
});

it("Should show locked before 10:00", () => {
  const unlockAt = "10:00";
  const lockAt = "19:00";

  const date = setHours(setMinutes(new Date(), 0), 9);
  const isLockedBetween = isLocked({ lockAt, unlockAt, customDate: date });

  expect(isLockedBetween).toBe(true);
});

it("Should show locked between 10:00 and 19:00", () => {
  const lockAt = "10:00";
  const unlockAt = "19:00";

  const date = setHours(setMinutes(new Date(), 0), 11);
  const isLockedBetween = isLocked({ lockAt, unlockAt, customDate: date });

  expect(isLockedBetween).toBe(true);
});

it("Should show unlocked before 10:00", () => {
  const lockAt = "10:00";
  const unlockAt = "19:00";

  const date = setHours(setMinutes(new Date(), 0), 9);
  const isLockedBetween = isLocked({ lockAt, unlockAt, customDate: date });

  expect(isLockedBetween).toBe(false);
});

it("Should show locked after 19:00", () => {
  const lockAt = "10:00";
  const unlockAt = "19:00";

  const date = setHours(setMinutes(new Date(), 1), 19);
  const isLockedBetween = isLocked({ lockAt, unlockAt, customDate: date });

  expect(isLockedBetween).toBe(false);
});
