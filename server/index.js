import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow requests from our React frontend
app.use(express.json()); // Parse incoming JSON payloads

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'OmniStack AI API is running natively with ES Modules!' });
});

app.listen(PORT, () => {
  console.log(`Server is blasting off on port ${PORT} 🚀`);
});