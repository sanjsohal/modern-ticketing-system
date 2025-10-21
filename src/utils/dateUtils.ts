import { format, parseISO, isValid } from 'date-fns';

/**
 * Safely parses a date value (string or Date object) into a Date object
 * @param dateValue - ISO string, timestamp, or Date object
 * @returns Parsed Date object or null if invalid
 */
export const parseDate = (dateValue: string | Date | number | null | undefined): Date | null => {
  if (!dateValue) return null;

  try {
    if (dateValue instanceof Date) {
      return isValid(dateValue) ? dateValue : null;
    }

    if (typeof dateValue === 'string') {
      const parsed = parseISO(dateValue);
      return isValid(parsed) ? parsed : null;
    }

    if (typeof dateValue === 'number') {
      const parsed = new Date(dateValue);
      return isValid(parsed) ? parsed : null;
    }

    return null;
  } catch (error) {
    console.error('Error parsing date:', dateValue, error);
    return null;
  }
};

/**
 * Formats a date value with a fallback message for invalid dates
 * @param dateValue - Date value to format
 * @param formatString - date-fns format string (default: 'dd MMM yyyy, hh:mm a')
 * @param fallback - Fallback text for invalid dates (default: 'Invalid date')
 * @returns Formatted date string or fallback
 */
export const formatDate = (
  dateValue: string | Date | number | null | undefined,
  formatString: string = 'dd MMM yyyy, hh:mm a',
  fallback: string = 'Invalid date'
): string => {
  const date = parseDate(dateValue);
  
  if (!date) {
    return fallback;
  }

  try {
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', dateValue, error);
    return fallback;
  }
};

/**
 * Common date format presets
 */
export const DateFormats = {
  /** Example: 21 Oct 2025, 03:00 PM */
  FULL_DATETIME: 'dd MMM yyyy, hh:mm a',
  /** Example: 21 Oct 2025 */
  DATE_ONLY: 'dd MMM yyyy',
  /** Example: 03:00 PM */
  TIME_ONLY: 'hh:mm a',
  /** Example: 21/10/2025 */
  SHORT_DATE: 'dd/MM/yyyy',
  /** Example: 2025-10-21 */
  ISO_DATE: 'yyyy-MM-dd',
  /** Example: October 21, 2025 */
  LONG_DATE: 'MMMM dd, yyyy',
  /** Example: Oct 21 */
  SHORT_MONTH_DAY: 'MMM dd',
  /** Example: 21 Oct 2025, 15:00 */
  DATETIME_24H: 'dd MMM yyyy, HH:mm',
} as const;

/**
 * Helper to format date with common presets
 */
export const formatDatePreset = (
  dateValue: string | Date | number | null | undefined,
  preset: keyof typeof DateFormats,
  fallback: string = 'Invalid date'
): string => {
  return formatDate(dateValue, DateFormats[preset], fallback);
};
