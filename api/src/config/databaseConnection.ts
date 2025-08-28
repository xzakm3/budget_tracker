import { Pool } from 'pg'
import { IDatabasePool, PostgresDatabasePool } from '../interfaces/IDatabaseClient'

class DatabaseConnectionSingleton {
  private static instance: IDatabasePool | null = null
  private static pool: Pool | null = null

  private constructor() {}

  public static getInstance(): IDatabasePool {
    if (!DatabaseConnectionSingleton.instance) {
      DatabaseConnectionSingleton.pool = new Pool({
        user: 'jokeice',
        host: 'localhost',
        database: 'jumptech_db',
        password: '',
        port: 5432,
      })

      DatabaseConnectionSingleton.instance = new PostgresDatabasePool(
        DatabaseConnectionSingleton.pool
      )
    }

    return DatabaseConnectionSingleton.instance
  }

  public static async closeConnection(): Promise<void> {
    if (DatabaseConnectionSingleton.pool) {
      await DatabaseConnectionSingleton.pool.end()
      DatabaseConnectionSingleton.pool = null
      DatabaseConnectionSingleton.instance = null
    }
  }
}

export default DatabaseConnectionSingleton