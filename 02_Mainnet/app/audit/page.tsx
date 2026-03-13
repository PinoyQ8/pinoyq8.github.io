"use client";

import React, { useState } from 'react';
import { usePiAuth } from "../contexts/pi-auth-context";
import { ShieldAlert, Terminal, ChevronLeft, Search, Database, Fingerprint } from "lucide-react";
import Link from 'next/link';

export default function AuditPage() {
  const { userData, isAuthenticated } = usePiAuth();

  // MOCKED DATA: The Security Fracture Ledger
  const [fractures] = useState([
    { id: "FR-001", pioneer: "@Pioneer_77", type: "SDK_LATENCY", status: "LOGGED", severity: "LOW" },
    { id: "FR-002", pioneer: "@Pioneer_X", type: "UNAUTHORIZED_PULSE", status: "QUARANTINED", severity: "HIGH" },
    { id: "FR-003", pioneer: "@Pioneer_Alpha", type: "HYDRATION_MISMATCH", status: "RESOLVED", severity: "MED" },
  ]);

  if (!isAuthenticated || (userData?.username !== "Bazaar_Founder" && userData?.username !== "Bazaar_Tech" && userData?.username !== "PinoyQ8")) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-red-500 font-mono">
        <ShieldAlert size={48} className="mb-4 animate-pulse" />
        <h1 className="text-2xl font-black uppercase">Access Denied</h1>
        <p className="text-[10px] tracking-widest mt-2 uppercase">Unauthorized Node Interaction Detected</p>
        <Link href="/" className="mt-8 text-cyan-500 border border-cyan-500 px-4 py-2 hover:bg-cyan-500 hover:text-black transition-all">
          Return to Core
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#06b6d4] font-mono p-4 sm:p-10 selection:bg-cyan-500 selection:text-black">
      
      {/* HEADER NAV */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter hover:text-white transition-colors">
          <ChevronLeft size={14} /> Back to Core
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8px] text-cyan-900 font-bold uppercase">Operator</p>
            <p className="text-xs font-black text-white italic uppercase">{userData.username}</p>
          </div>
          <Fingerprint className="text-cyan-500" size={24} />
        </div>
      </div>

      {/* COMMAND CENTER GRID */}
      <main className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">Audit Node</h1>
          <p className="text-[10px] tracking-[0.4em] text-cyan-600 font-bold uppercase">Security Fracture Ledger // v23.0.1</p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-800 group-focus-within:text-cyan-400 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="SEARCH PIONEER UID OR FRACTURE ID..." 
            className="w-full bg-cyan-950/10 border border-cyan-900/50 p-4 pl-10 text-[10px] font-bold tracking-widest focus:outline-none focus:border-cyan-400 transition-all placeholder:text-cyan-900"
          />
        </div>

        {/* LEDGER TABLE */}
        <div className="border border-cyan-900/30 overflow-hidden">
          <div className="bg-cyan-950/20 p-3 flex items-center justify-between border-b border-cyan-900/30">
            <div className="flex items-center gap-2">
              <Database size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">Active Fractures</span>
            </div>
            <span className="text-[9px] font-black text-cyan-800">TOTAL: {fractures.length}</span>
          </div>

          <div className="divide-y divide-cyan-950/50">
            {fractures.map((f) => (
              <div key={f.id} className="p-4 flex items-center justify-between hover:bg-cyan-500/5 transition-colors">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-cyan-700">{f.id}</p>
                  <p className="text-sm font-black text-white">{f.pioneer}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span className={`text-[8px] px-2 py-0.5 font-black uppercase ${
                      f.severity === 'HIGH' ? 'bg-red-500 text-black' : 'border border-cyan-900 text-cyan-600'
                    }`}>
                      {f.severity}
                    </span>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">{f.type}</span>
                  </div>
                  <p className="text-[8px] uppercase tracking-widest text-cyan-800 font-bold">{f.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 flex flex-col items-center gap-1 opacity-20 text-center">
        <p className="text-[10px] text-cyan-900 font-bold tracking-[0.2em] uppercase">
          X570 TAICHI // SECURE AUDIT NODE // {new Date().toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
}