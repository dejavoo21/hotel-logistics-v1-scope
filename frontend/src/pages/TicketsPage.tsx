import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, UserPlus, CheckCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const;
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'] as const;

interface Ticket {
  id: number;
  roomCode: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: number | null;
  resolutionNotes: string | null;
  cost: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  role: string;
}

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    roomCode: '',
    description: '',
    priority: 'Medium' as string,
  });
  const [assignData, setAssignData] = useState({ assignedTo: '' });
  const [closeData, setCloseData] = useState({ resolutionNotes: '', cost: '' });

  const fetchData = async () => {
    try {
      const [ticketsData, usersData] = await Promise.all([
        api.getTickets(),
        api.getUsers(),
      ]);
      setTickets(ticketsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const maintenanceUsers = users.filter(u => u.role === 'maintenance' || u.role === 'admin');

  const filteredTickets = statusFilter === 'all'
    ? tickets
    : tickets.filter(t => t.status === statusFilter);

  const openCreateDialog = () => {
    setFormData({ roomCode: '', description: '', priority: 'Medium' });
    setDialogOpen(true);
  };

  const openAssignDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setAssignData({ assignedTo: ticket.assignedTo?.toString() || '' });
    setAssignDialogOpen(true);
  };

  const openCloseDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCloseData({ resolutionNotes: '', cost: '' });
    setCloseDialogOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTicket({
        ...formData,
        createdBy: 1, // TODO: Use actual logged-in user
      });
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      await api.assignTicket(selectedTicket.id, {
        assignedTo: parseInt(assignData.assignedTo),
      });
      setAssignDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const handleClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      await api.closeTicket(selectedTicket.id, {
        resolutionNotes: closeData.resolutionNotes,
        cost: closeData.cost ? parseFloat(closeData.cost) : undefined,
      });
      setCloseDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to close ticket:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-purple-100 text-purple-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssigneeName = (assignedTo: number | null) => {
    if (!assignedTo) return '-';
    const user = users.find(u => u.id === assignedTo);
    return user?.name || '-';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Tickets</h1>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket #</TableHead>
            <TableHead>Room/Asset</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">TKT-{ticket.id.toString().padStart(4, '0')}</TableCell>
              <TableCell>{ticket.roomCode}</TableCell>
              <TableCell className="max-w-xs truncate">{ticket.description}</TableCell>
              <TableCell>
                <span className={cn('px-2 py-1 rounded text-xs', getPriorityColor(ticket.priority))}>
                  {ticket.priority}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn('px-2 py-1 rounded text-xs', getStatusColor(ticket.status))}>
                  {ticket.status}
                </span>
              </TableCell>
              <TableCell>{getAssigneeName(ticket.assignedTo)}</TableCell>
              <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {ticket.status !== 'Closed' && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openAssignDialog(ticket)}
                        title="Assign"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openCloseDialog(ticket)}
                        title="Close"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredTickets.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No tickets found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Create Ticket Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Maintenance Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="roomCode">Room / Asset</Label>
                <Input
                  id="roomCode"
                  value={formData.roomCode}
                  onChange={(e) => setFormData({ ...formData, roomCode: e.target.value })}
                  placeholder="e.g., HOTEL1-101, AC-Unit-3"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Problem Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssign}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select
                  value={assignData.assignedTo}
                  onValueChange={(value) => setAssignData({ assignedTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenanceUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Assign</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Close Dialog */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleClose}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="resolutionNotes">Resolution Notes</Label>
                <textarea
                  id="resolutionNotes"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={closeData.resolutionNotes}
                  onChange={(e) => setCloseData({ ...closeData, resolutionNotes: e.target.value })}
                  placeholder="Describe how the issue was resolved"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (optional)</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={closeData.cost}
                  onChange={(e) => setCloseData({ ...closeData, cost: e.target.value })}
                  placeholder="Parts/labor cost"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCloseDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Close Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
