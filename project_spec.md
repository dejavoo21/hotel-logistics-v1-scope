# Hotel Logistics & Maintenance App - Project Specification

## Overview

A standalone application for managing hotel inventory, suppliers, purchasing, and maintenance operations. Designed to operate independently from the front desk/Property Management System (PMS) while being future-proofed for integration.

## Goals

- Control stock levels across multiple storage locations
- Manage supplier relationships and purchase orders
- Track and resolve maintenance issues
- Provide operational visibility through dashboards and alerts

---

## User Roles

| Role | Description |
|------|-------------|
| **Storekeeper / Purchasing** | Manages inventory, stock movements, suppliers, and purchase orders |
| **Maintenance** | Creates and resolves maintenance tickets |
| **Hotel Admin/Owner** | Full access to all features, dashboards, and reports |

---

## v1 Features

### 1. Inventory Management

#### Inventory Items
- Item name
- Category: `Linen`, `Amenities`, `F&B`, `Cleaning`
- Unit of measure: `piece`, `kg`, `litre`, `box`
- Minimum stock level (triggers low-stock alert)
- Maximum stock level
- Current stock quantity per location

#### Stock Locations
- Main Store
- Housekeeping
- Bar
- (Extensible for additional locations)

### 2. Stock Movements

| Movement Type | Description |
|--------------|-------------|
| **Receive** | Stock received from supplier (increases inventory) |
| **Issue** | Stock issued to department (decreases source location) |
| **Transfer** | Stock moved between locations |

Each movement records:
- Item
- Quantity
- Source/destination location
- Date/time
- User who performed the action
- Reference (PO number, ticket number, etc.)

### 3. Suppliers & Purchase Orders

#### Supplier Management
- Supplier name
- Contact information
- Items supplied

#### Purchase Orders
- Supplier reference
- Order lines (item, quantity, unit price)
- Expected delivery date
- Status: `Draft`, `Submitted`, `Partially Delivered`, `Delivered`, `Cancelled`
- Delivery tracking (mark items as delivered, auto-update stock)

### 4. Maintenance Tickets

| Field | Description |
|-------|-------------|
| Room/Asset | Location or equipment with issue (uses `room_code` pattern) |
| Description | Problem details |
| Priority | `Low`, `Medium`, `High`, `Urgent` |
| Status | `Open`, `In Progress`, `Resolved`, `Closed` |
| Assigned To | Maintenance staff member |
| Resolution Notes | How the issue was fixed |
| Cost | Parts/labor cost for the repair |
| Created/Updated | Timestamps |

### 5. Logistics Dashboard

- **Low-stock alerts**: Items below minimum stock level
- **Open purchase orders**: Pending deliveries
- **Open maintenance tickets**: Unresolved issues by priority
- **Monthly spend by category**: Cost breakdown (Linen, Amenities, F&B, Cleaning, Maintenance)

---

## Data Model

```
┌─────────────────────┐     ┌─────────────────────┐
│  inventory_items    │     │  stock_locations    │
├─────────────────────┤     ├─────────────────────┤
│ id                  │     │ id                  │
│ name                │     │ name                │
│ category            │     │ description         │
│ unit                │     └─────────────────────┘
│ min_stock_level     │
│ max_stock_level     │     ┌─────────────────────┐
└─────────────────────┘     │  stock_movements    │
                            ├─────────────────────┤
┌─────────────────────┐     │ id                  │
│  suppliers          │     │ item_id             │
├─────────────────────┤     │ location_id         │
│ id                  │     │ movement_type       │
│ name                │     │ quantity            │
│ contact_email       │     │ reference_id        │
│ contact_phone       │     │ performed_by        │
│ address             │     │ created_at          │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│  purchase_orders    │     │ purchase_order_lines│
├─────────────────────┤     ├─────────────────────┤
│ id                  │     │ id                  │
│ supplier_id         │     │ purchase_order_id   │
│ status              │     │ item_id             │
│ expected_date       │     │ quantity            │
│ created_by          │     │ unit_price          │
│ created_at          │     │ received_quantity   │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│ maintenance_tickets │     │  users              │
├─────────────────────┤     ├─────────────────────┤
│ id                  │     │ id                  │
│ room_code           │     │ email               │
│ description         │     │ name                │
│ priority            │     │ role                │
│ status              │     │ created_at          │
│ assigned_to         │     └─────────────────────┘
│ resolution_notes    │
│ cost                │
│ created_by          │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

---

## Future Integration Design

### Shared ID Patterns

All rooms use a standardized `room_code` format:
```
HOTEL1-101  (Hotel identifier + Room number)
```

This allows maintenance tickets to reference rooms before full HMS integration.

### Shared User Concept

Users table structure mirrors potential HMS users:
- `id`, `email`, `role`
- Enables future SSO or shared authentication service

### Planned API Endpoints (Design Only - Not Implemented in v1)

| Direction | Endpoint | Purpose |
|-----------|----------|---------|
| HMS → Logistics | `GET /api/forecast/linen?month=2025-07` | Receive occupancy forecast for linen planning |
| Logistics → HMS | `GET /api/maintenance/status?room=HOTEL1-101` | Provide maintenance status for room |
| Shared | `GET /api/rooms` | Read-only room list for reference |

---

## Non-Functional Requirements

- **Authentication**: Role-based access control
- **Audit Trail**: Track who performed stock movements and ticket changes
- **Responsive**: Works on desktop and tablet devices
- **Offline-Ready**: Consider offline capability for inventory counts (future)

---

## Out of Scope for v1

- Direct PMS/HMS integration
- Multi-property support
- Advanced reporting/analytics
- Mobile native app
- Barcode/QR scanning
- Automated reorder suggestions
