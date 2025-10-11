// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          Welcome to SIM Protection
        </h1>
        <p className="text-gray-600 mb-6">
          Protect your SIM from fraud. Quickly register your number and set up alerts.
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register SIM
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/alerts")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            View Alerts
          </motion.button>
        </div>
      </motion.div>

      {/* Optional info at bottom */}
      <p className="text-gray-500 text-sm mt-6 text-center max-w-xs">
        Your data is secure and protected. Stay alert to prevent SIM fraud.
      </p>
    </div>
  );
};

export default HomePage;
