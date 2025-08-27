import { Pool } from 'pg'
import { IDatabasePool, IDatabaseConfig, PostgresDatabasePool } from '../interfaces/IDatabaseClient'
import { CategoryService } from '../services/categoryService'
import { TransactionService } from '../services/transactionService'
import { developmentDatabaseConfig, testDatabaseConfig } from '../config/databaseConfig'
import pool from '../config/database'

export class ServiceContainer {
  private static instance: ServiceContainer
  private _databasePool: IDatabasePool
  private _databaseConfig: IDatabaseConfig
  private _categoryService: CategoryService | null = null
  private _transactionService: TransactionService | null = null

  private constructor(databasePool: IDatabasePool, databaseConfig: IDatabaseConfig) {
    this._databasePool = databasePool
    this._databaseConfig = databaseConfig
  }

  public static getInstance(isTestEnvironment = false): ServiceContainer {
    if (!ServiceContainer.instance || (isTestEnvironment && ServiceContainer.instance._databaseConfig === developmentDatabaseConfig)) {
      const databasePool = new PostgresDatabasePool(pool)
      const databaseConfig = isTestEnvironment ? testDatabaseConfig : developmentDatabaseConfig
      ServiceContainer.instance = new ServiceContainer(databasePool, databaseConfig)
    }
    return ServiceContainer.instance
  }

  public static createTestInstance(testPool: Pool): ServiceContainer {
    const databasePool = new PostgresDatabasePool(testPool)
    const databaseConfig = testDatabaseConfig
    return new ServiceContainer(databasePool, databaseConfig)
  }

  public getCategoryService(): CategoryService {
    if (!this._categoryService) {
      this._categoryService = new CategoryService(this._databasePool, this._databaseConfig)
    }
    return this._categoryService
  }

  public getTransactionService(): TransactionService {
    if (!this._transactionService) {
      this._transactionService = new TransactionService(this._databasePool, this._databaseConfig)
    }
    return this._transactionService
  }

  public get databaseConfig(): IDatabaseConfig {
    return this._databaseConfig
  }

  // Reset services for testing purposes
  public resetServices(): void {
    this._categoryService = null
    this._transactionService = null
  }
}