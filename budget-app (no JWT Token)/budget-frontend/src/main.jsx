import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import AdminLogin from './admin/AdminLogin';
import AdminPanel from './admin/AdminPanel';
import AdminDashboard from './admin/AdminDashboard';
import './index.css'; // Asegúrate de tener Tailwind configurado aquí

const isAdminLoggedIn = () => !!localStorage.getItem('adminToken');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Panel de administración */}
        <Route
          path="/admin"
          element={isAdminLoggedIn() ? <AdminPanel /> : <Navigate to="/admin/login" />}
        />

        {/* Dashboard con estadísticas */}
        <Route
          path="/admin/dashboard"
          element={isAdminLoggedIn() ? <AdminDashboard /> : <Navigate to="/admin/login" />}
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
