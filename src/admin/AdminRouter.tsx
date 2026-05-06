import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from '../context/AdminContext';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminProductForm from './pages/AdminProductForm';
import AdminCategories from './pages/AdminCategories';
import AdminMedia from './pages/AdminMedia';
import AdminSetup from './pages/AdminSetup';

function ProtectedAdminRoutes() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/products/new" element={<AdminProductForm />} />
        <Route path="/products/:id/edit" element={<AdminProductForm />} />
        <Route path="/categories" element={<AdminCategories />} />
        <Route path="/media" element={<AdminMedia />} />
        <Route path="/setup" element={<AdminSetup />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export default function AdminRouter() {
  return (
    <AdminProvider>
      <ProtectedAdminRoutes />
    </AdminProvider>
  );
}
