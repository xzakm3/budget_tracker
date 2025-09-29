export interface Transaction {
  id: string
  name: string
  amount: number
  currency: 'EUR' | 'USD'
  date: string
  note?: string
  type: 'Expense' | 'Income' | 'Transfer'
  categoryId: string
}

export interface Category {
  id: string
  name: string
  color: string
}