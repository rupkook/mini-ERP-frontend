import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/layout/Layout';
import PrivateRoute from './routes/PrivateRoute';
import NotFound from './pages/NotFound';

import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProductList from './pages/products/ProductList';
import AddProduct from './pages/products/AddProduct';
import EditProduct from './pages/products/EditProduct';
import CustomerList from './pages/customers/CustomerList';
import AddCustomer from './pages/customers/AddCustomer';
import EditCustomer from './pages/customers/EditCustomer';
import CreateSale from './pages/sales/CreateSale';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route element={<PrivateRoute allowedRoles={['Admin', 'Manager', 'Employee']} />}>
            <Route path="products" element={<ProductList />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="sales" element={<CreateSale />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={['Admin', 'Manager']} />}>
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="customers/add" element={<AddCustomer />} />
            <Route path="customers/edit/:id" element={<EditCustomer />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
