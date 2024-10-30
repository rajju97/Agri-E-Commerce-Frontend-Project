
import './App.css'
import Layout from './Layout'
import { BrowserRouter,Routes, Route } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/products" element={<Layout />} />
        <Route path="/about-us" element={<Layout />} />
        <Route path="/contact" element={<Layout />} />
        <Route path="/cart" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
