import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Database } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-poppins">
            {/* Navbar */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Shield className="text-blue-600 w-8 h-8" />
                        <h1 className="text-2xl font-bold text-blue-600">SimSure</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-blue-50 to-blue-100">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-blue-700">
                    Protect Your SIM. Protect Your Identity.
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mb-8">
                    SimSure gives you the tools to stop SIM swap fraud, lock your credit
                    file, and remove your personal data from brokers — all in one secure
                    SaaS platform.
                </p>
                <Link
                    to="/register"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium shadow hover:bg-blue-700 transition"
                >
                    Get Started
                </Link>
            </header>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    <div className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition">
                        <BellIcon />
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">
                            SIM Fraud Alert & Auto Block
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Detect suspicious SIM activity and automatically block connected
                            accounts before fraud happens.
                        </p>
                    </div>

                    <div className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition">
                        <Lock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">
                            Credit File Lock
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Instantly lock your credit file to stop unauthorized checks or
                            applications in your name.
                        </p>
                    </div>

                    <div className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition">
                        <Database className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">
                            Data Broker Removal
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Automatically find and remove your data from online broker
                            databases and marketing lists.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
                © {new Date().getFullYear()} SimSure. All rights reserved.
            </footer>
        </div>
    );
}

// Simple bell icon to keep dependencies light
function BellIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-blue-600 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
        </svg>
    );
}
