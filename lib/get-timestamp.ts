import dayjs from "dayjs";

export const getTimestamp = (): string => `[${dayjs().format("h:mm:ss A")}]`;
