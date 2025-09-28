// src/components/layouts/DashboardLayout.js
import React from "react";
import Sidebar from "../sidebar/sidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 overflow-auto">{children}</div>
        </div>
    );
}
