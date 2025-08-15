import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes';
import gpxRoutes from './routes/gpxRoutes';
import overlayRoutes from './routes/overlayRoutes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration for OAuth state management
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/gpx', gpxRoutes);
app.use('/api/overlay', overlayRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    statusCode: 404,
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
