import { isWithinInterval, setHours, setMinutes, startOfDay } from "date-fns";
import { db } from "./db";

export const getSettings = async () => {
  const settingsDB = await db.settings.findMany();
  const settings = settingsDB.reduce((acc, setting) => {
    return {
      ...acc,
      [setting.name]: setting.value,
    };
  }, {});

  return settings;
};

export const isLocked = ({
  lockAt,
  unlockAt,
  customDate,
}: {
  lockAt: string;
  unlockAt: string;
  customDate?: Date;
}) => {
  const [hoursLock, minutesLock] = lockAt.split(":");
  const [hoursUnlock, minutesUnlock] = unlockAt.split(":");
  const date = customDate ?? new Date();
  const lockTime = Number(`${hoursLock}${minutesLock}`);
  const unlockTime = Number(`${hoursUnlock}${minutesUnlock}`);

  // Do a different logic here because we won't care about the interval anymore

  const lockTimeUTC = setMinutes(
    setHours(startOfDay(date), Number(hoursLock)),
    Number(minutesLock),
  );
  const unlockTimeUTC = setMinutes(
    setHours(startOfDay(date), Number(hoursUnlock)),
    Number(minutesUnlock),
  );

  const isWithin = isWithinInterval(date, {
    start: unlockTimeUTC,
    end: lockTimeUTC,
  });

  if (lockTime < unlockTime) {
    return isWithin;
  }

  return !isWithin;
};
