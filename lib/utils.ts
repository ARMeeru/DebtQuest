import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// NOTE: Lifted this from shadcn/ui - handy utility for combining Tailwind classes
// without running into specificity issues or duplications
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 * 
 * USAGE:
 * formatCurrency(1234.56) => "$1,234.56"
 * formatCurrency(1234.56, "EUR") => "€1,234.56"
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  // Handle edge cases that kept breaking the UI
  if (amount === null || amount === undefined) return '--';
  
  // Tried using a library for this but the built-in one actually works better
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// TODO: Move these to a config file once we implement more currencies
// Will eventually pull these from an API but this works for v1
export function getAvailableCurrencies() {
  return [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
    // Removed for now - had display issues
    // { code: "EUR", name: "Euro", symbol: "€" },
    // { code: "GBP", name: "British Pound", symbol: "£" },
  ];
}

// FIXME: Using US date format for now, need to support localization later
// This is surprisingly tricky with all the edge cases
export function formatDate(date: string | Date): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Make sure it's a valid date before formatting
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date passed to formatDate:', date);
      return "Invalid date";
    }
    
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (err) {
    console.error('Error formatting date:', err);
    return "Date error";
  }
}

/**
 * Returns a human-readable string representing time until a date
 * 
 * I spent way too long on this function but it makes the UI so much nicer!
 * - Dave
 */
export function timeUntil(date: string | Date): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffTime = dateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Return friendly strings based on timeframe
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  } catch {
    return "Unknown";
  }
}

// Quick helper I use all the time
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Useful for randomizing achievements and other lists
// export function shuffle<T>(array: T[]): T[] {
//   // Using Fisher-Yates algorithm
//   const result = [...array];
//   for (let i = result.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [result[i], result[j]] = [result[j], result[i]];
//   }
//   return result;
// }
