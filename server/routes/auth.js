import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Register a new user (participants and judges only, not admins)
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, specialty } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ 
        message: 'Email, password, firstName, lastName, and role are required' 
      });
    }

    // Only allow participant and judge registration (not admin)
    if (role !== 'participant' && role !== 'judge') {
      return res.status(400).json({ 
        message: 'Only participants and judges can register. Admin accounts must be created by existing admins.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Auto-generate initials for judges if not provided
    let userInitials = undefined;
    if (role === 'judge') {
      // Generate initials from firstName and lastName
      const firstInitial = firstName.charAt(0).toUpperCase();
      const lastInitial = lastName.charAt(0).toUpperCase();
      userInitials = (firstInitial + lastInitial).substring(0, 5);
    }

    // Create user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role,
      specialty: role === 'judge' ? specialty : undefined,
      initials: userInitials,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role,
        specialty: user.specialty,
        initials: user.initials,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.role,
        specialty: user.specialty,
        initials: user.initials,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        fullName: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        specialty: req.user.specialty,
        initials: req.user.initials,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

