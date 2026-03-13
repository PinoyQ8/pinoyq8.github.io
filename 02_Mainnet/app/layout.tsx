import { PiAuthProvider } from "./contexts/pi-auth-context"; // Ensure path is correct
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body className="bg-black">
        {/* MESH-SCAN: The Shield must wrap the Children */}
        <PiAuthProvider>
          {children}
        </PiAuthProvider>
      </body>
    </html>
  );
}