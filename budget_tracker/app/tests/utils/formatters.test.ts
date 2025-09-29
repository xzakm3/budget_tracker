import { formatCurrency, formatDate } from '../../src/utils/formatters'
import { CURRENCY_CODES } from '../../src/constants'

describe('formatCurrency', () => {
  describe('happy path', () => {
    it('should format number with default EUR currency', () => {
      expect(formatCurrency(100)).toBe('€100.00')
    })

    it('should format number with USD currency', () => {
      expect(formatCurrency(100, CURRENCY_CODES.USD)).toBe('$100.00')
    })

    it('should format number with EUR currency explicitly', () => {
      expect(formatCurrency(100, CURRENCY_CODES.EUR)).toBe('€100.00')
    })

    it('should format decimal number', () => {
      expect(formatCurrency(123.45)).toBe('€123.45')
    })

    it('should format large number', () => {
      expect(formatCurrency(1234567.89)).toBe('€1234567.89')
    })

    it('should format string number', () => {
      expect(formatCurrency('100')).toBe('€100.00')
    })

    it('should format string decimal', () => {
      expect(formatCurrency('123.45')).toBe('€123.45')
    })
  })

  describe('edge cases', () => {
    it('should format zero', () => {
      expect(formatCurrency(0)).toBe('€0.00')
    })

    it('should format negative number', () => {
      expect(formatCurrency(-100)).toBe('€-100.00')
    })

    it('should format very small decimal', () => {
      expect(formatCurrency(0.01)).toBe('€0.01')
    })

    it('should round to two decimal places', () => {
      expect(formatCurrency(123.456)).toBe('€123.46')
    })

    it('should round to two decimal places (down)', () => {
      expect(formatCurrency(123.454)).toBe('€123.45')
    })

    it('should handle string with leading/trailing spaces', () => {
      expect(formatCurrency(' 100 ')).toBe('€100.00')
    })

    it('should handle string with decimal', () => {
      expect(formatCurrency('123.456')).toBe('€123.46')
    })

    it('should handle very large number', () => {
      expect(formatCurrency(999999999.99)).toBe('€999999999.99')
    })
  })

  describe('error cases', () => {
    it('should throw error for empty string', () => {
      expect(() => formatCurrency('')).toThrow('Amount cannot be empty')
    })

    it('should throw error for whitespace-only string', () => {
      expect(() => formatCurrency('   ')).toThrow('Amount cannot be empty')
    })

    it('should handle invalid string number (NaN)', () => {
      expect(formatCurrency('invalid')).toBe('€NaN')
    })

    it('should handle Infinity', () => {
      expect(formatCurrency(Infinity)).toBe('€Infinity')
    })

    it('should handle negative Infinity', () => {
      expect(formatCurrency(-Infinity)).toBe('€-Infinity')
    })

    it('should handle NaN', () => {
      expect(formatCurrency(NaN)).toBe('€NaN')
    })
  })
})

describe('formatDate', () => {
  describe('happy path', () => {
    it('should format a basic date string', () => {
      expect(formatDate('2024-01-15T10:30:00.000Z')).toBe('Jan 15, 2024')
    })

    it('should format date with different month', () => {
      expect(formatDate('2024-12-25T00:00:00.000Z')).toBe('Dec 25, 2024')
    })

    it('should format date with single-digit day', () => {
      expect(formatDate('2024-03-05T12:00:00.000Z')).toBe('Mar 5, 2024')
    })

    it('should handle leap year date', () => {
      expect(formatDate('2024-02-29T15:45:30.000Z')).toBe('Feb 29, 2024')
    })
  })

  describe('edge cases', () => {
    it('should handle first day of year', () => {
      expect(formatDate('2024-01-01T00:00:00.000Z')).toBe('Jan 1, 2024')
    })

    it('should handle last day of year', () => {
      expect(formatDate('2024-12-31T23:59:59.999Z')).toBe('Dec 31, 2024')
    })

    it('should handle date without time zone info', () => {
      expect(formatDate('2024-06-15T14:30:00')).toBe('Jun 15, 2024')
    })

    it('should handle date with milliseconds', () => {
      expect(formatDate('2024-08-20T09:15:30.123Z')).toBe('Aug 20, 2024')
    })

    it('should handle very old date', () => {
      expect(formatDate('1900-01-01T00:00:00.000Z')).toBe('Jan 1, 1900')
    })

    it('should handle future date', () => {
      expect(formatDate('2050-11-11T16:45:00.000Z')).toBe('Nov 11, 2050')
    })

    it('should handle date with UTC offset', () => {
      expect(formatDate('2024-07-04T12:00:00+05:00')).toBe('Jul 4, 2024')
    })
  })

  describe('error cases', () => {
    it('should handle invalid date string', () => {
      expect(() => formatDate('invalid-date')).not.toThrow()
      expect(formatDate('invalid-date')).toBe('Invalid Date')
    })

    it('should handle empty string', () => {
      expect(() => formatDate('')).not.toThrow()
      expect(formatDate('')).toBe('Nieco')
    })

    it('should handle whitespace-only string', () => {
      expect(() => formatDate('   ')).not.toThrow()
      expect(formatDate('   ')).toBe('Nieco')
    })

    it('should handle malformed date string', () => {
      expect(() => formatDate('2024-13-45')).not.toThrow()
      expect(formatDate('2024-13-45')).toBe('Invalid Date')
    })

    it('should handle non-date string', () => {
      expect(() => formatDate('hello world')).not.toThrow()
      expect(formatDate('hello world')).toBe('Invalid Date')
    })

    it('should handle partial date string', () => {
      expect(() => formatDate('2024-06')).not.toThrow()
      expect(formatDate('2024-06')).toBe('Jun 1, 2024')
    })

    it('should handle date with invalid month', () => {
      expect(() => formatDate('2024-00-15T10:00:00Z')).not.toThrow()
      expect(formatDate('2024-00-15T10:00:00Z')).toBe('Invalid Date')
    })

    it('should handle date with invalid day', () => {
      expect(() => formatDate('2024-02-30T10:00:00Z')).not.toThrow()
      expect(formatDate('2024-02-30T10:00:00Z')).toBe('Mar 1, 2024')
    })
  })
})