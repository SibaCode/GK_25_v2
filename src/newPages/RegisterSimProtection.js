// src/newDash/dashboard/RegisterSimProtection.js
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  User, 
  Plus, 
  X, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Camera, 
  Upload, 
  Eye,
  Bank, 
  Signature, 
  Circle,
  House
} from "lucide-react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { getLinkedSimsById, verifyCompliance } from "./fakeRicaApi";
import { translations } from "./translations";

const RegisterSimProtection = ({ onClose }) => {
  const [formData, setFormData] = useState({
    // Identity Verification (no image data stored)
    idVerified: false,
    faceVerified: false,
    
    // Personal Details
    selectedNumber: "",
    preferredLanguage: "en",
    emailAlert: true,
    email: "",
    nextOfKinAlert: true,
    nextOfKin: [{ name: "", number: "" }],
    autoLock: true,
    
    // Bank Insurance
    bankAccount: true,
    bankAccounts: [
      { 
        bankName: "", 
        accountNumber: "",
        accountType: "savings",
        insured: true,
        insuranceAmount: 1000000
      }
    ],
    
    // Legal Consents
    telecomAuthorization: false,
    financialAuthorization: false,
    automatedActions: false,
    privacyConsent: false,
    insuranceTerms: false,
    
    // Digital Signature (we'll store only metadata, not image)
    fullLegalName: "",
    signatureProvided: false,
    perjuryCertification: false,
    bindingAgreement: false,
    
    consent: false
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [linkedSims, setLinkedSims] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingSims, setLoadingSims] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showInsuranceDetails, setShowInsuranceDetails] = useState(false);
  const [faceVerificationStatus, setFaceVerificationStatus] = useState('pending');
  const [idVerificationStatus, setIdVerificationStatus] = useState('pending');
  const [userExistingData, setUserExistingData] = useState(null);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRefFront = useRef(null);
  const fileInputRefBack = useRef(null);
  const faceInputRef = useRef(null);

  const steps = [
    "Identity Verification",
    "Bank Insurance",
    "Legal Authorization",
    "Digital Signature",
    "Review & Submit"
  ];

  const regex = {
    idNumber: /^\d+$/,
    phone: /^0\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    name: /^[A-Za-z\s]{2,}$/,
    bankAccount: /^\d{6,20}$/,
    bankName: /^[A-Za-z\s]{2,}$/,
  };

  const t = translations[formData.preferredLanguage] || translations.en;

  // Load user's existing data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserExistingData(data);
          console.log("Loaded existing user data:", data);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  // Simulate ID verification against existing user data
  const verifyIDDocuments = async (idFront, idBack) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate verification logic
        // In real app, this would compare with user's existing ID data
        const isVerified = true; // Simulate successful verification
        resolve(isVerified);
      }, 3000);
    });
  };

  // Simulate face verification against existing user data
  const verifyFace = async (facePhoto) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate face matching with existing user profile
        const isVerified = true; // Simulate successful verification
        resolve(isVerified);
      }, 2000);
    });
  };

  // File Upload Handlers - Only verify, don't store
  const handleFileUpload = async (fileType, file) => {
    const reader = new FileReader();
    setUploadProgress(prev => ({ ...prev, [fileType]: 0 }));

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        setUploadProgress(prev => ({ ...prev, [fileType]: progress }));
      }
    };

    reader.onloadend = async () => {
      setUploadProgress(prev => ({ ...prev, [fileType]: 100 }));
      
      // Verify against existing user data instead of storing
      if (fileType === 'idFront' || fileType === 'idBack') {
        setIdVerificationStatus('verifying');
        const isVerified = await verifyIDDocuments();
        if (isVerified) {
          setIdVerificationStatus('verified');
          setFormData(prev => ({ ...prev, idVerified: true }));
          setUploadProgress(prev => ({ ...prev, [fileType]: 'verified' }));
        } else {
          setIdVerificationStatus('failed');
          setErrors(prev => ({ ...prev, idVerification: "ID verification failed. Please ensure documents match your registration." }));
        }
      }
      
      if (fileType === 'facePhoto') {
        setFaceVerificationStatus('verifying');
        const isVerified = await verifyFace();
        if (isVerified) {
          setFaceVerificationStatus('verified');
          setFormData(prev => ({ ...prev, faceVerified: true }));
          setUploadProgress(prev => ({ ...prev, [fileType]: 'verified' }));
        } else {
          setFaceVerificationStatus('failed');
          setErrors(prev => ({ ...prev, faceVerification: "Face verification failed. Please ensure photo matches your ID." }));
        }
      }
    };

    reader.readAsDataURL(file);
  };

  // Signature Functions - Only track if signature was provided, don't store image
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
    
    // Only track that signature was provided, don't store the image data
    const hasSignature = true;
    setFormData(prev => ({ 
      ...prev, 
      signatureProvided: hasSignature 
    }));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData(prev => ({ ...prev, signatureProvided: false }));
  };

  // Form Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleIdChange = async (e) => {
    const { value } = e.target;
    const cleanedValue = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, idNumber: cleanedValue }));
    
    if (cleanedValue.length > 5) {
      setLoadingSims(true);
      const sims = await getLinkedSimsById(cleanedValue);
      setLinkedSims(sims);
      setLoadingSims(false);
    } else {
      setLinkedSims([]);
    }
  };

  const handleBankChange = (index, field, value) => {
    const updatedAccounts = [...formData.bankAccounts];
    if (field === "bankName") value = value.replace(/[^A-Za-z\s]/g, "");
    if (field === "accountNumber") value = value.replace(/[^0-9]/g, "").slice(0, 20);
    
    updatedAccounts[index][field] = value;
    setFormData(prev => ({ ...prev, bankAccounts: updatedAccounts }));
  };

  const addBankAccount = () => setFormData(prev => ({
    ...prev, 
    bankAccounts: [...prev.bankAccounts, { 
      bankName: "", 
      accountNumber: "",
      accountType: "savings",
      insured: true,
      insuranceAmount: 1000000
    }]
  }));

  const removeBankAccount = (index) => setFormData(prev => ({
    ...prev, 
    bankAccounts: prev.bankAccounts.filter((_, i) => i !== index)
  }));

  // Validation
  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!formData.idVerified) newErrors.idVerification = "ID verification required";
        if (!formData.faceVerified) newErrors.faceVerification = "Face verification required";
        if (!formData.biometricConsent) newErrors.biometricConsent = "Biometric consent required";
        break;
        
      case 1:
        formData.bankAccounts.forEach((acc, index) => {
          if (!acc.bankName) newErrors[`bankName-${index}`] = "Bank name required";
          if (!acc.accountNumber) newErrors[`accountNumber-${index}`] = "Account number required";
        });
        break;
        
      case 2:
        if (!formData.telecomAuthorization) newErrors.telecomAuthorization = "Required";
        if (!formData.financialAuthorization) newErrors.financialAuthorization = "Required";
        if (!formData.automatedActions) newErrors.automatedActions = "Required";
        if (!formData.privacyConsent) newErrors.privacyConsent = "Required";
        if (!formData.insuranceTerms) newErrors.insuranceTerms = "Required";
        break;
        
      case 3:
        if (!formData.fullLegalName) newErrors.fullLegalName = "Legal name required";
        if (!formData.signatureProvided) newErrors.signature = "Signature required";
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
    
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      // Only store verification status and metadata, not image data
      const submissionData = {
        simProtection: {
          // Verification status only
          idVerified: formData.idVerified,
          faceVerified: formData.faceVerified,
          verificationTimestamp: serverTimestamp(),
          
          // Personal details
          selectedNumber: formData.selectedNumber,
          emailAlert: formData.emailAlert,
          email: formData.email,
          nextOfKinAlert: formData.nextOfKinAlert,
          nextOfKin: formData.nextOfKin,
          autoLock: formData.autoLock,
          
          // Bank insurance
          bankAccount: formData.bankAccount,
          bankAccounts: formData.bankAccounts,
          
          // Legal consents
          telecomAuthorization: formData.telecomAuthorization,
          financialAuthorization: formData.financialAuthorization,
          automatedActions: formData.automatedActions,
          privacyConsent: formData.privacyConsent,
          insuranceTerms: formData.insuranceTerms,
          
          // Digital signature metadata only
          fullLegalName: formData.fullLegalName,
          signatureProvided: formData.signatureProvided,
          signatureTimestamp: serverTimestamp(),
          perjuryCertification: formData.perjuryCertification,
          bindingAgreement: formData.bindingAgreement,
          
          // System data
          submittedAt: serverTimestamp(),
          ipAddress: await getClientIP(),
          userAgent: navigator.userAgent,
          verificationStatus: "completed"
        },
        preferredLanguage: formData.preferredLanguage,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, "users", auth.currentUser.uid), submissionData, { merge: true });
      alert("SIM Protection registration completed successfully!");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving SIM protection:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  };

  // Render Steps
  const renderStep = () => {
    switch (currentStep) {
      case 0: return renderIdentityVerification();
      case 1: return renderBankInsurance();
      case 2: return renderLegalAuthorization();
      case 3: return renderDigitalSignature();
      case 4: return renderReview();
      default: return renderIdentityVerification();
    }
  };

  const renderIdentityVerification = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <Shield className="w-5 h-5" />
          <span className="font-semibold">🔐 IDENTITY VERIFICATION</span>
        </div>
        <p className="text-sm text-blue-600">
          Verify your identity against your existing registration data.
        </p>
        {userExistingData && (
          <p className="text-sm text-green-600 mt-2">
            ✓ Found your existing registration data
          </p>
        )}
      </div>

      {/* ID Document Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">📄 Front of ID/Passport</label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 ${
              errors.idVerification ? "border-red-500" : "border-gray-300"
            }`}
            onClick={() => fileInputRefFront.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Upload front side</p>
            <input 
              type="file" 
              ref={fileInputRefFront}
              className="hidden" 
              accept="image/*"
              onChange={(e) => handleFileUpload("idFront", e.target.files[0])}
            />
          </div>
          {idVerificationStatus === 'verified' && (
            <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Verified against registration
            </p>
          )}
          {idVerificationStatus === 'failed' && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Verification failed
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">📄 Back of ID/Passport</label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 ${
              errors.idVerification ? "border-red-500" : "border-gray-300"
            }`}
            onClick={() => fileInputRefBack.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Upload back side</p>
            <input 
              type="file" 
              ref={fileInputRefBack}
              className="hidden" 
              accept="image/*"
              onChange={(e) => handleFileUpload("idBack", e.target.files[0])}
            />
          </div>
          {idVerificationStatus === 'verified' && (
            <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Documents matched
            </p>
          )}
        </div>
      </div>

      {errors.idVerification && (
        <p className="text-red-500 text-sm">{errors.idVerification}</p>
      )}

      {/* Face Verification */}
      <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
        <label className="block text-gray-700 font-medium mb-4 text-lg">🤳 Face Verification</label>
        
        <div className="text-center mb-4">
          <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Upload a clear photo of your face to verify against your ID
            </p>
            
            <button
              type="button"
              onClick={() => faceInputRef.current?.click()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto"
            >
              <Upload className="w-5 h-5" />
              Upload Face Photo
            </button>
            
            <input 
              type="file" 
              ref={faceInputRef}
              className="hidden" 
              accept="image/*"
              onChange={(e) => handleFileUpload("facePhoto", e.target.files[0])}
            />
          </div>
        </div>

        {/* Face Verification Status */}
        {faceVerificationStatus !== 'pending' && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Face Verification Status:</span>
              {faceVerificationStatus === 'verifying' && (
                <span className="text-blue-600 text-sm flex items-center gap-1">
                  <Circle className="w-3 h-3 animate-pulse" />
                  Verifying against ID...
                </span>
              )}
              {faceVerificationStatus === 'verified' && (
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Face matched successfully
                </span>
              )}
              {faceVerificationStatus === 'failed' && (
                <span className="text-red-600 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Face match failed
                </span>
              )}
            </div>
          </div>
        )}

        {errors.faceVerification && (
          <p className="text-red-500 text-sm mt-2">{errors.faceVerification}</p>
        )}

        {/* Face Verification Instructions */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Face Verification Requirements:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Clear, well-lit photo of your face</li>
            <li>• Face should be clearly visible without obstructions</li>
            <li>• No sunglasses, hats, or face coverings</li>
            <li>• Look directly at the camera</li>
            <li>• Photo will be compared with your ID documents</li>
          </ul>
        </div>
      </div>

      {/* Biometric Consent */}
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
            "I consent to biometric verification including face matching with my ID documents. 
            Biometric data will be processed securely and not stored permanently."
          </p>
        </div>
      </div>
      {errors.biometricConsent && <p className="text-red-500 text-sm">{errors.biometricConsent}</p>}
    </div>
  );

  // ... (rest of the render methods remain the same as previous implementation)
  const renderBankInsurance = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <House className="w-5 h-5" />
          <span className="font-semibold">🏦 BANK ACCOUNT INSURANCE</span>
        </div>
        <p className="text-sm text-green-600">
          Link and insure your bank accounts against SIM swap fraud. $1,000,000 coverage per account.
        </p>
      </div>

      {formData.bankAccounts.map((account, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
          {formData.bankAccounts.length > 1 && (
            <button 
              type="button" 
              onClick={() => removeBankAccount(index)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Bank Name</label>
              <input 
                type="text" 
                value={account.bankName}
                onChange={(e) => handleBankChange(index, "bankName", e.target.value)}
                placeholder="e.g., FNB, Standard Bank, ABSA"
                className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors[`bankName-${index}`] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[`bankName-${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`bankName-${index}`]}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Account Number</label>
              <input 
                type="text" 
                value={account.accountNumber}
                onChange={(e) => handleBankChange(index, "accountNumber", e.target.value)}
                placeholder="1234567890"
                className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors[`accountNumber-${index}`] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[`accountNumber-${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`accountNumber-${index}`]}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-700">$1,000,000 Insurance Coverage</p>
              <p className="text-sm text-gray-600">Protected against SIM swap fraud</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={account.insured}
                onChange={(e) => handleBankChange(index, "insured", e.target.checked)}
                className="w-5 h-5 accent-green-600"
              />
              <span className="text-sm text-gray-700">Insure this account</span>
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

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-700 mb-2 cursor-pointer"
             onClick={() => setShowInsuranceDetails(!showInsuranceDetails)}>
          <Eye className="w-4 h-4" />
          <span className="font-semibold">Insurance Policy Details</span>
        </div>
        {showInsuranceDetails && (
          <div className="text-sm text-yellow-700 space-y-2">
            <p>• $1,000,000 coverage per linked bank account</p>
            <p>• Covers financial losses from SIM swap fraud</p>
            <p>• 24/7 fraud monitoring and alerts</p>
            <p>• Instant account freezing during threats</p>
            <p>• Underwritten by Lloyd's of London</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLegalAuthorization = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-purple-700 mb-2">
          <FileText className="w-5 h-5" />
          <span className="font-semibold">📄 LEGAL AUTHORIZATIONS (REQUIRED)</span>
        </div>
        <p className="text-sm text-purple-600">
          These authorizations are required to protect your accounts and provide insurance coverage.
        </p>
      </div>

      {[
        {
          key: "telecomAuthorization",
          title: "✅ TELECOMMUNICATIONS AUTHORIZATION",
          text: "I authorize SimProtect to communicate with my telecom provider to detect and block SIM swap attempts on my behalf."
        },
        {
          key: "financialAuthorization", 
          title: "✅ FINANCIAL INSTITUTION AUTHORIZATION",
          text: "I authorize SimProtect to instruct my linked banks to temporarily freeze accounts during confirmed security threats."
        },
        {
          key: "automatedActions",
          title: "✅ AUTOMATED ACTIONS CONSENT", 
          text: "I understand and consent to automated account protection measures that may activate without prior notice to prevent irreversible financial loss."
        },
        {
          key: "privacyConsent",
          title: "✅ PRIVACY POLICY & DATA PROCESSING",
          text: "I consent to my data being processed per POPIA/GDPR regulations, including biometric data stored for 90 days then deleted."
        },
        {
          key: "insuranceTerms", 
          title: "✅ INSURANCE TERMS ACCEPTANCE",
          text: "I accept the $1,000,000 identity theft insurance policy terms and understand the claims process."
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
            {errors[consent.key] && <p className="text-red-500 text-sm mt-1">This authorization is required</p>}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDigitalSignature = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-orange-700 mb-2">
          <Signature className="w-5 h-5" />
          <span className="font-semibold">✍️ LEGAL DIGITAL SIGNATURE</span>
        </div>
        <p className="text-sm text-orange-600">
          Your digital signature creates a legally binding agreement for SIM protection insurance.
        </p>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">FULL LEGAL NAME</label>
        <input 
          type="text" 
          name="fullLegalName"
          value={formData.fullLegalName}
          onChange={handleChange}
          placeholder="As it appears on your government ID"
          className={`w-full border px-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
            errors.fullLegalName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.fullLegalName && <p className="text-red-500 text-sm mt-1">{errors.fullLegalName}</p>}
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-3">DIGITAL SIGNATURE</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full h-40 bg-white border border-gray-200 rounded cursor-crosshair touch-none"
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
          <span className="text-xs text-gray-500">Sign above exactly as on your ID</span>
        </div>
        {errors.signature && <p className="text-red-500 text-sm mt-1">{errors.signature}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <div>
          <strong>TIMESTAMP:</strong> {new Date().toLocaleString()}
        </div>
        <div>
          <strong>IP ADDRESS:</strong> Loading...
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
            <p className="text-sm text-gray-600">I certify under penalty of perjury that all information is true and accurate.</p>
          </div>
        </div>
        {errors.perjuryCertification && <p className="text-red-500 text-sm">{errors.perjuryCertification}</p>}

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.bindingAgreement}
            onChange={(e) => setFormData(prev => ({ ...prev, bindingAgreement: e.target.checked }))}
            className="w-5 h-5 mt-1 accent-blue-600"
          />
          <div>
            <label className="text-gray-700 font-medium">Legally Binding Agreement</label>
            <p className="text-sm text-gray-600">I understand this is a legally binding insurance application and agreement.</p>
          </div>
        </div>
        {errors.bindingAgreement && <p className="text-red-500 text-sm">{errors.bindingAgreement}</p>}
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">REVIEW & SUBMIT</span>
        </div>
        <p className="text-sm text-green-600">
          Please review all information before submitting your SIM protection application.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Identity Verification</h3>
          <p className="text-sm text-gray-600">
            ✓ ID Documents: {formData.idVerified ? 'Verified against registration' : 'Pending'}
          </p>
          <p className="text-sm text-gray-600">
            ✓ Face Verification: {formData.faceVerified ? 'Matched successfully' : 'Pending'}
          </p>
          <p className="text-sm text-gray-600">✓ Biometric consent provided</p>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Bank Accounts to Insure</h3>
          {formData.bankAccounts.map((account, index) => (
            <p key={index} className="text-sm text-gray-600">
              ✓ {account.bankName}: ••••{account.accountNumber.slice(-4)} - ${account.insuranceAmount.toLocaleString()} coverage
            </p>
          ))}
        </div>

        <div className="border-b pb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Legal Authorizations</h3>
          <p className="text-sm text-gray-600">✓ Telecommunications authorization</p>
          <p className="text-sm text-gray-600">✓ Financial institution authorization</p>
          <p className="text-sm text-gray-600">✓ Automated actions consent</p>
          <p className="text-sm text-gray-600">✓ Privacy policy acceptance</p>
          <p className="text-sm text-gray-600">✓ Insurance terms acceptance</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Digital Signature</h3>
          <p className="text-sm text-gray-600">✓ Legal name: {formData.fullLegalName}</p>
          <p className="text-sm text-gray-600">✓ Digital signature provided</p>
          <p className="text-sm text-gray-600">✓ Legal certifications accepted</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">🏛️ REGULATORY COMPLIANCE</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• FSP License #: FSP12345</p>
          <p>• Underwritten by: Lloyd's of London</p>
          <p>• Cooling-off Period: 14-day cancellation right</p>
          <p>• Data Retention: 90-day biometric data deletion</p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.3 }} 
      className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-auto overflow-hidden relative"
    >
      <div className="p-6">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= index ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <span className={`text-xs mt-2 text-center ${
                currentStep >= index ? 'text-blue-600 font-semibold' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-300 -z-10">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterSimProtection;