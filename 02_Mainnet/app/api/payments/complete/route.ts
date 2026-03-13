import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentId, txid } = await request.json();
    console.log(`[SUCCESS] Sealing TX: ${txid}`);

    await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: { 
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ txid })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[FRACTURE] Completion Failed:', error);
    return NextResponse.json({ error: "Final Seal Failed" }, { status: 500 });
  }
}