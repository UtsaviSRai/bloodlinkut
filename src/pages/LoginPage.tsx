import React from 'react';
  
const LoginPage: React.FC = () => (
  <main style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', background: '#fff3f3', borderRadius: 8 }}>
    <h2 style={{ color: '#b71c1c' }}>Login</h2>
    <form>
      <label>
        Email
        <input type="email" required style={{ width: '100%', margin: '0.5rem 0' }} />
      </label>
      <label>
        Password
        <input type="password" required style={{ width: '100%', margin: '0.5rem 0' }} />
      </label>
      <button type="submit" style={{ background: '#b71c1c', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: 4 }}>
        Login
      </button>
    </form>
  </main>
);

export default LoginPage;
