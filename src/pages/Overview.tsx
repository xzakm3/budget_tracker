import React, { useState } from 'react'
import { PlusCircle, DollarSign, TrendingUp, TrendingDown, Calendar, Tag, Edit2, Trash2 } from 'lucide-react'
import TransactionForm from '../components/TransactionForm'
import EditTransactionForm from '../components/EditTransactionForm'
import useTransactions from '../hooks/useTransactions'
import useCategories from '../hooks/useCategories'
import { formatCurrency, formatDate } from '../utils/formatters'
import { PageProps, Transaction } from '../types'

/**
 * Overview component that displays the main dashboard with balance overview,
 * transaction management, and transaction history. This is the default page
 * of the budget tracker application.
 *
 * @param onNavigate - Optional callback for navigating to other pages
 * @returns JSX element for the overview dashboard
 */
function Overview({ onNavigate }: PageProps = {}): React.JSX.Element {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    calculateIncome,
    calculateExpenses,
    calculateBalance
  } = useTransactions()
  const { getCategoryById, categories } = useCategories()

  /**
   * Opens the transaction form modal.
   */
  function openForm(): void {
    setIsFormOpen(true)
  }

  /**
   * Closes the transaction form modal.
   */
  function closeForm(): void {
    setIsFormOpen(false)
  }

  /**
   * Opens the edit transaction form modal with the selected transaction.
   *
   * @param transaction - The transaction to edit
   */
  function openEditForm(transaction: Transaction): void {
    setEditingTransaction(transaction)
    setIsEditFormOpen(true)
  }

  /**
   * Closes the edit transaction form modal.
   */
  function closeEditForm(): void {
    setIsEditFormOpen(false)
    setEditingTransaction(null)
  }

  /**
   * Handles transaction update submission.
   *
   * @param transactionData - Updated transaction data
   */
  function handleUpdateTransaction(transactionData: Omit<Transaction, 'id'>): void {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData)
    }
  }

  /**
   * Handles transaction deletion with confirmation.
   *
   * @param transactionId - ID of the transaction to delete
   * @param transactionName - Name of the transaction for confirmation
   */
  function handleDeleteTransaction(transactionId: string, transactionName: string): void {
    if (window.confirm(`Are you sure you want to delete the transaction "${transactionName}"?`)) {
      deleteTransaction(transactionId)
    }
  }

  const income = calculateIncome()
  const expenses = calculateExpenses()
  const balance = calculateBalance()

  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Overview</h1>
            <p className="text-gray-600">Track your income and expenses with ease</p>
          </div>
          {categories.length === 0 ? (
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-2">You need to create categories first</p>
              <button
                onClick={() => onNavigate && onNavigate('categories')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
              >
                <Tag className="h-4 w-4" />
                Go to Categories
              </button>
            </div>
          ) : (
            <button
              onClick={openForm}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add New Transaction
            </button>
          )}
        </div>
      </header>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{balance.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-green-600">€{income.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">€{expenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>



      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet. Add your first transaction above!</p>
        ) : (
          <div className="space-y-4">
                        {transactions.map((transaction) => (
              <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-800">{transaction.name}</h3>
                      {(() => {
                        const category = getCategoryById(transaction.categoryId)
                        return category ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${category.color}`}>
                            {category.name}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            Unknown Category
                          </span>
                        )
                      })()}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(transaction.date)}
                      </span>
                      {transaction.note && (
                        <span className="text-gray-500">• {transaction.note}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(transaction)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title={`Edit ${transaction.name}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id, transaction.name)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title={`Delete ${transaction.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={addTransaction}
      />

      <EditTransactionForm
        isOpen={isEditFormOpen}
        transaction={editingTransaction}
        onClose={closeEditForm}
        onSubmit={handleUpdateTransaction}
      />
    </div>
  )
}

export default Overview