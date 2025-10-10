// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Register from "./newPages/Register";
import Login from "./newPages/Login";
import Dashboard from "./newPages/Dashboard";
import RegisterSimProtection from "./newPages/RegisterSimProtection";
import AlertsPage from "./newPages/AlertsPage";
import SimActivity from "./newPages/SimActivity";
function App() {
  return (
    <Router>
      <Routes>
        {/* Home / Register */}
        <Route path="/register" element={<Register />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Register SIM */}
        <Route path="/register-sim" element={<RegisterSimProtection />} />
                                <Route path="trigger" element={<SimActivity />} />

        {/* Default route */}
        <Route
          path="/y"
          element={
            <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
              <h1 className="text-3xl font-bold text-blue-700 text-center">
                Welcome to SIM Protection
              </h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
