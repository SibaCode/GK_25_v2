// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
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

// New pages with sidebar
// import Overview from "./newPages/Overview";
// import Protection from "./newPages/Protection";
// import Accounts from "./newPages/Accounts";
// import Documents from "./newPages/Documents";

function App() {
  return (
    <Routes>
      {/* Home / Welcome page */}
      <Route path="/" element={<HomePage />} />
      <Route path="/test" element={<Test />} />

      {/* Auth routes */}
      <Route path="/register" element={<MultiStepRegister />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard & Protected Pages with Sidebar */}
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/overview" element={<Overview />} />
      <Route path="/protection" element={<Protection />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/documents" element={<Documents />} /> */}

      {/* SIM Protection */}
      <Route path="/register-sim" element={<RegisterSimProtection />} />
      <Route path="/trigger" element={<SimActivity />} />

      {/* Alerts */}
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/SimFraud" element={<SimFraud />} />
      <Route path="/DataBroker" element={<DataBroker />} />
      <Route path="/CreditLock" element={<CreditLock />} />
    </Routes>
  );
}

export default App;