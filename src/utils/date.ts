import { format, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Used in Sidebar timestamp (last message time)
 */
export function formatSidebarTimestamp(isoTimestamp: string): string {
  const date = parseISO(isoTimestamp);
  if (isToday(date)) {
    return format(date, 'hh:mm a'); // e.g., "01:35 PM"
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'dd-MM-yyyy'); // e.g., "05-08-2025"
}

/**
 * Used for message timestamp (bottom-right of chat bubble)
 */
export function formatChatTimestamp(isoTimestamp: string): string {
  const date = parseISO(isoTimestamp);
  return format(date, 'hh:mm a'); // Always show 12hr time
}

/**
 * Used for date label in the center of the chat
 */
export function getMessageDayLabel(isoTimestamp: string): string {
  const date = parseISO(isoTimestamp);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'dd-MM-yyyy'); // e.g., "05-08-2025"
}
