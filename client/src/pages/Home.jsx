import React from 'react'

export default function Home(){
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const now = new Date()
  return (
    <div className="home-page">
      <h1>Service Center</h1>
      <div className="card">
        <p>Welcome to the Service Center demo (variant 18).</p>
        <p className="small muted">Your timezone: <strong>{tz}</strong></p>
        <p className="small muted">Current date (local): {now.toLocaleString()}</p>
        <p className="small muted">Current date (UTC): {now.toUTCString()}</p>
      </div>
    </div>
  )
}
