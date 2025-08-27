import { Request, Response } from 'express'
import { ServiceContainer } from '../container/ServiceContainer'
import { ApiResponse, CreateCategoryRequest, UpdateCategoryRequest } from '../types'

export const categoryController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const serviceContainer = ServiceContainer.getInstance()
      const categoryService = serviceContainer.getCategoryService()
      const categories = await categoryService.getAllCategories()
      const response: ApiResponse<typeof categories> = {
        success: true,
        data: categories
      }
      res.json(response)
    } catch (error) {
      console.error('Error fetching categories:', error)
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch categories'
      }
      res.status(500).json(response)
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const serviceContainer = ServiceContainer.getInstance()
      const categoryService = serviceContainer.getCategoryService()
      const category = await categoryService.getCategoryById(id)
      
      if (!category) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Category not found'
        }
        res.status(404).json(response)
        return
      }

      const response: ApiResponse<typeof category> = {
        success: true,
        data: category
      }
      res.json(response)
    } catch (error) {
      console.error('Error fetching category:', error)
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to fetch category'
      }
      res.status(500).json(response)
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: CreateCategoryRequest = req.body
      
      if (!categoryData.name || categoryData.name.trim() === '') {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Category name is required'
        }
        res.status(400).json(response)
        return
      }

      const serviceContainer = ServiceContainer.getInstance()
      const categoryService = serviceContainer.getCategoryService()
      const category = await categoryService.createCategory(categoryData)
      const response: ApiResponse<typeof category> = {
        success: true,
        data: category
      }
      res.status(201).json(response)
    } catch (error) {
      console.error('Error creating category:', error)
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to create category'
      }
      res.status(500).json(response)
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const categoryData: UpdateCategoryRequest = req.body
      
      if (!categoryData.name || categoryData.name.trim() === '') {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Category name is required'
        }
        res.status(400).json(response)
        return
      }

      const serviceContainer = ServiceContainer.getInstance()
      const categoryService = serviceContainer.getCategoryService()
      const category = await categoryService.updateCategory(id, categoryData)
      
      if (!category) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Category not found'
        }
        res.status(404).json(response)
        return
      }

      const response: ApiResponse<typeof category> = {
        success: true,
        data: category
      }
      res.json(response)
    } catch (error) {
      console.error('Error updating category:', error)
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to update category'
      }
      res.status(500).json(response)
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const serviceContainer = ServiceContainer.getInstance()
      const categoryService = serviceContainer.getCategoryService()
      const success = await categoryService.deleteCategory(id)
      
      if (!success) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Category not found'
        }
        res.status(404).json(response)
        return
      }

      const response: ApiResponse<null> = {
        success: true
      }
      res.json(response)
    } catch (error) {
      console.error('Error deleting category:', error)
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to delete category'
      }
      res.status(500).json(response)
    }
  }
}