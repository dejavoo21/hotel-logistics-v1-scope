import { Router } from 'express';
import { db, users } from '../db/index.js';
import { eq } from 'drizzle-orm';

export const usersRouter = Router();

// Get all users
usersRouter.get('/', async (_req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json({ data: allUsers });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get user by ID
usersRouter.get('/:id', async (req, res) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(req.params.id)));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create user
usersRouter.post('/', async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const [user] = await db.insert(users).values({ email, name, role }).returning();
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
