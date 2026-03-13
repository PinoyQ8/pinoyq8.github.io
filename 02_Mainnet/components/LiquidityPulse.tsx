"use client";

import React, { useState, useEffect } from 'react';
import { Database, TrendingUp, ShieldAlert } from "lucide-react";
import { bootstrapAmm } from '../lib/amm-logic'; // PULLING THE SHIELD

export default function LiquidityPulse() {
  const [piPool, setPiPool] = useState(435.00); // YOUR TREASURY
  const [bzrPool, setBzrPool] = useState(10000.00); // BZR SUPPLY
  const [lastAction, setLastAction] = useState("STABLE");

  // SIMULATE A RANDOM PIONEER SWAP (UNDER 10 PI)
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTrade = Math.random() * 5; // Simulating a small swap
      const result = bootstrapAmm(randomTrade, piPool, bzrPool);

      if (result.status === "APPROVED") {
        setPiPool(prev => prev + randomTrade);
        setBzrPool(prev => prev - parseFloat(result.bzrReceived));
        setLastAction(`+${result.treasuryGrowth} PI TO WAR CHEST`);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [piPool, bzrPool]);

  return (
    <div className="space-y-2 w-full">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black border border-cyan-900/50 p-3 rounded-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <Database size={10} className="text-cyan-600" />
            <span className="text-[8px] uppercase tracking-widest text-cyan-700 font-black">Treasury Vault</span>
          </div>
          <p className="text-lg font-black italic text-[#06b6d4]">{piPool.toFixed(2)} PI</p>
        </div>

        <div className="bg-black border border-cyan-900/50 p-3 rounded-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={10} className="text-cyan-600" />
            <span className="text-[8px] uppercase tracking-widest text-cyan-700 font-black">BZR Liquidity</span>
          </div>
          <p className="text-lg font-black italic text-white">{bzrPool.toFixed(0)} BZR</p>
        </div>
      </div>

      {/* BOOTSTRAP TELEMETRY */}
      <div className="bg-cyan-950/10 border border-cyan-900/20 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={10} className="text-yellow-500" />
          <span className="text-[8px] font-black uppercase text-cyan-800">Bootstrap Shield Active (Max 10 PI)</span>
        </div>
        <span className="text-[8px] font-bold text-cyan-500 animate-pulse">{lastAction}</span>
      </div>
    </div>
  );
}