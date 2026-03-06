import 'dotenv/config';
import { Horizon } from 'stellar-sdk';

// Connect to Pi Mainnet
const server = new Horizon.Server('https://api.mainnet.minepi.com');

async function verify10of10() {
    console.log("------------------------------------");
    console.log("[MESH-SCAN] Initiating ESM Blockchain Handshake...");
    
    try {
        // Pull the Public Key from the Vault (.env)
        const publicKey = process.env.BZR_PUBLIC_KEY;
        
        if (!publicKey) {
            throw new Error("BZR_PUBLIC_KEY not found in .env");
        }

        const account = await server.loadAccount(publicKey);
        const piBalance = account.balances.find(b => b.asset_type === 'native').balance;
        
        console.log("10/10 VERIFIED: BZR DAO IS LIVE");
        console.log("NODE ADDRESS: " + account.id);
        console.log("VAULT BALANCE: " + piBalance + " PI");
        console.log("------------------------------------");
    } catch (err) {
        console.log("LOGIC GAP: " + err.message);
        console.log("------------------------------------");
    }
}

verify10of10();