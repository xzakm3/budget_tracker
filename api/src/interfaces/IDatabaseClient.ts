import { Pool, PoolClient } from 'pg'

export interface IDatabaseClient {
  query(text: string, params?: any[]): Promise<any>
  release(): void
}

export interface IDatabasePool {
  connect(): Promise<IDatabaseClient>
}

export interface IDatabaseConfig {
  categoriesTable: string
  transactionsTable: string
}

export class PostgresDatabaseClient implements IDatabaseClient {
  constructor(private client: PoolClient) {}

  async query(text: string, params?: any[]): Promise<any> {
    return this.client.query(text, params)
  }

  release(): void {
    this.client.release()
  }
}

export class PostgresDatabasePool implements IDatabasePool {
  constructor(private pool: Pool) {}

  async connect(): Promise<IDatabaseClient> {
    const client = await this.pool.connect()
    return new PostgresDatabaseClient(client)
  }
}