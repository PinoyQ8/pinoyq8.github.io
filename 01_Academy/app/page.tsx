'use client';
import { useEffect, useState } from 'react';

export default function Phase10Strike() {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    // Sovereign DOM Injection
    const script = document.createElement('script');
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    script.onload = () => {
      if (window.Pi) {
        window.Pi.init({ version: '2.0', sandbox: true });
        console.log('[MESH] SDK Bone-Structure Hard-Coded.');
        setSdkReady(true);
      }
    };
    document.body.appendChild(script);
  }, []);

  const triggerHandshake = async () => {
    if (!sdkReady || !window.Pi) {
      alert('ADJUDICATOR ALERT: SDK Offline.');
      return;
    }

    try {
      console.log('[MESH] Requesting Payment Scope Auth...');
      
      // THE AUTH-KEY: Type-Safe Promise returned
      const auth = await window.Pi.authenticate(['payments'], async (payment) => {
        console.log('[MESH] Incomplete payment found:', payment);
        return Promise.resolve(); 
      });
      console.log('[MESH] Auth secured for UID:', auth.user.uid);

      console.log('[STRIKE INITIATED] Firing Payload to Testnet...');
      
      // THE STRIKE: Unified Route Protocol
      window.Pi.createPayment({
        amount: 1,
        memo: 'Phase 10: Alpha-Consort Handshake',
        metadata: { step: 10 }
      }, {
        onReadyForServerApproval: async (paymentId) => { 
          console.log('[MESH] Pulse ID Received:', paymentId);
          // ROUTE TO UNIFIED GATEWAY (ACTION: APPROVE)
          await fetch('/api/complete-handshake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'approve', paymentId })
          });
        },
        onReadyForServerCompletion: async (paymentId, txid) => { 
          console.log(`[MESH] Locking TXID: ${txid}`);
          // ROUTE TO UNIFIED GATEWAY (ACTION: COMPLETE)
          await fetch('/api/complete-handshake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'complete', paymentId, txid })
          });
          alert('SUCCESS: 1 Test Pi confirmed. Phase 10 Complete! TXID: ' + txid);
        },
        onCancel: (paymentId) => { console.log('[MESH] Strike Cancelled.'); },
        onError: (error, payment) => { alert('SDK Error: ' + error.message); }
      });

    } catch (err) {
      alert('Critical Execution Failure: ' + err.message);
    }
  };

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ color: 'white', fontFamily: 'monospace', marginBottom: '40px' }}>BZR-ACADEMY: PHASE 10</h1>
      <button 
        onClick={triggerHandshake} 
        style={{ backgroundColor: sdkReady ? '#FFD700' : '#555', color: 'black', padding: '25px 50px', fontSize: '24px', fontWeight: '900', border: 'none', borderRadius: '5px', cursor: sdkReady ? 'pointer' : 'not-allowed', fontFamily: 'monospace', boxShadow: sdkReady ? '0 0 15px #FFD700' : 'none' }}
      >
        {sdkReady ? 'EXECUTE STEP #10' : 'LOADING SDK...'}
      </button>
    </div>
  );
}