import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import zillowRoutes from './routes/zillow.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the correct path
const envPath = join(__dirname, '.env');
console.log('Loading .env file from:', envPath);
console.log('File exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

console.log('Environment variables loaded:', {
  port: process.env.PORT || 3003,
  zillowApiKey: process.env.ZILLOW_API_KEY ? 'Present' : 'Missing',
  zillowApiHost: process.env.ZILLOW_API_HOST ? 'Present' : 'Missing',
  actualKey: process.env.ZILLOW_API_KEY,
  actualHost: process.env.ZILLOW_API_HOST,
  envPath,
  currentDir: __dirname,
});

const app = express();
const port = process.env.PORT || 3003;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/zillow', zillowRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Start server with error handling
const server = app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${port}`);
  console.log('Available routes:');
  console.log('- GET /');
  console.log('- GET /test');
  console.log('- GET /api/zillow/test');
  console.log('- GET /api/zillow/search');
  console.log('- GET /api/zillow/property/:zpid');
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please choose a different port or kill the process using that port.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
