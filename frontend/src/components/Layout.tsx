import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Package,
  MapPin,
  ArrowLeftRight,
  Truck,
  FileText,
  Wrench,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Inventory', icon: Package },
  { path: '/locations', label: 'Locations', icon: MapPin },
  { path: '/movements', label: 'Movements', icon: ArrowLeftRight },
  { path: '/suppliers', label: 'Suppliers', icon: Truck },
  { path: '/purchase-orders', label: 'Purchase Orders', icon: FileText },
  { path: '/tickets', label: 'Maintenance', icon: Wrench },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">Hotel Logistics</h1>
        </div>
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
