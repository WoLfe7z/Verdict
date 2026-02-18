import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { errorHandler } from './middleware/errorHandler'
import { supabase } from './services/supabase'  // Import Supabase client

// Routes
import authRoutes from './routes/auth'
import ideaRoutes from './routes/ideas'
import dashboardRoutes from './routes/dashboard'
import chatRoutes from './routes/chat'
import roadmapRoutes from './routes/roadmap'
import settingsRoutes from './routes/settings'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Database connection test
app.get('/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('count')
      .limit(1)
    
    if (error) {
      return res.status(500).json({ 
        connected: false, 
        error: error.message 
      })
    }
    
    res.json({ 
      connected: true, 
      message: 'Database connection successful!' 
    })
  } catch (error: any) {
    res.status(500).json({ 
      connected: false, 
      error: error.message 
    })
  }
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/ideas', ideaRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/roadmap', roadmapRoutes)
app.use('/api/settings', settingsRoutes)

// Error handling
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})