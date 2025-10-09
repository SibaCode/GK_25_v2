// src/newDash/dashboard/Dashboard.js
import React from "react";
import { Plus, Bell, CreditCard, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard({ user }) {
  const currentUser = user || {
    fullName: "Mvubu Siba",
    email: "mvubusiba@gmail.com",
    phone: "0812345678",
    nextOfKin: [{ name: "John Doe", number: "0823456789" }],
    registeredSIMs: 2,
    activeAlerts: 5,
    linkedBanks: 1,
  };

  const cards = [
    { 
      title: "Registered SIMs", 
      count: currentUser.registeredSIMs, 
      icon: <Shield className="w-8 h-8 text-white" />, 
      color: "bg-blue-500", 
      link: "/register",
      tooltip: "Click to manage your registered SIMs"
    },
    { 
      title: "Active Alerts", 
      count: currentUser.activeAlerts, 
      icon: <Bell className="w-8 h-8 text-white" />, 
      color: "bg-gray-600", 
      link: "/alerts",
      tooltip: "View all active SIM alerts"
    },
    { 
      title: "Linked Bank Accounts", 
      count: currentUser.linkedBanks, 
      icon: <CreditCard className="w-8 h-8 text-white" />, 
      color: "bg-gray-500", 
      link: "/bank",
      tooltip: "Add or manage your linked bank accounts"
    },
    { 
      title: "Add New SIM", 
      count: "", 
      icon: <Plus className="w-8 h-8 text-white" />, 
      color: "bg-blue-600", 
      link: "/register",
      tooltip: "Register a new SIM for protection"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* User Info / Next of Kin */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 sticky top-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {currentUser.fullName.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <h2 className="font-bold text-gray-700">{currentUser.fullName}</h2>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
              <p className="text-sm text-gray-500">{currentUser.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Next of Kin</h3>
            {currentUser.nextOfKin.map((kin, idx) => (
              <div key={idx} className="text-sm text-gray-600 mb-1">
                {kin.name} - {kin.number}
              </div>
            ))}
          </div>
        </div>

        {/* Cards & Quick Links */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
              <Link
                key={idx}
                to={card.link}
                title={card.tooltip}
                className={`flex flex-col justify-between p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105 ${card.color}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-semibold">{card.title}</span>
                  {card.icon}
                </div>
                {card.count !== "" ? (
                  <span className="text-white text-3xl font-bold relative">
                    {card.count}
                    {card.title === "Active Alerts" && card.count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {card.count}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-white font-medium mt-2">Click to add</span>
                )}
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-700 mb-2">Quick Actions</h2>
            <p className="text-sm text-gray-500 mb-3">Get to your main actions quickly</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Register SIM</Link>
              <Link to="/alerts" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">View Alerts</Link>
              <Link to="/bank" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">Add Bank Account</Link>
            </div>
          </div>

          {/* About Us */}
          <div className="bg-white p-6 rounded-2xl shadow-sm text-gray-700">
            <h2 className="text-lg font-bold mb-2">About Us</h2>
            <p className="text-sm">
              We provide SIM protection services to secure your mobile line and linked accounts. Stay safe and in control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
