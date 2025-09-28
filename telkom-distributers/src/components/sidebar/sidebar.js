import React from "react";

export default function Sidebar({ setActivePage, activePage }) {
    const menuItems = [
        { name: "Home", key: "home" },
        { name: "Register SIM", key: "register" },
        { name: "Alerts", key: "alerts" },
        { name: "Linked SIMs", key: "linked" },
        { name: "Profile", key: "profile" },
    ];

    return (
        <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
            <h2 className="text-2xl font-bold mb-8">SIM Alerts</h2>
            <ul className="space-y-4">
                {menuItems.map((item) => (
                    <li
                        key={item.key}
                        className={`cursor-pointer p-2 rounded hover:bg-gray-700 ${activePage === item.key ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActivePage(item.key)}
                    >
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
