"use client";

import React, { useState, useEffect } from 'react';
import { usePiAuth } from "./contexts/pi-auth-context";
import { Hexagon, ShieldCheck, Terminal, Zap, Activity, Database } from "lucide-react";
import Link from 'next/link';
import LiquidityPulse from '../components/LiquidityPulse';

export default function HomePage() {
  const { userData, authMessage, isAuthenticated } = usePiAuth();
  const [isStriking, setIsStriking] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // WAR CHEST STATE (Solid Anchor)
  const [treasuryBalance, setTreasuryBalance] = useState(651.89);
  const [isIncrementing, setIsIncrementing] = useState(false);

  // TEMPORAL SHIELD ONLY - No fake heartbeat.
  useEffect(() => {
    setMounted(true);
  }, []);

  const initiateGovernanceStrike = async () => {
    if (!window.Pi) return;
    setIsStriking(true);

    const paymentData = {
      amount: 1,
      memo: 'BZR-MAINNET-GOVERNANCE-PULSE',
      metadata: { node: "X570-TAICHI", phase: 3 },
    };

    const callbacks = {
      onReadyForServerApproval: (paymentId: string) => {
        return fetch('/api/payments/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        setIsStriking(false);
        setTreasuryBalance(prev => prev + 1.0);
        setIsIncrementing(true);
        setTimeout(() => setIsIncrementing(false), 3000);

        return fetch('/api/payments/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, txid })
        });
      },
      onCancel: () => setIsStriking(false),
      onError: (error: Error) => {
        console.error('[FRACTURE]', error);
        setIsStriking(false);
      }
    };

    window.Pi.createPayment(paymentData, callbacks);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-[#06b6d4] font-mono selection:bg-cyan-500 selection:text-black">
      
      <div className="text-center space-y-6 max-w-md w-full">
        {/* MESH CORE VISUAL */}
        <div className="relative mx-auto w-24 h-24 animate-pulse">
          <Hexagon className="h-24 w-24 text-[#06b6d4]" fill="currentColor" opacity="0.05" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Hexagon className="h-12 w-12 text-[#06b6d4]" fill="currentColor" />
            <Activity className={`absolute h-6 w-6 ${isStriking ? "text-red-500 animate-ping" : "text-black"}`} />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Project Bazaar</h1>
          <p className="text-[10px] tracking-[0.3em] text-cyan-600 font-bold uppercase">E-Network OS // Mainnet Phase 3</p>
        </div>
        
        {/* TELEMETRY BOX */}
        <div className="bg-[#06b6d4]/5 border border-[#06b6d4]/30 p-4 rounded-sm backdrop-blur-sm relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full shadow-[0_0_10px_#06b6d4] ${isStriking ? "bg-red-500 shadow-red-500" : "bg-cyan-500"}`} />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Terminal size={12} className={isStriking ? "text-red-500" : "text-cyan-500"} />
            <span className="text-[10px] uppercase text-cyan-600 font-bold tracking-widest">
              {isStriking ? "STRIKE IN PROGRESS" : "System Pulse"}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-80 uppercase text-center">
            {isStriking ? "Awaiting Blockchain Seal..." : (authMessage || "AWAITING HANDSHAKE...")}
          </p>
        </div>

        {isAuthenticated && userData ? (
          <div className="space-y-6 animate-in fade-in zoom-in duration-700">
            
            {/* 1. AMM LIQUIDITY PULSE (DYNAMIC TICKER) */}
            <LiquidityPulse />

            {/* 2. CONSOLIDATED TREASURY HUB - SINGLE NODE */}
            <div className="bg-[#06b6d4]/5 border border-cyan-500/30 p-4 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <Database size={10} className="text-cyan-600" />
                    <p className="text-[9px] uppercase tracking-[0.3em] text-cyan-600 font-black">Treasury Vault</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black italic tracking-tighter transition-all duration-700 ${isIncrementing ? "text-green-400 scale-105" : "text-white"}`}>
                      {treasuryBalance.toFixed(2)}
                    </span>
                    <span className="text-xs text-cyan-800 font-bold">PI</span>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex items-center justify-end gap-2">
                    <Activity size={10} className="text-cyan-600" />
                    <p className="text-[9px] uppercase tracking-[0.3em] text-cyan-600 font-black">BZR Liquidity</p>
                  </div>
                  <p className="text-xl font-black italic text-white tracking-tighter">9899 BZR</p>
                </div>
              </div>

              {/* BOOTSTRAP SHIELD TELEMETRY */}
              <div className="flex items-center justify-between border-t border-cyan-900/30 pt-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-cyan-500" />
                  <p className="text-[10px] text-cyan-700 font-bold uppercase tracking-widest text-left">
                    Bootstrap Shield Active
                  </p>
                </div>
                <p className="text-[10px] text-cyan-400 font-black animate-pulse">+0.0155 PI TO WAR CHEST</p>
              </div>
            </div>

            {/* IDENTITY CARD */}
            <div className="p-4 border border-[#06b6d4] bg-[#06b6d4]/5 rounded-sm">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck size={18} className="text-cyan-400" />
                <p className="text-xl font-black uppercase italic text-white">Pioneer Verified</p>
              </div>
              <p className="text-sm tracking-[0.2em] text-cyan-300 font-bold">@{userData.username}</p>
            </div>

            {/* SOVEREIGN GATE */}
            {(userData.username === "Bazaar_Founder" || userData.username === "Bazaar_Tech" || userData.username === "PinoyQ8") && (
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-center gap-2 text-[10px] text-red-500 font-black uppercase tracking-tighter mb-1">
                  <Zap size={10} fill="currentColor" />
                  <span>Administrative Privilege Escalation Active</span>
                </div>
                
                <button 
                  onClick={initiateGovernanceStrike}
                  disabled={isStriking}
                  className="w-full bg-red-950/20 border border-red-900 text-red-500 py-4 font-black uppercase text-sm tracking-tighter hover:bg-red-500 hover:text-black transition-all mb-2 shadow-[0_0_15px_rgba(239,68,68,0.1)] active:scale-95"
                >
                  {isStriking ? "TRANSMITTING..." : "Execute Governance Strike (1 Pi)"}
                </button>

                <Link 
                  href="/audit"
                  className="block w-full bg-[#06b6d4] text-black py-4 font-black uppercase text-base tracking-tighter hover:bg-white hover:shadow-[0_0_20px_#fff] transition-all duration-300 text-center"
                >
                  Enter Audit Node
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="py-10">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-1 bg-[#06b6d4]/20 overflow-hidden">
                   <div className="w-4 h-full bg-[#06b6d4] animate-[shimmer_2s_infinite]" />
                </div>
                <p className="text-[10px] text-cyan-800 animate-pulse uppercase font-black tracking-[0.4em]">
                  Initializing MESH...
                </p>
             </div>
          </div>
        )}
      </div>

      <footer className="absolute bottom-6 flex flex-col items-center gap-1 opacity-40">
        <p className="text-[10px] text-cyan-900 font-bold tracking-[0.2em] uppercase">
          March 13 // {mounted ? new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : "--:--"} AST // UNIVERSAL MESH NODE
        </p>
        <p className="text-[8px] text-cyan-950 uppercase font-black">X570 TAICHI WORKSTATION // 92% UPTIME SHIELD</p>
      </footer>
    </div>
  );
}