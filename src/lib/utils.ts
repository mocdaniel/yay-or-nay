import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSlug(slug: string): string {
  // Format as XXXX-XXXX for better readability
  return slug.slice(0, 4) + "-" + slug.slice(4);
}

export function generateSlug(): string {
  // Generate a random 8-character alphanumeric slug
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function getRatingLabel(rating: number): string {
  if (rating === 0) return "No ratings";
  if (rating <= 1.5) return "Poor";
  if (rating <= 2.5) return "Fair";
  if (rating <= 3.5) return "Good";
  if (rating <= 4.5) return "Very Good";
  return "Excellent";
}

export function getRatingColor(rating: number): string {
  if (rating === 0) return "text-gray-400";
  if (rating <= 2) return "text-red-500";
  if (rating <= 3) return "text-yellow-500";
  if (rating <= 4) return "text-blue-500";
  return "text-green-500";
}

export function sanitizeFormData(formData: FormData): FormData {
  const sanitizedData = new FormData();
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && value === "") {
      continue;
    }
    sanitizedData.append(key, value);
  }
  return sanitizedData;
}
