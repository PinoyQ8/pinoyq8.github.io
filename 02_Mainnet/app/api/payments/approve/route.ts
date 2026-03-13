import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();
    console.log(`[STRIKE] Approving Payment: ${paymentId}`);

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: { 
        'Authorization': `Key ${process.env.PI_API_KEY}`,
        'Content-Type': 'application/json' 
      }
    });

    if (!response.ok) throw new Error('Pi API Rejection');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[FRACTURE] Approval Failed:', error);
    return NextResponse.json({ error: "MESH Handshake Failed" }, { status: 500 });
  }
}