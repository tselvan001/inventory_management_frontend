import { Dashboard } from './pages/Dashboard'
import { StockPage } from './pages/StockPage'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './component/Layout/Layout'
import { ToastProvider } from './context/ToastContext';


import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './component/ProtectedRoute'
import { RolesPage } from './pages/RolesPage'
import { UsersPage } from './pages/UsersPage'
import { ActivityLogPage } from './pages/ActivityLogPage'
import { LocationsPage } from './pages/LocationsPage'

function App() {
  return (
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/stocks" element={
            <ProtectedRoute>
              <StockPage />
            </ProtectedRoute>
          } />
          <Route path="/roles" element={
            <ProtectedRoute permissions={['ROLES_MANAGE']}>
              <RolesPage />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute permissions={['USERS_MANAGE']}>
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="/locations" element={
            <ProtectedRoute permissions={['MANAGE_LOCATION']}>
              <LocationsPage />
            </ProtectedRoute>
          } />
          <Route path="/activity-logs" element={
            <ProtectedRoute permissions={['REPORT_VIEW']}>
              <ActivityLogPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}

export default App
