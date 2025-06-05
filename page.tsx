
'use client';

import React from 'react';
import { claimAirdrop } from '../claim';

export default function Home() {
  const handleClaim = async () => {
    const result = await claimAirdrop();
    alert(result.message);
  };

  return (
    <main style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎁 CIT Airdrop DApp</h1>
      <p>Claim 100 ANY token after sending 0.60 USD worth BNB</p>
      <button onClick={handleClaim} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Claim Airdrop
      </button>
    </main>
  );
}
