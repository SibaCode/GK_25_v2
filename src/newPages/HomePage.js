// src/newPages/WelcomePage.js
import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-4xl w-full p-8 lg:p-16 text-center">
        {/* Heading */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
          Welcome to SIMProtect
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm lg:text-base mb-8 leading-relaxed">
          SIMProtect is your trusted partner in keeping your SIM cards secure. 
          Track your SIMs, receive instant alerts for suspicious activity, and 
          protect your banking and personal information. Join thousands of users 
          who trust SIMProtect to safeguard their digital life.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition text-sm sm:text-base"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-6 py-3 rounded-xl shadow-md transition border border-blue-600 text-sm sm:text-base"
          >
            Register
          </Link>
        </div>

        {/* Footer / extra info */}
        <p className="text-gray-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} SIMProtect. All rights reserved.
        </p>
      </div>
    </div>
  );
}
