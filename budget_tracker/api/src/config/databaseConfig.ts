import { IDatabaseConfig } from '../interfaces/IDatabaseClient'

export const createDatabaseConfig = (isTestEnvironment = false): IDatabaseConfig => {
  const tablePrefix = isTestEnvironment ? 'test_' : ''
  
  return {
    categoriesTable: `temp_andantino.${tablePrefix}categories`,
    transactionsTable: `temp_andantino.${tablePrefix}transactions`
  }
}

export const developmentDatabaseConfig = createDatabaseConfig(false)
export const testDatabaseConfig = createDatabaseConfig(true)