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
