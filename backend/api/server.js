import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎬 Favorite Movies & TV Shows API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      entries: {
        getAll: 'GET /api/entries',
        create: 'POST /api/entries',
        update: 'PUT /api/entries/:id',
        delete: 'DELETE /api/entries/:id'
      }
    }
  });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected Routes - Update all entry routes to use authenticateToken
app.get('/api/entries', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const where = {
      userId: req.user.userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { director: { contains: search, mode: 'insensitive' } },
          { type: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const entries = await prisma.entry.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.entry.count({ where });
    const totalPages = Math.ceil(total / limit);

    res.json({
      entries,
      currentPage: page,
      totalPages: totalPages,
      totalEntries: total,
      hasMore: page < totalPages
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

app.post('/api/entries', authenticateToken, async (req, res) => {
  try {
    const { title, type, director, budget, location, duration, yearTime, posterUrl } = req.body;
    
    if (!title || !type || !director) {
      return res.status(400).json({ error: 'Title, type, and director are required' });
    }
    
    const newEntry = await prisma.entry.create({
      data: {
        title,
        type,
        director,
        budget,
        location,
        duration,
        yearTime,
        posterUrl,
        userId: req.user.userId
      }
    });
    
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

app.put('/api/entries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, director, budget, location, duration, yearTime, posterUrl } = req.body;
    
    // Verify entry belongs to user
    const existingEntry = await prisma.entry.findFirst({
      where: { id: parseInt(id), userId: req.user.userId }
    });
    
    if (!existingEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    const updatedEntry = await prisma.entry.update({
      where: { id: parseInt(id) },
      data: {
        title,
        type,
        director,
        budget,
        location,
        duration,
        yearTime,
        posterUrl
      }
    });
    
    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

app.delete('/api/entries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify entry belongs to user
    const existingEntry = await prisma.entry.findFirst({
      where: { id: parseInt(id), userId: req.user.userId }
    });
    
    if (!existingEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    await prisma.entry.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// Start server
export default app;
