// src/newPages/SimFraud.js
import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Bell, 
  Lock, 
  CreditCard, 
  Mail, 
  Globe, 
  Phone, 
  Users, 
  AlertTriangle, 
  Play,
  Pause,
  Settings,
  FileText,
  MessageCircle
} from "lucide-react";
import { auth, db } from "../firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

export default function SimFraud() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mockIncident, setMockIncident] = useState(null);

  // Fetch current user
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) setCurrentUser(docSnap.data());
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const simulateIncident = () => {
    setMockIncident({
      type: "SIM_SWAP_ATTEMPT",
      timestamp: new Date(),
      status: "BLOCKED"
    });
  };

  const resolveIncident = () => {
    setMockIncident(null);
  };

  const toggleProtection = async () => {
    if (!auth.currentUser) return;
    
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const currentStatus = currentUser?.simProtection?.status === "ACTIVE";
      
      await updateDoc(userDocRef, {
        "simProtection.status": currentStatus ? "PAUSED" : "ACTIVE",
        updatedAt: new Date()
      });
      
    } catch (error) {
      console.error("Error toggling protection:", error);
      alert("Failed to update protection status");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  if (!currentUser) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">No user data found</div>;

  const simProtection = currentUser.simProtection || {};
  const isActive = simProtection.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4">
        
        {/* Incident Banner */}
        {mockIncident && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Security Incident Detected</h3>
                  <p className="text-red-600 text-sm">SIM swap attempt blocked - Verification required</p>
                </div>
              </div>
              <button
                onClick={resolveIncident}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
              >
                Resolve
              </button>
            </div>
          </div>
        )}

        {/* Protection Status Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Shield className="w-7 h-7 text-blue-600" />
                SIM Protection
              </h1>
              <p className="text-gray-600 mt-1">$1,000,000 Identity Theft Insurance</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2 justify-end">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="font-semibold text-sm">{isActive ? 'ACTIVE' : 'PAUSED'}</span>
              </div>
              <p className="text-xl font-bold text-blue-600">$1M Coverage</p>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={toggleProtection}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isActive 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4 inline mr-2" /> : <Play className="w-4 h-4 inline mr-2" />}
              {isActive ? 'Pause Protection' : 'Resume Protection'}
            </button>
            <button
              onClick={simulateIncident}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Test Response
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column - Rules & Accounts */}
          <div className="space-y-6">
            
            {/* Protection Rules */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Your Protection Rules
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">SIM Swap Detection</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• Freeze all linked bank accounts instantly</li>
                    <li>• Logout all email sessions</li>
                    <li>• Notify emergency contacts</li>
                  </ul>
                </div>
                
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">Unusual Location</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• Require 2FA verification</li>
                    <li>• Send security alerts</li>
                  </ul>
                </div>
              </div>

              <button className="w-full mt-4 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
                Edit Rules
              </button>
            </div>

            {/* Linked Accounts */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Accounts We Protect (3)
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Chase Bank</p>
                      <p className="text-sm text-gray-500">XXXX-1234</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Bank of America</p>
                      <p className="text-sm text-gray-500">XXXX-5678</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium">Gmail</p>
                      <p className="text-sm text-gray-500">john@gmail.com</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
              </div>

              <button className="w-full mt-4 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
                Add Account
              </button>
            </div>
          </div>

          {/* Right Column - Pre-declarations & Emergency */}
          <div className="space-y-6">
            
            {/* Pre-declarations */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-600" />
                Prevent False Alarms
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">Travel to United Kingdom</span>
                  </div>
                  <p className="text-sm text-gray-600">Dec 15 - 25, 2024 • Active</p>
                </div>
                
                <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">SIM Change Scheduled</span>
                  </div>
                  <p className="text-sm text-gray-600">Verizon • Dec 18, 2024 • Active</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="border border-gray-300 py-2 rounded text-gray-700 hover:bg-gray-50 text-sm">
                  Add Travel
                </button>
                <button className="border border-gray-300 py-2 rounded text-gray-700 hover:bg-gray-50 text-sm">
                  Add SIM Change
                </button>
              </div>
            </div>

            {/* Emergency Response Protocol */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Emergency Response
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">When we detect suspicious activity:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>System automatically freezes linked accounts</li>
                    <li>You receive immediate notification</li>
                    <li>Verify if it was you via email/SMS</li>
                    <li>Accounts unfrozen or investigation starts</li>
                  </ol>
                </div>
              </div>

              <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700">
                Test This Process
              </button>
            </div>

            {/* Emergency Contacts & Support */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Emergency Contacts & Support
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-500">Wife • +1 (555) 987-6543</p>
                  <span className="text-xs text-green-600 font-semibold">Verified</span>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <p className="font-medium">Mike Smith</p>
                  <p className="text-sm text-gray-500">Brother • +1 (555) 456-7890</p>
                  <span className="text-xs text-green-600 font-semibold">Verified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="border border-gray-300 py-2 rounded text-gray-700 hover:bg-gray-50 text-sm flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  Edit Contacts
                </button>
                <button className="border border-gray-300 py-2 rounded text-gray-700 hover:bg-gray-50 text-sm flex items-center justify-center gap-1">
                  <Bell className="w-4 h-4" />
                  Test Alert
                </button>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">24/7 Support:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="border border-blue-300 py-2 rounded text-blue-700 hover:bg-blue-50 text-sm flex items-center justify-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    Chatbot
                  </button>
                  <button className="border border-blue-300 py-2 rounded text-blue-700 hover:bg-blue-50 text-sm">
                    Call Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}