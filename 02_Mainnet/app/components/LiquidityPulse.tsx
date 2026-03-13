"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Zap } from "lucide-react";

export default function LiquidityPulse() {
  // INITIALIZE WITH STATIC NULLS TO PREVENT HYDRATION FRACTURE
  const [volume, setVolume] = useState("0.00");
  const [nodePing, setNodePing] = useState(0);
  const [pulseColor, setPulseColor] = useState("text-cyan-700");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // STARTING BASELINE
    let currentVol = 1574.92;

    const interval = setInterval(() => {
      // MESH VOLUME FLUCTUATIONS
      const shift = (Math.random() - 0.4) * 0.15;
      currentVol += shift;
      setVolume(currentVol.toFixed(2));
      
      // NODE PERFORMANCE JITTER
      setNodePing(Math.floor(Math.random() * (18 - 12 + 1) + 12));
      
      // VISUAL FEEDBACK: Subtle color flash, resting on muted cyan
      setPulseColor(shift > 0 ? "text-cyan-400" : "text-red-500");
      setTimeout(() => setPulseColor("text-cyan-700"), 500);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // THE TEMPORAL SHIELD: NO RENDER UNTIL HANDSHAKE
  if (!mounted) {
    return (
      <div className="flex justify-between w-full mb-4 opacity-20 px-1">
        <div className="h-[24px] w-[30%] bg-cyan-950/30 rounded-sm animate-pulse" />
        <div className="h-[24px] w-[30%] bg-cyan-950/30 rounded-sm animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center w-full mb-4 px-2 border-b border-cyan-900/20 pb-2">
      {/* LEFT: SUBTLE AMM VOLUME TICKER */}
      <div className="flex flex-col items-start gap-0.5">
        <div className="flex items-center gap-1 opacity-70">
          <Activity size={8} className="text-cyan-500" />
          <span className="text-[8px] uppercase tracking-[0.2em] text-cyan-600 font-bold">AMM Vol (24H)</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-xs font-black italic tracking-tighter transition-colors duration-700 ${pulseColor}`}>
            {volume}
          </span>
          <span className="text-[8px] text-cyan-800 font-bold uppercase">PI</span>
        </div>
      </div>

      {/* RIGHT: SUBTLE NODE LATENCY TICKER */}
      <div className="flex flex-col items-end gap-0.5">
        <div className="flex items-center gap-1 opacity-70">
          <span className="text-[8px] uppercase tracking-[0.2em] text-cyan-600 font-bold">Node Latency</span>
          <Zap size={8} className="text-cyan-500" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-black italic text-cyan-600/80 animate-pulse tracking-tighter">
            {nodePing || "--"}
          </span>
          <span className="text-[8px] text-cyan-800 font-bold uppercase">ms</span>
        </div>
      </div>
    </div>
  );
}