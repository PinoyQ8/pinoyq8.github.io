import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // EXTRACT ID: Handles both frontend signals AND direct Pi webhook pings
    const paymentId = body.paymentId || (body.payment && body.payment.identifier);

    if (!paymentId) {
      console.log('[FRACTURE] Payload received without Payment ID.');
      return NextResponse.json({ error: "No ID" }, { status: 400 });
    }

    // CHECK THE VAULT AND STRIP GHOST CHARACTERS
    const rawKey = process.env.PI_API_KEY;
    const apiKey = rawKey ? rawKey.trim() : null;

    if (!apiKey) {
      console.log('\n[CRITICAL FRACTURE] PI_API_KEY IS MISSING FROM 01_Academy/.env.local');
      return NextResponse.json({ error: "Missing Key" }, { status: 500 });
    }
    
    // THE TRACER: Verify the key is loaded and check its prefix
    console.log(`[MESH] KEY CHECK: LOADED [${apiKey.substring(0, 5)}...]`);

    // PHASE 1: SERVER APPROVAL
    // Triggered by frontend 'approve' action or default blockchain ping
    if (body.action === 'approve' || !body.action) {
      console.log(`\n[MESH] AUTHORIZING PULSE: ${paymentId}`);
      
      const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Key ${apiKey}` }
      });

      if (!piResponse.ok) {
        const errorData = await piResponse.text();
        console.log(`[FRACTURE] Pi Server Rejected Approval:`, errorData);
        return NextResponse.json({ error: "Pi Server Rejected" }, { status: 502 });
      }
      
      console.log(`[OK] Blockchain Approved. Awaiting S23 TXID...`);
      return NextResponse.json({ success: true });
    }

    // PHASE 2: SERVER COMPLETION
    // Triggered by frontend 'complete' action once TXID is generated
    if (body.action === 'complete') {
      console.log(`\n[MESH] LOCKING TXID: ${body.txid}`);
      
      const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
        method: 'POST',
        headers: { 
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ txid: body.txid })
      });

      if (!piResponse.ok) {
        const errorData = await piResponse.text();
        console.log(`[FRACTURE] Pi Server Rejected Completion:`, errorData);
        return NextResponse.json({ error: "Completion Failed" }, { status: 502 });
      }
      
      console.log(`[STRIKE COMPLETED] STEP #10 SEALED FOR TARGET: Alpha-Consort`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[FRACTURE] API Route Error:', error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}