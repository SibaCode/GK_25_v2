// src/pages/RegisterSimProtection.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function RegisterSimProtection({ onClose }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [savingStep, setSavingStep] = useState(false);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const drawing = useRef(false);
    const lastPoint = useRef({ x: 0, y: 0 });

    const [form, setForm] = useState({
        idNumber: "",
        linkedNumber: "",
        linkedNumbers: [],
        emailAlert: true,
        email: "",
        bankAccounts: [{ bankName: "", accountNumber: "" }],
        nextOfKin: [{ name: "", phone: "", relationship: "" }],
        authorizations: { telecom: true, bank: true, biometric: false },
        signatureDataUrl: null,
        signatureName: "",
        consent: true,
    });

    const steps = [
        { id: 1, name: "Identity & SIM" },
        { id: 2, name: "Bank Accounts" },
        { id: 3, name: "Next-of-Kin" },
        { id: 4, name: "Authorizations" },
        { id: 5, name: "Signature" },
    ];

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        ctx.scale(ratio, ratio);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 2;
        ctxRef.current = ctx;

        if (form.signatureDataUrl) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
            img.src = form.signatureDataUrl;
        }
    }, [canvasRef, form.signatureDataUrl]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleArrayChange = (e, arrayName, index, field) => {
        const newArray = [...form[arrayName]];
        newArray[index][field] = e.target.value;
        setForm(prev => ({ ...prev, [arrayName]: newArray }));
    };

    const addArrayItem = (arrayName, itemTemplate) => {
        setForm(prev => ({ ...prev, [arrayName]: [...prev[arrayName], itemTemplate] }));
    };

    const removeArrayItem = (arrayName, index) => {
        const newArray = [...form[arrayName]];
        newArray.splice(index, 1);
        setForm(prev => ({ ...prev, [arrayName]: newArray }));
    };

    const startDrawing = (e) => {
        if (!ctxRef.current) return;
        drawing.current = true;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        lastPoint.current = { x, y };
    };

    const draw = (e) => {
        if (!drawing.current || !ctxRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        const ctx = ctxRef.current;
        ctx.beginPath();
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastPoint.current = { x, y };
    };

    const stopDrawing = () => {
        drawing.current = false;
        if (!canvasRef.current) return;
        const dataUrl = canvasRef.current.toDataURL("image/png");
        setForm(prev => ({ ...prev, signatureDataUrl: dataUrl }));
    };

    const clearSignature = () => {
        if (!ctxRef.current || !canvasRef.current) return;
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setForm(prev => ({ ...prev, signatureDataUrl: null }));
    };

    const validateStep = () => {
        const stepErrors = {};
        if (currentStep === 1) {
            if (!/^\d{13}$/.test(form.idNumber)) stepErrors.idNumber = "ID must be 13 digits";
            if (!form.linkedNumber) stepErrors.linkedNumber = "Select a linked SIM";
        }
        if (currentStep === 2) {
            form.bankAccounts.forEach((acc, i) => {
                if (!acc.bankName) stepErrors[`bankName_${i}`] = "Required";
                if (!acc.accountNumber) stepErrors[`accountNumber_${i}`] = "Required";
            });
        }
        if (currentStep === 3) {
            form.nextOfKin.forEach((kin, i) => {
                if (!kin.name) stepErrors[`kinName_${i}`] = "Required";
                if (!kin.phone) stepErrors[`kinPhone_${i}`] = "Required";
                if (!kin.relationship) stepErrors[`kinRelationship_${i}`] = "Required";
            });
        }
        if (currentStep === 5) {
            if (!form.signatureDataUrl) stepErrors.signature = "Signature required";
            if (!form.signatureName) stepErrors.signatureName = "Full name required";
        }
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const saveStep = async () => {
        if (!auth.currentUser) return;
        setSavingStep(true);
        try {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                simProtection: form,
                lastSavedStep: currentStep,
                updatedAt: serverTimestamp()
            }, { merge: true });
        } catch (err) {
            console.error(err);
        } finally {
            setSavingStep(false);
        }
    };

    const nextStep = async () => {
        if (validateStep()) {
            await saveStep();
            setCurrentStep(s => Math.min(s + 1, steps.length));
        }
    };

    const prevStep = async () => {
        await saveStep();
        setCurrentStep(s => Math.max(s - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;
        setLoading(true);
        try {
            if (!auth.currentUser) return;
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                simProtection: form,
                completedAt: serverTimestamp()
            }, { merge: true });
            alert("SIM Protection registration complete!");
            if (onClose) onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save. Try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-3xl border border-gray-100"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Register SIM Protection</h2>
                <ProgressBar step={currentStep} total={steps.length} />

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 1 && (
                                <Step1 form={form} onChange={handleChange} errors={errors} />
                            )}
                            {currentStep === 2 && (
                                <Step2 form={form} onChange={handleArrayChange} addItem={addArrayItem} removeItem={removeArrayItem} errors={errors} />
                            )}
                            {currentStep === 3 && (
                                <Step3 form={form} onChange={handleArrayChange} addItem={addArrayItem} removeItem={removeArrayItem} errors={errors} />
                            )}
                            {currentStep === 4 && (
                                <Step4 form={form} onChange={handleChange} errors={errors} />
                            )}
                            {currentStep === 5 && (
                                <Step5 form={form} startDrawing={startDrawing} draw={draw} stopDrawing={stopDrawing} clearSignature={clearSignature} canvasRef={canvasRef} onChange={handleChange} errors={errors} />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between">
                        {currentStep > 1 && (
                            <button type="button" onClick={prevStep} className="px-5 py-2 bg-gray-200 rounded-xl flex items-center gap-1"><ArrowLeft size={16} /> Back</button>
                        )}
                        {currentStep < steps.length ? (
                            <button type="button" onClick={nextStep} className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2">Next <ArrowRight size={16} /></button>
                        ) : (
                            <button type="submit" disabled={loading || savingStep} className="ml-auto px-6 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2">{loading ? <Loader2 className="animate-spin" size={18} /> : "Finish & Save"}</button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

/* ---------------- Components ---------------- */
const ProgressBar = ({ step, total }) => {
    const percent = (step / total) * 100;
    return (
        <div className="mb-4">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600" initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.3 }} />
            </div>
        </div>
    );
};

const Input = ({ label, name, value, onChange, type = "text", error }) => (
    <div>
        <label className="block font-medium text-gray-700">{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} className={`w-full mt-1 p-2 border rounded-lg ${error ? "border-red-500" : "border-gray-300"}`} />
        {error && <small className="text-red-500">{error}</small>}
    </div>
);

const Step1 = ({ form, onChange, errors }) => (
    <div className="space-y-4">
        <Input label="ID Number" name="idNumber" value={form.idNumber} onChange={onChange} error={errors.idNumber} />
        <Input label="Linked SIM Number" name="linkedNumber" value={form.linkedNumber} onChange={onChange} error={errors.linkedNumber} />
        <Input label="Email for Alerts" name="email" value={form.email} onChange={onChange} />
    </div>
);

const Step2 = ({ form, onChange, addItem, removeItem, errors }) => (
    <div className="space-y-4">
        {form.bankAccounts.map((acc, i) => (
            <div key={i} className="border p-4 rounded-lg space-y-2">
                <Input label="Bank Name" name={`bankName_${i}`} value={acc.bankName} onChange={e => onChange(e, "bankAccounts", i, "bankName")} error={errors[`bankName_${i}`]} />
                <Input label="Account Number" name={`accountNumber_${i}`} value={acc.accountNumber} onChange={e => onChange(e, "bankAccounts", i, "accountNumber")} error={errors[`accountNumber_${i}`]} />
                {i > 0 && <button type="button" onClick={() => removeItem("bankAccounts", i)} className="text-red-500">Remove</button>}
            </div>
        ))}
        <button type="button" onClick={() => addItem("bankAccounts", { bankName: "", accountNumber: "" })} className="mt-2 px-4 py-1 bg-gray-200 rounded">Add Account</button>
    </div>
);

const Step3 = ({ form, onChange, addItem, removeItem, errors }) => (
    <div className="space-y-4">
        {form.nextOfKin.map((kin, i) => (
            <div key={i} className="border p-4 rounded-lg space-y-2">
                <Input label="Name" value={kin.name} onChange={e => onChange(e, "nextOfKin", i, "name")} error={errors[`kinName_${i}`]} />
                <Input label="Phone" value={kin.phone} onChange={e => onChange(e, "nextOfKin", i, "phone")} error={errors[`kinPhone_${i}`]} />
                <Input label="Relationship" value={kin.relationship} onChange={e => onChange(e, "nextOfKin", i, "relationship")} error={errors[`kinRelationship_${i}`]} />
                {i > 0 && <button type="button" onClick={() => removeItem("nextOfKin", i)} className="text-red-500">Remove</button>}
            </div>
        ))}
        <button type="button" onClick={() => addItem("nextOfKin", { name: "", phone: "", relationship: "" })} className="mt-2 px-4 py-1 bg-gray-200 rounded">Add Contact</button>
    </div>
);

const Step4 = ({ form, onChange }) => (
    <div className="space-y-4">
        <label className="flex items-center gap-2"><input type="checkbox" name="authorizations.telecom" checked={form.authorizations.telecom} onChange={onChange} /> Authorize Telecom</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="authorizations.bank" checked={form.authorizations.bank} onChange={onChange} /> Authorize Bank</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="authorizations.biometric" checked={form.authorizations.biometric} onChange={onChange} /> Biometric Consent</label>
    </div>
);

const Step5 = ({ form, startDrawing, draw, stopDrawing, clearSignature, canvasRef, onChange, errors }) => (
    <div>
        <label className="block font-medium text-gray-700 mb-1">Signature</label>
        <div className="border h-40 relative">
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }}
                onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
            <button type="button" onClick={clearSignature} className="absolute top-1 right-1 bg-gray-200 px-2 py-1 rounded">Clear</button>
        </div>
        <Input label="Full Name" name="signatureName" value={form.signatureName} onChange={onChange} error={errors.signatureName} />
        {errors.signature && <p className="text-red-500">{errors.signature}</p>}
    </div>
);
