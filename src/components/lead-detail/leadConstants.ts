export const LEAD_TIMEZONE = 'America/Los_Angeles';

export function formatLocalTime(tz: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';
  const time = `${get('hour')}:${get('minute')}${get('dayPeriod').toLowerCase()}`;
  return `${time} ${get('timeZoneName')}`;
}
