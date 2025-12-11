import React, { useEffect, useState } from 'react'

function ClientForm({ token, onCreated }){
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'' })
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = ()=>{
    const fe = {}
    if (!form.name.trim()) fe.name = 'Name required'
    if (!form.phone.trim()) fe.phone = 'Phone required'
    return fe
  }

  const submit = async (e)=>{
    e.preventDefault()
    setError(null)
    const fe = validate()
    setFieldErrors(fe)
    if (Object.keys(fe).length) return
    if (!token) return setError('You must be logged in to create clients')
    try{
      setLoading(true)
      const res = await fetch('/api/clients', { method:'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || (data.errors ? data.errors.map(x=>x.msg).join(', ') : 'Create failed'))
      } else {
        setForm({ name:'', phone:'', email:'', address:'' })
        setFieldErrors({})
        onCreated && onCreated()
      }
    }catch(err){ setError(err.message||err) } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit}>
      <div><input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
      {fieldErrors.name && <div className="small" style={{color:'#900'}}>{fieldErrors.name}</div>}
      <div><input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required/></div>
      {fieldErrors.phone && <div className="small" style={{color:'#900'}}>{fieldErrors.phone}</div>}
      <div><input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
      <div><input placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div>
      {error && <div className="small" style={{color:'#900',marginTop:8}}>{error}</div>}
      <div style={{marginTop:8}}>
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
      </div>
    </form>
  )
}

export default function Clients({ token }){
  const [clients, setClients] = useState([])
  const [error, setError] = useState(null)
  const [mousePos, setMousePos] = useState({})

  const load = async ()=>{
    try{
      const res = await fetch('/api/clients')
      const data = await res.json()
      setClients(data)
    }catch(e){ setError(e.message||e) }
  }

  useEffect(()=>{ load() },[])

  // creation is handled by ClientForm component

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name:'', phone:'', email:'', address:'' })

  const startEdit = (c)=>{
    setEditingId(c._id)
    setEditForm({ name: c.name || '', phone: c.phone || '', email: c.email || '', address: c.address || '' })
    setError(null)
  }

  const cancelEdit = ()=>{
    setEditingId(null)
    setEditForm({ name:'', phone:'', email:'', address:'' })
  }

  const submitEdit = async (e)=>{
    e.preventDefault()
    if (!editingId) return
    try{
      if (!token) return setError('You must be logged in to update clients')
      if (!editForm.name.trim() || !editForm.phone.trim()) return setError('Name and phone are required')
      const res = await fetch(`/api/clients/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(editForm) })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || (data.errors ? data.errors.map(x=>x.msg).join(', ') : 'Update failed'))
      } else {
        cancelEdit()
        load()
      }
    }catch(err){ setError(err.message||err) }
  }

  const handleDelete = async (id)=>{
    if (!confirm('Delete this client?')) return
    try{
      if (!token) return setError('You must be logged in to delete clients')
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      if (res.status === 204){ load() } else {
        const data = await res.json()
        setError(data.error || 'Delete failed')
      }
    }catch(err){ setError(err.message||err) }
  }

  return (
    <div className="clients-page">
      <h2>Clients</h2>
      {error && <div className="card" style={{background:'#ffecec',color:'#900'}}>{error}</div>}
      <div className="grid">
        {clients.map(c=> (
          <div
            className="card"
            key={c._id}
            onMouseMove={(e)=> setMousePos(prev=> ({...prev, [c._id]: {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}}))}
          >
            {editingId === c._id ? (
              <form onSubmit={submitEdit}>
                <div><input value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} required/></div>
                <div><input value={editForm.phone} onChange={e=>setEditForm({...editForm, phone: e.target.value})} required/></div>
                <div><input value={editForm.email} onChange={e=>setEditForm({...editForm, email: e.target.value})}/></div>
                <div><input value={editForm.address} onChange={e=>setEditForm({...editForm, address: e.target.value})}/></div>
                <div style={{marginTop:8}}>
                  <button className="btn btn--primary" type="submit">Save</button>
                  <button className="btn btn--muted" type="button" onClick={cancelEdit} style={{marginLeft:8}}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h3>{c.name}</h3>
                <p className="small">{c.phone} — {c.email}</p>
                <p className="muted small">Added: {new Date(c.createdAt).toLocaleString()}</p>
                <p className="small muted">Mouse: {mousePos[c._id] ? `${mousePos[c._id].x}, ${mousePos[c._id].y}` : '—'}</p>
                {token && (
                  <div style={{marginTop:8,display:'flex',gap:8}}>
                    <button className="btn" onClick={()=> startEdit(c)}>Edit</button>
                    <button className="btn btn--muted" onClick={()=> handleDelete(c._id)}>Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {token ? (
        <div className="card" style={{marginTop:12}}>
          <h3>Add Client</h3>
          <ClientForm token={token} onCreated={load} />
        </div>
      ) : (
        <div className="card" style={{marginTop:12}}>Sign in to add clients</div>
      )}
    </div>
  )
}
