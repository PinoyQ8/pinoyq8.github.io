import { PiAuthProvider } from "./contexts/pi-auth-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // MESH SHIELD: suppressHydrationWarning ignores third-party wallet injections (Bybit)
    <html lang="en" suppressHydrationWarning>
      <head>
  {/* BAZAAR FORCE: Direct SDK Injection with no delay */}
  <script 
    src="https://sdk.minepi.com/pi-sdk.js" 
    type="text/javascript"
  ></script>
  
  {/* MESH DIAGNOSTIC: Force window.Pi existence check */}
  <script dangerouslySetInnerHTML={{ __html: `
    window.onload = function() {
      console.log("MESH-SCAN: window.Pi status:", typeof window.Pi);
    }
  `}} />
</head>
      <body 
        style={{ 
          backgroundColor: 'black', 
          margin: 0, 
          color: '#06b6d4',
          fontFamily: 'monospace',
          minHeight: '100vh',
          // MESH-SCAN: Added smooth rendering for S23 AMOLED screens
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
      >
        <PiAuthProvider>
          {children}
        </PiAuthProvider>
      </body>
    </html>
  );
}