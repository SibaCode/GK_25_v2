// src/components/layouts/DashboardLayout.js
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-auto">
                {/* Header */}
                <Header />

                {/* Page content */}
                <main className="p-6 flex-1">{children}</main>
            </div>
        </div>
    );
}
