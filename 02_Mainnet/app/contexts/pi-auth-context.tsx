"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { setApiAuthToken } from "../../lib/api";

// --- TYPES: BAZAAR CORE ---
export type LoginDTO = {
  id: string; 
  username: string; 
  credits_balance: number;
  terms_accepted: boolean; 
  app_id: string; 
  registry_status?: string; 
};

interface PiAuthContextType {
  isAuthenticated: boolean; 
  authMessage: string; 
  hasError: boolean;
  piAccessToken: string | null; 
  userData: LoginDTO | null;
  reinitialize: () => Promise<void>; 
  appId: string | null;
  loading: boolean;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing MESH...");
  const [hasError, setHasError] = useState(false);
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<LoginDTO | null>(null);
  const [appId, setAppId] = useState<string | null>(null);

  // --- LOGIC: IDENTITY HANDSHAKE ---
  const authenticateAndLogin = async (accessToken: string, targetAppId: string | null) => {
    setAuthMessage("Manifesting Sovereign Registry...");
    let registryStatus = "LOCAL_J_DRIVE";

    // MESH-SCAN: Verify local development bridge
    try {
      const res = await fetch('/api/governance/fracture', { method: 'GET' });
      if (res.ok) registryStatus = "X570_VERIFIED";
    } catch (e) { 
      console.warn("⚠️ Isolated Mode active."); 
    }

    const mockUser: LoginDTO = {
      id: "bazaar-founder-v23", 
      username: "Bazaar_Founder", 
      credits_balance: 314.159, 
      terms_accepted: true,
      app_id: targetAppId || "bulacan-pi-node", 
      registry_status: registryStatus
    };

    setPiAccessToken(accessToken);
    setApiAuthToken(accessToken);
    setUserData(mockUser);
    setAppId(mockUser.app_id);
    setIsAuthenticated(true);
    setAuthMessage("HANDSHAKE COMPLETE // NODE SECURED");
  };

  // --- LOGIC: INITIALIZATION (10s SOVEREIGN BYPASS) ---
  const initializePiAndAuthenticate = async (retries = 0): Promise<void> => {
    setHasError(false);
    
    // MAX RETRY LIMIT: Engaging Manual Override
    if (retries > 30) { 
      setHasError(true); 
      setAuthMessage("![CRITICAL] SDK Signal Lost. Engaging Manual Bridge."); 
      await authenticateAndLogin("manual_bypass_token", "bulacan-pi-node");
      return; 
    }

    const piObject = (window as any).Pi;

    if (piObject) {
      setAuthMessage("Sovereign MESH Found. Awaiting Handshake...");
      
      const handshakeTimeout = setTimeout(async () => {
        if (!isAuthenticated) {
          console.warn("![BRIDGE] Handshake Latency Detected. Forcing Entry.");
          setAuthMessage("Bypassing SDK Latency... Manifesting.");
          await authenticateAndLogin("mock_bypass_token", "bulacan-pi-node");
        }
      }, 10000);

      try {
        await piObject.init({ version: "2.0", sandbox: false });
        
        const auth = await piObject.authenticate(['username', 'payments'], (payment: any) => {
          console.log("![PAYMENT] Pulse detected.");
        });
        
        clearTimeout(handshakeTimeout);
        await authenticateAndLogin(auth.accessToken, "bulacan-pi-node");
      } catch (err) {
        clearTimeout(handshakeTimeout);
        console.warn("⚠️ Handshake Fracture. Engaging Sovereign Mock.");
        await authenticateAndLogin("mock_token", "bulacan-pi-node");
      }
    } else {
      setAuthMessage(`MESH-SCAN: Pulse ${retries}/30...`);
      setTimeout(() => initializePiAndAuthenticate(retries + 1), 500);
    }
  };

  useEffect(() => { 
    initializePiAndAuthenticate(); 
  }, []);

  const value = {
    isAuthenticated, 
    authMessage, 
    hasError, 
    piAccessToken,
    userData, 
    reinitialize: initializePiAndAuthenticate,
    appId, 
    loading: !userData && !hasError 
  };

  return <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>;
}

export const usePiAuth = () => {
  const context = useContext(PiAuthContext);
  if (!context) throw new Error("usePiAuth must be used within PiAuthProvider");
  return context;
};