import dayjs from "dayjs";
export function formatDateTimeBR(value: any) {
  if (!value) return "";
  return dayjs(value).format("DD/MM/YYYY HH:mm:ss");
}
