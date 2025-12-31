import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { InventoryPage } from './pages/InventoryPage';
import { LocationsPage } from './pages/LocationsPage';
import { MovementsPage } from './pages/MovementsPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { TicketsPage } from './pages/TicketsPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<InventoryPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/movements" element={<MovementsPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
