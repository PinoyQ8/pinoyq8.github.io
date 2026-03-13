"use client";

import React, { useState, useEffect } from 'react';
// SEALED: Using Root Alias to bypass 'Cannot find module' fractures
import { usePiAuth } from "@/app/contexts/pi-auth-context"; 
import { Terminal, ShieldCheck, Zap } from "lucide-react";

export default function WelcomeHero() {
  const { userData } = usePiAuth();
  const [manifestText, setManifestText] = useState("");
  const fullText = "THE MESH IS LIVE. WELCOME TO PROJECT BAZAAR.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setManifestText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/50 border-y border-cyan-900/30 p-6 my-8 relative overflow-hidden group">
      {/* SCANLINE OVERLAY: Animated via Tailwind */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[200%] animate-scanline pointer-events-none" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/50">
            <ShieldCheck className="text-cyan-400" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] text-cyan-700 uppercase">System Status: Verified</p>
            <h2 className="text-xl font-black italic text-white tracking-tighter uppercase leading-none">
              {manifestText}
              <span className="animate-pulse">_</span>
            </h2>
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-cyan-100/60 max-w-xl font-bold uppercase tracking-wide">
          Pioneer <span className="text-white">@{userData?.username || "Guest"}</span>, you have reached the 
          <span className="text-cyan-400"> X570-Taichi Command Node</span>. This DAO is governed by the MESH Protocol. 
          The Bootstrap AMM is pulsing at <span className="text-white">435 PI</span> depth.
        </p>

        <div className="flex gap-4 pt-2">
          <div className="flex items-center gap-1.5 opacity-50">
            <Terminal size={12} className="text-cyan-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-800">Protocol: NEO-v23</span>
          </div>
          <div className="flex items-center gap-1.5 animate-pulse">
            <Zap size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-yellow-500">Mainnet Readiness: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}