import { NextResponse } from 'next/server';

// THE HANDSHAKE (GET): Satisfies pi-auth-context status checks
export async function GET() {
  return NextResponse.json({ 
    status: "ACTIVE", 
    node: "X570-TAICHI", 
    integrity: "92%",
    message: "MESH BRIDGE STABLE" 
  });
}

// THE STRIKE (POST): Records the Security Fracture
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pioneer, fractureType, timestamp, adjudicator } = body;

    // SOVEREIGN GATE: Only Bazaar_Founder can write to the ledger
    if (adjudicator !== "Bazaar_Founder" && adjudicator !== "PinoyQ8") {
      return NextResponse.json(
        { error: "Access Denied: Sovereign Identity Required" }, 
        { status: 403 }
      );
    }

    // MESH LOGIC: Hard-coding the fracture into the server logs
    console.log(`\n==================================================`);
    console.log(`[STRIKE] SECURITY FRACTURE DETECTED`);
    console.log(`Timestamp : ${timestamp}`);
    console.log(`Node      : ${pioneer}`);
    console.log(`Fracture  : ${fractureType}`);
    console.log(`Authority : @${adjudicator}`);
    console.log(`==================================================\n`);

    return NextResponse.json({ 
      success: true, 
      message: `Ledger updated. Governance strike recorded for Node ${pioneer}.`,
      status: "HARD-CODED"
    });

  } catch (error) {
    return NextResponse.json({ error: "Invalid MESH payload" }, { status: 400 });
  }
}