import React, { useEffect, useState } from 'react'

export default function Clients({ token }){
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'' })
  const [error, setError] = useState(null)

  const load = async ()=>{
    try{
      const res = await fetch('/api/clients')
      const data = await res.json()
      setClients(data)
    }catch(e){ setError(e.message||e) }
  }

  useEffect(()=>{ load() },[])

  const submit = async (e)=>{
    e.preventDefault()
    try{
      // basic client-side validation
      if (!form.name.trim() || !form.phone.trim()) return setError('Name and phone are required')
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      else return setError('You must be logged in to create clients')

      await fetch('/api/clients', { method:'POST', headers, body: JSON.stringify(form) })
      setForm({ name:'', phone:'', email:'', address:'' })
      load()
    }catch(e){ setError(e.message||e) }
  }

  return (
    <div>
      <h2>Clients</h2>
      {error && <div className="card" style={{background:'#ffecec',color:'#900'}}>{error}</div>}
      <div className="grid">
        {clients.map(c=> (
          <div className="card" key={c._id}>
            <h3>{c.name}</h3>
            <p className="small">{c.phone} — {c.email}</p>
            <p className="muted small">Added: {new Date(c.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {token ? (
        <div className="card" style={{marginTop:12}}>
          <h3>Add Client</h3>
          <form onSubmit={submit}>
            <div><input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
            <div><input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required/></div>
            <div><input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
            <div><input placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div>
            <div style={{marginTop:8}}><button className="btn" type="submit">Create</button></div>
          </form>
        </div>
      ) : (
        <div className="card" style={{marginTop:12}}>Sign in to add clients</div>
      )}
    </div>
  )
}
