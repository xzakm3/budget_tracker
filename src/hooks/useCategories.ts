import { useState, useEffect } from 'react'
import { Category } from '../types'

// Predefined color palette for categories
const CATEGORY_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-red-100 text-red-800 border-red-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-gray-100 text-gray-800 border-gray-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-lime-100 text-lime-800 border-lime-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-rose-100 text-rose-800 border-rose-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-rose-100 text-rose-800 border-rose-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
]

/**
 * Custom hook for managing category state and localStorage persistence.
 * Provides category CRUD operations and automatic data persistence.
 *
 * @returns Object containing categories array, loading state, and category management functions
 */
function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load categories from localStorage on hook initialization
  useEffect(() => {
    loadCategoriesFromStorage()
  }, [])

  // Save categories to localStorage whenever categories change (but only after initial load)
  useEffect(() => {
    saveCategoriesToStorage()
  }, [categories, isLoaded])

  /**
   * Loads saved categories from browser localStorage on application startup.
   * Handles JSON parsing errors gracefully and sets the loaded flag when complete.
   */
  function loadCategoriesFromStorage(): void {
    const savedCategories = localStorage.getItem('budget-tracker-categories')
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories))
      } catch (error) {
        console.error('Error loading categories from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }

  /**
   * Saves current categories to browser localStorage for persistence.
   * Only saves after initial load to prevent overwriting existing data.
   */
  function saveCategoriesToStorage(): void {
    if (isLoaded) {
      localStorage.setItem('budget-tracker-categories', JSON.stringify(categories))
    }
  }

  /**
   * Gets the next available color for a new category.
   * Cycles through the predefined color palette.
   *
   * @returns CSS classes for category color styling
   */
  function getNextCategoryColor(): string {
    return CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length]
  }

  /**
   * Adds a new category to the categories list.
   * Generates a unique ID and assigns the next available color.
   *
   * @param categoryData - Category data without ID and color
   */
  function addCategory(categoryData: Omit<Category, 'id' | 'color'>): void {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      color: getNextCategoryColor()
    }
    setCategories(prev => [...prev, newCategory])
  }

  /**
   * Removes a category from the categories list.
   *
   * @param categoryId - ID of the category to remove
   */
  function removeCategory(categoryId: string): void {
    setCategories(prev => prev.filter(category => category.id !== categoryId))
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
   * Updates an existing category in the categories list.
   * Preserves the original color when updating.
   *
   * @param categoryId - ID of the category to update
   * @param categoryData - Updated category data without ID and color
   */
  function updateCategory(categoryId: string, categoryData: Omit<Category, 'id' | 'color'>): void {
    setCategories(prev =>
      prev.map(category =>
        category.id === categoryId
          ? { ...category, ...categoryData }
          : category
      )
    )
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