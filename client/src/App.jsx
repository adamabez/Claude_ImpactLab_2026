import { useState, useEffect } from 'react'
import './App.css'

const TABS = [
  { id: 'inventory', label: 'Inventory Planning' },
  { id: 'feedback', label: 'Feedback Analysis' },
  { id: 'caption', label: 'Social Caption' },
]

async function callApi(path, body) {
  const res = await fetch(`/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Request failed')
  const data = await res.json()
  return data.result
}

function InventoryTab() {
  const [form, setForm] = useState({
    businessName: 'Konbini Kitchen',
    product: 'onigiri',
    lastEventCustomers: 120,
    lastEventUnitsSold: 180,
    nextEventCustomers: 200,
    bufferPercent: 10,
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult('')
    try {
      const result = await callApi('inventory', {
        ...form,
        lastEventCustomers: Number(form.lastEventCustomers),
        lastEventUnitsSold: Number(form.lastEventUnitsSold),
        nextEventCustomers: Number(form.nextEventCustomers),
        bufferPercent: Number(form.bufferPercent),
      })
      setResult(result)
    } catch (err) {
      setResult('Something went wrong. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <form onSubmit={handleSubmit} className="form">
        <label>
          Business name
          <input name="businessName" value={form.businessName} onChange={handleChange} />
        </label>
        <label>
          Product
          <input name="product" value={form.product} onChange={handleChange} />
        </label>
        <label>
          Customers at last event
          <input type="number" name="lastEventCustomers" value={form.lastEventCustomers} onChange={handleChange} />
        </label>
        <label>
          Units sold at last event
          <input type="number" name="lastEventUnitsSold" value={form.lastEventUnitsSold} onChange={handleChange} />
        </label>
        <label>
          Expected customers at next event
          <input type="number" name="nextEventCustomers" value={form.nextEventCustomers} onChange={handleChange} />
        </label>
        <label>
          Buffer %
          <input type="number" name="bufferPercent" value={form.bufferPercent} onChange={handleChange} />
          <span className="hint">
            Extra stock on top of your estimate, in case more customers show up than expected.
            For example, 10% buffer means preparing 10% more than the raw estimate so you're less likely to sell out.
          </span>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Estimating…' : 'Estimate inventory'}
        </button>
      </form>
      {result && <pre className="result">{result}</pre>}
    </div>
  )
}

function FeedbackTab() {
  const [feedbackText, setFeedbackText] = useState(
    "The onigiri was delicious but the line was too slow.\nPrices felt a little high for the portion size.\nWould love a spicy tuna option next time.\nStaff were super friendly!\nRan out of the salmon flavor by noon."
  )
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult('')
    try {
      const result = await callApi('feedback', { feedbackText })
      setResult(result)
    } catch (err) {
      setResult('Something went wrong. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <form onSubmit={handleSubmit} className="form">
        <label>
          Paste customer feedback (one comment per line)
          <textarea
            rows={8}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze feedback'}
        </button>
      </form>
      {result && <pre className="result">{result}</pre>}
    </div>
  )
}

function CaptionTab() {
  const [form, setForm] = useState({
    businessName: 'Konbini Kitchen',
    product: 'Japanese-style onigiri',
    location: 'Sacramento',
    tone: 'casual, energetic, and community-focused',
    wordLimit: 100,
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult('')
    try {
      const result = await callApi('caption', {
        ...form,
        wordLimit: Number(form.wordLimit),
      })
      setResult(result)
    } catch (err) {
      setResult('Something went wrong. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <form onSubmit={handleSubmit} className="form">
        <label>
          Business name
          <input name="businessName" value={form.businessName} onChange={handleChange} />
        </label>
        <label>
          Product
          <input name="product" value={form.product} onChange={handleChange} />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} />
        </label>
        <label>
          Tone
          <input name="tone" value={form.tone} onChange={handleChange} />
        </label>
        <label>
          Word limit
          <input type="number" name="wordLimit" value={form.wordLimit} onChange={handleChange} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Writing…' : 'Generate caption'}
        </button>
      </form>
      {result && <pre className="result">{result}</pre>}
    </div>
  )
}

function getInitialTheme() {
  const saved = localStorage.getItem('sbiz-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [activeTab, setActiveTab] = useState('inventory')
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('sbiz-theme', theme)
  }, [theme])

  return (
    <div className="app">
      <header className="app-header">
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          aria-label="Toggle light or dark mode"
        >
          {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
        </button>
        <h1>SBiz AI Toolkit</h1>
        <p>Practical Suggestions for Small Business Owners</p>
      </header>

      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'feedback' && <FeedbackTab />}
        {activeTab === 'caption' && <CaptionTab />}
      </main>
    </div>
  )
}

export default App
