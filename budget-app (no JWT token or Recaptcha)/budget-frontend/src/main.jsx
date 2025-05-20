import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import AdminLogin from './admin/AdminLogin';
import AdminPanel from './admin/AdminPanel';
import AdminDashboard from './admin/AdminDashboard';
import AdminPlans from './admin/AdminPlans';
import { FaBars, FaChartBar, FaBoxes, FaClipboardList } from 'react-icons/fa';
import './index.css';

const isAdminLoggedIn = () => !!localStorage.getItem('adminToken');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={isAdminLoggedIn() ? <AdminPanel /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/dashboard"
          element={isAdminLoggedIn() ? <AdminDashboard /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/plans"
          element={isAdminLoggedIn() ? <AdminPlans /> : <Navigate to="/admin/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
