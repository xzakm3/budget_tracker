import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { EditTransactionFormProps } from '../types'
import { CURRENCY_CODES, DEFAULT_CURRENCY } from '../constants'
import useCategories from '../hooks/useCategories'

/**
 * EditTransactionForm component that renders a modal overlay for editing existing transactions.
 * Pre-fills form with existing transaction data and allows updates to all fields.
 *
 * @param isOpen - Controls whether the modal is visible
 * @param transaction - The transaction to edit (null if not editing)
 * @param onClose - Callback function called when the modal should be closed
 * @param onSubmit - Callback function called when a valid transaction update is submitted
 * @returns JSX element for the edit transaction form modal or null if not open
 */
function EditTransactionForm({ isOpen, transaction, onClose, onSubmit }: EditTransactionFormProps): React.JSX.Element | null {
  const { categories } = useCategories()
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: DEFAULT_CURRENCY as typeof CURRENCY_CODES[keyof typeof CURRENCY_CODES],
    date: '',
    note: '',
    type: 'expense' as 'expense' | 'income' | 'transfer',
    categoryId: ''
  })

  // Update form data when transaction changes
  useEffect(() => {
    if (transaction) {
      // Convert date to YYYY-MM-DD format for HTML date input
      const formatDateForInput = (dateString: string): string => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      setFormData({
        name: transaction.name,
        amount: transaction.amount.toString(),
        currency: transaction.currency,
        date: formatDateForInput(transaction.date),
        note: transaction.note,
        type: transaction.type,
        categoryId: transaction.categoryId
      })
    }
  }, [transaction])

  /**
   * Handles form submission with validation and data processing.
   * Validates required fields, converts amount to number, and calls onSubmit.
   *
   * @param e - Form submit event
   */
  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault()

    if (!formData.name.trim() || !formData.amount || !formData.categoryId) {
      return
    }

    onSubmit({
      name: formData.name.trim(),
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      date: formData.date,
      note: formData.note.trim(),
      type: formData.type,
      categoryId: formData.categoryId
    })

    onClose()
  }

  /**
   * Handles input field changes and updates the form state.
   * Works with input, select, and textarea elements.
   *
   * @param e - Change event from form inputs
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen || !transaction) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Edit Transaction</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter transaction name"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(CURRENCY_CODES).map(([code, symbol]) => (
                  <option key={code} value={code}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Record Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Additional information about this transaction (optional)"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Update
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditTransactionForm