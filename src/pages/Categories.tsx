import React, { useState } from 'react'
import { Tag, Plus, Edit2, Trash2 } from 'lucide-react'
import CategoryForm from '../components/CategoryForm'
import EditCategoryForm from '../components/EditCategoryForm'
import useCategories from '../hooks/useCategories'
import { Category } from '../types'

/**
 * Categories component that manages transaction categories.
 * Allows users to create, view, and delete categories with color coding.
 *
 * @returns JSX element for the categories page
 */
function Categories(): React.JSX.Element {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { categories, addCategory, updateCategory, removeCategory } = useCategories()

  /**
   * Opens the category form modal.
   */
  function openForm(): void {
    setIsFormOpen(true)
  }

  /**
   * Closes the category form modal.
   */
  function closeForm(): void {
    setIsFormOpen(false)
  }

  /**
   * Opens the edit category form modal with the selected category.
   *
   * @param category - The category to edit
   */
  function openEditForm(category: Category): void {
    setEditingCategory(category)
    setIsEditFormOpen(true)
  }

  /**
   * Closes the edit category form modal.
   */
  function closeEditForm(): void {
    setIsEditFormOpen(false)
    setEditingCategory(null)
  }

  /**
   * Handles category update submission.
   *
   * @param categoryData - Updated category data
   */
  function handleUpdateCategory(categoryData: Omit<Category, 'id' | 'color'>): void {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData)
    }
  }

  /**
   * Handles category deletion with confirmation.
   *
   * @param categoryId - ID of the category to delete
   * @param categoryName - Name of the category for confirmation
   */
  function handleDeleteCategory(categoryId: string, categoryName: string): void {
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      removeCategory(categoryId)
    }
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Categories</h1>
        <p className="text-gray-600">Manage your transaction categories and analyze spending patterns</p>
      </header>

      {/* Add Category Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Manage Categories
          </h2>
          <button
            onClick={openForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Categories</h2>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No categories yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first category to start organizing your transactions
            </p>
            <button
              onClick={openForm}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Create Your First Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`${category.color} border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditForm(category)}
                    className="p-1 opacity-60 hover:opacity-100 transition-opacity text-current hover:text-blue-600"
                    title={`Edit ${category.name}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="p-1 opacity-60 hover:opacity-100 transition-opacity text-current hover:text-red-600"
                    title={`Delete ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={addCategory}
      />

      <EditCategoryForm
        isOpen={isEditFormOpen}
        category={editingCategory}
        onClose={closeEditForm}
        onSubmit={handleUpdateCategory}
      />
    </div>
  )
}

export default Categories