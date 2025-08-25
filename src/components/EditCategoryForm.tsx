import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { EditCategoryFormProps } from '../types'

/**
 * EditCategoryForm component that renders a modal overlay for editing existing categories.
 * Pre-fills form with existing category data and allows updates to the name field.
 *
 * @param isOpen - Controls whether the modal is visible
 * @param category - The category to edit (null if not editing)
 * @param onClose - Callback function called when the modal should be closed
 * @param onSubmit - Callback function called when a valid category update is submitted
 * @returns JSX element for the edit category form modal or null if not open
 */
function EditCategoryForm({ isOpen, category, onClose, onSubmit }: EditCategoryFormProps): React.JSX.Element | null {
  const [categoryName, setCategoryName] = useState('')

  // Update form data when category changes
  useEffect(() => {
    if (category) {
      setCategoryName(category.name)
    }
  }, [category])

  /**
   * Handles form submission with validation.
   * Validates that the category name is not empty and calls onSubmit.
   *
   * @param e - Form submit event
   */
  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault()

    if (!categoryName.trim()) {
      return
    }

    onSubmit({
      name: categoryName.trim()
    })

    onClose()
  }

  /**
   * Handles input field changes and updates the form state.
   *
   * @param e - Change event from the name input
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setCategoryName(e.target.value)
  }

  /**
   * Handles modal close and resets the form.
   */
  function handleClose(): void {
    setCategoryName('')
    onClose()
  }

  if (!isOpen || !category) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Edit Category</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category name"
                autoFocus
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
                onClick={handleClose}
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

export default EditCategoryForm