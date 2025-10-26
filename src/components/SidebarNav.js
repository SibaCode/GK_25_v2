// src/components/SidebarNav.js
import React from "react";
import { 
  Bell, 
  LogOut, 
  Shield, 
  FileText, 
  User, 
  Phone, 
  Calendar, 
  Mail,
  BarChart3,
  ShieldCheck,
  BanknoteIcon,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useTranslation } from "react-i18next";

export default function SidebarNav({ 
  currentUser, 
  onAlertClick, 
  mobileMenuOpen = false,
  onMobileMenuToggle 
}) {
  const { t, i18n } = useTranslation();

  // Calculate security score based on verification status
  const calculateSecurityScore = () => {
    if (!currentUser?.simProtection) return 0;
    
    let score = 0;
    if (currentUser.simProtection.idVerified) score += 25;
    if (currentUser.simProtection.faceVerified) score += 25;
    if (currentUser.simProtection.verificationStatus === "completed") score += 30;
    if (currentUser.simProtection.bankAccounts?.some(acc => acc.insured)) score += 20;
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

  const securityScore = calculateSecurityScore();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onMobileMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <User className="w-5 h-5" /> : <User className="w-5 h-5" />}
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
            onClick={onAlertClick}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Sidebar - Desktop & Mobile */}
      <div className={`
        ${mobileMenuOpen ? 'fixed inset-0 z-40 lg:relative lg:inset-auto' : 'hidden lg:block'}
        bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6 border border-gray-200 lg:col-span-1 h-full overflow-y-auto
      `}>
        {/* Close button for mobile */}
        {mobileMenuOpen && (
          <button 
            onClick={onMobileMenuToggle}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <User className="w-5 h-5" />
          </button>
        )}

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
              {currentUser?.fullName?.split(" ").map(n => n[0]).join("") || "U"}
            </div>
            <div className="flex flex-col justify-center truncate">
              <h2 className="font-semibold text-gray-900 text-sm">{currentUser?.fullName || "User"}</h2>
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
            <span className="text-gray-700">{currentUser?.simNumber || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 truncate">{currentUser?.email || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Born {currentUser?.dob || "N/A"}</span>
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
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-200"
            onClick={() => mobileMenuOpen && onMobileMenuToggle()}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link 
            to="/protection" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition"
            onClick={() => mobileMenuOpen && onMobileMenuToggle()}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="font-medium">My Protection</span>
          </Link>
          <Link 
            to="/accounts" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition"
            onClick={() => mobileMenuOpen && onMobileMenuToggle()}
          >
            <BanknoteIcon className="w-5 h-5" />
            <span className="font-medium">Bank Accounts</span>
          </Link>
          <Link 
            to="/documents" 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition"
            onClick={() => mobileMenuOpen && onMobileMenuToggle()}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Documents</span>
          </Link>
        </nav>

        {/* Language Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Language</label>
          <select
            value={currentUser?.preferredLanguage || "en"}
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
    </>
  );
}