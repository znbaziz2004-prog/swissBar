import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Layout, { ProtectedRoute } from './components/Layout';
import { BASE } from './data/config';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Calendar from './pages/Calendar';
import Customers from './pages/Customers';
import Services from './pages/Services';
import Staff from './pages/Staff';
import Shop from './pages/Shop';
import Availability from './pages/Availability';
import Earnings from './pages/Earnings';
import Reviews from './pages/Reviews';
import Testimonials from './pages/Testimonials';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function BarberRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`${BASE}/dashboard`} replace />}
      />

      <Route
        path={`${BASE}/login`}
        element={<Login />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path={BASE} element={<Layout />}>
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="customers" element={<Customers />} />
          <Route path="services" element={<Services />} />
          <Route path="staff" element={<Staff />} />
          <Route path="shop" element={<Shop />} />
          <Route path="availability" element={<Availability />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={`${BASE}/dashboard`} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <BarberRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}