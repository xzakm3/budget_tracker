# Budget Tracker App

A modern, responsive budget tracking application built with React and Tailwind CSS. Track your income, expenses, and maintain a clear overview of your financial health.

## Features

- 📊 **Balance Overview**: Real-time balance calculation with visual indicators
- 💰 **Income Tracking**: Monitor all your income sources
- 💸 **Expense Management**: Keep track of your spending
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## Tech Stack

- **React 18**: Modern React with hooks for state management
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful, customizable icons
- **ESLint**: Code linting and quality assurance

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
budget_tracker/
├── public/
│   ├── index.html          # Main HTML template
│   └── vite.svg           # App icon
├── src/
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # React application entry point
│   └── index.css          # Global styles and Tailwind imports
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite build configuration
└── .eslintrc.cjs         # ESLint configuration
```

## Development

The application is currently set up with a basic structure. The main `App.jsx` component includes:

- **Balance Overview Cards**: Display total balance, income, and expenses
- **Transaction Form Section**: Placeholder for adding new transactions
- **Transactions List**: Area to display transaction history

### Next Steps for Development

1. Implement transaction form with input validation
2. Add transaction management (add, edit, delete)
3. Implement local storage for data persistence
4. Add categories for expenses and income
5. Create charts and analytics
6. Add filtering and sorting capabilities

## Contributing

Feel free to contribute to this project by:

1. Forking the repository
2. Creating a feature branch
3. Making your changes
4. Submitting a pull request

## License

This project is open source and available under the [MIT License](LICENSE).