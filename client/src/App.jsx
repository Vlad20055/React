import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import DeviceView from './pages/DeviceView'
import Clients from './pages/Clients'
import Repairs from './pages/Repairs'
import DeviceDiagnostic from './pages/DeviceDiagnostic'
import Login from './pages/Login'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(()=>{
    localStorage.setItem('token', token || '')
  },[token])

  const logout = ()=>{ setToken(null); navigate('/') }

  return (
    <div className="app">
      <nav className="topnav">
        <Link to="/">Home</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/clients">Clients</Link>
        <Link to="/repairs">Repairs</Link>
        <Link to="/diagnostic">Diagnostic AI</Link>
        {token ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/catalog" element={<Catalog token={token}/> } />
          <Route path="/devices/:id" element={<DeviceView token={token}/> } />
          <Route path="/clients" element={<Clients token={token}/> } />
          <Route path="/repairs" element={<Repairs token={token}/> } />
          <Route path="/diagnostic" element={<DeviceDiagnostic token={token} />} />
          <Route path="/login" element={<Login onAuth={t=>setToken(t)} />} />
        </Routes>
      </main>
    </div>
  )
}
