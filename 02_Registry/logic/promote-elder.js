import fs from 'fs';
import path from 'path';

// Target: Permanent J: Drive Storage
const REGISTRY_FILE = "J:\\Project-Bazaar\\02_Registry\\Genesis_Ledger.json";

const promoteToElder = (pioneerUID) => {
    try {
        if (!fs.existsSync(REGISTRY_FILE)) {
            console.error("> ERROR: Genesis Ledger not found at target path.");
            return;
        }

        let ledger = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
        const index = ledger.findIndex(p => p.uid === pioneerUID || p.pioneer === pioneerUID);

        if (index !== -1) {
            // Status Hard-Coding
            ledger[index].role = "Council of Elders";
            ledger[index].governance_clearance = "LEVEL_01";
            ledger[index].promoted_at = new Date().toISOString();

            fs.writeFileSync(REGISTRY_FILE, JSON.stringify(ledger, null, 4));
            console.log(`------------------------------------------`);
            console.log(`[ADJUDICATOR] UID: ${pioneerUID} PROMOTED`);
            console.log(`[STATUS] Member of the Council of Elders`);
            console.log(`------------------------------------------`);
        } else {
            console.log(`> MESH-SCAN: UID "${pioneerUID}" not found in Genesis Ledger.`);
        }
    } catch (error) {
        console.error("> CRITICAL: Adjudication Write Failure", error);
    }
};

const targetUID = process.argv[2];
if (targetUID) {
    promoteToElder(targetUID);
} else {
    console.log("Usage: node promote-elder.js <Pioneer_UID_or_Name>");
}