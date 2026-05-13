/**
 * Japan Date Helper Functions
 *
 * Provides utility functions for classifying dates in Japan, including:
 * - Checking if a date is a Japan public holiday (fetched from external API)
 * - Determining weekdays, weekends, and holidays
 * - Calculating date breakdowns for date ranges
 * - Validating date ranges within the same month
 *
 * Uses the Nager Date API (https://date.nager.at/api/v3/publicholidays/{year}/JP)
 * to fetch Japan public holidays dynamically.
 */

import axios from 'axios';

/**
 * Interface for date breakdown results
 */
export interface DateBreakdown {
  weekdays: number;
  weekends: number;
  holidays: number; // Total holidays (weekends + public holidays)
  publicHolidays: number; // Public holidays only (excluding weekends)
  totalDays: number;
  weekdayDates: Date[];
  holidayDates: Date[];
  publicHolidayDates: Date[];
}

/**
 * Cache entry structure for holiday data
 */
interface HolidayCacheEntry {
  data: string[];
  timestamp: number;
}

/**
 * In-memory cache for Japan holidays
 * Key format: `japan_holidays_{year}`
 */
const holidayCache = new Map<string, HolidayCacheEntry>();

/**
 * Cache TTL: 24 hours
 */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * API timeout: 5 seconds
 */
const API_TIMEOUT_MS = 5000;

/**
 * Check if cached data is still valid
 */
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL_MS;
}

/**
 * Get cached holidays for a year
 */
function getCachedHolidays(year: number): string[] | null {
  const cacheKey = `japan_holidays_${year}`;
  const cached = holidayCache.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  return null;
}

/**
 * Store holidays in cache
 */
function setCachedHolidays(year: number, holidays: string[]): void {
  const cacheKey = `japan_holidays_${year}`;
  holidayCache.set(cacheKey, {
    data: holidays,
    timestamp: Date.now()
  });
}

/**
 * Normalize date to YYYY-MM-DD format string
 */
function normalizeDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get Japan public holidays for a specific year and month
 * Fetches from external API and filters by month
 *
 * @param year - The year to fetch holidays for
 * @param month - The month (1-12) to filter holidays
 * @returns Promise resolving to array of holiday dates in YYYY-MM-DD format
 */
export async function getJapanHolidays(
  year: number,
  month: number
): Promise<string[]> {
  try {
    // Check cache first
    const cached = getCachedHolidays(year);
    if (cached) {
      // Filter cached data by month
      return cached.filter((dateStr) => {
        const dateMonth = parseInt(dateStr.split('-')[1], 10);
        return dateMonth === month;
      });
    }

    // Build API URL
    const apiUrl = `https://date.nager.at/api/v3/publicholidays/${year}/JP`;

    // Make HTTP GET request with timeout
    const response = await axios.get(apiUrl, {
      timeout: API_TIMEOUT_MS
    });

    // Parse JSON response
    const holidays = response.data;

    // Extract date field and filter
    const holidayDates: string[] = [];

    for (const holiday of holidays) {
      const dateStr = holiday.date; // Format: YYYY-MM-DD

      // Parse date to check day of week
      const date = new Date(dateStr);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

      // Filter out Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Filter by month
        const dateMonth = parseInt(dateStr.split('-')[1], 10);
        if (dateMonth === month) {
          holidayDates.push(dateStr);
        }
      }
    }

    // Store full year data in cache (for reuse across months)
    const allYearHolidays = holidays
      .map((h) => h.date)
      .filter((dateStr) => {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6; // Exclude weekends
      });

    setCachedHolidays(year, allYearHolidays);

    return holidayDates;
  } catch {
    // Try to return cached data even if expired
    const cached = getCachedHolidays(year);
    if (cached) {
      return cached.filter((dateStr) => {
        const dateMonth = parseInt(dateStr.split('-')[1], 10);
        return dateMonth === month;
      });
    }

    // Return empty array if no cache available
    return [];
  }
}

/**
 * Check if a date is a Japan public holiday
 *
 * @param date - The date to check
 * @returns Promise resolving to true if the date is a holiday, false otherwise
 */
export async function isJapanHoliday(date: Date): Promise<boolean> {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11

  const holidays = await getJapanHolidays(year, month);
  const normalizedDate = normalizeDate(date);

  return holidays.includes(normalizedDate);
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 *
 * @param date - The date to check
 * @returns true if the date is Saturday or Sunday, false otherwise
 */
export function isWeekend(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * Check if a date is a weekday (not weekend, not holiday)
 *
 * @param date - The date to check
 * @returns Promise resolving to true if the date is a weekday, false otherwise
 */
export async function isWeekday(date: Date): Promise<boolean> {
  if (isWeekend(date)) {
    return false;
  }

  const isHoliday = await isJapanHoliday(date);
  return !isHoliday;
}

/**
 * Get breakdown of days between two dates (inclusive)
 *
 * @param startDate - The start date (inclusive)
 * @param endDate - The end date (inclusive)
 * @returns Promise resolving to DateBreakdown object with counts and date arrays
 */
export async function getDateBreakdown(
  startDate: Date,
  endDate: Date
): Promise<DateBreakdown> {
  // Validate that startDate <= endDate
  if (startDate > endDate) {
    throw new Error('startDate must be less than or equal to endDate');
  }

  // Extract year and month from startDate (range is guaranteed to be within one month)
  const year = startDate.getFullYear();
  const month = startDate.getMonth() + 1;

  // Fetch holidays for the month
  const holidays = await getJapanHolidays(year, month);
  const holidaySet = new Set(holidays);

  // Initialize counters
  let totalWeekdays = 0; // All weekdays (Monday-Friday) in range
  let weekends = 0;
  let holidaysCount = 0; // Total holidays (weekends + public holidays)
  let publicHolidaysCount = 0; // Public holidays only (excluding weekends)
  let publicHolidaysOnWeekdays = 0; // Public holidays that fall on weekdays
  const weekdayDates: Date[] = [];
  const holidayDates: Date[] = []; // All holidays (weekends + public holidays)
  const publicHolidayDates: Date[] = []; // Public holidays only

  // Iterate through each date from startDate to endDate (inclusive)
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  const endDateNormalized = new Date(endDate);
  endDateNormalized.setHours(0, 0, 0, 0);

  while (currentDate <= endDateNormalized) {
    const dateStr = normalizeDate(currentDate);
    const dayOfWeek = currentDate.getDay();
    const isPublicHoliday = holidaySet.has(dateStr);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday-Friday

    if (isPublicHoliday) {
      // Public holiday (can be on any day including weekends)
      holidaysCount++;
      publicHolidaysCount++;
      holidayDates.push(new Date(currentDate));
      publicHolidayDates.push(new Date(currentDate));

      if (isWeekday) {
        // Public holiday on a weekday - count in total weekdays but not in weekdayDates
        publicHolidaysOnWeekdays++;
        totalWeekdays++; // Count as weekday for calculation
      }
    } else if (isWeekend) {
      // Weekend (not a public holiday)
      weekends++;
      holidaysCount++; // Weekends count as holidays too
      holidayDates.push(new Date(currentDate));
    } else {
      // Weekday (not a holiday)
      totalWeekdays++;
      weekdayDates.push(new Date(currentDate)); // Only non-holiday weekdays
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Remaining weekdays = total weekdays - public holidays on weekdays
  const weekdays = totalWeekdays - publicHolidaysOnWeekdays;
  // Total days = remaining weekdays + weekends + public holidays
  // Note: Public holidays on weekends are counted in publicHolidaysCount but not in weekends
  const totalDays = weekdays + weekends + publicHolidaysCount;

  return {
    weekdays,
    weekends,
    holidays: holidaysCount,
    publicHolidays: publicHolidaysCount,
    totalDays,
    weekdayDates,
    holidayDates,
    publicHolidayDates
  };
}

/**
 * Get breakdown of remaining days from startDate to month end
 *
 * @param startDate - The start date
 * @returns Promise resolving to DateBreakdown object
 */
export async function getRemainingMonthDaysBreakdown(
  startDate: Date
): Promise<DateBreakdown> {
  // Calculate last day of month
  const year = startDate.getFullYear();
  const month = startDate.getMonth();

  // Get first day of next month, then subtract one day
  const lastDayOfMonth = new Date(year, month + 1, 0);

  return getDateBreakdown(startDate, lastDayOfMonth);
}

/**
 * Validate that two dates are in the same month and year
 *
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns true if both dates are in the same month and year, false otherwise
 */
export function validateDateRangeInSameMonth(
  startDate: Date,
  endDate: Date
): boolean {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth();

  return startYear === endYear && startMonth === endMonth;
}
