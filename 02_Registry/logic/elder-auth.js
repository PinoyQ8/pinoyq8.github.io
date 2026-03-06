import express from 'express';
import fs from 'fs';
const app = express();
app.use(express.json());

const REGISTRY_FILE = "J:\\Project-Bazaar\\02_Registry\\Genesis_Ledger.json";

app.post('/api/elder-verify', (req, res) => {
    const { uid } = req.body;
    try {
        const ledger = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
        const elder = ledger.find(p => p.uid === uid && p.role === "Council of Elders");

        if (elder) {
            console.log(`[GATE] Access GRANTED: Elder ${uid}`);
            res.json({ authorized: true, redirect: "/01_Academy/council-chamber.html" });
        } else {
            console.log(`[GATE] Access DENIED: ${uid} (Insufficient Clearance)`);
            res.json({ authorized: false, message: "ADJUDICATOR: Access Denied. Council Status Required." });
        }
    } catch (err) {
        res.status(500).json({ error: "Registry Link Failed" });
    }
});

app.listen(3003, () => console.log("[MESH-SCAN] Elder-Gate Active on Port 3003"));