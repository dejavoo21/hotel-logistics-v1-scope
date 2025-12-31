import { Router } from 'express';
import { db, suppliers } from '../db/index.js';
import { eq } from 'drizzle-orm';

export const suppliersRouter = Router();

// Get all suppliers
suppliersRouter.get('/', async (_req, res) => {
  try {
    const allSuppliers = await db.select().from(suppliers);
    res.json({ data: allSuppliers });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get supplier by ID
suppliersRouter.get('/:id', async (req, res) => {
  try {
    const [supplier] = await db.select().from(suppliers).where(eq(suppliers.id, parseInt(req.params.id)));
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ data: supplier });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create supplier
suppliersRouter.post('/', async (req, res) => {
  try {
    const { name, contactEmail, contactPhone, address } = req.body;
    const [supplier] = await db
      .insert(suppliers)
      .values({ name, contactEmail, contactPhone, address })
      .returning();
    res.status(201).json({ data: supplier });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update supplier
suppliersRouter.put('/:id', async (req, res) => {
  try {
    const { name, contactEmail, contactPhone, address } = req.body;
    const [supplier] = await db
      .update(suppliers)
      .set({ name, contactEmail, contactPhone, address })
      .where(eq(suppliers.id, parseInt(req.params.id)))
      .returning();
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ data: supplier });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete supplier
suppliersRouter.delete('/:id', async (req, res) => {
  try {
    const [supplier] = await db
      .delete(suppliers)
      .where(eq(suppliers.id, parseInt(req.params.id)))
      .returning();
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ data: supplier });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
