import { useState, useEffect } from 'react'
import { Category } from '../types'

const API_BASE_URL = 'http://localhost:3001/api'

/**
 * Custom hook for managing category state with backend API persistence.
 * Provides category CRUD operations and automatic data synchronization.
 *
 * @returns Object containing categories array, loading state, and category management functions
 */
function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load categories from API on hook initialization
  useEffect(() => {
    loadCategoriesFromAPI()
  }, [])

  /**
   * Loads categories from the backend API.
   * Handles API errors gracefully and sets the loaded flag when complete.
   */
  async function loadCategoriesFromAPI(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      } else {
        console.error('Error loading categories from API:', data.error)
      }
    } catch (error) {
      console.error('Error loading categories from API:', error)
    } finally {
      setIsLoaded(true)
    }
  }

  /**
   * Adds a new category via the backend API.
   * Updates local state on successful creation.
   *
   * @param categoryData - Category data without ID and color
   */
  async function addCategory(categoryData: Omit<Category, 'id' | 'color'>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })
      const data = await response.json()
      if (data.success) {
        setCategories(prev => [...prev, data.data])
      } else {
        console.error('Error creating category:', data.error)
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  /**
   * Soft deletes a category via the backend API.
   * Removes from local state on successful deletion.
   *
   * @param categoryId - ID of the category to remove
   */
  async function removeCategory(categoryId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setCategories(prev => prev.filter(category => category.id !== categoryId))
      } else {
        console.error('Error deleting category:', data.error)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  /**
   * Finds a category by its ID.
   *
   * @param categoryId - ID of the category to find
   * @returns The category object or undefined if not found
   */
  function getCategoryById(categoryId: string): Category | undefined {
    return categories.find(category => category.id === categoryId)
  }

  /**
   * Updates an existing category via the backend API.
   * Updates local state on successful modification.
   *
   * @param categoryId - ID of the category to update
   * @param categoryData - Updated category data without ID and color
   */
  async function updateCategory(categoryId: string, categoryData: Omit<Category, 'id' | 'color'>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })
      const data = await response.json()
      if (data.success) {
        setCategories(prev =>
          prev.map(category =>
            category.id === categoryId ? data.data : category
          )
        )
      } else {
        console.error('Error updating category:', data.error)
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  return {
    categories,
    isLoaded,
    addCategory,
    updateCategory,
    removeCategory,
    getCategoryById
  }
}

export default useCategories