# CLAUDE.md

This file provides context for Claude Code when working with this repository.

## Project Overview

**Hotel Logistics & Maintenance App** - A standalone system for managing hotel inventory, suppliers, purchase orders, and maintenance operations.

## Key Concepts

### User Roles
- **Storekeeper/Purchasing**: Inventory and PO management
- **Maintenance**: Ticket creation and resolution
- **Hotel Admin/Owner**: Full system access

### Core Domains

1. **Inventory**: Items tracked by category (Linen, Amenities, F&B, Cleaning) with min/max stock levels
2. **Stock Movements**: Receive (from supplier), Issue (to department), Transfer (between locations)
3. **Stock Locations**: Main Store, Housekeeping, Bar
4. **Suppliers & Purchase Orders**: Vendor management and procurement workflow
5. **Maintenance Tickets**: Room/asset issues with priority, assignment, and resolution tracking

### Data Model Tables
- `inventory_items` - Stock items with categories and thresholds
- `stock_locations` - Storage areas
- `stock_movements` - All inventory transactions
- `suppliers` - Vendor records
- `purchase_orders` / `purchase_order_lines` - Procurement
- `maintenance_tickets` - Issue tracking
- `users` - System users with roles

### Important Patterns

- **Room codes**: Use format `HOTEL1-101` (hotel identifier + room number) for future HMS integration
- **User structure**: Mirror HMS user schema (id, email, role) for future SSO
- **Categories**: Enum values - `Linen`, `Amenities`, `F&B`, `Cleaning`
- **Units**: Enum values - `piece`, `kg`, `litre`, `box`
- **Priorities**: `Low`, `Medium`, `High`, `Urgent`
- **Ticket statuses**: `Open`, `In Progress`, `Resolved`, `Closed`
- **PO statuses**: `Draft`, `Submitted`, `Partially Delivered`, `Delivered`, `Cancelled`

## Development Guidelines

### When Building Features

1. All stock changes must create a `stock_movement` record for audit
2. Low-stock alerts trigger when item quantity < `min_stock_level`
3. PO delivery should auto-update inventory via stock movements
4. Maintenance costs should be tracked for monthly reporting

### Future Integration Points

These APIs are designed but NOT implemented in v1:
- `GET /api/forecast/linen?month=YYYY-MM` - For HMS occupancy forecasts
- `GET /api/maintenance/status?room=ROOM_CODE` - Maintenance status for HMS
- `GET /api/rooms` - Shared room reference list

## File Structure

```
project_spec.md    # Full project specification
CLAUDE.md          # This file - Claude Code context
```

## Commands

(To be updated as project develops)

```bash
# Build
# Test
# Run
```
