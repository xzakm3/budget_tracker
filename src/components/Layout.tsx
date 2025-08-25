import React from 'react'
import { LayoutDashboard, Tag } from 'lucide-react'
import { LayoutProps, MenuItem } from '../types'

/**
 * Main layout component that provides the sidebar navigation and page wrapper.
 * Handles navigation between different sections of the budget tracker application.
 *
 * @param children - The main content to display in the content area
 * @param currentPage - The currently active page identifier
 * @param onPageChange - Callback function called when navigation menu item is clicked
 * @returns JSX element for the complete layout with sidebar and content area
 */
function Layout({ children, currentPage, onPageChange }: LayoutProps): React.JSX.Element {
  /**
   * Handles menu item click and triggers page navigation.
   *
   * @param pageId - The identifier of the page to navigate to
   */
  function handleMenuClick(pageId: string): void {
    onPageChange(pageId)
  }

  /**
   * Gets the menu items configuration with their current active state.
   *
   * @returns Array of menu items with icons, labels, and active states
   */
  function getMenuItems(): MenuItem[] {
    return [
      {
        id: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
        isActive: currentPage === 'overview'
      },
      {
        id: 'categories',
        label: 'Categories',
        icon: Tag,
        isActive: currentPage === 'categories'
      }
    ]
  }

  const menuItems = getMenuItems()

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Budget Tracker</h1>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    item.isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${
                    item.isActive ? 'text-blue-700' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default Layout