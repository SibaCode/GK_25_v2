// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Pages
import MainDashboard from "./pages/MainDashboard";
import FraudManagement from "./pages/FraudManagement";
import EWasteManagement from "./pages/EWasteManagement";
import Community from "./pages/Community";
import Reports from "./pages/Reports";
import SalesManagement from "./pages/SalesManagement";
import PromotionsManagement from "./pages/PromotionsManagement";
import SurveysManagement from "./pages/SurveysManagement";
import LearningHubManagement from "./pages/LearningHubManagement";
import SurveyPage from "./pages/SurveyPage";
import SimProtectionFlow from "./pages/SimProtectionFlow";
import SimProtectionDashboard from "./pages/dashboard/SimProtectionDashboard";

// Dashboard Components
import DashboardHome from "./components/dashboard/DashboardHome";
import AlertsPage from "./components/dashboard/AlertsPage";
import LinkedSims from "./components/dashboard/LinkedSims";
import ProfilePage from "./components/dashboard/ProfilePage";
import RegisterSimProtection from "./components/simProtection/RegisterSimProtection";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Auth Pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen for Firebase auth changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard/home" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard/home" />} />
                <Route path="/" element={<SimProtectionFlow />} />

                {/* Dashboard Routes (Protected) */}
                <Route
                    path="/dashboard/*"
                    element={user ? (
                        <DashboardLayout>
                            <Routes>
                                <Route path="home" element={<DashboardHome />} />
                                <Route path="registerSim" element={<RegisterSimProtection />} />
                                <Route path="alerts" element={<AlertsPage />} />
                                <Route path="linked" element={<LinkedSims />} />
                                <Route path="profile" element={<ProfilePage />} />
                            </Routes>
                        </DashboardLayout>
                    ) : (
                        <Navigate to="/login" />
                    )}
                />

                {/* Other App Routes */}
                <Route path="/main" element={<MainDashboard />} />
                <Route path="/fraud" element={<FraudManagement />} />
                <Route path="/e-waste" element={<EWasteManagement />} />
                <Route path="/learning" element={<LearningHubManagement />} />
                <Route path="/community" element={<Community />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/sales" element={<SalesManagement />} />
                <Route path="/promotions" element={<PromotionsManagement />} />
                <Route path="/surveys" element={<SurveysManagement />} />
                <Route path="/survey/:id" element={<SurveyPage />} />
                <Route path="/simflow" element={<SimProtectionFlow />} />
                <Route path="/simdashboard" element={<SimProtectionDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
