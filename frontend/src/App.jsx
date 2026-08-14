import { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState("Checking...")

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then(res => res.json())
      .then(data => setStatus("Connected to Backend ✅"))
      .catch(err => setStatus("Disconnected ❌"))
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4">CodeCompass</h1>
      <p className="text-xl">
        Backend Status: <span className="font-mono bg-slate-800 px-3 py-1 rounded-md text-[#38B2AC]">{status}</span>
      </p>
    </div>
  )
}

export default App
