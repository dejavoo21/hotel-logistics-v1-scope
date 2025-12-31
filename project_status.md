# Project Status – Hotel Logistics & Maintenance App

## Milestones
- MVP:
  - Inventory items
  - Stock per location
  - Basic stock movements (receive, issue)
  - Supplier list
  - Simple purchase orders
  - Maintenance tickets (create, assign, close)
- v1:
  - Transfers between locations
  - Mark PO delivered and auto-update stock
  - Logistics dashboard (low stock, open POs, open tickets, monthly spend)
- v2:
  - Assets & rooms reference
  - Better reporting, role-based views, integration prep

## Completed so far
- [2024-12-31] Created Git repo and connected to GitHub
- [2024-12-31] Created initial `project_spec.md`
- [2024-12-31] Created `CLAUDE.md` with project context + git & docs rules
- [2024-12-31] Scaffolded full MVP project structure:
- [YYYY-MM-DD] Added shared TypeScript types for maintenance tickets and generic API responses (CreateTicketRequest, AssignTicketRequest, CloseTicketRequest, ApiResponse<T>).
  - Monorepo with npm workspaces (frontend, backend, shared)
  - Backend: Express + TypeScript + Drizzle ORM + SQLite
  - Frontend: React + Vite + TypeScript + Tailwind + Shadcn/ui
  - All API routes implemented (items, locations, movements, suppliers, POs, tickets)
  - All frontend pages implemented with full CRUD functionality
- [YYYY-MM-DD] Project scaffolding created (frontend, backend, shared workspaces).
- [YYYY-MM-DD] Installed npm dependencies and pushed initial database schema.
- Backend dev command: `npm run dev:backend` (port 3001)
- Frontend dev command: `npm run dev:frontend` (port 5173)


## Current focus
- Install dependencies and run initial setup
- Push database schema with `npm run db:push`
- Seed initial data (locations, users)

## Next up
- Test all MVP features end-to-end
- Add seed script for demo data
- Add basic validation with Zod

### Estimated Build Order (MVP)

1. Project scaffolding (Phase 1)
2. Database schema (Phase 2)
3. Locations API + UI (simplest feature)
4. Items API + UI
5. Stock movements API + UI
6. Suppliers API + UI
7. Purchase orders API + UI
8. Maintenance tickets API + UI
9. Integration & testing (Phase 5)
