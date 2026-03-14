'use client';
import { useEffect, useState } from 'react';

export default function Phase10Strike() {
  const [sdkReady, setSdkReady] = useState(false);
  const [isStriking, setIsStriking] = useState(false);

  useEffect(() => {
    const checkSDK = () => {
      const piSDK = (window as any).Pi;
      if (piSDK) {
        piSDK.init({ version: '2.0', sandbox: true });
        console.log('[MESH] Academy SDK Initialized.');
        setSdkReady(true);
      } else {
        // Retry logic if script defer is slow
        setTimeout(checkSDK, 500);
      }
    };
    checkSDK();
  }, []);

  const triggerHandshake = async () => {
    const piSDK = (window as any).Pi;

    if (!piSDK || !sdkReady) {
      alert('ADJUDICATOR ALERT: SDK Offline.');
      return;
    }

    setIsStriking(true);

    try {
      const auth = await piSDK.authenticate(['payments'], async (payment: any) => {
        console.log('[MESH] Incomplete payment found.');
      });

      piSDK.createPayment({
        amount: 1,
        memo: 'Phase 10: Alpha-Consort Handshake',
        metadata: { step: 10 }
      }, {
        onReadyForServerApproval: async (paymentId: string) => { 
          await fetch('/api/complete-handshake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'approve', paymentId })
          });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => { 
          await fetch('/api/complete-handshake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'complete', paymentId, txid })
          });
          setIsStriking(false);
          alert('SUCCESS: Phase 10 Complete! TXID: ' + txid);
        },
        onCancel: () => setIsStriking(false),
        onError: (error: any) => {
          setIsStriking(false);
          alert('SDK Error: ' + error.message);
        }
      });

    } catch (err: any) {
      setIsStriking(false);
      alert('Critical Execution Failure: ' + err.message);
    }
  };

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ color: 'white', fontFamily: 'monospace', marginBottom: '40px' }}>BZR-ACADEMY: PHASE 10</h1>
      <button 
        onClick={triggerHandshake} 
        disabled={!sdkReady || isStriking}
        style={{ 
            backgroundColor: sdkReady ? '#FFD700' : '#555', 
            color: 'black', 
            padding: '25px 50px', 
            fontSize: '24px', 
            fontWeight: '900', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: sdkReady ? 'pointer' : 'not-allowed', 
            fontFamily: 'monospace', 
            boxShadow: sdkReady ? '0 0 15px #FFD700' : 'none' 
        }}
      >
        {isStriking ? 'TRANSMITTING...' : (sdkReady ? 'EXECUTE STEP #10' : 'LOADING SDK...')}
      </button>
      {/* HEARTBEAT: [March 14 // 17:28 AST] - Hypercoag Clear. */}
    </div>
  );
}