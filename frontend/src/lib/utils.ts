import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Category } from '../backend';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.class6]: 'Class 6',
  [Category.class7]: 'Class 7',
  [Category.class8]: 'Class 8',
  [Category.class9]: 'Class 9',
  [Category.class10]: 'Class 10',
  [Category.class11]: 'Class 11',
  [Category.class12]: 'Class 12',
  [Category.neet]: 'NEET',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.class6]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  [Category.class7]: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  [Category.class8]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  [Category.class9]: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  [Category.class10]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  [Category.class11]: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  [Category.class12]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  [Category.neet]: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
};

export function categoryFromSlug(slug: string): Category | null {
  const map: Record<string, Category> = {
    class6: Category.class6,
    class7: Category.class7,
    class8: Category.class8,
    class9: Category.class9,
    class10: Category.class10,
    class11: Category.class11,
    class12: Category.class12,
    neet: Category.neet,
  };
  return map[slug] ?? null;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
