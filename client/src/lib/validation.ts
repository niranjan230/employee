import { z } from "zod";

/**
 * Calculate age from date of birth
 */
export function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Validates if date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date <= today;
}

/**
 * Custom SSN validation with proper format checking
 */
export const ssnSchema = z.string().regex(/^\d{3}-\d{2}-\d{4}$/, {
  message: "SSN must be in format XXX-XX-XXXX"
});

/**
 * Custom phone number validation with proper format checking
 */
export const phoneSchema = z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, {
  message: "Phone must be in format (XXX) XXX-XXXX"
});

/**
 * Custom ZIP code validation
 */
export const zipSchema = z.string().regex(/^\d{5}$/, {
  message: "ZIP must be 5 digits"
});

/**
 * Age validation function (22-64 years)
 */
export function validateEmployeeAge(dob: Date): boolean {
  const age = calculateAge(dob);
  return age >= 22 && age <= 64;
}
