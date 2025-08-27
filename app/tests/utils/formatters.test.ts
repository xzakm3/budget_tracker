import { formatDate, formatCurrency } from '../../src/utils/formatters'

describe('formatters', () => {
  describe('formatCurrency', () => {
    describe('Happy path scenarios', () => {
      test('should format number amount with default EUR currency', () => {
        const result = formatCurrency(100.50)
        expect(result).toBe('€100.50')
      })

      test('should format number amount with USD currency', () => {
        const result = formatCurrency(250.75, 'USD')
        expect(result).toBe('$250.75')
      })

      test('should format string amount with EUR currency', () => {
        const result = formatCurrency('99.99', 'EUR')
        expect(result).toBe('€99.99')
      })

      test('should format whole number without decimals', () => {
        const result = formatCurrency(50)
        expect(result).toBe('€50.00')
      })

      test('should format zero amount', () => {
        const result = formatCurrency(0)
        expect(result).toBe('€0.00')
      })

      test('should format large amounts', () => {
        const result = formatCurrency(999999.99, 'USD')
        expect(result).toBe('$999999.99')
      })
    })

    describe('Edge case scenarios', () => {
      test('should handle negative amounts', () => {
        const result = formatCurrency(-50.25)
        expect(result).toBe('€-50.25')
      })

      test('should handle very small amounts', () => {
        const result = formatCurrency(0.01)
        expect(result).toBe('€0.01')
      })

      test('should handle amounts with many decimal places', () => {
        const result = formatCurrency(123.456789)
        expect(result).toBe('€123.46')
      })

      test('should handle string amounts with many decimals', () => {
        const result = formatCurrency('99.999', 'USD')
        expect(result).toBe('$100.00')
      })

      test('should handle scientific notation numbers', () => {
        const result = formatCurrency(1e6)
        expect(result).toBe('€1000000.00')
      })

      test('should handle very large numbers', () => {
        const result = formatCurrency(Number.MAX_SAFE_INTEGER)
        expect(result).toBe('€9007199254740991.00')
      })
    })

    describe('Error case scenarios', () => {
      test('should handle NaN number input', () => {
        const result = formatCurrency(NaN)
        expect(result).toBe('€NaN')
      })

      test('should handle Infinity', () => {
        const result = formatCurrency(Infinity)
        expect(result).toBe('€Infinity')
      })

      test('should handle negative Infinity', () => {
        const result = formatCurrency(-Infinity)
        expect(result).toBe('€-Infinity')
      })

      test('should handle invalid string amount', () => {
        const result = formatCurrency('invalid')
        expect(result).toBe('€NaN')
      })

      test('should throw error for empty string amount', () => {
        expect(() => formatCurrency('')).toThrow('Amount cannot be empty')
      })

      test('should throw error for whitespace-only string amount', () => {
        expect(() => formatCurrency('   ')).toThrow('Amount cannot be empty')
      })

      test('should handle non-numeric string', () => {
        const result = formatCurrency('abc123')
        expect(result).toBe('€NaN')
      })

      test('should handle string with mixed content', () => {
        const result = formatCurrency('123abc')
        expect(result).toBe('€123.00')
      })
    })
  })

  describe('formatDate', () => {
    describe('Happy path scenarios', () => {
      test('should format standard ISO date string correctly', () => {
        const result = formatDate('2024-01-15T10:30:00.000Z')
        expect(result).toBe('Jan 15, 2024')
      })

      test('should format date without time correctly', () => {
        const result = formatDate('2024-12-25')
        expect(result).toBe('Dec 25, 2024')
      })

      test('should format leap year date correctly', () => {
        const result = formatDate('2024-02-29T23:59:58.000Z')
        expect(result).toBe('Feb 29, 2024')
      })

      test('should format first day of year correctly', () => {
        const result = formatDate('2024-01-01T00:00:00.000Z')
        expect(result).toBe('Jan 1, 2024')
      })

      test('should format last day of year correctly', () => {
        const result = formatDate('2024-12-31T23:59:59.999Z')
        expect(result).toBe('Dec 31, 2024')
      })
    })

    describe('Edge case scenarios', () => {
      test('should handle very old dates', () => {
        const result = formatDate('1900-01-01T00:00:00.000Z')
        expect(result).toBe('Jan 1, 1900')
      })

      test('should handle future dates', () => {
        const result = formatDate('2099-12-31T23:59:59.999Z')
        expect(result).toBe('Dec 31, 2099')
      })

      test('should handle date with milliseconds', () => {
        const result = formatDate('2024-06-15T14:30:45.123Z')
        expect(result).toBe('Jun 15, 2024')
      })

      test('should handle date with timezone offset', () => {
        const result = formatDate('2024-07-04T10:00:00-05:00')
        expect(result).toBe('Jul 4, 2024')
      })

      test('should handle date at midnight', () => {
        const result = formatDate('2024-03-15T00:00:00.000Z')
        expect(result).toBe('Mar 15, 2024')
      })

      test('should handle date just before midnight', () => {
        const result = formatDate('2024-03-15T23:59:59.999Z')
        expect(result).toBe('Mar 15, 2024')
      })
    })

    describe('Error case scenarios', () => {
      test('should handle invalid date string gracefully', () => {
        const result = formatDate('invalid-date')
        expect(result).toBe('Invalid Date')
      })

      test('should handle empty string', () => {
        const result = formatDate('')
        expect(result).toBe('Invalid Date')
      })

      test('should handle malformed ISO string', () => {
        const result = formatDate('2024-13-40T25:70:70.000Z')
        expect(result).toBe('Invalid Date')
      })

      test('should handle non-date string', () => {
        const result = formatDate('hello world')
        expect(result).toBe('Invalid Date')
      })

      test('should handle null-like string', () => {
        const result = formatDate('null')
        expect(result).toBe('Invalid Date')
      })

      test('should handle undefined-like string', () => {
        const result = formatDate('undefined')
        expect(result).toBe('Invalid Date')
      })

      test('should handle numeric string that is not a valid timestamp', () => {
        const result = formatDate('123')
        expect(result).toBe('Dec 31, 122')
      })
    })
  })
})