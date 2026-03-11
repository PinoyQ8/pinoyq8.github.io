"use client";

import React, { useState } from 'react';

export default function DiagnosticPage() {
  const [status, setStatus] = useState("AWAITING_COMMAND");
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const forceHandshake = async () => {
    setStatus("STRIKING...");
    addLog("Initiating manual handshake...");

    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
        addLog("❌ [CRITICAL] window.Pi is NULL. SDK not injected by Browser.");
        setStatus("FAILURE");
        return;
      }

      addLog("✅ SDK found. Initializing v2.0...");
      await Pi.init({ version: "2.0", sandbox: false });
      
      addLog("Authenticating Pioneer...");
      const auth = await Pi.authenticate(['username', 'payments'], (p: any) => {});
      
      addLog(`✅ SUCCESS: Connected as ${auth.user.username}`);
      setStatus("SOVEREIGN");
    } catch (err: any) {
      addLog(`❌ FRACTURE: ${err.message || JSON.stringify(err)}`);
      setStatus("ERROR");
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', padding: '20px', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h1>BZR_DIAGNOSTIC_v1.0</h1>
      <hr style={{ borderColor: '#0f0' }} />
      
      <div style={{ margin: '20px 0' }}>
        <p>SYSTEM_STATUS: <span style={{ color: status === 'SOVEREIGN' ? '#0f0' : '#f00' }}>[{status}]</span></p>
        <button 
          onClick={forceHandshake}
          style={{ padding: '15px', backgroundColor: '#0f0', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          FORCE SDK HANDSHAKE
        </button>
      </div>

      <div style={{ backgroundColor: '#111', padding: '10px', border: '1px solid #333' }}>
        <p style={{ color: '#555' }}>--- TELEMETRY_LOG ---</p>
        {log.map((line, i) => <p key={i} style={{ margin: '2px 0', fontSize: '12px' }}>{line}</p>)}
      </div>
    </div>
  );
}