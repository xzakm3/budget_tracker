import { CURRENCY_SYMBOLS, CURRENCY_CODES, DEFAULT_CURRENCY } from '../constants'

/**
 * Formats a monetary amount with the appropriate currency symbol.
 *
 * @param amount - The monetary amount to format
 * @param currency - The currency code (defaults to EUR)
 * @returns Formatted currency string with symbol and two decimal places
 */
export function formatCurrency(
  amount: number | string,
  currency: typeof CURRENCY_CODES[keyof typeof CURRENCY_CODES] = DEFAULT_CURRENCY
): string {
  if (typeof amount === 'string' && amount.trim() === '') {
    throw new Error('Amount cannot be empty')
  }
  
  const symbol = CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS]
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return `${symbol}${numAmount.toFixed(2)}`
}

/**
 * Formats a date string into a user-friendly display format.
 *
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString: string): string {
  if (dateString.trim() === '') {
    return 'Nieco'
  }
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })
}