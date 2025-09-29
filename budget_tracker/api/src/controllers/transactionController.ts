import { Request, Response } from 'express'
import { ServiceContainer } from '../container/ServiceContainer'
import { ApiResponse, CreateTransactionRequest, UpdateTransactionRequest, CURRENCY_CODES } from '../types'

export const transactionController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const serviceContainer = ServiceContainer.getInstance()
      const transactionService = serviceContainer.getTransactionService()
      const transactions = await transactionService.getAllTransactions()
      const response: ApiResponse<typeof transactions> = {
        success: true,
        data: transactions
      }
      res.json(response)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch transactions'
      }
      res.status(500).json(response)
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const serviceContainer = ServiceContainer.getInstance()
      const transactionService = serviceContainer.getTransactionService()
      const transaction = await transactionService.getTransactionById(id)
      
      if (!transaction) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Transaction not found'
        }
        res.status(404).json(response)
        return
      }

      const response: ApiResponse<typeof transaction> = {
        success: true,
        data: transaction
      }
      res.json(response)
    } catch (error) {
      console.error('Error fetching transaction:', error)
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch transaction'
      }
      res.status(500).json(response)
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const transactionData: CreateTransactionRequest = req.body
      
      // Validate required fields
      if (!transactionData.name || transactionData.name.trim() === '') {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Transaction name is required'
        }
        res.status(400).json(response)
        return
      }

      if (!transactionData.amount || transactionData.amount <= 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Valid amount is required'
        }
        res.status(400).json(response)
        return
      }

      if (!transactionData.currency || !Object.values(CURRENCY_CODES).includes(transactionData.currency)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Valid currency is required'
        }
        res.status(400).json(response)
        return
      }

      if (!transactionData.date) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Date is required'
        }
        res.status(400).json(response)
        return
      }

      if (!['expense', 'income', 'transfer'].includes(transactionData.type)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Valid transaction type is required'
        }
        res.status(400).json(response)
        return
      }

      if (!transactionData.category_id) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Category is required'
        }
        res.status(400).json(response)
        return
      }

      const serviceContainer = ServiceContainer.getInstance()
      const transactionService = serviceContainer.getTransactionService()
      const transaction = await transactionService.createTransaction(transactionData)
      const response: ApiResponse<typeof transaction> = {
        success: true,
        data: transaction
      }
      res.status(201).json(response)
    } catch (error) {
      console.error('Error creating transaction:', error)
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to create transaction'
      }
      res.status(500).json(response)
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const transactionData: UpdateTransactionRequest = req.body
      
      // Validate required fields (same as create)
      if (!transactionData.name || transactionData.name.trim() === '') {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Transaction name is required'
        }
        res.status(400).json(response)
        return
      }

      if (!transactionData.amount || transactionData.amount <= 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Valid amount is required'
        }
        res.status(400).json(response)
        return
      }

      if (!transactionData.currency || !Object.values(CURRENCY_CODES).includes(transactionData.currency)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Valid currency is required'
        }
        res.status(400).json(response)
        return
      }

      if (!transactionData.date) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Date is required'
        }
        res.status(400).json(response)
        return
      }

      if (!['expense', 'income', 'transfer'].includes(transactionData.type)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Valid transaction type is required'
        }
        res.status(400).json(response)
        return
      }

      if (!transactionData.category_id) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Category is required'
        }
        res.status(400).json(response)
        return
      }

      const serviceContainer = ServiceContainer.getInstance()
      const transactionService = serviceContainer.getTransactionService()
      const transaction = await transactionService.updateTransaction(id, transactionData)
      
      if (!transaction) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Transaction not found'
        }
        res.status(404).json(response)
        return
      }

      const response: ApiResponse<typeof transaction> = {
        success: true,
        data: transaction
      }
      res.json(response)
    } catch (error) {
      console.error('Error updating transaction:', error)
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to update transaction'
      }
      res.status(500).json(response)
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const serviceContainer = ServiceContainer.getInstance()
      const transactionService = serviceContainer.getTransactionService()
      const success = await transactionService.deleteTransaction(id)
      
      if (!success) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Transaction not found'
        }
        res.status(404).json(response)
        return
      }

      const response: ApiResponse<null> = {
        success: true
      }
      res.json(response)
    } catch (error) {
      console.error('Error deleting transaction:', error)
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to delete transaction'
      }
      res.status(500).json(response)
    }
  }
}