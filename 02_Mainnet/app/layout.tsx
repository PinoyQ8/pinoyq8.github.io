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
        {/* MESH FORCE: Direct script injection for Pi SDK */}
        <script src="https://sdk.minepi.com/pi-sdk.js" defer></script>
      </head>
      <body 
        style={{ 
          backgroundColor: 'black', 
          margin: 0, 
          color: '#06b6d4',
          fontFamily: 'monospace', // Added for that hard-coded terminal look
          minHeight: '100vh'
        }}
      >
        <PiAuthProvider>
          {children}
        </PiAuthProvider>
      </body>
    </html>
  );
}