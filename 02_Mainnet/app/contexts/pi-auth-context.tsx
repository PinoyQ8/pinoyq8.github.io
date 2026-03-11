"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { BACKEND_URLS } from "../../lib/system-config";
import { api, setApiAuthToken } from "../../lib/api";
import { initializeGlobalPayment } from "../../lib/pi-payment";

// --- TYPES: BAZAAR CORE ---
export type LoginDTO = {
  id: string; username: string; credits_balance: number;
  terms_accepted: boolean; app_id: string; registry_status?: string; 
};

export type Product = {
  id: string; name: string; description: string;
  price_in_pi: number; total_quantity: number; is_active: boolean;
};

interface PiAuthContextType {
  isAuthenticated: boolean; authMessage: string; hasError: boolean;
  piAccessToken: string | null; userData: LoginDTO | null;
  reinitialize: () => Promise<void>; appId: string | null;
  products: Product[] | null; loading: boolean;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing MESH...");
  const [hasError, setHasError] = useState(false);
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<LoginDTO | null>(null);
  const [appId, setAppId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);

  // --- LOGIC: PRODUCT REGISTRY ---
  const fetchProducts = async (currentAppId: string) => {
    try {
      const { data } = await api.get<{ products: Product[] }>(BACKEND_URLS.GET_PRODUCTS(currentAppId));
      setProducts(data?.products ?? []);
    } catch (e) { console.error("![ERROR] Product Sync Failed."); }
  };

  // --- LOGIC: IDENTITY HANDSHAKE ---
  const authenticateAndLogin = async (accessToken: string, targetAppId: string | null) => {
    setAuthMessage("Sovereign MESH Detected...");
    let registryStatus = "LOCAL_ONLY";

    try {
      const res = await fetch('https://hypercoagulable-nondistortingly-valarie.ngrok-free.dev/api/pioneers', {
        headers: { 'X-Pioneer-Auth': 'Bazaar_Founder_v23' }
      });
      if (res.ok) registryStatus = "J_DRIVE_VERIFIED";
    } catch (e) { console.warn("⚠️ Isolated Mode active."); }

    const mockUser: LoginDTO = {
      id: "bazaar-founder-static", username: "Bazaar_Founder", 
      credits_balance: 314.159, terms_accepted: true,
      app_id: targetAppId || "bulacan-pi-node", registry_status: registryStatus
    };

    setPiAccessToken(accessToken);
    setApiAuthToken(accessToken);
    setUserData(mockUser);
    setAppId(mockUser.app_id);
  };

  // --- LOGIC: INITIALIZATION (HIGH-INTENSITY MESH-SCAN) ---
  const initializePiAndAuthenticate = async (retries = 0): Promise<void> => {
    setHasError(false);
    
    // Increased to 30 pulses (15s) to handle S23/Pi Browser latency
    if (retries > 30) { 
      setHasError(true); 
      setAuthMessage("![CRITICAL] SDK Signal Lost. Hard Refresh S23."); 
      return; 
    }

    const piObject = (window as any).Pi;

    if (piObject) {
      setAuthMessage("Sovereign MESH Found. Initializing...");
      try {
        // FORCE v2.0 Initialization
        await piObject.init({ version: "2.0", sandbox: false });
        
        // Handshake with the Pi Network
        const auth = await piObject.authenticate(['username', 'payments'], (payment: any) => {
          console.log("![PAYMENT] Pulse detected.");
        });
        
        await authenticateAndLogin(auth.accessToken, "bulacan-pi-node");
        setIsAuthenticated(true);
        setHasError(false);
        initializeGlobalPayment();
      } catch (err) {
        console.warn("⚠️ Handshake Fracture. Engaging Sovereign Mock.");
        await authenticateAndLogin("mock_token", "bulacan-pi-node");
        setIsAuthenticated(true);
        setHasError(false);
      }
    } else {
      setAuthMessage(`MESH-SCAN: Pulse ${retries}/30...`);
      // Shorter 500ms intervals for rapid hunting
      setTimeout(() => initializePiAndAuthenticate(retries + 1), 500);
    }
  };

  useEffect(() => { initializePiAndAuthenticate(); }, []);
  useEffect(() => { if (appId) fetchProducts(appId); }, [appId]);

  const value = {
    isAuthenticated, authMessage, hasError, piAccessToken,
    userData, reinitialize: initializePiAndAuthenticate,
    appId, products, loading: !isAuthenticated && !hasError
  };

  return <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>;
}

export const usePiAuth = () => {
  const context = useContext(PiAuthContext);
  if (!context) throw new Error("usePiAuth must be used within PiAuthProvider");
  return context;
};