import express from 'express'; // Modern MESH syntax
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser'; // [STAT] Required for Merchant Database access
import cors from 'cors';       // [STAT] Required to bridge the Browser-to-Port gap

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- MESH SECURITY: CORS & PARSING ---
app.use(cors()); // Resolves the "Null Origin" and Port 5500 conflicts
app.use(express.json());

// Target: Permanent J: Drive Storage
const REGISTRY_FILE = "J:\\Project-Bazaar\\02_Registry\\Genesis_Ledger.json";
const MERCHANT_DB = "J:\\Project-Bazaar\\03_Economic\\logic\\Merchants_List.csv";

// ==========================================
// 1. DATA SYNC: WRITE TO LEDGER
// ==========================================
app.post('/02_Registry/sync', (req, res) => {
    console.log(`[MESH-SCAN] Incoming Handshake: ${req.body.uid}`);
    
    try {
        let ledger = [];
        if (fs.existsSync(REGISTRY_FILE)) {
            ledger = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
        }

        ledger.push({
            ...req.body,
            server_verified_at: new Date().toISOString()
        });

        fs.writeFileSync(REGISTRY_FILE, JSON.stringify(ledger, null, 4));
        res.status(200).send("SYNCED");
    } catch (error) {
        console.error("CRITICAL: J: Drive Write Failed", error);
        res.status(500).send("ERROR");
    }
});

// ==========================================
// 2. PIONEER KEY VERIFICATION (ACCESS CONTROL)
// ==========================================
app.post('/api/verify-pioneer', async (req, res) => {
    const { pioneerKey } = req.body;
    
    const validKeys = [
        "BZR-A8F2-9C1D-4E5F", // Pioneer-002
        "BZR-B7E3-8D2A-5F6G", // Pioneer-003
        "BZR-C6D4-7E3B-6G7H", // Pioneer-004
        "BZR-D5C5-6F4C-7H8I", // Pioneer-005
        "BZR-E4B6-5G5D-8I9J"  // Pioneer-006
    ];

    if (validKeys.includes(pioneerKey)) {
        console.log(`[SYNC] Real Pioneer Authenticated: ${pioneerKey}`);
        res.status(200).json({ 
            status: "SUCCESS", 
            message: "Genesis (100) Protocol Authorized. Welcome, Pioneer.",
            mesh_clearance: true
        });
    } else {
        console.warn(`[MESH-SCAN] Invalid Key Attempt: ${pioneerKey}`);
        res.status(403).json({ 
            status: "REJECTED", 
            message: "Adjudicator Alert: Invalid or Expired Pioneer Key.",
            mesh_clearance: false
        });
    }
});

// ==========================================
// 3. AMBASSADOR MERCHANT SEARCH (ECONOMIC BRIDGE)
// ==========================================
app.get('/api/search-merchants', (req, res) => {
    const results = [];
    
    if (!fs.existsSync(MERCHANT_DB)) {
        console.error(`[MESH-SCAN] Database Missing: ${MERCHANT_DB}`);
        return res.status(404).json({ error: "Merchant Database Offline" });
    }

    fs.createReadStream(MERCHANT_DB)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(`[SYNC] Merchant DB Search Success. Found ${results.length} entries.`);
            res.status(200).json(results);
        })
        .on('error', (err) => {
            console.error("[ADJUDICATOR ALERT] CSV Stream Failed", err);
            res.status(500).json({ error: "Internal Database Error" });
        });
});

// ==========================================
// 4. GENESIS STATUS: THE PI SYNC BRIDGE
// ==========================================
app.get('/genesis-status', (req, res) => {
    try {
        if (fs.existsSync(REGISTRY_FILE)) {
            const data = fs.readFileSync(REGISTRY_FILE, 'utf8');
            const ledger = JSON.parse(data);
            res.status(200).json({ count: ledger.length });
        } else {
            res.status(200).json({ count: 0 });
        }
    } catch (error) {
        console.error("[MESH-SCAN] Telemetry Error", error);
        res.status(500).json({ error: "Storage Unreachable" });
    }
});

// ==========================================
// 5. SERVER IGNITION
// ==========================================
const PORT = 3001;
app.listen(PORT, () => {
    console.log("------------------------------------------");
    console.log(`[BAZAAR DAO] X570 COMMAND CENTER ACTIVE`);
    console.log(`[GATEWAY] Listening on Port: ${PORT}`);
    console.log(`[STORAGE] Target: ${REGISTRY_FILE}`);
    console.log(`[VAULT] Merchant DB: ${MERCHANT_DB}`);
    console.log("------------------------------------------");
});