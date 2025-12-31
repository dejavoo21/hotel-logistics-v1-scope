import { Router } from 'express';
import { db, stockMovements, itemStock, inventoryItems, stockLocations, users } from '../db/index.js';
import { eq, and, desc } from 'drizzle-orm';

export const movementsRouter = Router();

// Get all movements
movementsRouter.get('/', async (_req, res) => {
  try {
    const movements = await db
      .select({
        id: stockMovements.id,
        itemId: stockMovements.itemId,
        locationId: stockMovements.locationId,
        movementType: stockMovements.movementType,
        quantity: stockMovements.quantity,
        referenceId: stockMovements.referenceId,
        performedBy: stockMovements.performedBy,
        createdAt: stockMovements.createdAt,
        itemName: inventoryItems.name,
        locationName: stockLocations.name,
        performedByName: users.name,
      })
      .from(stockMovements)
      .leftJoin(inventoryItems, eq(stockMovements.itemId, inventoryItems.id))
      .leftJoin(stockLocations, eq(stockMovements.locationId, stockLocations.id))
      .leftJoin(users, eq(stockMovements.performedBy, users.id))
      .orderBy(desc(stockMovements.createdAt));

    res.json({ data: movements });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Receive stock (from supplier)
movementsRouter.post('/receive', async (req, res) => {
  try {
    const { itemId, locationId, quantity, referenceId, performedBy } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be positive' });
    }

    // Create movement record
    const [movement] = await db
      .insert(stockMovements)
      .values({
        itemId,
        locationId,
        movementType: 'receive',
        quantity,
        referenceId,
        performedBy,
      })
      .returning();

    // Update stock level
    const [existingStock] = await db
      .select()
      .from(itemStock)
      .where(and(eq(itemStock.itemId, itemId), eq(itemStock.locationId, locationId)));

    if (existingStock) {
      await db
        .update(itemStock)
        .set({ quantity: existingStock.quantity + quantity })
        .where(eq(itemStock.id, existingStock.id));
    } else {
      await db.insert(itemStock).values({ itemId, locationId, quantity });
    }

    res.status(201).json({ data: movement });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Issue stock (to department)
movementsRouter.post('/issue', async (req, res) => {
  try {
    const { itemId, locationId, quantity, referenceId, performedBy } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be positive' });
    }

    // Check current stock
    const [existingStock] = await db
      .select()
      .from(itemStock)
      .where(and(eq(itemStock.itemId, itemId), eq(itemStock.locationId, locationId)));

    if (!existingStock || existingStock.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Create movement record
    const [movement] = await db
      .insert(stockMovements)
      .values({
        itemId,
        locationId,
        movementType: 'issue',
        quantity,
        referenceId,
        performedBy,
      })
      .returning();

    // Update stock level
    await db
      .update(itemStock)
      .set({ quantity: existingStock.quantity - quantity })
      .where(eq(itemStock.id, existingStock.id));

    res.status(201).json({ data: movement });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
