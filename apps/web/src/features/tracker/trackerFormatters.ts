export function formatWeekId(weekId?: string): string {
  if (!weekId) return '';
  const parts = weekId.split('-');
  if (parts.length !== 3) return weekId;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month, day);

  try {
    const dayStr = date.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthStr = monthNames[date.getMonth()];
    const yearStr = date.getFullYear();
    return `Week of ${dayStr} ${monthStr} ${yearStr}`;
  } catch {
    return `Week of ${weekId}`;
  }
}
