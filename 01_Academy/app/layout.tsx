export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 1. DOMAIN CLAIM ANCHOR */}
        {/* Replace 'YOUR_VERIFICATION_CODE' with the string from Step 3 of the Portal */}
        <meta name="pi-verification" content="YOUR_VERIFICATION_CODE_FROM_PORTAL" />
        
        {/* 2. SOVEREIGN SDK LOAD (Managed here globally) */}
        <script src="https://sdk.minepi.com/pi-sdk.js" defer></script>
      </head>
      <body style={{ backgroundColor: 'black', margin: 0, color: 'white' }}>
        {children}
      </body>
    </html>
  );
}