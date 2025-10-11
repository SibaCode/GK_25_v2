// src/newUI/dashboard/DashboardLayout.js
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function DashboardLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => navigate("/"))
            .catch(err => console.error(err));
    };

    const activeClass = "bg-blue-700 text-white rounded-lg px-4 py-2";
    const inactiveClass = "text-gray-200 hover:bg-blue-600 hover:text-white rounded-lg px-4 py-2";

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-800 text-gray-200 flex flex-col p-6 space-y-6">
                <h2 className="text-2xl font-bold mb-6">SIM Protection</h2>
                <nav className="flex flex-col space-y-2">
                    <NavLink to="/dashboard/home" className={({ isActive }) => isActive ? activeClass : inactiveClass}>Home</NavLink>
                    <NavLink to="/dashboard/alerts" className={({ isActive }) => isActive ? activeClass : inactiveClass}>Alerts</NavLink>
                    <NavLink to="/dashboard/about" className={({ isActive }) => isActive ? activeClass : inactiveClass}>About</NavLink>
                    <NavLink to="/dashboard/safety" className={({ isActive }) => isActive ? activeClass : inactiveClass}>Safety & Compliance</NavLink>
                </nav>
                <button
                    className="mt-auto bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-2"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
