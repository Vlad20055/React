import React, { useEffect, useState } from 'react'
export default function Repairs(){
  const [repairs, setRepairs] = useState([])
  const [error, setError] = useState(null)

  useEffect(()=>{
    fetch('/api/repairs').then(r=>r.json()).then(setRepairs).catch(e=>setError(e.message||e))
  },[])

  return (
    <div>
      <h2>Repairs</h2>
      {error && <div className="card" style={{background:'#ffecec',color:'#900'}}>{error}</div>}
      <div className="grid">
        {repairs.map(r=> (
          <div className="card" key={r._id}>
            <h3>{r.device?.brand} {r.device?.model}</h3>
            <p className="small">Status: {r.status}</p>
            <p className="muted small">Created: {new Date(r.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
