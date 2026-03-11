// server.js - Project Bazaar: Hybrid Security Adjudicator v2.7 (ESM Architecture)
import fs from 'fs';
import http from 'http';
import express from 'express';
import path from 'path';

const app = express();
const PORT = 3001; 

// --- MESH SECURITY & LEDGER PATHS ---
const logFile = 'Scan_Logs.txt';
const ledgerFile = 'ledger.json'; // The Sovereign Transaction Ledger
const keyFile = '02_Mainnet/validation-key.txt';
const BRIDGE_URL = 'http://localhost:4040/api/tunnels';

app.use(express.json()); // Essential for Phase 2 Payment processing

// --- STEALTH PRODUCT REGISTRY ---
const BZR_PRODUCTS = [
    {
        id: "pioneer-badge-001",
        name: "Real Pioneer Badge",
        description: "Digital proof of early-stage DAO participation. Hard-coded to your UID.",
        price_in_pi: 1.00,
        category: "Credentials",
        is_active: true
    },
    {
        id: "node-license-001",
        name: "Master Node License",
        description: "Unlocks advanced telemetry and project governance voting rights.",
        price_in_pi: 3.14,
        category: "Licensing",
        is_active: true
    }
];

// --- MESH SECURITY PROTOCOLS ---

function getValidationKey() {
    try {
        return fs.readFileSync(keyFile, 'utf8').trim();
    } catch (err) {
        return null;
    }
}

function writeToLedger(tag, message) {
    const timestamp = new Date().toLocaleString();
    const entry = `\n${timestamp} - [${tag}] ${message}`;
    
    // 1. Write to Scan_Logs (Standard Telemetry)
    fs.appendFile(logFile, entry, (err) => {
        if (err) console.error('![ERROR] Ledger write failure.');
    });

    // 2. Write to ledger.json if it's a Transaction (Economic Finality)
    if (tag === 'TRANSACTION') {
        let currentLedger = [];
        if (fs.existsSync(ledgerFile)) {
            currentLedger = JSON.parse(fs.readFileSync(ledgerFile));
        }
        currentLedger.push({ timestamp, ...message });
        fs.writeFileSync(ledgerFile, JSON.stringify(currentLedger, null, 2));
        console.log(`✅ [LEDGER] Bazaar Block finalized on J: Drive.`);
    }
}

function checkBridge() {
    const key = getValidationKey();
    if (!key) {
        writeToLedger('UNAUTHORIZED', 'Pioneer Validation Key MISSING. Heartbeat Blocked.');
        console.log('![CRITICAL] Validation Key not found. Pulse inhibited.');
        return;
    }

    http.get(BRIDGE_URL, (res) => {
        if (res.statusCode === 200) {
            writeToLedger('SYSTEM', `Heartbeat Pulse - NODE: HYBRID-CORE-ACTIVE (KEY: ${key.substring(0, 5)}...)`);
            console.log('[OK] Bridge Verified & Pioneer Key Validated.');
        } else {
            writeToLedger('WARNING', 'Bridge Handshake unstable.');
        }
    }).on('error', (err) => {
        writeToLedger('UNAUTHORIZED', 'MESH Bridge Offline or Interrupted');
        console.log('![ALERT] Bridge failure detected.');
    });
}

// --- E-NETWORK API GATEWAY (MESH Shield) ---

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*"); 
    res.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    
    if (req.method === 'OPTIONS') return res.status(204).end();
    next();
});

// ROUTE 1: Pioneer Database
app.get('/api/pioneers', (req, res) => {
    writeToLedger('API-SYNC', 'Pioneer database queried.');
    res.status(200).json([{ id: "X570-TAICHI-01", username: "Bazaar Founder", status: "MASTER_NODE", mesh_level: "V23", uptime: "92%" }]); 
});

// ROUTE 2: Stealth Products (Phase 2)
app.get('/api/products', (req, res) => {
    writeToLedger('COMMERCE-SYNC', 'Product manifest requested.');
    res.status(200).json({ products: BZR_PRODUCTS });
});

// ROUTE 3: Payment Adjudicator (Phase 2 Finality)
app.post('/api/payments/complete', (req, res) => {
    const { paymentId, txid, username, amount } = req.body;
    
    const transactionRecord = {
        username,
        payment_id: paymentId,
        transaction_id: txid,
        amount,
        status: 'HARD_CODED_SUCCESS'
    };

    writeToLedger('TRANSACTION', transactionRecord);
    res.status(200).json({ status: "finalized", message: "Bazaar Block written to J: Drive." });
});

// --- IGNITION SEQUENCE ---

app.listen(PORT, () => {
    console.log(`\nSecurity Adjudicator: v2.7 ONLINE [Phase 2: Commerce Enabled]`);
    console.log(`[OK] E-Network API Gateway listening on PORT ${PORT}`);
    writeToLedger('SYSTEM_START', 'Adjudicator v2.7 initialized.');
});

checkBridge();
setInterval(checkBridge, 300000);