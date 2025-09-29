#!/usr/bin/env ts-node

import { Pool } from 'pg'

const pool = new Pool({
  user: 'jokeice',
  host: 'localhost',
  database: 'jumptech_db',
  password: '',
  port: 5432,
})

async function setupTestTables(): Promise<void> {
  const client = await pool.connect()
  
  try {
    // Create test_categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS temp_andantino.test_categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(255) NOT NULL,
        deleted_at TIMESTAMP DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create test_transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS temp_andantino.test_transactions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'EUR',
        type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
        date DATE NOT NULL,
        note TEXT,
        category_id UUID REFERENCES temp_andantino.test_categories(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('Test tables created successfully')
  } finally {
    client.release()
  }
}

async function closeTestConnection(): Promise<void> {
  await pool.end()
}

async function main() {
  try {
    console.log('Setting up test database...')
    await setupTestTables()
    console.log('Test database setup completed')
  } catch (error) {
    console.error('Failed to setup test database:', error)
    process.exit(1)
  } finally {
    await closeTestConnection()
  }
}

main()