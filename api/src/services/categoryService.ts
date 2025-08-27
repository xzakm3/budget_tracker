import { IDatabasePool, IDatabaseConfig } from '../interfaces/IDatabaseClient'
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types'

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
  'bg-rose-100 text-rose-800 border-rose-200',
]

export class CategoryService {
  private client: any

  constructor(
    private databasePool: IDatabasePool,
    private databaseConfig: IDatabaseConfig
  ) {
    this.initializeClient()
  }

  private async initializeClient() {
    this.client = await this.databasePool.connect()
  }

  async getAllCategories(): Promise<Category[]> {
    const result = await this.client.query(`
      SELECT id, name, color, deleted_at, created_at, updated_at
      FROM ${this.databaseConfig.categoriesTable}
      WHERE deleted_at IS NULL
      ORDER BY created_at ASC
    `)
    return result.rows
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const result = await this.client.query(`
      SELECT id, name, color, deleted_at, created_at, updated_at
      FROM ${this.databaseConfig.categoriesTable}
      WHERE id = $1 AND deleted_at IS NULL
    `, [id])
    return result.rows[0] || null
  }

  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    // Get current category count to assign color
    const countResult = await this.client.query(`
      SELECT COUNT(*) as count
      FROM ${this.databaseConfig.categoriesTable}
      WHERE deleted_at IS NULL
    `)
    const count = parseInt(countResult.rows[0].count)
    const color = CATEGORY_COLORS[count % CATEGORY_COLORS.length]

    const result = await this.client.query(`
      INSERT INTO ${this.databaseConfig.categoriesTable} (name, color)
      VALUES ($1, $2)
      RETURNING id, name, color, deleted_at, created_at, updated_at
    `, [categoryData.name, color])
    
    return result.rows[0]
  }

  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<Category | null> {
    const result = await this.client.query(`
      UPDATE ${this.databaseConfig.categoriesTable}
      SET name = $2
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, name, color, deleted_at, created_at, updated_at
    `, [id, categoryData.name])
    
    return result.rows[0] || null
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.client.query(`
      UPDATE ${this.databaseConfig.categoriesTable}
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
    `, [id])
    
    return (result.rowCount ?? 0) > 0
  }

  async destroy() {
    if (this.client) {
      this.client.release()
    }
  }
}