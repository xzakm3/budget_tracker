import { CURRENCY_CODES } from '../constants'

/**
 * Transaction interface representing a financial transaction record.
 * Contains all the required fields for tracking income, expenses, and transfers.
 */
export interface Transaction {
  id: string
  name: string
  amount: number
  currency: typeof CURRENCY_CODES[keyof typeof CURRENCY_CODES]
  date: string
  note: string
  type: 'expense' | 'income' | 'transfer'
  categoryId: string
}

/**
 * Props interface for the TransactionForm component.
 */
export interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void
}

/**
 * Props interface for the Layout component.
 */
export interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
}

/**
 * Menu item configuration interface for sidebar navigation.
 */
export interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  isActive: boolean
}

/**
 * Category interface representing a transaction category.
 * Contains name and assigned color for visual distinction.
 */
export interface Category {
  id: string
  name: string
  color: string
}

/**
 * Props interface for the CategoryForm component.
 */
export interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (categoryData: Omit<Category, 'id' | 'color'>) => void
}

/**
 * Props interface for page components that need navigation.
 */
export interface PageProps {
  onNavigate?: (page: string) => void
}

/**
 * Props interface for the EditTransactionForm component.
 */
export interface EditTransactionFormProps {
  isOpen: boolean
  transaction: Transaction | null
  onClose: () => void
  onSubmit: (transactionData: Omit<Transaction, 'id'>) => void
}

/**
 * Props interface for the EditCategoryForm component.
 */
export interface EditCategoryFormProps {
  isOpen: boolean
  category: Category | null
  onClose: () => void
  onSubmit: (categoryData: Omit<Category, 'id' | 'color'>) => void
}