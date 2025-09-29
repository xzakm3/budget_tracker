import React, { useState } from 'react'
import { PlusCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
}

function App(): React.JSX.Element {
  const [transactions] = useState<Transaction[]>([])
  const [income] = useState<number>(0)
  const [expenses] = useState<number>(0)

  const balance: number = income - expenses

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Budget Tracker</h1>
          <p className="text-gray-600">Track your income and expenses with ease</p>
        </header>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${balance.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Income</p>
                <p className="text-2xl font-bold text-green-600">${income.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${expenses.toFixed(2)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Add Transaction Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Transaction
          </h2>
          <p className="text-gray-600">Transaction form will be implemented here</p>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet. Add your first transaction above!</p>
          ) : (
            <div className="space-y-4">
              {/* Transaction items will be rendered here */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App