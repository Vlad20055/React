import React, { useState } from 'react'

export default function Login({ onAuth }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) })
      const data = await res.json()
      if (data.token) {
        // store token but don't require it for API calls (simpler behavior)
        localStorage.setItem('token', data.token)
        onAuth && onAuth(data.token)
        alert('Login successful')
      } else {
        alert('Login failed')
      }
    }catch(err){
      alert('Login error: '+err.message)
    }
  }

  return (
    <div className="card" style={{maxWidth:420}}>
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div>
          <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div>
          <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div style={{marginTop:8}}>
          <button className="btn" type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}
