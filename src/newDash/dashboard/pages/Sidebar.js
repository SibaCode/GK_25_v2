import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const links = [
        { name: "Home", path: "/new/home" },
        { name: "Alerts", path: "/new/alerts" },
        { name: "Safety & Compliance", path: "/new/safety" },
        { name: "About", path: "/new/about" },
        { name: "Register SIM", path: "/new/registerSim" },
    ];

    return (
        <div className="w-64 bg-[#1E40AF] min-h-screen text-white flex flex-col p-4 space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center">SIM Protection</h2>
            {links.map((link) => (
                <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                        `block px-4 py-2 rounded hover:bg-[#2563EB] transition ${
                            isActive ? "bg-[#2563EB] font-semibold" : ""
                        }`
                    }
                >
                    {link.name}
                </NavLink>
            ))}
        </div>
    );
}
