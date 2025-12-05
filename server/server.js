import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import judgeRoutes from './routes/judges.js';
import hackathonRoutes from './routes/hackathons.js';
import adminRoutes from './routes/admin.js';
import scoresRoutes from './routes/scores.js';
import rubricRoutes from './routes/rubric.js';
import { initializeDefaultHackathon } from './utils/initializeDefaultHackathon.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/judges', judgeRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/rubric', rubricRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/innovateher')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Initialize default hackathon
    await initializeDefaultHackathon();
    
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle server errors gracefully
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error(`💡 Try one of these solutions:`);
        console.error(`   1. Kill the process using port ${PORT}: lsof -ti:${PORT} | xargs kill -9`);
        console.error(`   2. Change the PORT in server/.env file`);
        console.error(`   3. Find and stop the other server instance`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    console.error('💡 Make sure MongoDB is running: mongod');
    process.exit(1);
  });

export default app;

