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
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

interface Movement {
  id: number;
  itemId: number;
  locationId: number;
  movementType: string;
  quantity: number;
  referenceId: string | null;
  performedBy: number;
  createdAt: string;
  itemName: string;
  locationName: string;
  performedByName: string;
}

interface Item {
  id: number;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

export function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState<'receive' | 'issue'>('receive');
  const [formData, setFormData] = useState({
    itemId: '',
    locationId: '',
    quantity: 1,
    referenceId: '',
  });

  const fetchData = async () => {
    try {
      const [movementsData, itemsData, locationsData] = await Promise.all([
        api.getMovements(),
        api.getItems(),
        api.getLocations(),
      ]);
      setMovements(movementsData);
      setItems(itemsData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDialog = (type: 'receive' | 'issue') => {
    setMovementType(type);
    setFormData({ itemId: '', locationId: '', quantity: 1, referenceId: '' });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        itemId: parseInt(formData.itemId),
        locationId: parseInt(formData.locationId),
        quantity: formData.quantity,
        referenceId: formData.referenceId || undefined,
        performedBy: 1, // TODO: Use actual logged-in user
      };

      if (movementType === 'receive') {
        await api.receiveStock(data);
      } else {
        await api.issueStock(data);
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to record movement:', error);
      alert((error as Error).message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Movements</h1>
        <div className="flex gap-2">
          <Button onClick={() => openDialog('receive')} variant="default">
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Receive Stock
          </Button>
          <Button onClick={() => openDialog('issue')} variant="secondary">
            <ArrowUpFromLine className="h-4 w-4 mr-2" />
            Issue Stock
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Performed By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>{new Date(movement.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs ${
                  movement.movementType === 'receive'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {movement.movementType}
                </span>
              </TableCell>
              <TableCell className="font-medium">{movement.itemName}</TableCell>
              <TableCell>{movement.locationName}</TableCell>
              <TableCell>
                {movement.movementType === 'receive' ? '+' : '-'}{movement.quantity}
              </TableCell>
              <TableCell>{movement.referenceId || '-'}</TableCell>
              <TableCell>{movement.performedByName}</TableCell>
            </TableRow>
          ))}
          {movements.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No movements recorded yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {movementType === 'receive' ? 'Receive Stock' : 'Issue Stock'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="item">Item</Label>
                <Select
                  value={formData.itemId}
                  onValueChange={(value) => setFormData({ ...formData, itemId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(value) => setFormData({ ...formData, locationId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referenceId">Reference (optional)</Label>
                <Input
                  id="referenceId"
                  value={formData.referenceId}
                  onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                  placeholder="e.g., PO-001, Ticket-123"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {movementType === 'receive' ? 'Receive' : 'Issue'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
