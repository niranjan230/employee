/**
 * Formats a date object or string into a readable date string
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  
  const d = date instanceof Date ? date : new Date(date);
  
  // Check if date is valid
  if (isNaN(d.getTime())) return "Invalid Date";
  
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });
}

/**
 * Formats a number as currency with $ sign
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "N/A";
  
  const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  // Check if number is valid
  if (isNaN(parsedAmount)) return "Invalid Amount";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(parsedAmount);
}

/**
 * Formats input for SSN as user types (XXX-XX-XXXX)
 */
export function formatInputForSSN(input: string): string {
  // Remove all non-numeric characters
  const numbers = input.replace(/\D/g, '');
  
  // Format as XXX-XX-XXXX
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  }
}

/**
 * Formats input for phone number as user types (XXX) XXX-XXXX
 */
export function formatInputForPhone(input: string): string {
  // Remove all non-numeric characters
  const numbers = input.replace(/\D/g, '');
  
  // Format as XXX-XXX-XXXX
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  }
}
