import React, { useEffect, useMemo, useState } from 'react'
export default function Repairs({ token }){
  const [repairs, setRepairs] = useState([])
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('') // '' | 'status' | 'status-desc'

  useEffect(()=>{
    fetch('/api/repairs').then(r=>r.json()).then(setRepairs).catch(e=>setError(e.message||e))
  },[])

  const getProgress = (status)=>{
    switch((status||'').toLowerCase()){
      case 'received': return 10
      case 'diagnosing': return 40
      case 'in-progress': return 70
      case 'ready': return 100
      case 'completed': return 100
      default: return 20
    }
  }

  // define canonical status order for sorting
  const statusOrder = useMemo(()=>({
    received: 1,
    diagnosing: 2,
    'in-progress': 3,
    ready: 4,
    completed: 5
  }),[])

  const sortedRepairs = useMemo(()=>{
    if (!sortBy || sortBy === '') return repairs
    const copy = [...repairs]
    if (sortBy === 'status'){
      copy.sort((a,b)=> (statusOrder[(a.status||'').toLowerCase()]||99) - (statusOrder[(b.status||'').toLowerCase()]||99))
    } else if (sortBy === 'status-desc'){
      copy.sort((a,b)=> (statusOrder[(b.status||'').toLowerCase()]||99) - (statusOrder[(a.status||'').toLowerCase()]||99))
    }
    return copy
  },[repairs, sortBy, statusOrder])

  return (
    <div className="repairs-page">
      <h2>Repairs</h2>
      {token ? (
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}>
          <span className="small muted">Sort:</span>
          <button className={`btn ${sortBy==='status' ? 'btn--primary' : ''}`} onClick={()=> setSortBy(prev=> prev==='status' ? '' : 'status')}>Status ↑</button>
          <button className={`btn ${sortBy==='status-desc' ? 'btn--primary' : ''}`} onClick={()=> setSortBy(prev=> prev==='status-desc' ? '' : 'status-desc')}>Status ↓</button>
          <button className="btn btn--muted" onClick={()=> setSortBy('')}>Reset</button>
        </div>
      ) : (
        <div style={{marginBottom:10}} className="small muted">Log in to enable sorting</div>
      )}
      {error && <div className="card" style={{background:'#ffecec',color:'#900'}}>{error}</div>}
      <div className="grid">
        {sortedRepairs.map(r=> (
          <div className="card repair-item" key={r._id}>
            <div className="card__header">
              <div>
                <h3 className="card__title">{r.device?.brand} {r.device?.model}</h3>
                <div className={`step ${'status-'+(r.status||'').toLowerCase()}`}></div>
              </div>
              <div className="card__meta small">Created: {new Date(r.createdAt).toLocaleString()}</div>
            </div>
            <div className="card__body">
              <p className="small">Status: <strong>{r.status}</strong></p>
              <div className="repair-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${getProgress(r.status)}%`}}></div>
                </div>
                <div className="progress-text"><span>{r.status}</span><span>{getProgress(r.status)}%</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
