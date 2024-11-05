
import {  useDispatch, useSelector } from 'react-redux'
import './App.css'
import Layout from './Layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import RegistrationPage from './components/Register'
import Loader from './components/Loader'
import { useEffect } from 'react'
import { stopLoader } from './dispatchers'
import NotFound from './components/NotFound'

function App() {

  const showLoader = useSelector((state) => state.showLoader)
  const dispatch = useDispatch()
  useEffect(()=>{
    const timer = setTimeout(()=>{
      dispatch(stopLoader())
    },2000)

    return () => clearTimeout(timer)
  },[dispatch])

  return (

    
      <BrowserRouter>

        {showLoader ? <Loader /> :
        <div className="bg-cream min-h-screen text-soil">
          <NavBar></NavBar>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/products" element={<Layout />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/about-us" element={<Layout />} />
            <Route path="/contact" element={<Layout />} />
            <Route path="/cart" element={<Layout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        }
      </BrowserRouter>


  )
}

export default App
