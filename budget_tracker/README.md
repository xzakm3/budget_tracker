# Budget Tracker App

A modern, full-stack budget tracking application with React frontend and Node.js backend. Track your income, expenses, and maintain a clear overview of your financial health with persistent data storage.

## Features

- 📊 **Balance Overview**: Real-time balance calculation with visual indicators
- 💰 **Income Tracking**: Monitor all your income sources
- 💸 **Expense Management**: Keep track of your spending
- 🏷️ **Categories**: Organize transactions with customizable categories
- 💾 **Data Persistence**: PostgreSQL database for reliable data storage
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## Tech Stack

### Frontend (App)
- **React 18**: Modern React with hooks for state management
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful, customizable icons

### Backend (API)
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **TypeScript**: Type-safe development
- **PostgreSQL**: Relational database for data persistence

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- PostgreSQL database

### Database Setup

1. **Run the database migration:**
   ```bash
   # Connect to your PostgreSQL database and run:
   psql -U your_username -d your_database -f migration.sql
   ```

### Installation & Running

#### Backend (API)

1. **Navigate to the API directory:**
   ```bash
   cd api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure database connection:**
   Update the database configuration in `src/config/database.ts` with your PostgreSQL credentials.

4. **Start the API server:**
   ```bash
   npm run dev
   ```
   The API will start at `http://localhost:3001`

#### Frontend (App)

1. **Navigate to the App directory:**
   ```bash
   cd app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will automatically open at `http://localhost:3000`

### Available Scripts

#### Frontend (App)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

#### Backend (API)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

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