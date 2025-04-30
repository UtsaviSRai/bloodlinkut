import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
  
// Blood group compatibility map
const bloodCompatibility = {
  'A+': { donate: ['A+', 'AB+'], receive: ['A+', 'A-', 'O+', 'O-'] },
  'A-': { donate: ['A+', 'A-', 'AB+', 'AB-'], receive: ['A-', 'O-'] },
  'B+': { donate: ['B+', 'AB+'], receive: ['B+', 'B-', 'O+', 'O-'] },
  'B-': { donate: ['B+', 'B-', 'AB+', 'AB-'], receive: ['B-', 'O-'] },
  'AB+': { donate: ['AB+'], receive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  'AB-': { donate: ['AB+', 'AB-'], receive: ['A-', 'B-', 'AB-', 'O-'] },
  'O+': { donate: ['O+', 'A+', 'B+', 'AB+'], receive: ['O+', 'O-'] },
  'O-': { donate: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'], receive: ['O-'] },
};

const bloodGroups = Object.keys(bloodCompatibility);

// Helper type for blood group keys

type BloodGroup = keyof typeof bloodCompatibility;

function BloodDrop({ size = 32, color = "#a80000", style = {} }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="16" cy="22" rx="10" ry="8" fill={color} fillOpacity="0.7"/>
      <path d="M16 4C16 4 6 16 16 28C26 16 16 4 16 4Z" fill={color} />
      <ellipse cx="13" cy="16" rx="2" ry="4" fill="#fff" fillOpacity="0.3"/>
    </svg>
  );
}

function Home() {
  return (
    <div className="page home">
      <h1>Blood Link</h1>
      <p className="quote">Donate blood, save lives. Every drop counts.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        <BloodDrop size={60} />
        <BloodDrop size={40} color="#d32f2f" style={{ marginTop: 20 }} />
        <BloodDrop size={32} color="#e57373" style={{ marginTop: 10 }} />
      </div>
    </div>
  );
}

function Login() {
  return (
    <div className="page login">
      <h2>Login</h2>
      {/* Login form placeholder */}
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function Register() {
  return (
    <div className="page register">
      <h2>Register</h2>
      {/* Registration form placeholder */}
      <form>
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

function DonorDetails() {
  const [donors, setDonors] = useState<any[]>([]);
  useEffect(() => {
    fetch('http://localhost:3000/api/donors')
      .then(res => res.json())
      .then(data => setDonors(data))
      .catch(() => setDonors([]));
  }, []);
  return (
    <div className="page donor-details">
      <h2>Donor Details</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        <BloodDrop size={24} />
        <BloodDrop size={24} color="#d32f2f" />
        <BloodDrop size={24} color="#e57373" />
      </div>
      {donors.length === 0 ? (
        <p>No donors found.</p>
      ) : (
        <table style={{margin:'0 auto',background:'#fff5f6',borderRadius:8}}>
          <thead>
            <tr><th>Name</th><th>Age</th><th>Blood Group</th></tr>
          </thead>
          <tbody>
            {donors.map((d, i) => (
              <tr key={i}><td>{d.name}</td><td>{d.age}</td><td>{d.bloodGroup}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function RequestBloodCard({ onSubmitted }: { onSubmitted?: () => void }) {
  const [form, setForm] = useState({ name: '', bloodGroup: bloodGroups[0], units: 1, reason: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>(bloodGroups[0] as BloodGroup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to request blood');
      setSubmitted(true);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError('Could not request blood. Please try again.');
    }
  };

  return (
    <div className="dashboard-card">
      <h3>Request for Blood</h3>
      {submitted ? (
        <div>
          <p>Blood request submitted for {form.name} ({form.bloodGroup})!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Patient Name" value={form.name} required onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <select value={form.bloodGroup} onChange={e => { setForm(f => ({ ...f, bloodGroup: e.target.value })); setSelectedGroup(e.target.value as BloodGroup); }}>
            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
          <input type="number" placeholder="Units Needed" value={form.units} min={1} max={10} required onChange={e => setForm(f => ({ ...f, units: Number(e.target.value) }))} />
          <input type="text" placeholder="Reason (optional)" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
          <button type="submit">Request Blood</button>
        </form>
      )}
      {error && <div style={{color:'#d32f2f',marginTop:8}}>{error}</div>}
      <div style={{ marginTop: 12 }}>
        <strong>Donate Blood To:</strong>
        <ul>
          {(bloodCompatibility[selectedGroup] as {donate: string[]; receive: string[];}).donate.map((bg: string) => <li key={bg}>{bg}</li>)}
        </ul>
        <strong>Receive Blood From:</strong>
        <ul>
          {(bloodCompatibility[selectedGroup] as {donate: string[]; receive: string[];}).receive.map((bg: string) => <li key={bg}>{bg}</li>)}
        </ul>
      </div>
    </div>
  );
}

function EmergencyCase() {
  const [requests, setRequests] = useState<any[]>([]);
  useEffect(() => {
    fetch('http://localhost:3000/api/requests')
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(() => setRequests([]));
  }, []);
  return (
    <div className="page emergency-case">
      <h2>Emergency Cases</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        <BloodDrop size={24} />
        <BloodDrop size={24} color="#d32f2f" />
        <BloodDrop size={24} color="#e57373" />
      </div>
      {requests.length === 0 ? (
        <p>No emergency blood requests found.</p>
      ) : (
        <table style={{margin:'0 auto',background:'#fff5f6',borderRadius:8}}>
          <thead>
            <tr><th>Patient</th><th>Blood Group</th><th>Units</th><th>Reason</th><th>Requested</th></tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.bloodGroup}</td>
                <td>{r.units}</td>
                <td>{r.reason || '-'}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function BloodAvailabilityCard() {
  const [stock, setStock] = useState<{[key: string]: number}>({});
  useEffect(() => {
    fetch('http://localhost:3000/api/availability')
      .then(res => res.json())
      .then(data => setStock(data))
      .catch(() => setStock({}));
  }, []);
  return (
    <div className="dashboard-card">
      <h3>Blood Availability</h3>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
        {bloodGroups.map(bg => (
          <div key={bg} style={{ textAlign: 'center', minWidth: 40 }}>
            <BloodDrop size={20} color="#a80000" />
            <div style={{ fontSize: 12 }}>{bg}</div>
            <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>{stock[bg] || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [donorRegistered, setDonorRegistered] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  return (
    <div className="page dashboard">
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
        <div className="dashboard-card" style={{ minWidth: 220 }}>
          <h3>Become a Donor</h3>
          <button onClick={() => setShowDonorForm(v => !v)} style={{ marginBottom: 12 }}>
            {showDonorForm ? 'Hide Form' : 'Register as Donor'}
          </button>
          {showDonorForm && (
            <BecomeDonorCard onRegistered={() => { setDonorRegistered(true); setShowDonorForm(false); }} />
          )}
          {donorRegistered && <div style={{color:'#388e3c',marginTop:8}}>Registration successful!</div>}
        </div>
        <div className="dashboard-card" style={{ minWidth: 220 }}>
          <h3>Request for Blood</h3>
          <button onClick={() => setShowRequestForm(v => !v)} style={{ marginBottom: 12 }}>
            {showRequestForm ? 'Hide Form' : 'Request Blood'}
          </button>
          {showRequestForm && (
            <RequestBloodCard onSubmitted={() => { setRequestSubmitted(true); setShowRequestForm(false); }} />
          )}
          {requestSubmitted && <div style={{color:'#388e3c',marginTop:8}}>Blood request submitted!</div>}
        </div>
        <BloodAvailabilityCard />
      </div>
    </div>
  );
}

function BecomeDonorCard({ onRegistered }: { onRegistered?: () => void }) {
  const [form, setForm] = useState({ name: '', age: '', bloodGroup: bloodGroups[0] });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to register donor');
      setSubmitted(true);
      if (onRegistered) onRegistered();
    } catch (err) {
      setError('Could not register donor. Please try again.');
    }
  };
  return (
    <div className="dashboard-card">
      <h3>Become a Donor</h3>
      {submitted ? (
        <div>
          <p>Thank you, {form.name}, for registering as a donor!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={form.name} required onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input type="number" placeholder="Age" value={form.age} required min={18} max={65} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
          <select value={form.bloodGroup} onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}>
            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
          <button type="submit">Register</button>
        </form>
      )}
      {error && <div style={{color:'#d32f2f',marginTop:8}}>{error}</div>}
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/donors">Donor Details</Link>
        <Link to="/emergency">Emergency Cases</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donors" element={<DonorDetails />} />
        <Route path="/emergency" element={<EmergencyCase />} />
      </Routes>
    </Router>
  );
}

export default App;
