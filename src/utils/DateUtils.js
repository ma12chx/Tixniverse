const MILLISEC_IN_A_DAY = 1000 * 60 * 60 * 24;

export const DAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/*
 * Parses a date string in the format "YYYY-MM-DD" and returns a Date object.
 */
export function parseDateKey(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/*
 * Whole days from today to the event date:
 * positive = future, 0 = today, negative = past
 */
export function getDaysUntil(eventDate, now = new Date()) {
  if (!eventDate) return null;

  const eventDay = parseDateKey(eventDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.round((eventDay - today) / MILLISEC_IN_A_DAY);
}

/*
 * Get the date in the specified time zone and format it as "YYYY-MM-DD".
 */
export function getDateInThaiTimeZone(date, timeZone = "Asia/Bangkok") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/*
 * Format the number of days until the event into a human-readable string.
 */
export function formatDaysUntil(days) {
  if (days === null) return "-";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";

  return days > 0 ? `${days} days` : `${Math.abs(days)} days ago`;
}

/*
 * Format the event date into a human-readable string.
 */
export function formatDatePretty(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr + "T00:00:00");

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
