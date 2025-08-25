import { useState, useEffect } from 'react'
import { Transaction } from '../types'
import { CURRENCY_CODES } from '../constants'

const API_BASE_URL = 'http://localhost:3001/api'

/**
 * Custom hook for managing transaction state with backend API persistence.
 * Provides transaction CRUD operations and automatic data synchronization.
 *
 * @returns Object containing transactions array, loading state, and transaction management functions
 */
function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load transactions from API on hook initialization
  useEffect(() => {
    loadTransactionsFromAPI()
  }, [])

  /**
   * Loads transactions from the backend API.
   * Handles API errors gracefully and sets the loaded flag when complete.
   */
  async function loadTransactionsFromAPI(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`)
      const data = await response.json()
      if (data.success) {
        // Convert backend format to frontend format
        const frontendTransactions = data.data.map((transaction: any) => ({
          ...transaction,
          categoryId: transaction.category_id
        }))
        setTransactions(frontendTransactions)
      } else {
        console.error('Error loading transactions from API:', data.error)
      }
    } catch (error) {
      console.error('Error loading transactions from API:', error)
    } finally {
      setIsLoaded(true)
    }
  }

  /**
   * Adds a new transaction via the backend API.
   * Updates local state on successful creation.
   *
   * @param transactionData - Transaction data without ID
   */
  async function addTransaction(transactionData: Omit<Transaction, 'id'>): Promise<void> {
    try {
      // Convert frontend format to backend format
      const backendData = {
        name: transactionData.name,
        amount: transactionData.amount,
        currency: transactionData.currency,
        date: transactionData.date,
        note: transactionData.note,
        type: transactionData.type,
        category_id: transactionData.categoryId
      }
      
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      })
      const data = await response.json()
      if (data.success) {
        // Convert backend format to frontend format
        const frontendTransaction = {
          ...data.data,
          categoryId: data.data.category_id
        }
        setTransactions(prev => [frontendTransaction, ...prev])
      } else {
        console.error('Error creating transaction:', data.error)
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
    }
  }

  /**
   * Calculates the total income from all income-type transactions.
   * Converts USD amounts to EUR for unified display using a simple conversion rate.
   *
   * @returns Total income amount in EUR
   */
  function calculateIncome(): number {
    if (!transactions || transactions.length === 0) return 0
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.currency === CURRENCY_CODES.EUR ? t.amount : t.amount * 0.85), 0)
  }

  /**
   * Calculates the total expenses from all expense-type transactions.
   * Converts USD amounts to EUR for unified display using a simple conversion rate.
   *
   * @returns Total expenses amount in EUR
   */
  function calculateExpenses(): number {
    if (!transactions || transactions.length === 0) return 0
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.currency === CURRENCY_CODES.EUR ? t.amount : t.amount * 0.85), 0)
  }

  /**
   * Calculates the current balance by subtracting expenses from income.
   *
   * @returns Current balance in EUR
   */
  function calculateBalance(): number {
    return calculateIncome() - calculateExpenses()
  }

  /**
   * Updates an existing transaction via the backend API.
   * Updates local state on successful modification.
   *
   * @param transactionId - ID of the transaction to update
   * @param transactionData - Updated transaction data without ID
   */
  async function updateTransaction(transactionId: string, transactionData: Omit<Transaction, 'id'>): Promise<void> {
    try {
      // Convert frontend format to backend format
      const backendData = {
        name: transactionData.name,
        amount: transactionData.amount,
        currency: transactionData.currency,
        date: transactionData.date,
        note: transactionData.note,
        type: transactionData.type,
        category_id: transactionData.categoryId
      }
      
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      })
      const data = await response.json()
      if (data.success) {
        // Convert backend format to frontend format
        const frontendTransaction = {
          ...data.data,
          categoryId: data.data.category_id
        }
        setTransactions(prev =>
          prev.map(transaction =>
            transaction.id === transactionId ? frontendTransaction : transaction
          )
        )
      } else {
        console.error('Error updating transaction:', data.error)
      }
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  /**
   * Removes a transaction via the backend API.
   * Removes from local state on successful deletion.
   *
   * @param transactionId - ID of the transaction to remove
   */
  async function deleteTransaction(transactionId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId))
      } else {
        console.error('Error deleting transaction:', data.error)
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  /**
   * Finds a transaction by its ID.
   *
   * @param transactionId - ID of the transaction to find
   * @returns The transaction object or undefined if not found
   */
  function getTransactionById(transactionId: string): Transaction | undefined {
    return transactions.find(transaction => transaction.id === transactionId)
  }

  return {
    transactions,
    isLoaded,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    calculateIncome,
    calculateExpenses,
    calculateBalance
  }
}

export default useTransactions