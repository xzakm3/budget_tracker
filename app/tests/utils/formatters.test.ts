import { formatDate } from '../../src/utils/formatters'

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