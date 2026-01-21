# Hotel Logistics & Maintenance App

A standalone system for managing hotel inventory, suppliers, purchase orders, and maintenance operations.

## Overview

This application provides hotel staff with tools to control stock levels, manage supplier relationships, track purchase orders, and handle maintenance issues—all independent of front desk operations while being designed for future integration with Hotel Management Systems (HMS).

## Key Features

### 📦 Inventory Management
- Track items across multiple categories (Linen, Amenities, F&B, Cleaning)
- Monitor stock levels across different locations (Main Store, Housekeeping, Bar)
- Set minimum and maximum stock thresholds
- Receive low-stock alerts when items fall below minimum levels

### 🔄 Stock Movements
- **Receive**: Stock received from suppliers
- **Issue**: Stock issued to departments (housekeeping, bar, restaurant)
- **Transfer**: Move stock between locations
- Complete audit trail of all stock movements

### 🏪 Supplier & Purchase Order Management
- Maintain supplier database with contact information
- Create and manage purchase orders
- Track order status (Draft, Submitted, Partially Delivered, Delivered, Cancelled)
- Automatically update inventory when deliveries are received

### 🔧 Maintenance Tickets
- Create tickets for room and asset issues
- Assign priority levels (Low, Medium, High, Urgent)
- Track status from Open → In Progress → Resolved → Closed
- Record resolution notes and associated costs
- Use standardized room codes (e.g., HOTEL1-101) for future HMS integration

### 📊 Logistics Dashboard
- Real-time low-stock alerts
- Open purchase orders overview
- Open maintenance tickets by priority
- Monthly spending breakdown by category

## User Roles

| Role | Access |
|------|--------|
| **Storekeeper/Purchasing** | Manage inventory, stock movements, suppliers, and purchase orders |
| **Maintenance** | Create and resolve maintenance tickets |
| **Hotel Admin/Owner** | Full system access including dashboards and reports |

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **UI Framework** | Shadcn/ui + Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | SQLite (via better-sqlite3) |
| **ORM** | Drizzle ORM |
| **E2E Testing** | Playwright |

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/dejavoo21/hotel-logistics-v1-scope.git
cd hotel-logistics-v1-scope
```

2. **Install dependencies**
```bash
npm install
```

3. **Initialize the database**
```bash
npm run db:push
```

### Development

Run both frontend and backend in development mode:

```bash
# Start backend server (port 3001)
npm run dev:backend

# In a separate terminal, start frontend (port 5173)
npm run dev:frontend
```

Access the application at `http://localhost:5173`

### Available Commands

```bash
npm install              # Install all dependencies
npm run dev:backend      # Start backend server (port 3001)
npm run dev:frontend     # Start frontend dev server (port 5173)
npm run db:push          # Push database schema changes
npm run db:studio        # Open Drizzle Studio (database GUI)
npm run test:e2e         # Run Playwright E2E tests
```

## Project Structure

```
hotel-logistics/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # UI components (Shadcn/ui)
│   │   ├── pages/         # Page components
│   │   ├── lib/           # API client and utilities
│   │   └── App.tsx
│   └── package.json
├── backend/               # Express API server
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── db/            # Drizzle schema definitions
│   │   └── index.ts
│   ├── data/              # SQLite database files
│   └── package.json
├── shared/                # Shared TypeScript types
│   └── src/index.ts
├── tests/                 # E2E tests
│   └── e2e/
│       └── logistics.spec.ts
├── project_spec.md        # Detailed project specification
├── project_status.md      # Development status and milestones
├── CLAUDE.md             # Development context for AI assistants
└── README.md             # This file
```

## Database Schema

The application uses SQLite with the following core tables:

- **inventory_items**: Stock items with categories and thresholds
- **stock_locations**: Storage areas (Main Store, Housekeeping, Bar)
- **stock_movements**: All inventory transactions (receive, issue, transfer)
- **suppliers**: Vendor records
- **purchase_orders** / **purchase_order_lines**: Procurement tracking
- **maintenance_tickets**: Issue tracking with priority and status
- **users**: System users with roles

## Future Integration

This application is designed to integrate with Hotel Management Systems (HMS) in the future:

### Standardized Patterns
- **Room Codes**: Uses format `HOTEL1-101` (hotel identifier + room number)
- **User Schema**: Mirrors HMS user structure for future SSO integration

### Planned API Endpoints (Design Phase)
These endpoints are designed but not yet implemented:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/forecast/linen?month=YYYY-MM` | Receive occupancy forecasts from HMS |
| `GET /api/maintenance/status?room=ROOM_CODE` | Provide maintenance status to HMS |
| `GET /api/rooms` | Shared room reference list (read-only) |

## Development Guidelines

- All stock changes must create a `stock_movement` record for auditing
- Low-stock alerts trigger when item quantity < `min_stock_level`
- PO delivery should auto-update inventory via stock movements
- Maintenance costs are tracked for monthly reporting
- Clarity and simplicity over premature optimization

## Testing

Run E2E tests with Playwright:

```bash
npm run test:e2e
```

Tests cover:
- Inventory management workflows
- Stock movement operations
- Purchase order creation and delivery
- Maintenance ticket lifecycle

## Contributing

1. Follow the existing code style and patterns
2. Update documentation for any feature changes
3. Run tests before submitting changes
4. Keep changes focused and minimal

## License

[Add your license information here]

## Support

For questions or issues, please [open an issue](https://github.com/dejavoo21/hotel-logistics-v1-scope/issues) on GitHub.
