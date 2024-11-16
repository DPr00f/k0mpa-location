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

  // Note: The ternary is to make sure that we accomodate for the case
  // when the user passes a lock/unlock time that will be across 2 days, for example 22:00 to 06:00
  return lockTime < unlockTime ? isWithin : !isWithin;
};
