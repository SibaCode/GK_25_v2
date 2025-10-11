// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./i18n";

// Pages
import Register from "./newPages/Register";
import Login from "./newPages/Login";
import Dashboard from "./newPages/Dashboard";
import RegisterSimProtection from "./newPages/RegisterSimProtection";
import AlertsPage from "./newPages/AlertsPage";
import SimActivity from "./newPages/SimActivity";
import HomePage from "./newPages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home / Welcome page */}
        <Route
          path="/"
          element={
            <HomePage />
          }
        />

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* SIM Protection */}
        <Route path="/register-sim" element={<RegisterSimProtection />} />
        <Route path="/trigger" element={<SimActivity />} />

        {/* Alerts */}
        <Route path="/alerts" element={<AlertsPage />} />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
