// src/pages/SimProtectionFlow.js
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // your Firebase auth instance
import LandingScreen from "../pages/simProtection/LandingScreen";
import FraudProtectionForm from "../pages/simProtection/FraudProtectionForm";
import SuccessScreen from "../components/simProtection/SuccessScreen";
import { useNavigate } from "react-router-dom";

export default function SimProtectionFlow() {
    const [step, setStep] = useState("info"); // info | form | success
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate("/login"); // redirect to login if not authenticated
            }
        });
        return unsubscribe;
    }, [navigate]);

    const handleStart = () => setStep("form");
    const handleSuccess = () => setStep("success");

    if (!user) return null; // or a loading spinner

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4">
            {step === "info" && <LandingScreen onStart={handleStart} />}
            {step === "form" && <FraudProtectionForm user={user} onSuccess={handleSuccess} />}
            {step === "success" && <SuccessScreen />}
        </div>
    );
}
