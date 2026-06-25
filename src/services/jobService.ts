import { format, startOfWeek, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { Priority } from '../types';

export function computePriority(deadline: Date): Priority {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const hours = diff / (1000 * 60 * 60);
  if (hours <= 24) return 'red';
  if (hours <= 168) return 'amber';
  return 'green';
}

export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function formatDeadline(date: Date): string {
  return format(date, 'dd.MM.yyyy', { locale: de });
}

export function formatDeadlineShort(date: Date): string {
  return format(date, 'EEE dd.MM.', { locale: de });
}

export function getWeekLabel(weekStart: Date): string {
  const weekNum = format(weekStart, 'ww', { locale: de });
  const weekEnd = addDays(weekStart, 6);
  const startStr = format(weekStart, 'd.', { locale: de });
  const endStr = format(weekEnd, 'd. MMMM yyyy', { locale: de });
  return `KW ${weekNum} · ${startStr}–${endStr}`;
}

export function getWeekStartForDate(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}
