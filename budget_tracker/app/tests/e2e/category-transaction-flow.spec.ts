import { test, expect } from '@playwright/test'
import { Pool } from 'pg'

// Database connection for test setup and cleanup
const testPool = new Pool({
  user: 'jokeice',
  host: 'localhost',
  database: 'jumptech_db',
  password: '',
  port: 5432,
})

test.describe('Category-Transaction Flow E2E Tests', () => {
  test.beforeEach(async () => {
    // Clean test tables before each test
    await cleanTestTables()
  })

  test.afterAll(async () => {
    // Clean test tables after all tests
    await cleanTestTables()
    await testPool.end()
  })

  async function cleanTestTables() {
    const client = await testPool.connect()
    try {
      // Delete in correct order to respect foreign keys
      await client.query('DELETE FROM temp_andantino.test_transactions')
      await client.query('DELETE FROM temp_andantino.test_categories')
    } finally {
      client.release()
    }
  }

  test('should create category and transaction flow', async ({ page }) => {
    // Navigate to the app
    await page.goto('/')

    // Step 1: Verify that "Add New Transaction" button doesn't exist when no categories exist
    // and locate "Go to Categories" button
    await expect(page.getByText('Add New Transaction')).toHaveCount(0)
    
    const goToCategoriesButton = page.getByRole('button', { name: 'Go to Categories' })
    await expect(goToCategoriesButton).toBeVisible()

    // Step 2: Click "Go to Categories" button and create new category
    await goToCategoriesButton.click()
    
    // Verify we're on the Categories page
    await expect(page).toHaveURL(/.*categories/)
    
    // Create new category with name "Test category"
    const addCategoryButton = page.getByRole('button', { name: 'Add New Category' })
    await expect(addCategoryButton).toBeVisible()
    await addCategoryButton.click()
    
    // Fill in category name
    const categoryNameInput = page.getByLabel('Category Name')
    await expect(categoryNameInput).toBeVisible()
    await categoryNameInput.fill('Test category')
    
    // Save the category
    const saveCategoryButton = page.getByRole('button', { name: 'Save Category', exact: true })
    await saveCategoryButton.click()
    
    // Verify category was created
    await expect(page.getByText('Test category')).toBeVisible()

    // Step 3: Navigate back to transactions and create a new transaction
    const transactionsNavLink = page.getByRole('link', { name: 'Transactions' })
    await transactionsNavLink.click()
    
    // Verify we're on the Transactions page
    await expect(page).toHaveURL(/.*transactions/)
    
    // Now "Add New Transaction" button should be available
    const addTransactionButton = page.getByRole('button', { name: 'Add New Transaction' })
    await expect(addTransactionButton).toBeVisible()
    await addTransactionButton.click()
    
    // Fill in transaction details
    // Name: Test
    const transactionNameInput = page.getByLabel('Transaction Name')
    await expect(transactionNameInput).toBeVisible()
    await transactionNameInput.fill('Test')
    
    // Amount: 20 euros
    const amountInput = page.getByLabel('Amount')
    await expect(amountInput).toBeVisible()
    await amountInput.fill('20')
    
    // Currency should be EUR (check if dropdown exists or if it's pre-selected)
    const currencySelect = page.getByLabel('Currency')
    if (await currencySelect.isVisible()) {
      await currencySelect.selectOption('EUR')
    }
    
    // Date: 20th August 2025
    const dateInput = page.getByLabel('Date')
    await expect(dateInput).toBeVisible()
    await dateInput.fill('2025-08-20')
    
    // Type: expense
    const typeExpenseRadio = page.getByLabel('Expense')
    await expect(typeExpenseRadio).toBeVisible()
    await typeExpenseRadio.check()
    
    // Note: This is testing note
    const noteTextarea = page.getByLabel('Note')
    await expect(noteTextarea).toBeVisible()
    await noteTextarea.fill('This is testing note')
    
    // Select the category we created
    const categorySelect = page.getByLabel('Category')
    await expect(categorySelect).toBeVisible()
    await categorySelect.selectOption({ label: 'Test category' })
    
    // Save the transaction
    const saveTransactionButton = page.getByRole('button', { name: 'Save Transaction' })
    await saveTransactionButton.click()
    
    // Verify transaction was created successfully
    await expect(page.getByText('Test')).toBeVisible() // Transaction name
    await expect(page.getByText('€20.00')).toBeVisible() // Amount
    await expect(page.getByText('Test category')).toBeVisible() // Category
    await expect(page.getByText('This is testing note')).toBeVisible() // Note
    
    // Verify the transaction appears in the list
    const transactionRow = page.locator('[data-testid="transaction-item"]').filter({
      hasText: 'Test'
    })
    await expect(transactionRow).toBeVisible()
    
    // Verify transaction details within the row
    await expect(transactionRow.getByText('€20.00')).toBeVisible()
    await expect(transactionRow.getByText('Test category')).toBeVisible()
    await expect(transactionRow.getByText('Aug 20, 2025')).toBeVisible()
    
    // Verify database state by checking the created records
    const client = await testPool.connect()
    try {
      // Check category was created
      const categoryResult = await client.query(
        'SELECT * FROM temp_andantino.test_categories WHERE name = $1',
        ['Test category']
      )
      expect(categoryResult.rows).toHaveLength(1)
      expect(categoryResult.rows[0].name).toBe('Test category')
      
      // Check transaction was created
      const transactionResult = await client.query(
        'SELECT * FROM temp_andantino.test_transactions WHERE name = $1',
        ['Test']
      )
      expect(transactionResult.rows).toHaveLength(1)
      expect(transactionResult.rows[0].name).toBe('Test')
      expect(transactionResult.rows[0].amount).toBe('20.00')
      expect(transactionResult.rows[0].currency).toBe('EUR')
      expect(transactionResult.rows[0].type).toBe('expense')
      expect(transactionResult.rows[0].note).toBe('This is testing note')
      expect(new Date(transactionResult.rows[0].date).toISOString().split('T')[0]).toBe('2025-08-20')
      
      // Verify foreign key relationship
      expect(transactionResult.rows[0].category_id).toBe(categoryResult.rows[0].id)
    } finally {
      client.release()
    }
  })

  test('should handle navigation between categories and transactions', async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
    
    // Should show "Go to Categories" when no categories exist
    await expect(page.getByRole('button', { name: 'Go to Categories' })).toBeVisible()
    await expect(page.getByText('Add New Transaction')).toHaveCount(0)
    
    // Go to categories
    await page.getByRole('button', { name: 'Go to Categories' }).click()
    await expect(page).toHaveURL(/.*categories/)
    
    // Create a category
    await page.getByRole('button', { name: 'Add New Category' }).click()
    await page.getByLabel('Category Name').fill('Navigation Test Category')
    await page.getByRole('button', { name: 'Save Category' }).click()
    
    // Navigate back to transactions
    await page.getByRole('link', { name: 'Transactions' }).click()
    await expect(page).toHaveURL(/.*transactions/)
    
    // Now "Add New Transaction" should be available
    await expect(page.getByRole('button', { name: 'Add New Transaction' })).toBeVisible()
    await expect(page.getByText('Go to Categories')).toHaveCount(0)
  })

  test('should show validation errors for invalid transaction data', async ({ page }) => {
    // First create a category so we can access the transaction form
    const client = await testPool.connect()
    try {
      await client.query(`
        INSERT INTO temp_andantino.test_categories (name, color)
        VALUES ('Validation Test Category', 'bg-blue-100 text-blue-800 border-blue-200')
      `)
    } finally {
      client.release()
    }
    
    await page.goto('/')
    
    // Add new transaction
    await page.getByRole('button', { name: 'Add New Transaction' }).click()
    
    // Try to save without filling required fields
    await page.getByRole('button', { name: 'Save Transaction' }).click()
    
    // Should show validation errors
    await expect(page.getByText('Transaction name is required')).toBeVisible()
    await expect(page.getByText('Amount is required')).toBeVisible()
    await expect(page.getByText('Date is required')).toBeVisible()
    
    // Fill invalid amount
    await page.getByLabel('Amount').fill('-10')
    await page.getByRole('button', { name: 'Save Transaction' }).click()
    await expect(page.getByText('Amount must be greater than 0')).toBeVisible()
  })
})