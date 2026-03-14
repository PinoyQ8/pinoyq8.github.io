import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BZR Academy Node",
  // 1. THIS IS THE CRITICAL LINE
  // REPLACE 'PASTE_YOUR_CODE_HERE' with the code from Step 3 of the Portal.
  verification: {
    other: {
      "pi-verification": ["PASTE_YOUR_CODE_HERE"],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* FALLBACK INJECTION: Bot-Visible Tag */}
        <meta name="pi-verification" content="PASTE_YOUR_CODE_HERE" />
        <script src="https://sdk.minepi.com/pi-sdk.js" defer></script>
      </head>
      <body style={{ backgroundColor: "black", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}