export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://sdk.minepi.com/pi-sdk.js" defer></script>
      </head>
      <body style={{ backgroundColor: 'black', margin: 0, color: 'white' }}>
        {children}
      </body>
    </html>
  );
}