import { FirstPage } from './pages/FirstPage'
import { StockPage } from './pages/StockPage'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './component/Layout/Layout'


import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './component/ProtectedRoute'
import { RolesPage } from './pages/RolesPage'

function App() {

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <FirstPage />
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
      </Routes>
    </Layout>
  );
}

export default App
