const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  const data = await response.json();
  return data.data;
}

export const api = {
  // Items
  getItems: () => request<any[]>('/items'),
  createItem: (data: any) => request<any>('/items', { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id: number, data: any) => request<any>(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteItem: (id: number) => request<any>(`/items/${id}`, { method: 'DELETE' }),

  // Locations
  getLocations: () => request<any[]>('/locations'),
  createLocation: (data: any) => request<any>('/locations', { method: 'POST', body: JSON.stringify(data) }),
  updateLocation: (id: number, data: any) => request<any>(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocation: (id: number) => request<any>(`/locations/${id}`, { method: 'DELETE' }),

  // Suppliers
  getSuppliers: () => request<any[]>('/suppliers'),
  createSupplier: (data: any) => request<any>('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  updateSupplier: (id: number, data: any) => request<any>(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSupplier: (id: number) => request<any>(`/suppliers/${id}`, { method: 'DELETE' }),

  // Movements
  getMovements: () => request<any[]>('/movements'),
  receiveStock: (data: any) => request<any>('/movements/receive', { method: 'POST', body: JSON.stringify(data) }),
  issueStock: (data: any) => request<any>('/movements/issue', { method: 'POST', body: JSON.stringify(data) }),

  // Purchase Orders
  getPurchaseOrders: () => request<any[]>('/purchase-orders'),
  getPurchaseOrder: (id: number) => request<any>(`/purchase-orders/${id}`),
  createPurchaseOrder: (data: any) => request<any>('/purchase-orders', { method: 'POST', body: JSON.stringify(data) }),
  updatePurchaseOrder: (id: number, data: any) => request<any>(`/purchase-orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePurchaseOrder: (id: number) => request<any>(`/purchase-orders/${id}`, { method: 'DELETE' }),

  // Tickets
  getTickets: () => request<any[]>('/tickets'),
  getTicket: (id: number) => request<any>(`/tickets/${id}`),
  createTicket: (data: any) => request<any>('/tickets', { method: 'POST', body: JSON.stringify(data) }),
  updateTicket: (id: number, data: any) => request<any>(`/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  assignTicket: (id: number, data: any) => request<any>(`/tickets/${id}/assign`, { method: 'PUT', body: JSON.stringify(data) }),
  closeTicket: (id: number, data: any) => request<any>(`/tickets/${id}/close`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTicket: (id: number) => request<any>(`/tickets/${id}`, { method: 'DELETE' }),

  // Users
  getUsers: () => request<any[]>('/users'),
  createUser: (data: any) => request<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
};
