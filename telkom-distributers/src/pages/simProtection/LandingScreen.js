// src/components/LandingScreen.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, AlertTriangle, Banknote } from "lucide-react";

export default function LandingScreen() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login"); // Redirect to your login route
    };

    return (
        <div className="max-w-2xl text-center space-y-8 p-6">
            <h1 className="text-4xl font-bold">Telkom SIM Protection</h1>
            <p className="text-lg text-blue-100">
                We instantly notify your banks, insurers, and apps when unusual activity is detected.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
                <div className="bg-white rounded-2xl p-4 shadow flex flex-col items-center">
                    <ShieldCheck className="w-10 h-10 text-blue-600 mb-2" />
                    <p className="font-semibold">Stop SIM Swap Fraud</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow flex flex-col items-center">
                    <AlertTriangle className="w-10 h-10 text-yellow-600 mb-2" />
                    <p className="font-semibold">Instant Alerts</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow flex flex-col items-center">
                    <Banknote className="w-10 h-10 text-green-600 mb-2" />
                    <p className="font-semibold">Auto-Notify Banks</p>
                </div>
            </div>

            <button
                onClick={handleLogin}
                className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow hover:bg-blue-100 transition"
            >
                Login
            </button>
        </div>
    );
}
