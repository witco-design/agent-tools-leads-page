/**
 * PROTECTED — Canonical date/time formatting utility.
 *
 * All date/time renderings on the page MUST use one of these formatters.
 * Do not add ad-hoc date.toLocaleString() or inline format() calls in components.
 * If you need a new format variation, add it as a function here.
 *
 * Format spec is locked: 3-letter month, no leading zeros, lowercase am/pm,
 * no space before am/pm, "at" as date-time separator. Do not change without
 * explicit user permission.
 */

import {
  format,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  isSameYear,
} from 'date-fns';

/** "8:00am" — 12-hour, lowercase am/pm, no leading zero, no space */
export function formatTime(date: Date | string | number): string {
  return format(new Date(date), 'h:mmaaa');
}

/** "Jan 10" */
export function formatDate(date: Date | string | number): string {
  return format(new Date(date), 'MMM d');
}

/** "Jan 10, 2026" */
export function formatDateWithYear(date: Date | string | number): string {
  return format(new Date(date), 'MMM d, yyyy');
}

/** "Jan 10 at 8:00am" */
export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return `${format(d, 'MMM d')} at ${formatTime(d)}`;
}

/** "Jan 10, 2026 at 8:00am" */
export function formatDateTimeWithYear(date: Date | string | number): string {
  const d = new Date(date);
  return `${format(d, 'MMM d, yyyy')} at ${formatTime(d)}`;
}

/**
 * PROTECTED — Canonical Follow Up + compact meta date format.
 * Do not inline `format(date, 'MMM d, h:mmaaa')` elsewhere — always import
 * formatDateWithTime from this file. Keeps the convention consistent when
 * we tweak whitespace, punctuation, or 12/24-hour treatment later.
 */

/** "Jan 10, 8:00am" — compact date + time, comma-separated, no year */
export function formatDateWithTime(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(d, 'MMM d, h:mmaaa');
}

/** "Jan 10, 2026, 8:00am" — compact date + time with year, comma-separated */
export function formatDateWithTimeYear(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(d, 'MMM d, yyyy, h:mmaaa');
}

/**
 * Hybrid relative formatter.
 * - Within 1 minute     → "just now"
 * - Within 1 hour       → "N minutes ago"
 * - Within 24 hours     → "N hours ago"
 * - Within 7 days       → "N days ago"
 * - Same year, >7 days  → absolute (e.g., "Jan 10" or "Jan 10 at 8:00am")
 * - Different year      → absolute with year (e.g., "Jan 10, 2024" or "Jan 10, 2024 at 8:00am")
 *
 * @param includeTime if true and falling back to absolute, includes "at h:mmaaa"
 */
export function formatRelative(
  date: Date | string | number,
  options: { includeTime?: boolean } = {}
): string {
  const d = new Date(date);
  const now = new Date();
  const minutes = differenceInMinutes(now, d);
  const hours = differenceInHours(now, d);
  const days = differenceInDays(now, d);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

  if (isSameYear(d, now)) {
    return options.includeTime ? formatDateTime(d) : formatDate(d);
  }
  return options.includeTime ? formatDateTimeWithYear(d) : formatDateWithYear(d);
}
