/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { JSX } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import LibraryPage from './components/LibraryPage';

function ProtectedRoute({ children, adminOnly = false }: { children: JSX.Element, adminOnly?: boolean }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && role !== 'super_admin') return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Home Page</div>} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="selected" element={<ProtectedRoute><div>Selected Page</div></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><div>Profile Page</div></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute adminOnly={true}><div>Admin Panel</div></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
