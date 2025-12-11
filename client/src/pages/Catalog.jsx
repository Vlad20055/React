import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// using plain fetch to keep behavior simple (no automatic auth wrapper)

export default function Catalog(){
  const [devices, setDevices] = useState([])
  const [q, setQ] = useState('')
  const [error, setError] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [pressed, setPressed] = useState(null)

  useEffect(()=>{
    let mounted = true
    fetch(`/api/devices?q=${encodeURIComponent(q)}`).then(r=>r.json()).then(d=>{ if (mounted) setDevices(d) }).catch(e=>setError(e.message||e))
    return ()=> mounted = false
  },[q])

  return (
    <div className="catalog-page">
      <h2>Catalog</h2>
      {error && <div className="card" style={{background:'#ffecec',color:'#900'}}>{error}</div>}
      <div className="card small">
        <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="grid" style={{marginTop:12}}>
        {devices.map(d=> (
          <div
            className={`card ${hovered === d._id ? 'is-hovered' : ''}`}
            key={d._id}
            onMouseEnter={() => setHovered(d._id)}
            onMouseLeave={() => setHovered(null)}
          >
            <h3>{d.brand} {d.model}</h3>
            <p className="small">Serial: {d.serial}</p>
            <p className="muted small">Owner: {d.client?.name}</p>
            <Link
              to={`/devices/${d._id}`}
              className={`btn ${pressed === d._id ? 'pressed' : ''}`}
              onMouseDown={() => setPressed(d._id)}
              onMouseUp={() => setPressed(null)}
            >View</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
