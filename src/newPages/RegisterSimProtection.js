// src/newDash/dashboard/RegisterSimProtection.js
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    House, Phone, User, Plus, X, Shield, AlertTriangle,
    CheckCircle, FileText, Camera, Upload, Eye, Bank,
    Signature, Circle, IdCard, ChevronDown, Loader
} from "lucide-react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const RegisterSimProtection = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        // Identity Verification
        idVerified: false,
        faceVerified: false,
        biometricConsent: false,

        // Phone Numbers
        selectedNumber: "",

        bankAccount: true,
        bankAccounts: [
            {
                bankName: "",
                accountNumber: "",
                accountType: "savings",
                insured: true,
                insuranceAmount: 1000000,
                termsAccepted: false
            }
        ],

        // Next of Kin
        nextOfKinAlert: true,
        nextOfKin: [{ name: "", number: "", relationship: "" }],

        // Legal Consents
        telecomAuthorization: false,
        financialAuthorization: false,
        automatedActions: false,
        privacyConsent: false,
        insuranceTerms: false,

        // Digital Signature
        fullLegalName: "",
        signatureProvided: false,
        perjuryCertification: false,
        bindingAgreement: false,
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [linkedSims, setLinkedSims] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingSims, setLoadingSims] = useState(false);
    const [userExistingData, setUserExistingData] = useState(null);
    const [showBankExplanation, setShowBankExplanation] = useState(false);

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const steps = [
        { title: "Identity", icon: <IdCard size={16} /> },
        { title: "Bank", icon: <House size={16} /> },
        { title: "Next of Kin", icon: <User size={16} /> },
        { title: "Legal", icon: <FileText size={16} /> },
        { title: "Signature", icon: <Signature size={16} /> }
    ];

    // Load user's existing data
    useEffect(() => {
        const loadUserData = async () => {
            if (!auth.currentUser) return;

            try {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserExistingData(data);

                    // Pre-fill form with user data
                    setFormData(prev => ({
                        ...prev,
                        fullLegalName: data.fullName || "",
                        idVerified: true,
                        faceVerified: true
                    }));

                    // Load mock linked SIMs
                    setLoadingSims(true);
                    setTimeout(() => {
                        setLinkedSims([
                            { number: "0821234567", status: "Active", provider: "Vodacom" },
                            { number: "0839876543", status: "Active", provider: "MTN" },
                            { number: "0845556677", status: "Inactive", provider: "Cell C" }
                        ]);
                        setLoadingSims(false);
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

    // Initialize canvas when component mounts
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [currentStep]);

    // Signature Functions
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

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
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);
        setFormData(prev => ({ ...prev, signatureProvided: true }));
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            accountType: "savings",
            insured: true,
            insuranceAmount: 1000000,
            termsAccepted: false
        }]
    }));

    const removeBankAccount = (index) => setFormData(prev => ({
        ...prev,
        bankAccounts: prev.bankAccounts.filter((_, i) => i !== index)
    }));

    const addNextOfKin = () => setFormData(prev => ({
        ...prev,
        nextOfKin: [...prev.nextOfKin, { name: "", number: "", relationship: "" }]
    }));

    const removeNextOfKin = (index) => setFormData(prev => ({
        ...prev,
        nextOfKin: prev.nextOfKin.filter((_, i) => i !== index)
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
            case 0: // Identity Verification
                if (!formData.biometricConsent) {
                    newErrors.biometricConsent = "Biometric consent is required";
                }
                if (!formData.selectedNumber) {
                    newErrors.selectedNumber = "Please select a phone number to protect";
                }
                break;

            case 1: // Bank Insurance
                formData.bankAccounts.forEach((acc, index) => {
                    if (!acc.bankName) newErrors[`bankName-${index}`] = "Bank name required";
                    if (!acc.accountNumber) newErrors[`accountNumber-${index}`] = "Account number required";
                    if (!acc.termsAccepted) newErrors[`terms-${index}`] = "You must accept the terms for this account";
                });
                break;

            case 2: // Next of Kin
                if (formData.nextOfKinAlert) {
                    formData.nextOfKin.forEach((kin, index) => {
                        if (!kin.name) newErrors[`kinName-${index}`] = "Name required";
                        if (!kin.number) newErrors[`kinNumber-${index}`] = "Phone number required";
                        if (!kin.relationship) newErrors[`kinRelationship-${index}`] = "Relationship required";
                    });
                }
                break;

            case 3: // Legal Authorization
                if (!formData.telecomAuthorization) newErrors.telecomAuthorization = "Required";
                if (!formData.financialAuthorization) newErrors.financialAuthorization = "Required";
                if (!formData.automatedActions) newErrors.automatedActions = "Required";
                if (!formData.privacyConsent) newErrors.privacyConsent = "Required";
                if (!formData.insuranceTerms) newErrors.insuranceTerms = "Required";
                break;

            case 4: // Digital Signature
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
            const submissionData = {
                simProtection: {
                    // Identity
                    idVerified: formData.idVerified,
                    faceVerified: formData.faceVerified,
                    biometricConsent: formData.biometricConsent,

                    // Phone Protection
                    selectedNumber: formData.selectedNumber,
                    linkedNumbers: linkedSims,

                    // Bank Insurance
                    bankAccount: formData.bankAccount,
                    bankAccounts: formData.bankAccounts,

                    // Next of Kin
                    nextOfKinAlert: formData.nextOfKinAlert,
                    nextOfKin: formData.nextOfKin,

                    // Legal Consents
                    telecomAuthorization: formData.telecomAuthorization,
                    financialAuthorization: formData.financialAuthorization,
                    automatedActions: formData.automatedActions,
                    privacyConsent: formData.privacyConsent,
                    insuranceTerms: formData.insuranceTerms,

                    // Digital Signature
                    fullLegalName: formData.fullLegalName,
                    signatureProvided: formData.signatureProvided,
                    perjuryCertification: formData.perjuryCertification,
                    bindingAgreement: formData.bindingAgreement,

                    // System
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

            alert("🎉 SIM Protection Registered Successfully!\n\nYou now have 7 days of free protection. Your $1,000,000 coverage is active.");
            if (onClose) onClose();
        } catch (error) {
            console.error("Error saving SIM protection:", error);
            alert("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Render Steps
    const renderStep = () => {
        switch (currentStep) {
            case 0: return renderIdentityVerification();
            case 1: return renderBankInsurance();
            case 2: return renderNextOfKin();
            case 3: return renderLegalAuthorization();
            case 4: return renderDigitalSignature();
            default: return renderIdentityVerification();
        }
    };

    const renderIdentityVerification = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Identity Verification Complete</span>
                </div>
                <p className="text-sm text-blue-600">
                    Your identity has been verified during registration. No additional verification needed.
                </p>
            </div>

            {/* Linked Phone Numbers */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <label className="block text-gray-800 font-semibold mb-3">Select Phone Number to Protect</label>
                <p className="text-sm text-gray-600 mb-4">Choose which number you want to protect with our insurance</p>

                {loadingSims ? (
                    <div className="text-center py-6">
                        <Loader className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Loading your linked numbers...</p>
                    </div>
                ) : linkedSims.length > 0 ? (
                    <div className="space-y-3">
                        {linkedSims.map((sim, index) => (
                            <label key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200">
                                <input
                                    type="radio"
                                    name="selectedNumber"
                                    value={sim.number}
                                    checked={formData.selectedNumber === sim.number}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="font-semibold text-gray-900">{sim.number}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${sim.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {sim.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{sim.provider}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <Phone className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-700 font-medium">No linked numbers found</p>
                        <p className="text-sm text-gray-500 mt-1">Enter your number manually below</p>
                        <input
                            type="text"
                            name="selectedNumber"
                            value={formData.selectedNumber}
                            onChange={handleChange}
                            placeholder="0821234567"
                            className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                )}
                {errors.selectedNumber && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.selectedNumber}
                    </p>
                )}
            </div>

            {/* Biometric Consent */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                    type="checkbox"
                    checked={formData.biometricConsent}
                    onChange={(e) => setFormData(prev => ({ ...prev, biometricConsent: e.target.checked }))}
                    className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                    <label className="text-gray-800 font-semibold">Biometric Verification Consent</label>
                    <p className="text-sm text-gray-600 mt-1">
                        I consent to biometric verification including face matching with my ID documents.
                        Biometric data will be processed securely and deleted after 90 days.
                    </p>
                </div>
            </div>
            {errors.biometricConsent && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {errors.biometricConsent}
                </p>
            )}
        </div>
    );

    const renderBankInsurance = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                    <House className="w-5 h-5" />
                    <span className="font-semibold">Bank Account Protection</span>
                </div>
                <p className="text-sm text-green-600">
                    Secure your bank accounts with $1,000,000 insurance coverage against SIM swap fraud.
                </p>
            </div>

            {/* Bank Insurance Explanation */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowBankExplanation(!showBankExplanation)}
                >
                    <h3 className="font-semibold text-yellow-800">How Bank Protection Works</h3>
                    <ChevronDown className={`w-5 h-5 transform transition-transform ${showBankExplanation ? 'rotate-180' : ''}`} />
                </div>

                {showBankExplanation && (
                    <div className="mt-3 space-y-2 text-sm text-yellow-700">
                        <p><strong>Protection Features:</strong></p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Immediate account freezing during SIM swap detection</li>
                            <li>$1,000,000 coverage per account for financial losses</li>
                            <li>24/7 monitoring and instant alerts</li>
                            <li>Legal support for fraud recovery</li>
                            <li>Direct communication with your bank's security team</li>
                        </ul>
                    </div>
                )}
            </div>

            {formData.bankAccounts.map((account, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-5 relative bg-white">
                    {formData.bankAccounts.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeBankAccount(index)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 rounded"
                        >
                            <X size={18} />
                        </button>
                    )}

                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">Bank Account {index + 1}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Bank Name</label>
                            <input
                                type="text"
                                value={account.bankName}
                                onChange={(e) => handleBankChange(index, "bankName", e.target.value)}
                                placeholder="e.g., FNB, Standard Bank, ABSA"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors[`bankName-${index}`] ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors[`bankName-${index}`] && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    {errors[`bankName-${index}`]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Account Number</label>
                            <input
                                type="text"
                                value={account.accountNumber}
                                onChange={(e) => handleBankChange(index, "accountNumber", e.target.value)}
                                placeholder="1234567890"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors[`accountNumber-${index}`] ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors[`accountNumber-${index}`] && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    {errors[`accountNumber-${index}`]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div>
                            <p className="font-semibold text-green-800">$1,000,000 Insurance Coverage</p>
                            <p className="text-sm text-green-600">Protected against SIM swap fraud</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={account.insured}
                                onChange={(e) => handleBankChange(index, "insured", e.target.checked)}
                                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Insure this account</span>
                        </div>
                    </div>

                    {/* Account Terms Acceptance */}
                    <div className="flex items-start gap-3 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <input
                            type="checkbox"
                            checked={account.termsAccepted}
                            onChange={(e) => handleBankChange(index, "termsAccepted", e.target.checked)}
                            className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                            <label className="text-gray-800 font-medium">
                                I authorize monitoring and protection of this bank account
                            </label>
                            <p className="text-sm text-gray-600 mt-1">
                                This includes temporary freezing during security threats and communication with your bank.
                            </p>
                        </div>
                    </div>
                    {errors[`terms-${index}`] && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            {errors[`terms-${index}`]}
                        </p>
                    )}
                </div>
            ))}

            <button
                type="button"
                onClick={addBankAccount}
                className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
            >
                <Plus size={18} /> Add Another Bank Account
            </button>
        </div>
    );

    const renderNextOfKin = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <User className="w-5 h-5" />
                    <span className="font-semibold">Emergency Contacts</span>
                </div>
                <p className="text-sm text-purple-600">
                    These contacts will be notified immediately if we detect suspicious activity on your number.
                </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                <label className="flex items-center gap-3 text-gray-800 font-semibold">
                    <Phone className="w-5 h-5 text-blue-600" />
                    Enable Emergency Alerts
                </label>
                <input
                    type="checkbox"
                    checked={formData.nextOfKinAlert}
                    onChange={(e) => setFormData(prev => ({ ...prev, nextOfKinAlert: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
            </div>

            {formData.nextOfKinAlert && (
                <>
                    {formData.nextOfKin.map((kin, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-5 relative bg-white">
                            {formData.nextOfKin.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeNextOfKin(index)}
                                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 rounded"
                                >
                                    <X size={18} />
                                </button>
                            )}

                            <h4 className="font-semibold text-gray-800 mb-4 text-lg">Emergency Contact {index + 1}</h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={kin.name}
                                        onChange={(e) => handleKinChange(index, "name", e.target.value)}
                                        placeholder="Full name"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors[`kinName-${index}`] ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors[`kinName-${index}`] && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <AlertTriangle className="w-4 h-4" />
                                            {errors[`kinName-${index}`]}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        value={kin.number}
                                        onChange={(e) => handleKinChange(index, "number", e.target.value)}
                                        placeholder="0821234567"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors[`kinNumber-${index}`] ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors[`kinNumber-${index}`] && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <AlertTriangle className="w-4 h-4" />
                                            {errors[`kinNumber-${index}`]}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Relationship</label>
                                    <select
                                        value={kin.relationship}
                                        onChange={(e) => handleKinChange(index, "relationship", e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors[`kinRelationship-${index}`] ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select relationship</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Parent">Parent</option>
                                        <option value="Child">Child</option>
                                        <option value="Sibling">Sibling</option>
                                        <option value="Friend">Friend</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors[`kinRelationship-${index}`] && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <AlertTriangle className="w-4 h-4" />
                                            {errors[`kinRelationship-${index}`]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addNextOfKin}
                        className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                    >
                        <Plus size={18} /> Add Another Contact
                    </button>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-800 mb-3">Alert Details</h4>
                        <ul className="text-sm text-blue-700 space-y-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Immediate SMS alert when SIM swap is detected
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Instructions on how to verify your safety
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Emergency contact numbers for assistance
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );

    const renderLegalAuthorization = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-orange-700 mb-2">
                    <FileText className="w-5 h-5" />
                    <span className="font-semibold">Legal Authorizations Required</span>
                </div>
                <p className="text-sm text-orange-600">
                    These authorizations are required to protect your accounts and provide insurance coverage.
                </p>
            </div>

            {[
                {
                    key: "telecomAuthorization",
                    title: "Telecommunications Authorization",
                    text: "I authorize communication with my telecom provider to detect and block SIM swap attempts."
                },
                {
                    key: "financialAuthorization",
                    title: "Financial Institution Authorization",
                    text: "I authorize instructing my linked banks to temporarily freeze accounts during security threats."
                },
                {
                    key: "automatedActions",
                    title: "Automated Actions Consent",
                    text: "I consent to automated account protection measures that may activate without prior notice."
                },
                {
                    key: "privacyConsent",
                    title: "Privacy Policy & Data Processing",
                    text: "I consent to my data being processed per POPIA/GDPR regulations."
                },
                {
                    key: "insuranceTerms",
                    title: "Insurance Terms Acceptance",
                    text: "I accept the $1,000,000 identity theft insurance policy terms."
                }
            ].map((consent, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-white">
                    <input
                        type="checkbox"
                        checked={formData[consent.key]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [consent.key]: e.target.checked }))}
                        className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                        <label className="text-gray-800 font-semibold block mb-2">{consent.title}</label>
                        <p className="text-sm text-gray-600">{consent.text}</p>
                        {errors[consent.key] && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4" />
                                This authorization is required
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderDigitalSignature = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                    <Signature className="w-5 h-5" />
                    <span className="font-semibold">Legal Digital Signature</span>
                </div>
                <p className="text-sm text-red-600">
                    Your digital signature creates a legally binding agreement for SIM protection insurance.
                </p>
            </div>

            <div>
                <label className="block text-gray-800 font-semibold mb-3">Full Legal Name</label>
                <input
                    type="text"
                    name="fullLegalName"
                    value={formData.fullLegalName}
                    onChange={handleChange}
                    placeholder="As it appears on your government ID"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.fullLegalName ? "border-red-500" : "border-gray-300"
                        }`}
                />
                {errors.fullLegalName && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.fullLegalName}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-gray-800 font-semibold mb-3">Digital Signature</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white">
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={200}
                        className="w-full h-40 bg-white border border-gray-200 rounded-lg cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>
                <div className="flex justify-between items-center mt-3">
                    <button
                        type="button"
                        onClick={clearSignature}
                        className="text-red-600 font-medium hover:text-red-800 transition-colors"
                    >
                        Clear Signature
                    </button>
                    <span className="text-sm text-gray-500">Sign above exactly as on your ID</span>
                </div>
                {errors.signature && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.signature}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                    <strong>Timestamp:</strong> {new Date().toLocaleString()}
                </div>
                <div>
                    <strong>IP Address:</strong> Secured
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <input
                        type="checkbox"
                        checked={formData.perjuryCertification}
                        onChange={(e) => setFormData(prev => ({ ...prev, perjuryCertification: e.target.checked }))}
                        className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                        <label className="text-gray-800 font-semibold">Certification Under Penalty of Perjury</label>
                        <p className="text-sm text-gray-600 mt-1">I certify under penalty of perjury that all information is true and accurate.</p>
                    </div>
                </div>
                {errors.perjuryCertification && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.perjuryCertification}
                    </p>
                )}

                <div className="flex items-start gap-4">
                    <input
                        type="checkbox"
                        checked={formData.bindingAgreement}
                        onChange={(e) => setFormData(prev => ({ ...prev, bindingAgreement: e.target.checked }))}
                        className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                        <label className="text-gray-800 font-semibold">Legally Binding Agreement</label>
                        <p className="text-sm text-gray-600 mt-1">I understand this is a legally binding insurance application and agreement.</p>
                    </div>
                </div>
                {errors.bindingAgreement && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.bindingAgreement}
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <div>
                        <h2 className="text-2xl font-bold">SIM Protection Registration</h2>
                        <p className="text-blue-100">Secure your SIM and bank accounts with $1,000,000 coverage</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-blue-700 rounded-lg transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between px-8 py-4 bg-gray-50 border-b border-gray-200">
                    {steps.map((step, index) => (
                        <div key={step.title} className="flex flex-col items-center flex-1">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(index)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentStep >= index
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white text-gray-500 border border-gray-300'
                                    }`}
                            >
                                {step.icon}
                                <span className="font-medium text-sm">{step.title}</span>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Form Content - Fixed height with proper scrolling */}
                <div className="flex-1 overflow-hidden">
                    <form onSubmit={handleSubmit} className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto p-6">
                            {renderStep()}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="border-t border-gray-200 p-6 bg-white">
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Previous
                                </button>

                                {currentStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </span>
                                        ) : (
                                            "Complete Registration"
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterSimProtection;