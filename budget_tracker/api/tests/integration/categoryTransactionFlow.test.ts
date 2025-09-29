import request from 'supertest'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import categoryRoutes from '../../src/routes/categoryRoutes'
import transactionRoutes from '../../src/routes/transactionRoutes'
import { ServiceContainer } from '../../src/container/ServiceContainer'
import DatabaseConnectionSingleton from '../../src/config/databaseConnection'

describe('Category-Transaction Flow Integration Tests', () => {
  let app: express.Application
  
  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test'
    
    // Create test app
    app = express()
    app.use(helmet())
    app.use(cors())
    app.use(morgan('combined'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    
    // Routes
    app.use('/api/categories', categoryRoutes)
    app.use('/api/transactions', transactionRoutes)
    
    // Error handler
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Unhandled error:', err)
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    })

    // Initialize service container for test environment
    ServiceContainer.getInstance(true)
    
    // Create test tables if they don't exist
    await createTestTables()
  })

  beforeEach(async () => {
    // Clean test tables before each test
    await cleanTestTables()
  })

  afterAll(async () => {
    // Clean up after all tests
    await cleanTestTables()
    // Note: Database connection cleanup is handled by the test framework
  })

  async function createTestTables() {
    const dbPool = DatabaseConnectionSingleton.getInstance()
    const client = await dbPool.connect()
    try {
      // Create schema if it doesn't exist
      await client.query('CREATE SCHEMA IF NOT EXISTS temp_andantino')
      
      // Create categories table
      await client.query(`
        CREATE TABLE IF NOT EXISTS temp_andantino.test_categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          color VARCHAR(100) NOT NULL,
          deleted_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)
      
      // Create transactions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS temp_andantino.test_transactions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) NOT NULL,
          date DATE NOT NULL,
          note TEXT,
          type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
          category_id INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES temp_andantino.test_categories(id)
        )
      `)
    } finally {
      client.release()
    }
  }

  async function cleanTestTables() {
    const dbPool = DatabaseConnectionSingleton.getInstance()
    const client = await dbPool.connect()
    try {
      // Delete in correct order to respect foreign keys
      await client.query('DELETE FROM temp_andantino.test_transactions')
      await client.query('DELETE FROM temp_andantino.test_categories')
      
      // Reset sequences - use TRUNCATE to reset sequences automatically
      await client.query('TRUNCATE TABLE temp_andantino.test_transactions RESTART IDENTITY CASCADE')
      await client.query('TRUNCATE TABLE temp_andantino.test_categories RESTART IDENTITY CASCADE')
    } finally {
      client.release()
    }
  }

  describe('Category and Transaction Creation Flow', () => {
    it('should create a category and then create a transaction with that category', async () => {
      // Step 1: Create a category
      const categoryData = {
        name: 'Food & Dining'
      }
      
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201)
      
      expect(categoryResponse.body.success).toBe(true)
      expect(categoryResponse.body.data).toMatchObject({
        id: expect.any(String),
        name: 'Food & Dining',
        color: expect.any(String),
        deleted_at: null,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
      
      const categoryId = categoryResponse.body.data.id
      
      // Step 2: Create a transaction using the created category
      const transactionData = {
        name: 'Lunch at Restaurant',
        amount: 25.50,
        currency: 'EUR',
        date: '2024-09-02',
        note: 'Business lunch with client',
        type: 'expense',
        category_id: categoryId
      }
      
      const transactionResponse = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(201)
      
      expect(transactionResponse.body.success).toBe(true)
      expect(transactionResponse.body.data).toMatchObject({
        id: expect.any(String),
        name: 'Lunch at Restaurant',
        amount: 25.50,
        currency: 'EUR',
        date: '2024-09-02',
        note: 'Business lunch with client',
        type: 'expense',
        category_id: categoryId,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
      
      // Step 3: Verify both records exist in database
      const categoriesResponse = await request(app)
        .get('/api/categories')
        .expect(200)
      
      expect(categoriesResponse.body.success).toBe(true)
      expect(categoriesResponse.body.data).toHaveLength(1)
      expect(categoriesResponse.body.data[0]).toMatchObject({
        id: categoryId,
        name: 'Food & Dining'
      })
      
      const transactionsResponse = await request(app)
        .get('/api/transactions')
        .expect(200)
      
      expect(transactionsResponse.body.success).toBe(true)
      expect(transactionsResponse.body.data).toHaveLength(1)
      expect(transactionsResponse.body.data[0]).toMatchObject({
        name: 'Lunch at Restaurant',
        category_id: categoryId
      })
    })

    it('should create multiple categories with different colors and transactions', async () => {
      // Create first category
      const category1Response = await request(app)
        .post('/api/categories')
        .send({ name: 'Transportation' })
        .expect(201)
      
      const category1Id = category1Response.body.data.id
      const category1Color = category1Response.body.data.color
      
      // Create second category
      const category2Response = await request(app)
        .post('/api/categories')
        .send({ name: 'Entertainment' })
        .expect(201)
      
      const category2Id = category2Response.body.data.id
      const category2Color = category2Response.body.data.color
      
      // Verify categories have different colors
      expect(category1Color).not.toBe(category2Color)
      
      // Create transactions for both categories
      await request(app)
        .post('/api/transactions')
        .send({
          name: 'Bus Ticket',
          amount: 3.20,
          currency: 'EUR',
          date: '2024-09-02',
          note: 'Daily commute',
          type: 'expense',
          category_id: category1Id
        })
        .expect(201)
      
      await request(app)
        .post('/api/transactions')
        .send({
          name: 'Movie Tickets',
          amount: 15.00,
          currency: 'USD',
          date: '2024-09-02',
          note: 'Weekend entertainment',
          type: 'expense',
          category_id: category2Id
        })
        .expect(201)
      
      // Verify all records exist
      const categoriesResponse = await request(app)
        .get('/api/categories')
        .expect(200)
      
      expect(categoriesResponse.body.data).toHaveLength(2)
      
      const transactionsResponse = await request(app)
        .get('/api/transactions')
        .expect(200)
      
      expect(transactionsResponse.body.data).toHaveLength(2)
    })

    it('should handle transaction creation failure when category does not exist', async () => {
      const transactionData = {
        name: 'Invalid Transaction',
        amount: 10.00,
        currency: 'EUR',
        date: '2024-09-02',
        note: 'This should fail',
        type: 'expense',
        category_id: '999999' // Non-existent category
      }
      
      const transactionResponse = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(500) // Should fail due to foreign key constraint
      
      expect(transactionResponse.body.success).toBe(false)
      expect(transactionResponse.body.error).toBe('Failed to create transaction')
    })

    it('should validate category creation with empty name', async () => {
      const invalidCategoryResponse = await request(app)
        .post('/api/categories')
        .send({ name: '' })
        .expect(400)
      
      expect(invalidCategoryResponse.body.success).toBe(false)
      expect(invalidCategoryResponse.body.error).toBe('Category name is required')
    })

    it('should validate transaction creation with missing required fields', async () => {
      // First create a valid category
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({ name: 'Test Category' })
        .expect(201)
      
      const categoryId = categoryResponse.body.data.id
      
      // Test missing name
      await request(app)
        .post('/api/transactions')
        .send({
          amount: 10.00,
          currency: 'EUR',
          date: '2024-09-02',
          type: 'expense',
          category_id: categoryId
        })
        .expect(400)
      
      // Test invalid amount
      await request(app)
        .post('/api/transactions')
        .send({
          name: 'Test Transaction',
          amount: -10.00,
          currency: 'EUR',
          date: '2024-09-02',
          type: 'expense',
          category_id: categoryId
        })
        .expect(400)
      
      // Test invalid currency
      await request(app)
        .post('/api/transactions')
        .send({
          name: 'Test Transaction',
          amount: 10.00,
          currency: 'INVALID',
          date: '2024-09-02',
          type: 'expense',
          category_id: categoryId
        })
        .expect(400)
      
      // Test invalid type
      await request(app)
        .post('/api/transactions')
        .send({
          name: 'Test Transaction',
          amount: 10.00,
          currency: 'EUR',
          date: '2024-09-02',
          type: 'invalid_type',
          category_id: categoryId
        })
        .expect(400)
    })

    it('should handle income and transfer transaction types', async () => {
      // Create category
      const categoryResponse = await request(app)
        .post('/api/categories')
        .send({ name: 'Salary' })
        .expect(201)
      
      const categoryId = categoryResponse.body.data.id
      
      // Create income transaction
      const incomeResponse = await request(app)
        .post('/api/transactions')
        .send({
          name: 'Monthly Salary',
          amount: 3000.00,
          currency: 'EUR',
          date: '2024-09-01',
          note: 'September salary',
          type: 'income',
          category_id: categoryId
        })
        .expect(201)
      
      expect(incomeResponse.body.data.type).toBe('income')
      
      // Create transfer transaction
      const transferResponse = await request(app)
        .post('/api/transactions')
        .send({
          name: 'Account Transfer',
          amount: 500.00,
          currency: 'EUR',
          date: '2024-09-02',
          note: 'Transfer to savings',
          type: 'transfer',
          category_id: categoryId
        })
        .expect(201)
      
      expect(transferResponse.body.data.type).toBe('transfer')
    })
  })
})