import { IDatabasePool, IDatabaseConfig } from '../interfaces/IDatabaseClient'
import { Transaction, CreateTransactionRequest, UpdateTransactionRequest } from '../types'

export class TransactionService {
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

  async getAllTransactions(): Promise<Transaction[]> {
    const result = await this.client.query(`
      SELECT id, name, amount, currency, TO_CHAR(date, 'YYYY-MM-DD') as date, note, type, category_id, created_at, updated_at
      FROM ${this.databaseConfig.transactionsTable}
      ORDER BY date DESC, created_at DESC
    `)
    return result.rows
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const result = await this.client.query(`
      SELECT id, name, amount, currency, TO_CHAR(date, 'YYYY-MM-DD') as date, note, type, category_id, created_at, updated_at
      FROM ${this.databaseConfig.transactionsTable}
      WHERE id = $1
    `, [id])
    return result.rows[0] || null
  }

  async createTransaction(transactionData: CreateTransactionRequest): Promise<Transaction> {
    const result = await this.client.query(`
      INSERT INTO ${this.databaseConfig.transactionsTable} (name, amount, currency, date, note, type, category_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, amount, currency, TO_CHAR(date, 'YYYY-MM-DD') as date, note, type, category_id, created_at, updated_at
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
  }

  async updateTransaction(id: string, transactionData: UpdateTransactionRequest): Promise<Transaction | null> {
    const result = await this.client.query(`
      UPDATE ${this.databaseConfig.transactionsTable}
      SET name = $2, amount = $3, currency = $4, date = $5, note = $6, type = $7, category_id = $8
      WHERE id = $1
      RETURNING id, name, amount, currency, TO_CHAR(date, 'YYYY-MM-DD') as date, note, type, category_id, created_at, updated_at
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
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const result = await this.client.query(`
      DELETE FROM ${this.databaseConfig.transactionsTable}
      WHERE id = $1
    `, [id])
    
    return (result.rowCount ?? 0) > 0
  }

  async getTransactionsByType(type: 'income' | 'expense' | 'transfer'): Promise<Transaction[]> {
    const result = await this.client.query(`
      SELECT id, name, amount, currency, TO_CHAR(date, 'YYYY-MM-DD') as date, note, type, category_id, created_at, updated_at
      FROM ${this.databaseConfig.transactionsTable}
      WHERE type = $1
      ORDER BY date DESC, created_at DESC
    `, [type])
    return result.rows
  }

  async destroy() {
    if (this.client) {
      this.client.release()
    }
  }
}