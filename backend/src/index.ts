import express from 'express';
import cors from 'cors';
import { itemsRouter } from './routes/items.js';
import { locationsRouter } from './routes/locations.js';
import { suppliersRouter } from './routes/suppliers.js';
import { movementsRouter } from './routes/movements.js';
import { purchaseOrdersRouter } from './routes/purchase-orders.js';
import { ticketsRouter } from './routes/tickets.js';
import { usersRouter } from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/movements', movementsRouter);
app.use('/api/purchase-orders', purchaseOrdersRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/users', usersRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
