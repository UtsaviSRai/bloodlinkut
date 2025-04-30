import React from 'react';
  
const HomePage: React.FC = () => (
  <main style={{ textAlign: 'center', padding: '2rem' }}>
    <h1 style={{ color: '#b71c1c' }}>Welcome to Blood Link</h1>
    <p style={{ fontSize: '1.2rem' }}>
      Connecting donors and recipients. Save lives, donate blood today!
    </p>
    <img
      src="https://img.icons8.com/color/96/000000/blood-donation.png"
      alt="Blood Donation"
      style={{ margin: '2rem 0' }}
    />
  </main>
);

export default HomePage;
