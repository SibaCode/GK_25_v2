// scripts/enhanceFraudCases.js
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    addDoc,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "../src/firebase.js"; // adjust relative path
  
  // 1. Normalize fraud cases
  const enhanceFraudCases = async () => {
    try {
      const fraudCasesRef = collection(db, "fraudCases");
      const snapshot = await getDocs(fraudCasesRef);
  
      for (const docSnap of snapshot.docs) {
        const caseData = docSnap.data();
        const caseRef = doc(db, "fraudCases", docSnap.id);
  
        const updates = {};
        if (!caseData.riskScore) updates.riskScore = 10;
        if (!caseData.blockedUntil) updates.blockedUntil = null;
        if (!caseData.status) updates.status = "Pending";
        if (!caseData.aiComment) updates.aiComment = "No unusual activity detected.";
  
        if (Object.keys(updates).length > 0) {
          await updateDoc(caseRef, updates);
        }
      }
  
      console.log("✅ Fraud cases normalized.");
    } catch (error) {
      console.error("❌ Error enhancing fraud cases:", error);
    }
  };
  
  // 2. Detect duplicates and add AI comments
  const detectDuplicatesAndAlert = async () => {
    try {
      const fraudCasesRef = collection(db, "fraudCases");
      const snapshot = await getDocs(fraudCasesRef);
  
      const simMap = {}; // simNumber => [caseIds]
  
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (!simMap[data.simNumber]) simMap[data.simNumber] = [];
        simMap[data.simNumber].push(docSnap.id);
      });
  
      for (const [simNumber, caseIds] of Object.entries(simMap)) {
        if (caseIds.length > 1) {
          // Add alert to fraudAlerts
          await addDoc(collection(db, "fraudAlerts"), {
            simNumber,
            alertType: "Duplicate SIM",
            caseNumbers: caseIds,
            createdAt: serverTimestamp(),
          });
  
          // Update each case with AI comment and increase risk
          for (const caseId of caseIds) {
            const caseRef = doc(db, "fraudCases", caseId);
            await updateDoc(caseRef, {
              riskScore: 50,
              status: "Under Review",
              aiComment: "⚠️ AI detected duplicate SIM usage. Review immediately.",
            });
          }
  
          console.log(`⚠️ Duplicate SIM detected: ${simNumber}`);
        } else {
          // Single SIM – AI comment can suggest low risk
          const caseRef = doc(db, "fraudCases", caseIds[0]);
          await updateDoc(caseRef, {
            aiComment: "✅ SIM appears normal, no immediate action needed.",
          });
        }
      }
  
      console.log("✅ Duplicate detection & AI comments finished.");
    } catch (error) {
      console.error("❌ Error detecting duplicates:", error);
    }
  };
  
  // 3. Auto-block high-risk SIMs
  const autoBlockHighRiskSIMs = async () => {
    try {
      const fraudCasesRef = collection(db, "fraudCases");
      const snapshot = await getDocs(fraudCasesRef);
  
      for (const docSnap of snapshot.docs) {
        const caseData = docSnap.data();
        if (caseData.riskScore >= 50 && caseData.status !== "Blocked") {
          const blockedUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hrs
          const caseRef = doc(db, "fraudCases", docSnap.id);
          await updateDoc(caseRef, {
            status: "Blocked",
            blockedUntil,
            aiComment: "🚫 High-risk SIM detected. Temporarily blocked by AI.",
          });
          console.log(`🚫 SIM ${caseData.simNumber} blocked until ${blockedUntil}`);
        }
      }
  
      console.log("✅ High-risk SIMs checked for blocking & AI comments added.");
    } catch (error) {
      console.error("❌ Error blocking SIMs:", error);
    }
  };
  
  // Run all AI checks
  const runEnhancement = async () => {
    console.log("🔎 Running AI Fraud Checks...");
    await enhanceFraudCases();
    await detectDuplicatesAndAlert();
    await autoBlockHighRiskSIMs();
    console.log("✅ AI Fraud Checks Completed.");
  };
  
  runEnhancement();
  