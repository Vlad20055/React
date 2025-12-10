import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// using plain fetch for simplicity

export default function DeviceView(){
  const { id } = useParams()
  const [device, setDevice] = useState(null)

  useEffect(()=>{
    fetch(`/api/devices/${id}`).then(r=>r.json()).then(setDevice).catch(()=>setDevice(null))
  },[id])

  if (!device) return <div className="card">Loading...</div>

  return (
    <div>
      <h2>Device</h2>
      <div className="card">
        <h3>{device.brand} {device.model}</h3>
        <p>Serial: {device.serial}</p>
        <p>Owner: {device.client?.name} ({device.client?.phone})</p>
        <p>Added: {new Date(device.createdAt).toLocaleString()} / {new Date(device.createdAt).toUTCString()}</p>
      </div>
    </div>
  )
}
