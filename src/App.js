// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom"; // no BrowserRouter here
import "./i18n";

// Pages
import Register from "./newPages/Register";
import Login from "./newPages/Login";
import Dashboard from "./newPages/Dashboard";
import RegisterSimProtection from "./newPages/RegisterSimProtection";
import AlertsPage from "./newPages/AlertsPage";
import SimActivity from "./newPages/SimActivity";
import HomePage from "./newPages/HomePage";
import SimFraud from "./newPages/SimFraud";
import DataBroker from "./newPages/DataBroker";
import CreditLock from "./newPages/CreditLock";
import MultiStepRegister from "./newPages/MultiStepRegister";
import Test from "./newPages/Test";


function App() {
  return (
    <Routes>
      {/* Home / Welcome page */}
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<Test />} />

      {/* Auth routes */}
      {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/register" element={<MultiStepRegister />} />

      
      <Route path="/login" element={<Login />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* SIM Protection */}
      <Route path="/register-sim" element={<RegisterSimProtection />} />
      <Route path="/trigger" element={<SimActivity />} />

      {/* Alerts */}
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/SimFraud" element={<SimFraud />} />
      <Route path="/DataBroker" element={<DataBroker />} />
      <Route path="/CreditLock" element={<CreditLock />} />


      {/* Redirect unknown routes to home */}
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
}

export default App;
