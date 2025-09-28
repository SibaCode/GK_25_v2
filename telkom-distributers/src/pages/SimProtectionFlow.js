import React, { useState } from "react";
import LandingScreen from "./simProtection/LandingScreen";
import FraudProtectionForm from "./simProtection/FraudProtectionForm";
import SuccessScreen from "./simProtection/SuccessScreen";

export default function SimProtectionFlow() {
    const [step, setStep] = useState("info"); // info | form | success

    const handleStart = () => setStep("form");
    const handleSuccess = () => setStep("success");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4">
            {step === "info" && <LandingScreen onStart={handleStart} />}
            {step === "form" && <FraudProtectionForm onSuccess={handleSuccess} />}
            {step === "success" && <SuccessScreen />}
        </div>
    );
}
