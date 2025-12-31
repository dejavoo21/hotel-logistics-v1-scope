import { Router } from 'express';
import { db, stockLocations } from '../db/index.js';
import { eq } from 'drizzle-orm';

export const locationsRouter = Router();

// Get all locations
locationsRouter.get('/', async (_req, res) => {
  try {
    const locations = await db.select().from(stockLocations);
    res.json({ data: locations });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get location by ID
locationsRouter.get('/:id', async (req, res) => {
  try {
    const [location] = await db.select().from(stockLocations).where(eq(stockLocations.id, parseInt(req.params.id)));
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ data: location });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create location
locationsRouter.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const [location] = await db.insert(stockLocations).values({ name, description }).returning();
    res.status(201).json({ data: location });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update location
locationsRouter.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const [location] = await db
      .update(stockLocations)
      .set({ name, description })
      .where(eq(stockLocations.id, parseInt(req.params.id)))
      .returning();
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ data: location });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete location
locationsRouter.delete('/:id', async (req, res) => {
  try {
    const [location] = await db
      .delete(stockLocations)
      .where(eq(stockLocations.id, parseInt(req.params.id)))
      .returning();
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ data: location });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
