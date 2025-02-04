import { type ClassValue, clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';
import { twMerge } from 'tailwind-merge';
import { orderStatuses } from './constants';
import { useTranslations } from 'next-intl';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function translateColumnHeader(prefix: string, columnKey: string, tFields: (key: string) => string) {
  const translatedKey = columnKey.replace(/([A-Z])/g, '-$1').toLowerCase();
  return tFields(`${prefix}-${translatedKey}`);
}

export function formatDate(date: Date, showTime = true): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  if (!showTime) {
    return `${day}/${month}/${year}`;
  }
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

export function generateCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
