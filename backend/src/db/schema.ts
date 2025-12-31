import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'storekeeper', 'maintenance'] }).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Stock locations table
export const stockLocations = sqliteTable('stock_locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  description: text('description'),
});

// Inventory items table
export const inventoryItems = sqliteTable('inventory_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category', { enum: ['Linen', 'Amenities', 'F&B', 'Cleaning'] }).notNull(),
  unit: text('unit', { enum: ['piece', 'kg', 'litre', 'box'] }).notNull(),
  minStockLevel: integer('min_stock_level').notNull().default(0),
  maxStockLevel: integer('max_stock_level').notNull().default(100),
});

// Item stock per location
export const itemStock = sqliteTable('item_stock', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').notNull().references(() => inventoryItems.id),
  locationId: integer('location_id').notNull().references(() => stockLocations.id),
  quantity: integer('quantity').notNull().default(0),
});

// Suppliers table
export const suppliers = sqliteTable('suppliers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  address: text('address'),
});

// Purchase orders table
export const purchaseOrders = sqliteTable('purchase_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  supplierId: integer('supplier_id').notNull().references(() => suppliers.id),
  status: text('status', {
    enum: ['Draft', 'Submitted', 'Partially Delivered', 'Delivered', 'Cancelled']
  }).notNull().default('Draft'),
  expectedDate: text('expected_date'),
  createdBy: integer('created_by').notNull().references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Purchase order lines table
export const purchaseOrderLines = sqliteTable('purchase_order_lines', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  purchaseOrderId: integer('purchase_order_id').notNull().references(() => purchaseOrders.id),
  itemId: integer('item_id').notNull().references(() => inventoryItems.id),
  quantity: integer('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
});

// Stock movements table
export const stockMovements = sqliteTable('stock_movements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').notNull().references(() => inventoryItems.id),
  locationId: integer('location_id').notNull().references(() => stockLocations.id),
  movementType: text('movement_type', { enum: ['receive', 'issue', 'transfer'] }).notNull(),
  quantity: integer('quantity').notNull(),
  referenceId: text('reference_id'),
  performedBy: integer('performed_by').notNull().references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Maintenance tickets table
export const maintenanceTickets = sqliteTable('maintenance_tickets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  roomCode: text('room_code').notNull(),
  description: text('description').notNull(),
  priority: text('priority', { enum: ['Low', 'Medium', 'High', 'Urgent'] }).notNull(),
  status: text('status', { enum: ['Open', 'In Progress', 'Resolved', 'Closed'] }).notNull().default('Open'),
  assignedTo: integer('assigned_to').references(() => users.id),
  resolutionNotes: text('resolution_notes'),
  cost: real('cost'),
  createdBy: integer('created_by').notNull().references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});
