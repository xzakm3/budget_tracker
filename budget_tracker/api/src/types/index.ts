export const CURRENCY_CODES = {
  EUR: 'EUR',
  USD: 'USD'
} as const

export type CurrencyCode = typeof CURRENCY_CODES[keyof typeof CURRENCY_CODES]

export interface Category {
  id: string
  name: string
  color: string
  deleted_at?: Date | null
  created_at: Date
  updated_at: Date
}

export interface Transaction {
  id: string
  name: string
  amount: number
  currency: CurrencyCode
  date: string
  note: string
  type: 'expense' | 'income' | 'transfer'
  category_id: string
  created_at: Date
  updated_at: Date
}

export interface CreateCategoryRequest {
  name: string
}

export interface UpdateCategoryRequest {
  name: string
}

export interface CreateTransactionRequest {
  name: string
  amount: number
  currency: CurrencyCode
  date: string
  note: string
  type: 'expense' | 'income' | 'transfer'
  category_id: string
}

export interface UpdateTransactionRequest {
  name: string
  amount: number
  currency: CurrencyCode
  date: string
  note: string
  type: 'expense' | 'income' | 'transfer'
  category_id: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}