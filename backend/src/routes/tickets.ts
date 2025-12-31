import { Router } from 'express';
import { db, maintenanceTickets, users } from '../db/index.js';
import { eq, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const ticketsRouter = Router();

// Get all tickets
ticketsRouter.get('/', async (_req, res) => {
  try {
    const tickets = await db
      .select({
        id: maintenanceTickets.id,
        roomCode: maintenanceTickets.roomCode,
        description: maintenanceTickets.description,
        priority: maintenanceTickets.priority,
        status: maintenanceTickets.status,
        assignedTo: maintenanceTickets.assignedTo,
        resolutionNotes: maintenanceTickets.resolutionNotes,
        cost: maintenanceTickets.cost,
        createdBy: maintenanceTickets.createdBy,
        createdAt: maintenanceTickets.createdAt,
        updatedAt: maintenanceTickets.updatedAt,
      })
      .from(maintenanceTickets)
      .orderBy(desc(maintenanceTickets.createdAt));

    res.json({ data: tickets });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get ticket by ID
ticketsRouter.get('/:id', async (req, res) => {
  try {
    const [ticket] = await db
      .select()
      .from(maintenanceTickets)
      .where(eq(maintenanceTickets.id, parseInt(req.params.id)));

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Get assigned user if exists
    let assignedToUser = null;
    if (ticket.assignedTo) {
      const [user] = await db.select().from(users).where(eq(users.id, ticket.assignedTo));
      assignedToUser = user || null;
    }

    // Get created by user
    const [createdByUser] = await db.select().from(users).where(eq(users.id, ticket.createdBy));

    res.json({
      data: {
        ...ticket,
        assignedToUser,
        createdByUser,
      },
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Create ticket
ticketsRouter.post('/', async (req, res) => {
  try {
    const { roomCode, description, priority, createdBy } = req.body;
    const [ticket] = await db
      .insert(maintenanceTickets)
      .values({ roomCode, description, priority, createdBy })
      .returning();

    res.status(201).json({ data: ticket });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Update ticket (general update)
ticketsRouter.put('/:id', async (req, res) => {
  try {
    const { roomCode, description, priority, status, assignedTo } = req.body;
    const [ticket] = await db
      .update(maintenanceTickets)
      .set({
        roomCode,
        description,
        priority,
        status,
        assignedTo,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(maintenanceTickets.id, parseInt(req.params.id)))
      .returning();

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ data: ticket });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Assign ticket
ticketsRouter.put('/:id/assign', async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const [ticket] = await db
      .update(maintenanceTickets)
      .set({
        assignedTo,
        status: 'In Progress',
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(maintenanceTickets.id, parseInt(req.params.id)))
      .returning();

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ data: ticket });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Close ticket with resolution
ticketsRouter.put('/:id/close', async (req, res) => {
  try {
    const { resolutionNotes, cost } = req.body;
    const [ticket] = await db
      .update(maintenanceTickets)
      .set({
        resolutionNotes,
        cost,
        status: 'Closed',
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(maintenanceTickets.id, parseInt(req.params.id)))
      .returning();

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ data: ticket });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete ticket
ticketsRouter.delete('/:id', async (req, res) => {
  try {
    const [ticket] = await db
      .delete(maintenanceTickets)
      .where(eq(maintenanceTickets.id, parseInt(req.params.id)))
      .returning();

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ data: ticket });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});
