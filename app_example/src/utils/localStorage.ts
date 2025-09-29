import { Transaction, Category } from '../types'

const TRANSACTIONS_KEY = 'budget-tracker-transactions'
const CATEGORIES_KEY = 'budget-tracker-categories'

export const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(TRANSACTIONS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
}

export const getCategories = (): Category[] => {
  const stored = localStorage.getItem(CATEGORIES_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  
  const defaultCategories: Category[] = [
    { id: '1', name: 'Food', color: '#ef4444' },
    { id: '2', name: 'Transport', color: '#3b82f6' },
    { id: '3', name: 'Entertainment', color: '#8b5cf6' },
    { id: '4', name: 'Shopping', color: '#f59e0b' },
    { id: '5', name: 'Salary', color: '#10b981' }
  ]
  
  saveCategories(defaultCategories)
  return defaultCategories
}

export const saveCategories = (categories: Category[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
}