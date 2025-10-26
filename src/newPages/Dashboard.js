// src/newPages/Dashboard.js
import React, { useState, useEffect } from "react";
import { 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  FileText, 
  User, 
  Phone, 
  Calendar, 
  Mail,
  Lock, 
  Zap,
  CheckCircle,
  BarChart3,
  CreditCard,
  ShieldCheck,
  BanknoteIcon,
  Settings,
  MapPin,
  IdCard,
  Smartphone
} from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import AlertHistoryModal from "./AlertHistoryModal";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { t, i18n } = useTranslation();

  // Fetch user from Firestore and listen for changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
          }
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Update i18n language based on user's preferredLanguage
  useEffect(() => {
    if (currentUser?.preferredLanguage) {
      i18n.changeLanguage(currentUser.preferredLanguage);
    }
  }, [currentUser, i18n]);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "R0";
    const num = typeof amount === 'string' ? parseInt(amount.replace('R', '')) : amount;
    return `R${num.toLocaleString()}`;
  };

  // Calculate total coverage from simProtection insuranceAmount
  const calculateTotalCoverage = () => {
    const simCoverage = currentUser?.simProtection?.insuranceAmount || 0;
    return simCoverage >= 1000000 
      ? `R${(simCoverage / 1000000).toFixed(1)}M` 
      : `R${(simCoverage / 1000).toFixed(0)}K`;
  };

  // Calculate security score based on verification status
  const calculateSecurityScore = () => {
    let score = 0;
    if (currentUser?.simProtection?.idVerified) score += 25;
    if (currentUser?.simProtection?.faceVerified) score += 25;
    if (currentUser?.simProtection?.verificationStatus === "completed") score += 30;
    if (currentUser?.simProtection?.bankAccounts?.some(acc => acc.insured)) score += 20;
    return Math.min(score, 100);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const handleLanguageChange = async (newLang) => {
    i18n.changeLanguage(newLang);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (!currentUser) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-600">No user data found.</p>
    </div>
  );

  const securityScore = calculateSecurityScore();
  const totalCoverage = calculateTotalCoverage();
  const insuredAccounts = currentUser.simProtection?.bankAccounts?.filter(acc => acc.insured) || [];
  const simProtection = currentUser.simProtection || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">SimSure</h1>
                <p className="text-xs text-gray-500">FSP License #123456</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsAlertModalOpen(true)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 lg:p-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-gray-200">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SimSure</h1>
              <p className="text-xs text-gray-500">FSP License #123456</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-semibold">
                {currentUser.fullName?.split(" ").map(n => n[0]).join("") || "U"}
              </div>
              <div className="flex flex-col justify-center truncate">
                <h2 className="font-semibold text-gray-900 text-sm">{currentUser.fullName}</h2>
                <p className="text-gray-600 text-xs">Policy Holder</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{currentUser.simNumber}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">Born {currentUser.dob}</span>
            </div>
          </div>

          {/* Security Score */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600 text-sm">Security Score</span>
              <span className="text-blue-600 font-bold">{securityScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${securityScore}%` }}
              ></div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link to="/overview" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </Link>
            <Link to="/protection" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">My Protection</span>
            </Link>
            <Link to="/accounts" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition">
              <BanknoteIcon className="w-5 h-5" />
              <span className="font-medium">Bank Accounts</span>
            </Link>
            <Link to="/documents" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Documents</span>
            </Link>
          </nav>

          {/* Language Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Language</label>
            <select
              value={currentUser.preferredLanguage || "en"}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="en">English</option>
              <option value="af">Afrikaans</option>
              <option value="zu">Zulu</option>
              <option value="xh">Xhosa</option>
              <option value="st">Sotho</option>
            </select>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout} 
            className="mt-auto flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Welcome Header */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser.fullName?.split(' ')[0]}!</h1>
                <p className="text-gray-600 mt-1">Policy #POL-{currentUser.uid?.slice(-8).toUpperCase() || "ACTIVE"}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Member since {currentUser.createdAt?.toDate?.() ? new Date(currentUser.createdAt.toDate()).toLocaleDateString() : "Recent"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Policy Term</p>
                  <p className="text-lg font-semibold text-green-600">{currentUser.policyTerm}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Coverage */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Coverage</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{totalCoverage}</p>
                  <p className="text-green-600 text-sm mt-1">Active Protection</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Protected Accounts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Protected Accounts</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{insuredAccounts.length}</p>
                  <p className="text-gray-600 text-sm mt-1">Bank Accounts</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <BanknoteIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Security Score */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Security Score</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{securityScore}/100</p>
                  <p className="text-blue-600 text-sm mt-1">
                    {securityScore >= 80 ? "Excellent" : securityScore >= 60 ? "Good" : "Needs Improvement"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Protection Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">SIM Protection Status</h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {simProtection.verificationStatus === "completed" ? "Active" : "Pending"}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coverage Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Coverage Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Coverage Amount</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(simProtection.insuranceAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Phone Number</span>
                    <span className="font-semibold text-gray-900">{currentUser.simNumber}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Policy Term</span>
                    <span className="font-semibold text-gray-900">{currentUser.policyTerm}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Insurance Type</span>
                    <span className="font-semibold text-gray-900">{currentUser.insuranceType}</span>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Security Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Email Alerts</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${simProtection.emailAlert ? "bg-green-500" : "bg-gray-300"}`}></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Auto Lock</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${simProtection.autoLock ? "bg-green-500" : "bg-gray-300"}`}></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Automated Actions</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${simProtection.automatedActions ? "bg-green-500" : "bg-gray-300"}`}></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Bank Protection</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${insuredAccounts.length > 0 ? "bg-green-500" : "bg-gray-300"}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insured Accounts */}
          {insuredAccounts.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Protected Bank Accounts</h2>
                <span className="text-blue-600 text-sm font-medium">{insuredAccounts.length} account{insuredAccounts.length !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insuredAccounts.map((account, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{account.bankName}</h3>
                        <p className="text-gray-600 text-sm capitalize">{account.accountType}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        Protected
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Account Number</span>
                        <span className="font-mono text-gray-900">•••• {account.accountNumber?.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Coverage</span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(account.insuranceAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Account Holder</span>
                        <span className="text-gray-900 text-sm">{account.fullLegalName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Identity Verification Status</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  label: "ID Document", 
                  verified: simProtection.idVerified, 
                  icon: IdCard,
                  description: "Identity verified"
                },
                { 
                  label: "Face Verification", 
                  verified: simProtection.faceVerified, 
                  icon: User,
                  description: "Biometric scan"
                },
                { 
                  label: "Digital Signature", 
                  verified: simProtection.signatureProvided, 
                  icon: FileText,
                  description: "Signed agreement"
                },
                { 
                  label: "Legal Consent", 
                  verified: simProtection.bindingAgreement, 
                  icon: CheckCircle,
                  description: "Terms accepted"
                },
              ].map((item, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    item.verified ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    <item.icon className={`w-6 h-6 ${item.verified ? "text-green-600" : "text-gray-400"}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">{item.label}</p>
                  <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.verified 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {item.verified ? "Verified" : "Pending"}
                  </span>
                </div>
              ))}
            </div>

            {/* Additional Verification Info */}
            {simProtection.verificationStatus === "completed" && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Verification Completed</p>
                    <p className="text-green-700 text-sm">
                      Your identity was verified on {simProtection.verificationTimestamp?.toDate?.() ? 
                      new Date(simProtection.verificationTimestamp.toDate()).toLocaleDateString() : 
                      "recently"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Policy Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Policy Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Personal Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Full Name</span>
                    <span className="font-semibold text-gray-900">{currentUser.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Date of Birth</span>
                    <span className="font-semibold text-gray-900">{currentUser.dob}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Email</span>
                    <span className="font-semibold text-gray-900">{currentUser.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Payment & Terms</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-semibold text-gray-900">{currentUser.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Coverage Amount</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(currentUser.coverageAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-semibold text-gray-900">
                      {currentUser.updatedAt?.toDate?.() ? 
                        new Date(currentUser.updatedAt.toDate()).toLocaleDateString() : 
                        "Recently"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert History Modal */}
      {isAlertModalOpen && (
        <AlertHistoryModal 
          onClose={() => setIsAlertModalOpen(false)} 
          userData={currentUser}
        />
      )}
    </div>
  );
}