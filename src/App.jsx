import { FirstPage } from './pages/FirstPage'
import { StockPage } from './pages/StockPage'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './component/Layout/Layout'


function App() {

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/stocks" element={<StockPage />} />
      </Routes>
    </Layout>
  );
}

export default App
