import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import categoryRoutes from './routes/categoryRoutes'
import transactionRoutes from './routes/transactionRoutes'
import { ServiceContainer } from './container/ServiceContainer'

const app = express()
const PORT = process.env.PORT || 3001

// Initialize service container based on environment
const isTestEnvironment = process.env.NODE_ENV === 'test'
ServiceContainer.getInstance(isTestEnvironment)

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/categories', categoryRoutes)
app.use('/api/transactions', transactionRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Budget Tracker API is running' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`Budget Tracker API server running on port ${PORT}`)
})