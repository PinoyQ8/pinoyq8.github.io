import crypto from 'crypto';
import fs from 'fs';

// Target: Recruitment Archive
const KEY_LOG = "J:\\Project-Bazaar\\02_Registry\\logic\\Issued_Keys.log";

const generatePioneerKey = (pioneerName) => {
    const timestamp = new Date().toISOString();
    const secret = "Bazaar-MESH-v23"; // Internal Salt
    
    // Generate unique 16-character hex key
    const hash = crypto.createHmac('sha256', secret)
                   .update(`${pioneerName}-${timestamp}`)
                   .digest('hex')
                   .substring(0, 16).toUpperCase();

    const entry = `[${timestamp}] PIONEER: ${pioneerName} | KEY: BZR-${hash}\n`;
    
    try {
        fs.appendFileSync(KEY_LOG, entry);
        
        console.log(`------------------------------------------`);
        console.log(`[ADJUDICATOR] KEY GENERATED FOR: ${pioneerName}`); // Corrected: console.log
        console.log(`KEY: BZR-${hash}`);
        console.log(`FILE: validation-key.txt (Deliver to Pioneer)`);
        console.log(`------------------------------------------`);
    } catch (err) {
        console.error("CRITICAL: J: Drive Write Failed", err);
    }
};

const name = process.argv[2];
if (name) {
    generatePioneerKey(name);
} else {
    console.log("Usage: node generate-keys.js <Pioneer_Name>");
}