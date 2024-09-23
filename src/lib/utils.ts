import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function translateColumnHeader(prefix: string, columnKey: string, tFields: (key: string) => string) {
  const translatedKey = columnKey.replace(/([A-Z])/g, '-$1').toLowerCase();
  return tFields(`${prefix}-${translatedKey}`);
}

export function formatDate(date: Date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); 
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}
