import { useState } from 'react'
import './App.css'
import { FirstPage } from './pages/FirstPage'
import { StockPage } from './pages/StockPage'
import { Routes, Route } from 'react-router-dom'


function App() {

  return (
    <Routes>
      <Route path="/" element={ <FirstPage /> } />
      <Route path="/stocks" element={ <StockPage /> } />
    </Routes>
  );
}

export default App
