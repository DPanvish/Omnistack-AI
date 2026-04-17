import './src/config/env.js';
import rateLimit from 'express-rate-limit';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow requests from our React frontend
app.use(express.json()); // Parse incoming JSON payloads

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'OmniStack AI API is running natively with ES Modules!' });
});

app.listen(PORT, () => {
  console.log(`Server is blasting off on port ${PORT} 🚀`);
});
