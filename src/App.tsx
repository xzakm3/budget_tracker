import React, { useState } from 'react'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Categories from './pages/Categories'

/**
 * Main App component that manages the overall application state and navigation.
 * Provides routing between different pages using a simple state-based approach.
 *
 * @returns JSX element for the complete budget tracker application
 */
function App(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<string>('overview')

  /**
   * Handles navigation between different pages in the application.
   * Updates the current page state to show the selected page content.
   *
   * @param page - The page identifier to navigate to
   */
  function handlePageChange(page: string): void {
    setCurrentPage(page)
  }

  /**
   * Renders the appropriate page component based on the current page state.
   *
   * @returns JSX element for the currently selected page
   */
  function renderCurrentPage(): React.JSX.Element {
    switch (currentPage) {
      case 'categories':
        return <Categories />
      case 'overview':
      default:
        return <Overview onNavigate={handlePageChange} />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={handlePageChange}>
      {renderCurrentPage()}
    </Layout>
  )
}

export default App