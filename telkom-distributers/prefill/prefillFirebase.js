/**
 * Prefill Firebase Firestore + Storage with sample data for hackathon
 * Run once: node prefillFirebase.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 1?? Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Download from Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "hackathonmvpv2.firebasestorage.app" // Your Firebase Storage bucket
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function main() {
    try {
        console.log("Starting Firebase prefill...");

        // 2?? Add a sample customer
        const customerRef = db.collection('customers').doc('customer1');
        await customerRef.set({
            fullName: 'John Doe',
            saId: '8001015009087'
        });

        // 3?? Add linked SIMs
        const sims = [
            { number: '0821234567', provider: 'Vodacom', imei: 'X123', status: 'Active', lastActive: new Date() },
            { number: '0827654321', provider: 'MTN', imei: 'Y456', status: 'Active', lastActive: new Date() }
        ];

        for (const sim of sims) {
            await customerRef.collection('linkedSIMs').doc(sim.number).set(sim);
        }

        // 4?? Create a dummy CAS PDF file
        const localCASPath = path.join(__dirname, 'dummy_cas.pdf');
        fs.writeFileSync(localCASPath, 'This is a dummy CAS affidavit file for hackathon.');

        // Upload CAS to Firebase Storage
        const storageRef = bucket.file('fraudCases/case1/cas.pdf');
        await bucket.upload(localCASPath, {
            destination: storageRef,
            metadata: { contentType: 'application/pdf' }
        });
        const casURL = `gs://${bucket.name}/fraudCases/case1/cas.pdf`;

        // 5?? Add a sample fraud case
        const fraudRef = db.collection('fraudCases').doc('case1');
        await fraudRef.set({
            customerId: 'customer1',
            simId: '0821234567',
            description: 'SIM swap attempt detected',
            evidenceFiles: [casURL],
            itcNumber: 'ITC-2025-0001',
            itcIssued: true,
            casNumber: 'CAS-2025-001',
            status: 'CAS Uploaded',
            timeline: [
                { date: new Date(), action: 'Fraud Report Submitted', actor: 'Customer', notes: '' },
                { date: new Date(), action: 'ITC Issued & SIM Blocked', actor: 'System', notes: '' },
                { date: new Date(), action: 'CAS Uploaded', actor: 'Customer', notes: '' }
            ]
        });

        // 6?? Add a sample notification
        await db.collection('notifications').doc('notif1').set({
            caseId: 'case1',
            userId: 'customer1',
            message: 'Your SIM has been blocked and ITC issued.',
            read: false,
            date: new Date()
        });

        console.log("Firebase prefill completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error pre-filling Firebase:", err);
        process.exit(1);
    }
}

main();
