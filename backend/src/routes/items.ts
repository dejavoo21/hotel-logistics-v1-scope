import { Router } from 'express';
import { db, inventoryItems, itemStock, stockLocations } from '../db/index.js';
import { eq, sql } from 'drizzle-orm';

export const itemsRouter = Router();

// Get all items with stock levels
itemsRouter.get('/', async (_req, res) => {
  try {
    const items = await db.select().from(inventoryItems);
    const stock = await db
      .select({
        itemId: itemStock.itemId,
        locationId: itemStock.locationId,
        locationName: stockLocations.name,
        quantity: itemStock.quantity,
      })
      .from(itemStock)
      .leftJoin(stockLocations, eq(itemStock.locationId, stockLocations.id));

    const itemsWithStock = items.map(item => {
      const stockByLocation = stock
        .filter(s => s.itemId === item.id)
        .map(s => ({
          locationId: s.locationId,
          locationName: s.locationName || '',
          quantity: s.quantity,
        }));
      const totalStock = stockByLocation.reduce((sum, s) => sum + s.quantity, 0);
      return { ...item, stockByLocation, totalStock };
    });

    res.json({ data: itemsWithStock });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get item by ID
itemsRouter.get('/:id', async (req, res) => {
  try {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, parseInt(req.params.id)));
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const stock = await db
      .select({
        locationId: itemStock.locationId,
        locationName: stockLocations.name,
        quantity: itemStock.quantity,
      })
      .from(itemStock)
      .leftJoin(stockLocations, eq(itemStock.locationId, stockLocations.id))
      .where(eq(itemStock.itemId, item.id));

    const stockByLocation = stock.map(s => ({
      locationId: s.locationId,
      locationName: s.locationName || '',
      quantity: s.quantity,
    }));
    const totalStock = stockByLocation.reduce((sum, s) => sum + s.quantity, 0);

    res.json({ data: { ...item, stockByLocation, totalStock } });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create item
itemsRouter.post('/', async (req, res) => {
  try {
    const { name, category, unit, minStockLevel, maxStockLevel } = req.body;
    const [item] = await db
      .insert(inventoryItems)
      .values({ name, category, unit, minStockLevel, maxStockLevel })
      .returning();

    // Initialize stock at all locations to 0
    const locations = await db.select().from(stockLocations);
    if (locations.length > 0) {
      await db.insert(itemStock).values(
        locations.map(loc => ({ itemId: item.id, locationId: loc.id, quantity: 0 }))
      );
    }

    res.status(201).json({ data: { ...item, stockByLocation: [], totalStock: 0 } });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update item
itemsRouter.put('/:id', async (req, res) => {
  try {
    const { name, category, unit, minStockLevel, maxStockLevel } = req.body;
    const [item] = await db
      .update(inventoryItems)
      .set({ name, category, unit, minStockLevel, maxStockLevel })
      .where(eq(inventoryItems.id, parseInt(req.params.id)))
      .returning();
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ data: item });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete item
itemsRouter.delete('/:id', async (req, res) => {
  try {
    // Delete stock records first
    await db.delete(itemStock).where(eq(itemStock.itemId, parseInt(req.params.id)));

    const [item] = await db
      .delete(inventoryItems)
      .where(eq(inventoryItems.id, parseInt(req.params.id)))
      .returning();
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ data: item });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
