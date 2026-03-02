"use client"; // STAT: Enable Client-Side Logic

import React from 'react';

export default function AdminPage() {
  // Add any logic/state here (e.g., const [logs, setLogs] = React.useState([]);)
  const logs = []; // Placeholder for the logs variable appearing in your snippet

  const fetchLogs = () => { console.log("SYNC: Fetching Logs..."); };
  const handleFlushRAM = () => { console.log("STAT: Flushing RAM..."); };

  return (
    <div className={`min-h-screen font-mono p-4 md:p-8 transition-colors duration-500 ${
      logs.some(l => l.includes('UNAUTHORIZED')) ? 'bg-red-950' : 'bg-black'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* MATTE BAZAAR_OS HEADER */}
        <header className="border-b border-gray-800 pb-4 mb-6 flex justify-between items-center px-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-600 rounded-none shadow-[0_0_5px_#0891b2]"></div>
            <div>
              <h1 className="text-lg font-bold tracking-[0.2em] text-gray-100 uppercase">BAZAAR_OS</h1>
              <p className="text-[8px] text-gray-600 font-bold tracking-[0.3em] uppercase">Node: X570-TAICHI // v23.2-SECURE</p>
            </div>
          </div>
          <div className="border border-gray-800 px-2 py-1 rounded-none text-right">
            <span className="text-[9px] text-gray-500 block leading-none uppercase">Uptime Shield</span>
            <span className="text-xs text-green-600 font-bold font-mono">92.00%</span>
          </div>
        </header>

        {/* DATA LEDGER VIEW */}
        <div className="bg-black border border-gray-800 p-4 h-96 overflow-y-auto mb-8 relative rounded-none scrollbar-hide">
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <div key={i} className="text-[10px] sm:text-[11px] mb-1 font-mono flex items-start leading-tight antialiased">
                <span className="text-gray-700 mr-2 select-none">[{i.toString().padStart(3, '0')}]</span>
                <span className={log.includes('UNAUTHORIZED') ? 'text-white bg-red-900 px-1 font-bold' : 'text-cyan-600'}>
                  {log}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-800 text-[10px] tracking-[0.4em] uppercase">
              Signal_Loss_Detected
            </div>
          )}
        </div>

        {/* RESPONSIVE COMMAND GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={fetchLogs} className="border border-gray-800 p-4 text-xs text-white hover:bg-gray-900 uppercase transition-all active:bg-cyan-900">
            Manual Refresh
          </button>
          <button onClick={handleFlushRAM} className="border border-red-900 bg-red-950/20 p-6 md:p-4 text-sm md:text-xs text-red-500 hover:bg-red-900 hover:text-white uppercase transition-all font-bold active:scale-95">
            [!] Flush RAM Ledger [!]
          </button>
          <button className="w-full group relative overflow-hidden border border-cyan-900 bg-black p-4 transition-all hover:border-cyan-500 active:scale-[0.98]">
            Terminate Session
          </button>
        </div>
      </div>
    </div>
  );
}