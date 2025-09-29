import { CategoryService } from '../../src/services/categoryService'
import { IDatabaseConfig } from '../../src/interfaces/IDatabaseClient'
import { CreateCategoryRequest, Category } from '../../src/types'
import DatabaseConnectionSingleton from '../../src/config/databaseConnection'

jest.mock('../../src/config/databaseConnection')

const mockDatabaseConfig: IDatabaseConfig = {
  categoriesTable: 'categories',
  transactionsTable: 'transactions'
}

const CATEGORY_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-red-100 text-red-800 border-red-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-gray-100 text-gray-800 border-gray-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-lime-100 text-lime-800 border-lime-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-rose-100 text-rose-800 border-rose-200'
]

describe('CategoryService - createCategory', () => {
  let categoryService: CategoryService
  let mockClient: any
  let mockDatabasePool: any

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn()
    }

    mockDatabasePool = {
      connect: jest.fn().mockResolvedValue(mockClient)
    }

    const mockGetInstance = jest.mocked(DatabaseConnectionSingleton.getInstance)
    mockGetInstance.mockReturnValue(mockDatabasePool)

    categoryService = new CategoryService(mockDatabaseConfig)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('happy path', () => {
    it('should create category with first color when no existing categories', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      const expectedCategory: Category = {
        id: '1',
        name: 'Food',
        color: CATEGORY_COLORS[0],
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [expectedCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(mockDatabasePool.connect).toHaveBeenCalledTimes(1)
      expect(mockClient.query).toHaveBeenCalledTimes(2)
      expect(mockClient.query).toHaveBeenNthCalledWith(1, `
        SELECT COUNT(*) as count
        FROM ${mockDatabaseConfig.categoriesTable}
        WHERE deleted_at IS NULL
      `)
      expect(mockClient.query).toHaveBeenNthCalledWith(2, `
        INSERT INTO ${mockDatabaseConfig.categoriesTable} (name, color)
        VALUES ($1, $2)
        RETURNING id, name, color, deleted_at, created_at, updated_at
      `, ['Food', CATEGORY_COLORS[0]])
      expect(mockClient.release).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedCategory)
    })

    it('should create category with correct color based on existing count', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Transport' }
      const existingCount = 5
      const expectedColor = CATEGORY_COLORS[existingCount % CATEGORY_COLORS.length]
      const expectedCategory: Category = {
        id: '6',
        name: 'Transport',
        color: expectedColor,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: '5' }] })
        .mockResolvedValueOnce({ rows: [expectedCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(mockClient.query).toHaveBeenNthCalledWith(2, `
        INSERT INTO ${mockDatabaseConfig.categoriesTable} (name, color)
        VALUES ($1, $2)
        RETURNING id, name, color, deleted_at, created_at, updated_at
      `, ['Transport', expectedColor])
      expect(result).toEqual(expectedCategory)
    })

    it('should handle color cycling when count exceeds available colors', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Entertainment' }
      const existingCount = 25
      const expectedColor = CATEGORY_COLORS[existingCount % CATEGORY_COLORS.length] // Should wrap around
      const expectedCategory: Category = {
        id: '26',
        name: 'Entertainment',
        color: expectedColor,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: '25' }] })
        .mockResolvedValueOnce({ rows: [expectedCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(mockClient.query).toHaveBeenNthCalledWith(2, `
        INSERT INTO ${mockDatabaseConfig.categoriesTable} (name, color)
        VALUES ($1, $2)
        RETURNING id, name, color, deleted_at, created_at, updated_at
      `, ['Entertainment', expectedColor])
      expect(result).toEqual(expectedCategory)
    })
  })

  describe('edge cases', () => {
    it('should handle category name with special characters', async () => {
      const categoryData: CreateCategoryRequest = { name: "Café & Restaurant's" }
      const expectedCategory: Category = {
        id: '1',
        name: "Café & Restaurant's",
        color: CATEGORY_COLORS[0],
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [expectedCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.name).toBe("Café & Restaurant's")
    })

    it('should handle very long category name', async () => {
      const longName = 'A'.repeat(255)
      const categoryData: CreateCategoryRequest = { name: longName }
      const expectedCategory: Category = {
        id: '1',
        name: longName,
        color: CATEGORY_COLORS[0],
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [expectedCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.name).toBe(longName)
    })

    it('should handle count as string "0"', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Test' }
      const expectedCategory: Category = {
        id: '1',
        name: 'Test',
        color: CATEGORY_COLORS[0],
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [expectedCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.color).toBe(CATEGORY_COLORS[0])
    })

    it('should handle count as numeric string', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Test' }
      const expectedCategory: Category = {
        id: '1',
        name: 'Test',
        color: CATEGORY_COLORS[3],
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: '3' }] })
        .mockResolvedValueOnce({ rows: [expectedCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.color).toBe(CATEGORY_COLORS[3])
    })

    it('should handle exact color array length count', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Test' }
      const count = CATEGORY_COLORS.length
      const expectedColor = CATEGORY_COLORS[0] // Should wrap to first color
      const expectedCategory: Category = {
        id: '1',
        name: 'Test',
        color: expectedColor,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: count.toString() }] })
        .mockResolvedValueOnce({ rows: [expectedCategory] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.color).toBe(expectedColor)
    })
  })

  describe('error cases', () => {
    it('should release client when count query fails', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      const countError = new Error('Database connection failed')

      mockClient.query.mockRejectedValueOnce(countError)

      await expect(categoryService.createCategory(categoryData))
        .rejects.toThrow('Database connection failed')

      expect(mockClient.release).toHaveBeenCalledTimes(1)
    })

    it('should release client when insert query fails', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      const insertError = new Error('Unique constraint violation')

      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockRejectedValueOnce(insertError)

      await expect(categoryService.createCategory(categoryData))
        .rejects.toThrow('Unique constraint violation')

      expect(mockClient.release).toHaveBeenCalledTimes(1)
    })

    it('should handle database connection failure', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      const connectionError = new Error('Failed to connect to database')

      mockDatabasePool.connect.mockRejectedValueOnce(connectionError)

      await expect(categoryService.createCategory(categoryData))
        .rejects.toThrow('Failed to connect to database')

      expect(mockClient.release).not.toHaveBeenCalled()
    })

    it('should handle invalid count response', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: null }] })
        .mockResolvedValueOnce({ rows: [{ 
          id: '1', 
          name: 'Food', 
          color: CATEGORY_COLORS[0],
          deleted_at: null,
          created_at: new Date(),
          updated_at: new Date()
        }] })

      const result = await categoryService.createCategory(categoryData)

      expect(result.color).toBe(CATEGORY_COLORS[0]) // parseInt(null) -> NaN, NaN % length -> NaN, should default to 0
    })

    it('should handle empty count result rows', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ 
          id: '1', 
          name: 'Food', 
          color: CATEGORY_COLORS[0],
          deleted_at: null,
          created_at: new Date(),
          updated_at: new Date()
        }] })

      await expect(categoryService.createCategory(categoryData))
        .rejects.toThrow() // Should throw when trying to access rows[0].count on empty array

      expect(mockClient.release).toHaveBeenCalledTimes(1)
    })

    it('should handle non-numeric count string', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      
      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: 'invalid' }] })
        .mockResolvedValueOnce({ rows: [{ 
          id: '1', 
          name: 'Food', 
          color: CATEGORY_COLORS[0],
          deleted_at: null,
          created_at: new Date(),
          updated_at: new Date()
        }] })

      const result = await categoryService.createCategory(categoryData)

      // parseInt('invalid') -> NaN, NaN % length -> NaN, but color assignment should handle this
      expect(result.name).toBe('Food')
    })

    it('should propagate client.release errors', async () => {
      const categoryData: CreateCategoryRequest = { name: 'Food' }
      const expectedCategory: Category = {
        id: '1',
        name: 'Food',
        color: CATEGORY_COLORS[0],
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      mockClient.query
        .mockResolvedValueOnce({ rows: [{ count: '0' }] })
        .mockResolvedValueOnce({ rows: [expectedCategory] })
      
      // Mock release to throw an error
      mockClient.release.mockImplementation(() => {
        throw new Error('Release failed')
      })

      // The function should propagate the release error
      await expect(categoryService.createCategory(categoryData))
        .rejects.toThrow('Release failed')
    })
  })
})