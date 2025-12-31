import { Router } from 'express';
import { db, purchaseOrders, purchaseOrderLines, suppliers, inventoryItems } from '../db/index.js';
import { eq, desc } from 'drizzle-orm';

export const purchaseOrdersRouter = Router();

// Get all purchase orders
purchaseOrdersRouter.get('/', async (_req, res) => {
  try {
    const orders = await db
      .select({
        id: purchaseOrders.id,
        supplierId: purchaseOrders.supplierId,
        status: purchaseOrders.status,
        expectedDate: purchaseOrders.expectedDate,
        createdBy: purchaseOrders.createdBy,
        createdAt: purchaseOrders.createdAt,
        supplierName: suppliers.name,
      })
      .from(purchaseOrders)
      .leftJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id))
      .orderBy(desc(purchaseOrders.createdAt));

    res.json({ data: orders });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get purchase order by ID with lines
purchaseOrdersRouter.get('/:id', async (req, res) => {
  try {
    const [order] = await db
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.id, parseInt(req.params.id)));

    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, order.supplierId));

    const lines = await db
      .select({
        id: purchaseOrderLines.id,
        purchaseOrderId: purchaseOrderLines.purchaseOrderId,
        itemId: purchaseOrderLines.itemId,
        quantity: purchaseOrderLines.quantity,
        unitPrice: purchaseOrderLines.unitPrice,
        itemName: inventoryItems.name,
        itemUnit: inventoryItems.unit,
      })
      .from(purchaseOrderLines)
      .leftJoin(inventoryItems, eq(purchaseOrderLines.itemId, inventoryItems.id))
      .where(eq(purchaseOrderLines.purchaseOrderId, order.id));

    const total = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

    res.json({
      data: {
        ...order,
        supplier,
        lines,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create purchase order with lines
purchaseOrdersRouter.post('/', async (req, res) => {
  try {
    const { supplierId, expectedDate, createdBy, lines } = req.body;

    // Create the order
    const [order] = await db
      .insert(purchaseOrders)
      .values({ supplierId, expectedDate, createdBy })
      .returning();

    // Create the lines
    if (lines && lines.length > 0) {
      await db.insert(purchaseOrderLines).values(
        lines.map((line: { itemId: number; quantity: number; unitPrice: number }) => ({
          purchaseOrderId: order.id,
          itemId: line.itemId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
        }))
      );
    }

    res.status(201).json({ data: order });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update purchase order status
purchaseOrdersRouter.put('/:id', async (req, res) => {
  try {
    const { status, expectedDate } = req.body;
    const [order] = await db
      .update(purchaseOrders)
      .set({ status, expectedDate })
      .where(eq(purchaseOrders.id, parseInt(req.params.id)))
      .returning();

    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    res.json({ data: order });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete purchase order
purchaseOrdersRouter.delete('/:id', async (req, res) => {
  try {
    // Delete lines first
    await db.delete(purchaseOrderLines).where(eq(purchaseOrderLines.purchaseOrderId, parseInt(req.params.id)));

    const [order] = await db
      .delete(purchaseOrders)
      .where(eq(purchaseOrders.id, parseInt(req.params.id)))
      .returning();

    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    res.json({ data: order });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
