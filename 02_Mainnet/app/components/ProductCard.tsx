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
    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
        alert("![CRITICAL] Pi SDK not found on S23 node.");
        return;
      }

      const paymentData = {
        amount: product.price_in_pi,
        memo: `BZR-${product.id}: ${userData?.username || 'Pioneer'}`,
        metadata: { productId: product.id, buyer: userData?.username || 'Unknown' },
      };

      const callbacks = {
        onReadyForServerApproval: (paymentId: string) => {
          console.log(`[OK] Payment ${paymentId} waiting for server pulse...`);
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("![SYNC] Transaction Detected. Striking X570 Ledger...");
          
          // Send the receipt to your J: Drive server.js via the Ngrok Tunnel
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
        onError: (error: Error, paymentId?: string) => console.error("![CRITICAL] Payment Fracture:", error),
      };

      // ACTIVATE THE S23 BIOMETRIC WALLET
      await Pi.createPayment(paymentData, callbacks);
      
    } catch (err) {
      console.error("![ERROR] Payment Adjudicator failed to ignite:", err);
    }
  };

  return (
    <div style={{
      border: '1px solid #06b6d4',
      padding: '20px',
      margin: '10px 0',
      backgroundColor: 'rgba(6, 182, 212, 0.05)',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ color: '#06b6d4', marginTop: 0 }}>{product.name.toUpperCase()}</h3>
      <p style={{ color: '#a5f3fc', fontSize: '0.9rem' }}>{product.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>{product.price_in_pi} π</span>
        <button 
          onClick={handlePayment}
          style={{
            backgroundColor: '#06b6d4',
            color: 'black',
            padding: '8px 16px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            textTransform: 'uppercase'
          }}
        >
          Execute Strike
        </button>
      </div>
    </div>
  );
}