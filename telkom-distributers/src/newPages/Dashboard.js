import React, { useState, useEffect } from "react";
import { Plus, Bell, CreditCard, Shield, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import RegisterSimProtectionModal from "./RegisterSimProtectionModal";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("About Us");

  // ✅ Real-time user + simProtection data
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubDoc = onSnapshot(doc(db, "users", user.uid), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            // Merge simProtection fields for easy display
            setCurrentUser({
              ...data,
              ...data.simProtection,
            });
          }
          setLoading(false);
        });
        return () => unsubDoc();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading user data...</p>;
  if (!currentUser) return <p className="text-center mt-10">No user logged in</p>;

  const cards = [
    {
      title: "Registered SIMs",
      count: currentUser.selectedNumber ? 1 : 0,
      icon: <Shield className="w-8 h-8 text-white" />,
      color: "bg-blue-500",
      tooltip: "Click to manage your registered SIMs",
    },
    {
      title: "Active Alerts",
      count:
        currentUser.nextOfKinAlert || currentUser.emailAlert ? 1 : 0,
      icon: <Bell className="w-8 h-8 text-white" />,
      color: "bg-gray-600",
      link: "/alerts",
      tooltip: "View all active SIM alerts",
    },
    {
      title: "Linked Bank Accounts",
      count: currentUser.bankAccounts
        ? currentUser.bankAccounts.length
        : 0,
      icon: <CreditCard className="w-8 h-8 text-white" />,
      color: "bg-gray-500",
      link: "/bank",
      tooltip: "Add or manage your linked bank accounts",
    },
    {
      title: "Add New SIM",
      count: "",
      icon: <Plus className="w-8 h-8 text-white" />,
      color: "bg-blue-600",
      tooltip: "Register a new SIM for protection",
      onClick: () => setIsModalOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Info */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 sticky top-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {currentUser.fullName
                ? currentUser.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </div>
            <div>
              <h2 className="font-bold text-gray-700">
                {currentUser.fullName || "Unknown User"}
              </h2>
              <p className="text-sm text-gray-500">
                {currentUser.email || "-"}
              </p>
              <p className="text-sm text-gray-500">
                {currentUser.selectedNumber || "-"}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Next of Kin</h3>
            {currentUser.nextOfKin?.length ? (
              currentUser.nextOfKin.map((kin, idx) => (
                <div key={idx} className="text-sm text-gray-600 mb-1">
                  {kin.name} - {kin.number}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No next of kin added</p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Cards & Quick Links */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
              <div
                key={idx}
                title={card.tooltip}
                onClick={card.onClick}
                className={`cursor-pointer flex flex-col justify-between p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105 ${card.color}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-semibold">
                    {card.title}
                  </span>
                  {card.icon}
                </div>
                {card.count !== "" ? (
                  <span className="text-white text-3xl font-bold">
                    {card.count}
                  </span>
                ) : (
                  <span className="text-white font-medium mt-2">
                    Click to add
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-700 mb-2">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Register SIM
              </button>
              <Link
                to="/alerts"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                View Alerts
              </Link>
              <Link
                to="/bank"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Add Bank Account
              </Link>
            </div>
          </div>

          {/* About & Rules */}
         {/* Information Center Tabs */}
<div className="bg-white p-6 rounded-2xl shadow-sm text-gray-700">
  <h2 className="text-lg font-bold mb-4">Information Center</h2>

  <div className="border-b border-gray-200 mb-4 flex flex-wrap gap-4">
    {["About Us", "Legal & Compliance", "Accessibility", "Privacy Policy"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`pb-2 font-medium ${
          activeTab === tab
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* About Us */}
  {activeTab === "About Us" && (
    <div>
      <p className="text-sm leading-relaxed">
        Welcome to <strong>SimProtect</strong> — your trusted partner in SIM card and financial security.  
        We empower individuals to safeguard their personal information and linked accounts 
        against unauthorized access, fraud, and mobile threats.
      </p>
      <p className="text-sm mt-2">
        Our goal is to make digital safety simple, affordable, and accessible for everyone.
      </p>
    </div>
  )}

  {/* Legal & Compliance */}
  {activeTab === "Legal & Compliance" && (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Key Regulations</h3>
      <ul className="list-disc ml-6 text-sm space-y-1">
        <li>Compliant with South Africa’s POPIA data protection laws.</li>
        <li>Follows FSCA and ICASA regulations for telecom and financial data handling.</li>
        <li>Implements strong cybersecurity and consumer protection measures.</li>
      </ul>
      <p className="text-sm mt-3">
        SimProtect operates transparently and complies with both local and international 
        data protection and privacy standards.
      </p>
    </div>
  )}

  {/* Accessibility */}
  {activeTab === "Accessibility" && (
    <div>
      <p className="text-sm leading-relaxed">
        SimProtect is built with inclusivity in mind, ensuring usability for all users 
        regardless of ability, device, or environment.
      </p>
      <ul className="list-disc ml-6 text-sm space-y-1 mt-2">
        <li>Screen-reader and keyboard navigation friendly.</li>
        <li>High-contrast visuals for better visibility.</li>
        <li>Responsive design across all screen sizes.</li>
        <li>24/7 support via email and phone for assistance.</li>
      </ul>
    </div>
  )}

  {/* Privacy Policy */}
  {activeTab === "Privacy Policy" && (
    <div>
      <p className="text-sm leading-relaxed">
        Your privacy is our top priority. We only collect information necessary 
        to provide our services and protect your SIM and financial accounts.
      </p>
      <ul className="list-disc ml-6 text-sm space-y-1 mt-2">
        <li>We never sell or share your data with third parties without consent.</li>
        <li>Your information is stored securely using industry-standard encryption.</li>
        <li>You can request to update or delete your data at any time.</li>
        <li>All data is handled according to POPIA and GDPR compliance rules.</li>
      </ul>
      <p className="text-sm mt-3">
        For more details, contact our Data Protection Officer at 
        <a href="mailto:privacy@simprotect.co.za" className="text-blue-600 hover:underline ml-1">
          privacy@simprotect.co.za
        </a>.
      </p>
    </div>
  )}
</div>


        </div>
      </div>

      {/* Modal */}
      <RegisterSimProtectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
