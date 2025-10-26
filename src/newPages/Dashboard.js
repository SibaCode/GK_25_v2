// src/newPages/Dashboard.js
import React, { useState, useEffect } from "react";
import {
    Bell,
    LogOut,
    Menu,
    X,
    Shield,
    Lock,
    Zap,
    CheckCircle,
    Smartphone
} from "lucide-react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import AlertHistoryModal from "./AlertHistoryModal";
import RegisterSimProtectionModal from "./RegisterSimProtectionModal";

export default function Dashboard() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [openModal, setOpenModal] = useState(null); // "register" | "view" | "edit" | "alerts"
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const fetchCurrentUser = (userId) => {
        const docRef = doc(db, "users", userId);
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) setCurrentUser(docSnap.data());
            setLoading(false);
        });
    };

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                const unsubscribeSnapshot = fetchCurrentUser(user.uid);
                return () => unsubscribeSnapshot();
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    };

    const handleManageSim = () => setOpenModal("register");
    const handleViewAlerts = () => setOpenModal("alerts");

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading your dashboard...</p>
            </div>
        </div>
    );

    if (!currentUser) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <p className="text-gray-600">No user data found.</p>
        </div>
    );

    const activeAlerts = currentUser.activeAlertsArray || [];
    const protectedSIM = currentUser.simProtection?.simNumber ? 1 : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm border-b p-4 sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">SimSure</h1>
                                <p className="text-xs text-gray-500">FSP License #123456</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleViewAlerts}
                        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 lg:p-6">
                {/* Sidebar */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">SimSure</h1>
                            <p className="text-xs text-gray-500">FSP License #123456</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <button onClick={handleManageSim} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-100 text-blue-700 transition font-medium w-full">
                            <Bell className="w-5 h-5" />
                            SIM Swap Alerts
                        </button>
                        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-100 text-green-700 transition font-medium w-full">
                            <Lock className="w-5 h-5" />
                            Credit File Lock
                        </button>
                        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-100 text-purple-700 transition font-medium w-full">
                            <Zap className="w-5 h-5" />
                            Data Removal Services
                        </button>
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="mt-auto flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Welcome Header */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome back, {currentUser.firstName || currentUser.fullName?.split(" ")[0] || "User"}!
                            </h1>
                            <p className="text-gray-600 mt-1">Policy #POL-{currentUser.uid?.slice(-8).toUpperCase() || "ACTIVE"}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-600 animate-pulse" />
                    </div>

                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-green-100 to-green-300 shadow-lg rounded-lg p-5 hover:scale-105 transform transition cursor-pointer">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Protected SIMs</h3>
                                <Smartphone className="w-6 h-6 text-green-700" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{protectedSIM}</p>
                            <button onClick={handleManageSim} className="mt-3 text-sm text-green-800 font-medium hover:underline flex items-center gap-1">
                                Manage SIM <Shield className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="bg-gradient-to-r from-blue-100 to-blue-300 shadow-lg rounded-lg p-5 hover:scale-105 transform transition cursor-pointer">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Active Alerts</h3>
                                <Bell className="w-6 h-6 text-blue-700" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{activeAlerts.length}</p>
                            <button onClick={handleViewAlerts} className="mt-3 text-sm text-blue-800 font-medium hover:underline flex items-center gap-1">
                                View Alerts <Bell className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="bg-gradient-to-r from-purple-100 to-purple-300 shadow-lg rounded-lg p-5 hover:scale-105 transform transition cursor-pointer">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Security Score</h3>
                                <Shield className="w-6 h-6 text-purple-700" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">100%</p>
                            <p className="text-purple-700 text-sm mt-1">Excellent</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {openModal === "register" && (
                <RegisterSimProtectionModal
                    isOpen={true}
                    onClose={() => {
                        setOpenModal(null);
                        // refresh current user data
                        if (auth.currentUser) {
                            const docRef = doc(db, "users", auth.currentUser.uid);
                            onSnapshot(docRef, (docSnap) => {
                                if (docSnap.exists()) setCurrentUser(docSnap.data());
                            });
                        }
                    }}
                />
            )}

            {isAlertModalOpen && (
                <AlertHistoryModal
                    onClose={() => setIsAlertModalOpen(false)}
                    userData={currentUser}
                />
            )}
        </div>
    );
}
