import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = '95612592596-kg220l1qgdmjfsmmkanklri9rt73ih92.apps.googleusercontent.com'

function LoginContent({ onAuth }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submitForm = async (e)=>{
    e.preventDefault()
    try{
      const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({ username }))
        onAuth && onAuth(data.token)
        navigate('/')
      } else {
        alert('Login failed: '+(data.error || 'Unknown error'))
      }
    }catch(err){
      alert('Login error: '+err.message)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({ username: data.user.email, name: data.user.name }))
        onAuth && onAuth(data.token)
        navigate('/')
      } else {
        alert('Google login failed: '+(data.error || 'Unknown error'))
      }
    } catch (err) {
      alert('Google login error: '+err.message)
    }
  }

  return (
    <div className="login-page" style={{maxWidth:'600px', marginTop:'20px'}}>
      <div className="card">
        <h3>Login</h3>
        <form onSubmit={submitForm}>
          <div style={{marginBottom:'10px'}}>
            <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
          </div>
          <div style={{marginBottom:'10px'}}>
            <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div>
            <button className="btn" type="submit">Login</button>
          </div>
        </form>
        
        <div style={{marginTop:'20px', borderTop:'1px solid #ccc', paddingTop:'20px'}}>
          <h4>Or Sign in with Google</h4>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={()=>alert('Google login failed')} />
        </div>
      </div>
    </div>
  )
}

export default function Login({ onAuth }){
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginContent onAuth={onAuth} />
    </GoogleOAuthProvider>
  )
}
