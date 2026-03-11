// system-config.ts - Project Bazaar: MESH Connectivity v2.7

export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SANDBOX: false, // HARD-CODED for Mainnet Strike
} as const;

// THE BRIDGE: Pointing to your X570 Ngrok Tunnel
// Ensure this URL is exactly what is in your Ngrok terminal
const NGROK_URL = "https://hypercoagulable-nondistortingly-valarie.ngrok-free.dev";

export const BACKEND_CONFIG = {
  BASE_URL: NGROK_URL, 
  BLOCKCHAIN_BASE_URL: "https://api.mainnet.minepi.com", // Switched to Mainnet for live strikes
} as const;

export const BACKEND_URLS = {
  // PULSE: Hits server.js v2.7 /api/pioneers
  LOGIN: `${BACKEND_CONFIG.BASE_URL}/api/pioneers`,
  
  // REGISTRY: Hits server.js v2.7 /api/products
  GET_PRODUCTS: (appId: string) =>
    `${BACKEND_CONFIG.BASE_URL}/api/products`,
    
  // FINALITY: Hits server.js v2.7 /api/payments/complete
  COMPLETE_PAYMENT: (paymentId: string) =>
    `${BACKEND_CONFIG.BASE_URL}/api/payments/complete`,
    
  // LEGACY/RESERVED (Keep for structural integrity)
  GET_PAYMENT: (paymentId: string) => `${BACKEND_CONFIG.BASE_URL}/proxy/v2/payments/${paymentId}`,
  APPROVE_PAYMENT: (paymentId: string) => `${BACKEND_CONFIG.BASE_URL}/proxy/v2/payments/${paymentId}/approve`,
} as const;

export const PI_BLOCKCHAIN_URLS = {
  GET_TRANSACTION: (txid: string) =>
    `${BACKEND_CONFIG.BLOCKCHAIN_BASE_URL}/transactions/${txid}/effects`,
} as const;