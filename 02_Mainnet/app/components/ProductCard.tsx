"use client";

import React from 'react';
import { usePiAuth } from "../contexts/pi-auth-context";

interface Product {
  id: string;
  name: string;
  description: string;
  price_in_pi: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { userData } = usePiAuth();

  const handlePayment = async () => {
    // 1. GAIN SDK ACCESS
    const Pi = (window as any).Pi;
    
    if (!Pi) {
      alert("![CRITICAL] MESH-SCAN: SDK not detected. Ensure you are inside the Pi Browser app.");
      return;
    }

    try {
      // 2. FORCE HANDSHAKE (Solves the 'Failed' error by ensuring init is active)
      console.log("[SYNC] Manually igniting SDK for Strike...");
      await Pi.init({ version: "2.0", sandbox: false });

      const paymentData = {
        amount: product.price_in_pi,
        memo: `BZR-${product.id}: ${userData?.username || 'Pioneer'}`,
        metadata: { productId: product.id, buyer: userData?.username || 'Unknown' },
      };

      const callbacks = {
        onReadyForServerApproval: (paymentId: string) => {
          console.log(`[OK] Payment ${paymentId} awaiting server pulse...`);
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("![SYNC] Transaction Detected. Striking X570 Ledger...");
          
          const response = await fetch('https://hypercoagulable-nondistortingly-valarie.ngrok-free.dev/api/payments/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId,
              txid,
              username: userData?.username,
              amount: product.price_in_pi
            })
          });
          
          if (response.ok) {
            alert("✅ Bazaar Block Finalized. Product Hard-Coded to J: Drive.");
          }
        },
        onCancel: (paymentId: string) => console.log("![ALERT] Pioneer cancelled strike."),
        onError: (error: Error, paymentId?: string) => {
          console.error("![CRITICAL] Payment Fracture:", error);
          alert(`Strike Failure: ${error.message}`);
        },
      };

      // 3. TRIGGER BIOMETRIC WALLET
      await Pi.createPayment(paymentData, callbacks);
      
    } catch (err) {
      console.error("![ERROR] Payment Adjudicator failed to ignite:", err);
      alert("MESH-SCAN: Manual Handshake Interrupted. Verify S23 Signal.");
    }
  };

  return (
    <div style={{
      border: '1px solid #06b6d4',
      padding: '20px',
      margin: '10px 0',
      backgroundColor: 'rgba(6, 182, 212, 0.05)',
      fontFamily: 'monospace',
      position: 'relative'
    }}>
      <h3 style={{ color: '#06b6d4', marginTop: 0, fontSize: '1.2rem' }}>{product.name.toUpperCase()}</h3>
      <p style={{ color: '#a5f3fc', fontSize: '0.85rem', lineHeight: '1.4' }}>{product.description}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#22d3ee', fontWeight: 'bold', fontSize: '1.1rem' }}>{product.price_in_pi} π</span>
          <span style={{ color: '#164e63', fontSize: '10px' }}>UNIT PRICE / PI-MAINNET</span>
        </div>
        
        <button 
          onClick={handlePayment}
          style={{
            backgroundColor: '#06b6d4',
            color: 'black',
            padding: '10px 20px',
            border: 'none',
            fontWeight: '900',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)'
          }}
        >
          Execute Strike
        </button>
      </div>
    </div>
  );
}