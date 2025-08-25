import pool from '../config/database'
import { Transaction, CreateTransactionRequest, UpdateTransactionRequest } from '../types'

export class TransactionService {
  async getAllTransactions(): Promise<Transaction[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT id, name, amount, currency, date, note, type, category_id, created_at, updated_at
        FROM temp_andantino.transactions
        ORDER BY date DESC, created_at DESC
      `)
      return result.rows
    } finally {
      client.release()
    }
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT id, name, amount, currency, date, note, type, category_id, created_at, updated_at
        FROM temp_andantino.transactions
        WHERE id = $1
      `, [id])
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async createTransaction(transactionData: CreateTransactionRequest): Promise<Transaction> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        INSERT INTO temp_andantino.transactions (name, amount, currency, date, note, type, category_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, amount, currency, date, note, type, category_id, created_at, updated_at
      `, [
        transactionData.name,
        transactionData.amount,
        transactionData.currency,
        transactionData.date,
        transactionData.note,
        transactionData.type,
        transactionData.category_id
      ])
      
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async updateTransaction(id: string, transactionData: UpdateTransactionRequest): Promise<Transaction | null> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        UPDATE temp_andantino.transactions
        SET name = $2, amount = $3, currency = $4, date = $5, note = $6, type = $7, category_id = $8
        WHERE id = $1
        RETURNING id, name, amount, currency, date, note, type, category_id, created_at, updated_at
      `, [
        id,
        transactionData.name,
        transactionData.amount,
        transactionData.currency,
        transactionData.date,
        transactionData.note,
        transactionData.type,
        transactionData.category_id
      ])
      
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        DELETE FROM temp_andantino.transactions
        WHERE id = $1
      `, [id])
      
      return (result.rowCount ?? 0) > 0
    } finally {
      client.release()
    }
  }

  async getTransactionsByType(type: 'income' | 'expense' | 'transfer'): Promise<Transaction[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT id, name, amount, currency, date, note, type, category_id, created_at, updated_at
        FROM temp_andantino.transactions
        WHERE type = $1
        ORDER BY date DESC, created_at DESC
      `, [type])
      return result.rows
    } finally {
      client.release()
    }
  }
}