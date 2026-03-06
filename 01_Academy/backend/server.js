/* BAZAAR_APP_V1: Server Approval Bridge 
   Domain: Neo Protocol / v23 Mainnet Readiness
*/

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// --- MESH SECURITY: CORS SHIELD ---
app.use(cors()); 
app.use(bodyParser.json());

const PI_API_KEY = 'YOUR_SECRET_BAZAAR_API_KEY';
const PI_API_URL = 'https://api.minepi.com/v2/payments';
const ledgerPath = 'J:/Project-Bazaar/02_Registry/Genesis_Ledger.json'; 

// --- MODULE 1: APPROVAL LOGIC ---
async function approveBazaarPayment(paymentId) {
    console.log(`[MESH-SCAN] Auditing Payment ID: ${paymentId}`);
    try {
        const response = await axios.post(`${PI_API_URL}/${paymentId}/approve`, {}, {
            headers: { 'Authorization': `Key ${PI_API_KEY}` }
        });
        return response.status === 200;
    } catch (error) {
        console.error(`[ADJUDICATOR ALERT] Approval Failed: ${error.message}`);
        return false;
    }
}

// --- MODULE 2: HANDSHAKE ENDPOINT ---
app.post('/approve-payment', async (req, res) => {
    const { paymentId } = req.body;
    const success = await approveBazaarPayment(paymentId);
    if (success) res.status(200).json({ message: "Approved" });
    else res.status(500).json({ error: "Approval Failed" });
});

// --- MODULE 3: GENESIS STATUS (Fixes the 404 Error) ---
app.get('/genesis-status', (req, res) => {
    try {
        const data = fs.readFileSync(ledgerPath, 'utf8');
        const ledger = JSON.parse(data);
        // Counting the length of the array in your J: Drive Ledger
        res.status(200).json({ count: ledger.length });
    } catch (err) {
        console.error("[BAZAAR TECH] Ledger read failed", err);
        res.status(200).json({ count: 0 }); // Fallback to 0 if file is missing
    }
});

// --- MODULE 4: LEDGER COMPLETION ---
app.post('/complete-handshake', (req, res) => {
    const { username, txid } = req.body;
    try {
        let ledger = [];
        if (fs.existsSync(ledgerPath)) {
            ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
        }
        
        // Prevent duplicates
        if (!ledger.find(p => p.username === username)) {
            ledger.push({
                username: username, 
                txid: txid, 
                timestamp: new Date().toISOString(), 
                status: "VERIFIED"
            });
            fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 4));
            console.log(`[SYNC SUCCESS] Genesis Pioneer Verified: ${username}`);
            res.status(200).json({ status: "SUCCESS" });
        } else {
            res.status(400).json({ status: "FAIL", message: "Duplicate" });
        }
    } catch (err) {
        res.status(500).json({ error: "Storage Error" });
    }
});

app.listen(3000, () => {
    console.log("------------------------------------------");
    console.log("[SYNC SUCCESS] Bazaar Backend Live on Port 3000");
    console.log(`[LEDGER] Pointed to: ${ledgerPath}`);
    console.log("------------------------------------------");
});