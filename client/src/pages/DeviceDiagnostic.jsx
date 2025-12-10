import React, { useState } from 'react'

export default function DeviceDiagnostic({ token }){
  const [step, setStep] = useState('analyze')  // 'analyze' or 'report'
  const [serialNumber, setSerialNumber] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [issueDescription, setIssueDescription] = useState('')
  const [findings, setFindings] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      if (!token) throw new Error('Authentication required')
      const res = await fetch('/api/ai/analyze-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ serialNumber, brand, model })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult({ type: 'analysis', data })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      if (!token) throw new Error('Authentication required')
      // basic client-side validation
      if (!issueDescription.trim()) throw new Error('Issue description is required')
      const res = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ serialNumber, brand, model, issueDescription, findings })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult({ type: 'report', data })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Device Diagnostic AI</h2>
      <div style={{ marginBottom: '12px' }}>
        <button
          className={`btn ${step === 'analyze' ? '' : 'muted'}`}
          onClick={() => setStep('analyze')}
          style={{ marginRight: '8px', opacity: step === 'analyze' ? 1 : 0.6 }}
        >
          Analyze Serial Number
        </button>
        <button
          className={`btn ${step === 'report' ? '' : 'muted'}`}
          onClick={() => setStep('report')}
          style={{ opacity: step === 'report' ? 1 : 0.6 }}
        >
          Generate Report
        </button>
      </div>

      {error && <div className="card" style={{background:'#ffecec',color:'#900',marginBottom:'12px'}}>{error}</div>}

      {step === 'analyze' && (
        <div className="card">
          <h3>Analyze Device Serial Number</h3>
          {token ? (
            <form onSubmit={handleAnalyze}>
            <div style={{marginBottom:'10px'}}>
              <input placeholder="Serial Number *" value={serialNumber} onChange={e=>setSerialNumber(e.target.value)} required />
            </div>
            <div style={{marginBottom:'10px'}}>
              <input placeholder="Brand (e.g., Lenovo, Dell)" value={brand} onChange={e=>setBrand(e.target.value)} />
            </div>
            <div style={{marginBottom:'10px'}}>
              <input placeholder="Model (e.g., ThinkPad X1)" value={model} onChange={e=>setModel(e.target.value)} />
            </div>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Analyze'}</button>
            </form>
          ) : (
            <div>Please login to use AI diagnostics.</div>
          )}
        </div>
      )}

      {step === 'report' && (
        <div className="card">
          <h3>Generate Diagnostic Report</h3>
          {token ? (
            <form onSubmit={handleGenerateReport}>
            <div style={{marginBottom:'10px'}}>
              <input placeholder="Serial Number *" value={serialNumber} onChange={e=>setSerialNumber(e.target.value)} required />
            </div>
            <div style={{marginBottom:'10px'}}>
              <input placeholder="Brand (e.g., Lenovo, Dell)" value={brand} onChange={e=>setBrand(e.target.value)} />
            </div>
            <div style={{marginBottom:'10px'}}>
              <input placeholder="Model (e.g., ThinkPad X1)" value={model} onChange={e=>setModel(e.target.value)} />
            </div>
            <div style={{marginBottom:'10px'}}>
              <textarea placeholder="Issue Description *" value={issueDescription} onChange={e=>setIssueDescription(e.target.value)} required style={{minHeight:'80px', padding:'8px', borderRadius:'6px'}} />
            </div>
            <div style={{marginBottom:'10px'}}>
              <textarea placeholder="Initial Findings (optional)" value={findings} onChange={e=>setFindings(e.target.value)} style={{minHeight:'60px', padding:'8px', borderRadius:'6px'}} />
            </div>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Report'}</button>
            </form>
          ) : (
            <div>Please login to use AI diagnostics.</div>
          )}
        </div>
      )}

      {result && (
        <div className="card" style={{marginTop:'12px', background:'#f0f8ff', borderLeft:'4px solid #0b74de'}}>
          <h3>Result</h3>
          {result.type === 'analysis' && (
            <>
              <p><strong>Serial Number:</strong> {result.data.serialNumber}</p>
              <p><strong>Brand:</strong> {result.data.brand || 'Unknown'}</p>
              <p><strong>Model:</strong> {result.data.model || 'Unknown'}</p>
              <h4>Analysis:</h4>
              <p style={{whiteSpace:'pre-wrap', fontFamily:'monospace', fontSize:'0.9rem'}}>
                {result.data.analysis}
              </p>
            </>
          )}
          {result.type === 'report' && (
            <>
              <p><strong>Serial Number:</strong> {result.data.serialNumber}</p>
              <p><strong>Brand:</strong> {result.data.brand || 'Unknown'}</p>
              <p><strong>Model:</strong> {result.data.model || 'Unknown'}</p>
              <p><strong>Issue:</strong> {result.data.issueDescription}</p>
              <h4>Diagnostic Report:</h4>
              <p style={{whiteSpace:'pre-wrap', fontFamily:'monospace', fontSize:'0.9rem'}}>
                {result.data.report}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
