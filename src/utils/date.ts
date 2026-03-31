/**
 * Date Formatting Utilities
 */

/**
 * Converts a browser date (yyyy-MM-dd) to backend date format (yyyy/MM/dd)
 */
export const toBackendDate = (dateStr: string): string => {
  if (!dateStr) return '';
  return dateStr.replace(/-/g, '/');
};

/**
 * Converts a backend date (yyyy/MM/dd) to browser date format (yyyy-MM-dd)
 */
export const toBrowserDate = (dateStr: string): string => {
  if (!dateStr) return '';
  return dateStr.replace(/\//g, '-');
};
