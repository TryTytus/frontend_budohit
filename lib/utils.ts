import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize("NFD") // Decompose chars (e.g. ą -> a + ˛)
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/\s+/g, "-") // Space to dash
        .replace(/[^\w\-]+/g, "") // Remove non-word chars
        .replace(/\-\-+/g, "-"); // Collapse dashes
}
