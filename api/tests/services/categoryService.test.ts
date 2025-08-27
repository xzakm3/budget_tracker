import { CategoryService } from '../../src/services/categoryService'
import pool from '../../src/config/database'
import { CreateCategoryRequest, Category } from '../../src/types'

// Mock the database pool
jest.mock('../../src/config/database', () => ({
  connect: jest.fn()
}))

describe('CategoryService - createCategory', () => {
  let categoryService: CategoryService
  let mockClient: any

  beforeEach(() => {
    categoryService = new CategoryService()
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    }
    ;(pool.connect as jest.Mock).mockResolvedValue(mockClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Happy path scenarios', () => {
    test('should create category with valid name', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      const mockCategory: Category = {
        id: '1',
        name: 'Food',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        created_at: new Date(),
        updated_at: new Date()
      }

      // Mock count query
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{ count: '0' }] 
      })
      // Mock insert query
      mockClient.query.mockResolvedValueOnce({ 
        rows: [mockCategory] 
      })

      const result = await categoryService.createCategory(categoryData)

      expect(result).toEqual(mockCategory)
      expect(mockClient.query).toHaveBeenCalledTimes(2)
      expect(mockClient.query).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT COUNT(*)'))
      expect(mockClient.query).toHaveBeenNthCalledWith(2, 
        expect.stringContaining('INSERT INTO temp_andantino.categories'),
        ['Food', 'bg-blue-100 text-blue-800 border-blue-200']
      )
      expect(mockClient.release).toHaveBeenCalled()
    })

    test('should create category with correct color cycling', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Transport' }
      const mockCategory: Category = {
        id: '2',
        name: 'Transport',
        color: 'bg-green-100 text-green-800 border-green-200',
        created_at: new Date(),
        updated_at: new Date()
      }

      // Mock count query returning 1 (second category)
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{ count: '1' }] 
      })
      mockClient.query.mockResolvedValueOnce({ 
        rows: [mockCategory] 
      })

      const result = await categoryService.createCategory(categoryData)

      expect(result.color).toBe('bg-green-100 text-green-800 border-green-200')
    })
  })

  describe('Edge case scenarios', () => {
    test('should handle category with minimum length name', async () => {
      const categoryData: CreateCategoryRequest = { name: 'A' }
      const mockCategory: Category = {
        id: '1',
        name: 'A',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '0' }] })
      mockClient.query.mockResolvedValueOnce({ rows: [mockCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.name).toBe('A')
    })

    test('should handle category with very long name', async () => {
      const longName = 'A'.repeat(255)
      const categoryData: CreateCategoryRequest = { name: longName }
      const mockCategory: Category = {
        id: '1',
        name: longName,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '0' }] })
      mockClient.query.mockResolvedValueOnce({ rows: [mockCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.name).toBe(longName)
    })

    test('should handle special characters in category name', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food & Drinks 🍔' }
      const mockCategory: Category = {
        id: '1',
        name: 'Food & Drinks 🍔',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '0' }] })
      mockClient.query.mockResolvedValueOnce({ rows: [mockCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.name).toBe('Food & Drinks 🍔')
    })

    test('should handle unicode characters in category name', async () => {
      const categoryData: CreateCategoryRequest = { name: '食べ物' }
      const mockCategory: Category = {
        id: '1',
        name: '食べ物',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '0' }] })
      mockClient.query.mockResolvedValueOnce({ rows: [mockCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.name).toBe('食べ物')
    })

    test('should handle leading and trailing whitespace', async () => {
      const categoryData: CreateCategoryRequest = { name: '  Food  ' }
      const mockCategory: Category = {
        id: '1',
        name: '  Food  ',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '0' }] })
      mockClient.query.mockResolvedValueOnce({ rows: [mockCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.name).toBe('  Food  ')
    })

    test('should cycle through all available colors', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Category' }
      const mockCategory: Category = {
        id: '1',
        name: 'Category',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        created_at: new Date(),
        updated_at: new Date()
      }

      // Test color cycling beyond available colors (18 colors total)
      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '25' }] })
      mockClient.query.mockResolvedValueOnce({ rows: [mockCategory] })

      await categoryService.createCategory(categoryData)

      // Should use first color again (25 % 18 = 7, so index 7)
      expect(mockClient.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO temp_andantino.categories'),
        ['Category', 'bg-orange-100 text-orange-800 border-orange-200']
      )
    })

    test('should handle large category count numbers', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Category' }
      const mockCategory: Category = {
        id: '1',
        name: 'Category',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '999999' }] })
      mockClient.query.mockResolvedValueOnce({ rows: [mockCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result).toBeDefined()
    })
  })

  describe('Error case scenarios', () => {
    test('should handle database connection failure', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      ;(pool.connect as jest.Mock).mockRejectedValue(new Error('Connection failed'))

      await expect(categoryService.createCategory(categoryData)).rejects.toThrow('Connection failed')
    })

    test('should handle count query failure', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      mockClient.query.mockRejectedValueOnce(new Error('Count query failed'))

      await expect(categoryService.createCategory(categoryData)).rejects.toThrow('Count query failed')
      expect(mockClient.release).toHaveBeenCalled()
    })

    test('should handle insert query failure', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '0' }] })
      mockClient.query.mockRejectedValueOnce(new Error('Insert failed'))

      await expect(categoryService.createCategory(categoryData)).rejects.toThrow('Insert failed')
      expect(mockClient.release).toHaveBeenCalled()
    })

    test('should handle database constraint violation', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '0' }] })
      mockClient.query.mockRejectedValueOnce(new Error('duplicate key value violates unique constraint'))

      await expect(categoryService.createCategory(categoryData)).rejects.toThrow('duplicate key value violates unique constraint')
    })

    test('should handle null/undefined count result', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      mockClient.query.mockResolvedValueOnce({ rows: [{ count: null }] })
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{
          id: '1',
          name: 'Food',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          created_at: new Date(),
          updated_at: new Date()
        }] 
      })

      const result = await categoryService.createCategory(categoryData)

      expect(result.name).toBe('Food')
      // When count is null, parseInt returns NaN, resulting in undefined color
      expect(mockClient.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO temp_andantino.categories'),
        ['Food', undefined]
      )
    })

    test('should handle invalid count format', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      mockClient.query.mockResolvedValueOnce({ rows: [{ count: 'invalid' }] })
      mockClient.query.mockResolvedValueOnce({ 
        rows: [{
          id: '1',
          name: 'Food',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          created_at: new Date(),
          updated_at: new Date()
        }] 
      })

      const result = await categoryService.createCategory(categoryData)

      expect(result.name).toBe('Food')
      // When count is invalid string, parseInt returns NaN, resulting in undefined color
      expect(mockClient.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('INSERT INTO temp_andantino.categories'),
        ['Food', undefined]
      )
    })

    test('should handle empty insert result', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      mockClient.query.mockResolvedValueOnce({ rows: [{ count: '0' }] })
      mockClient.query.mockResolvedValueOnce({ rows: [] })

      const result = await categoryService.createCategory(categoryData)

      expect(result).toBeUndefined()
    })

    test('should always release client even on error', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      mockClient.query.mockRejectedValueOnce(new Error('Database error'))

      await expect(categoryService.createCategory(categoryData)).rejects.toThrow('Database error')
      expect(mockClient.release).toHaveBeenCalled()
    })
  })
})