// Enums
export type Category = 'Linen' | 'Amenities' | 'F&B' | 'Cleaning';
export type Unit = 'piece' | 'kg' | 'litre' | 'box';
export type MovementType = 'receive' | 'issue' | 'transfer';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type POStatus = 'Draft' | 'Submitted' | 'Partially Delivered' | 'Delivered' | 'Cancelled';
export type UserRole = 'admin' | 'storekeeper' | 'maintenance';

// Base types
export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface StockLocation {
  id: number;
  name: string;
  description: string | null;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: Category;
  unit: Unit;
  minStockLevel: number;
  maxStockLevel: number;
}

export interface ItemStock {
  itemId: number;
  locationId: number;
  quantity: number;
}

export interface InventoryItemWithStock extends InventoryItem {
  stockByLocation: { locationId: number; locationName: string; quantity: number }[];
  totalStock: number;
}

export interface Supplier {
  id: number;
  name: string;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  status: POStatus;
  expectedDate: string | null;
  createdBy: number;
  createdAt: string;
}

export interface PurchaseOrderLine {
  id: number;
  purchaseOrderId: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderWithLines extends PurchaseOrder {
  supplier: Supplier;
  lines: (PurchaseOrderLine & { item: InventoryItem })[];
  total: number;
}

export interface StockMovement {
  id: number;
  itemId: number;
  locationId: number;
  movementType: MovementType;
  quantity: number;
  referenceId: string | null;
  performedBy: number;
  createdAt: string;
}

export interface StockMovementWithDetails extends StockMovement {
  item: InventoryItem;
  location: StockLocation;
  performedByUser: User;
}

export interface MaintenanceTicket {
  id: number;
  roomCode: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: number | null;
  resolutionNotes: string | null;
  cost: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTicketWithUsers extends MaintenanceTicket {
  assignedToUser: User | null;
  createdByUser: User;
}

// API Request/Response types
export interface CreateItemRequest {
  name: string;
  category: Category;
  unit: Unit;
  minStockLevel: number;
  maxStockLevel: number;
}

export interface CreateLocationRequest {
  name: string;
  description?: string;
}

export interface CreateSupplierRequest {
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

export interface CreatePurchaseOrderRequest {
  supplierId: number;
  expectedDate?: string;
  lines: { itemId: number; quantity: number; unitPrice: number }[];
}

export interface ReceiveStockRequest {
  itemId: number;
  locationId: number;
  quantity: number;
  referenceId?: string;
}

export interface IssueStockRequest {
  itemId: number;
  locationId: number;
  quantity: number;
  referenceId?: string;
}

export interface CreateTicketRequest {
  roomCode: string;
  description: string;
  priority: TicketPriority;
}

export interface AssignTicketRequest {
  assignedTo: number;
}

export interface CloseTicketRequest {
  resolutionNotes: string;
  cost?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
