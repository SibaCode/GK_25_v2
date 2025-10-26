// src/newDash/dashboard/RegisterSimProtection.js
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  House , User, Plus, X, Shield, CheckCircle, 
  FileText, Bank, Signature, IdCard
} from "lucide-react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const RegisterSimProtection = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    selectedNumber: "",
    biometricConsent: false,
    bankAccounts: [{ bankName: "", accountNumber: "", termsAccepted: false }],
    nextOfKin: [{ name: "", number: "", relationship: "" }],
    telecomAuthorization: false,
    financialAuthorization: false,
    automatedActions: false,
    privacyConsent: false,
    insuranceTerms: false,
    fullLegalName: "",
    signatureProvided: false,
    perjuryCertification: false,
    bindingAgreement: false,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [linkedSims, setLinkedSims] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userExistingData, setUserExistingData] = useState(null);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const steps = [
    "Identity Verification",
    "Bank Insurance", 
    "Next of Kin",
    "Legal Authorization",
    "Digital Signature"
  ];

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserExistingData(data);
          setFormData(prev => ({
            ...prev,
            fullLegalName: data.fullName || ""
          }));

          // Mock linked numbers
          setTimeout(() => {
            setLinkedSims([
              { number: "0821234567", status: "Active", provider: "Vodacom" },
              { number: "0839876543", status: "Active", provider: "MTN" }
            ]);
          }, 1000);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    if (isOpen) {
      loadUserData();
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Signature functions
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setFormData(prev => ({ ...prev, signatureProvided: true }));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData(prev => ({ ...prev, signatureProvided: false }));
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleBankChange = (index, field, value) => {
    const updatedAccounts = [...formData.bankAccounts];
    updatedAccounts[index][field] = value;
    setFormData(prev => ({ ...prev, bankAccounts: updatedAccounts }));
  };

  const addBankAccount = () => setFormData(prev => ({
    ...prev, 
    bankAccounts: [...prev.bankAccounts, { 
      bankName: "", 
      accountNumber: "",
      termsAccepted: false
    }]
  }));

  const addNextOfKin = () => setFormData(prev => ({
    ...prev, 
    nextOfKin: [...prev.nextOfKin, { name: "", number: "", relationship: "" }]
  }));

  const handleKinChange = (index, field, value) => {
    const updatedKin = [...formData.nextOfKin];
    updatedKin[index][field] = value;
    setFormData(prev => ({ ...prev, nextOfKin: updatedKin }));
  };

  // Validation
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!formData.biometricConsent) newErrors.biometricConsent = "Required";
        if (!formData.selectedNumber) newErrors.selectedNumber = "Select a phone number";
        break;
      case 1:
        formData.bankAccounts.forEach((acc, index) => {
          if (!acc.bankName) newErrors[`bankName-${index}`] = "Required";
          if (!acc.accountNumber) newErrors[`accountNumber-${index}`] = "Required";
          if (!acc.termsAccepted) newErrors[`terms-${index}`] = "Accept terms";
        });
        break;
      case 3:
        if (!formData.telecomAuthorization) newErrors.telecomAuthorization = "Required";
        if (!formData.financialAuthorization) newErrors.financialAuthorization = "Required";
        if (!formData.automatedActions) newErrors.automatedActions = "Required";
        if (!formData.privacyConsent) newErrors.privacyConsent = "Required";
        if (!formData.insuranceTerms) newErrors.insuranceTerms = "Required";
        break;
      case 4:
        if (!formData.fullLegalName) newErrors.fullLegalName = "Required";
        if (!formData.signatureProvided) newErrors.signature = "Required";
        if (!formData.perjuryCertification) newErrors.perjuryCertification = "Required";
        if (!formData.bindingAgreement) newErrors.bindingAgreement = "Required";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      alert('Please fix all errors before submitting.');
      return;
    }
    
    setLoading(true);
    try {
      const submissionData = {
        simProtection: {
          ...formData,
          submittedAt: serverTimestamp(),
          active: true,
          coverage: 1000000,
          freeTrial: true,
          trialDays: 7,
          trialEnds: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, "users", auth.currentUser.uid), submissionData, { merge: true });

      alert("🎉 SIM Protection Registered Successfully!\n\nYou now have 7 days of free protection.");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving SIM protection:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render steps
  const renderStep = () => {
    switch (currentStep) {
      case 0: return (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Identity Verification</span>
            </div>
            <p className="text-sm text-blue-600">Your identity is verified</p>
          </div>

          {userExistingData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <IdCard className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Verified Identity</h3>
              </div>
              <div className="text-sm">
                <p><span className="text-gray-600">Name:</span> {userExistingData.fullName}</p>
                <p><span className="text-gray-600">ID:</span> ••••••••{userExistingData.idNumber?.slice(-4)}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Phone Number</label>
            <div className="space-y-3">
              {linkedSims.map((sim, index) => (
                <label key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                  <input
                    type="radio"
                    name="selectedNumber"
                    value={sim.number}
                    checked={formData.selectedNumber === sim.number}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sim.number}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {sim.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{sim.provider}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.selectedNumber && <p className="text-red-500 text-sm mt-1">{errors.selectedNumber}</p>}
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={formData.biometricConsent}
              onChange={(e) => setFormData(prev => ({ ...prev, biometricConsent: e.target.checked }))}
              className="w-5 h-5 mt-1 accent-blue-600"
            />
            <div>
              <label className="text-gray-700 font-medium">Biometric Consent</label>
              <p className="text-sm text-gray-600 mt-1">
                I consent to biometric verification including face matching with my ID documents.
              </p>
            </div>
          </div>
          {errors.biometricConsent && <p className="text-red-500 text-sm">{errors.biometricConsent}</p>}
        </div>
      );

      case 1: return (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <House className="w-5 h-5" />
              <span className="font-semibold">Bank Account Insurance</span>
            </div>
            <p className="text-sm text-green-600">$1,000,000 coverage against SIM swap fraud</p>
          </div>

          {formData.bankAccounts.map((account, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Bank Account {index + 1}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Bank Name</label>
                  <input 
                    type="text" 
                    value={account.bankName}
                    onChange={(e) => handleBankChange(index, "bankName", e.target.value)}
                    placeholder="e.g., FNB, Standard Bank"
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-1">Account Number</label>
                  <input 
                    type="text" 
                    value={account.accountNumber}
                    onChange={(e) => handleBankChange(index, "accountNumber", e.target.value)}
                    placeholder="1234567890"
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={account.termsAccepted}
                  onChange={(e) => handleBankChange(index, "termsAccepted", e.target.checked)}
                  className="w-5 h-5 mt-1 accent-blue-600"
                />
                <div>
                  <label className="text-gray-700 text-sm font-medium">
                    I authorize monitoring and protection of this account
                  </label>
                </div>
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={addBankAccount}
            className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800"
          >
            <Plus size={16} /> Add Another Bank Account
          </button>
        </div>
      );

      case 2: return (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <User className="w-5 h-5" />
              <span className="font-semibold">Next of Kin Notification</span>
            </div>
            <p className="text-sm text-purple-600">Contacts will be notified if SIM swap is detected</p>
          </div>

          {formData.nextOfKin.map((kin, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Contact {index + 1}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    value={kin.name}
                    onChange={(e) => handleKinChange(index, "name", e.target.value)}
                    placeholder="Full name"
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={kin.number}
                    onChange={(e) => handleKinChange(index, "number", e.target.value)}
                    placeholder="0821234567"
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-1">Relationship</label>
                  <select
                    value={kin.relationship}
                    onChange={(e) => handleKinChange(index, "relationship", e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addNextOfKin}
            className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800"
          >
            <Plus size={16} /> Add Another Contact
          </button>
        </div>
      );

      case 3: return (
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-700 mb-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">Legal Authorizations (REQUIRED)</span>
            </div>
          </div>

          {[
            {
              key: "telecomAuthorization",
              title: "✅ TELECOMMUNICATIONS AUTHORIZATION",
              text: "I authorize communication with my telecom provider to detect and block SIM swap attempts."
            },
            {
              key: "financialAuthorization", 
              title: "✅ FINANCIAL INSTITUTION AUTHORIZATION",
              text: "I authorize instructing my banks to temporarily freeze accounts during security threats."
            },
            {
              key: "automatedActions",
              title: "✅ AUTOMATED ACTIONS CONSENT", 
              text: "I consent to automated account protection measures to prevent financial loss."
            },
            {
              key: "privacyConsent",
              title: "✅ PRIVACY POLICY & DATA PROCESSING",
              text: "I consent to my data being processed per POPIA/GDPR regulations."
            },
            {
              key: "insuranceTerms", 
              title: "✅ INSURANCE TERMS ACCEPTANCE",
              text: "I accept the $1,000,000 identity theft insurance policy terms."
            }
          ].map((consent, index) => (
            <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                checked={formData[consent.key]}
                onChange={(e) => setFormData(prev => ({ ...prev, [consent.key]: e.target.checked }))}
                className="w-5 h-5 mt-1 accent-blue-600"
              />
              <div>
                <label className="text-gray-700 font-medium block mb-1">{consent.title}</label>
                <p className="text-sm text-gray-600">{consent.text}</p>
              </div>
            </div>
          ))}
        </div>
      );

      case 4: return (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <Signature className="w-5 h-5" />
              <span className="font-semibold">Legal Digital Signature</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">FULL LEGAL NAME</label>
            <input 
              type="text" 
              name="fullLegalName"
              value={formData.fullLegalName}
              onChange={handleChange}
              placeholder="As it appears on your ID"
              className="w-full border px-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-3">DIGITAL SIGNATURE</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-40 bg-white border border-gray-200 rounded cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={clearSignature}
                className="text-red-600 text-sm hover:text-red-800 font-medium"
              >
                Clear Signature
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.perjuryCertification}
                onChange={(e) => setFormData(prev => ({ ...prev, perjuryCertification: e.target.checked }))}
                className="w-5 h-5 mt-1 accent-blue-600"
              />
              <div>
                <label className="text-gray-700 font-medium">Certification Under Penalty of Perjury</label>
                <p className="text-sm text-gray-600">I certify all information is true and accurate.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.bindingAgreement}
                onChange={(e) => setFormData(prev => ({ ...prev, bindingAgreement: e.target.checked }))}
                className="w-5 h-5 mt-1 accent-blue-600"
              />
              <div>
                <label className="text-gray-700 font-medium">Legally Binding Agreement</label>
                <p className="text-sm text-gray-600">I understand this is a legally binding agreement.</p>
              </div>
            </div>
          </div>
        </div>
      );

      default: return <div>Step not found</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">SIM Protection Registration</h2>
            <p className="text-sm text-gray-600">Secure your SIM with $1,000,000 coverage</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between px-6 pt-4">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= index ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <span className="text-xs mt-2 text-center">{step}</span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Complete Registration"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterSimProtection;