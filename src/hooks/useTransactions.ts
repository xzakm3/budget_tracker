import { useState, useEffect } from 'react'
import { Transaction } from '../types'
import { CURRENCY_CODES } from '../constants'

/**
 * Custom hook for managing transaction state and localStorage persistence.
 * Provides transaction CRUD operations and automatic data persistence.
 *
 * @returns Object containing transactions array, loading state, and transaction management functions
 */
function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load transactions from localStorage on hook initialization
  useEffect(() => {
    loadTransactionsFromStorage()
  }, [])

  // Save transactions to localStorage whenever transactions change (but only after initial load)
  useEffect(() => {
    saveTransactionsToStorage()
  }, [transactions, isLoaded])

  /**
   * Loads saved transactions from browser localStorage on application startup.
   * Handles JSON parsing errors gracefully and sets the loaded flag when complete.
   */
  function loadTransactionsFromStorage(): void {
    const savedTransactions = localStorage.getItem('budget-tracker-transactions')
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions))
      } catch (error) {
        console.error('Error loading transactions from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }

  /**
   * Saves current transactions to browser localStorage for persistence.
   * Only saves after initial load to prevent overwriting existing data.
   */
  function saveTransactionsToStorage(): void {
    if (isLoaded) {
      localStorage.setItem('budget-tracker-transactions', JSON.stringify(transactions))
    }
  }

  /**
   * Adds a new transaction to the transaction list.
   * Generates a unique ID and prepends the transaction to the beginning of the list.
   *
   * @param transactionData - Transaction data without ID
   */
  function addTransaction(transactionData: Omit<Transaction, 'id'>): void {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  /**
   * Calculates the total income from all income-type transactions.
   * Converts USD amounts to EUR for unified display using a simple conversion rate.
   *
   * @returns Total income amount in EUR
   */
  function calculateIncome(): number {
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
   * Updates an existing transaction in the transactions list.
   *
   * @param transactionId - ID of the transaction to update
   * @param transactionData - Updated transaction data without ID
   */
  function updateTransaction(transactionId: string, transactionData: Omit<Transaction, 'id'>): void {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === transactionId
          ? { ...transactionData, id: transactionId }
          : transaction
      )
    )
  }

  /**
   * Removes a transaction from the transactions list.
   *
   * @param transactionId - ID of the transaction to remove
   */
  function deleteTransaction(transactionId: string): void {
    setTransactions(prev => prev.filter(transaction => transaction.id !== transactionId))
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