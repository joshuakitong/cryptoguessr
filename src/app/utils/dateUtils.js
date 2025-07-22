export function getCurrentMonthKey() {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 8);
  return now.toISOString().split("T")[0].slice(0, 7);
}