// src/pages/Register.js
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle2, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState("pending");
    const [errors, setErrors] = useState({});
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const streamRef = useRef(null);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        idNumber: "",
        address: { street: "", city: "", province: "", postalCode: "" },
        password: "",
        confirmPassword: "",
        facePhoto: null,
        termsAccepted: false,
    });

    const regex = {
        name: /^[A-Za-z\s]{2,}$/,
        idNumber: /^\d{13}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^0\d{9}$/,
        postalCode: /^\d{4}$/,
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
        } else {
            setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        }
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch {
            alert("Camera access denied. Please check permissions.");
        }
    };

    const stopCamera = () => streamRef.current?.getTracks().forEach((t) => t.stop());

    const capturePhoto = () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL("image/jpeg");
        setForm((prev) => ({ ...prev, facePhoto: photoData }));
        setVerificationStatus("captured");
        setTimeout(() => setVerificationStatus("verified"), 2000);
        stopCamera();
    };

    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((prev) => ({ ...prev, facePhoto: reader.result }));
            setVerificationStatus("captured");
            setTimeout(() => setVerificationStatus("verified"), 2000);
        };
        reader.readAsDataURL(file);
    };

    const validateStep = () => {
        const stepErrors = {};
        if (currentStep === 1) {
            if (!regex.name.test(form.firstName)) stepErrors.firstName = "Enter a valid first name";
            if (!regex.name.test(form.lastName)) stepErrors.lastName = "Enter a valid last name";
            if (!regex.email.test(form.email)) stepErrors.email = "Invalid email format";
            if (!regex.phone.test(form.phone)) stepErrors.phone = "Phone must start with 0 and be 10 digits";
        }
        if (currentStep === 2) {
            if (!regex.idNumber.test(form.idNumber)) stepErrors.idNumber = "ID must be 13 digits";
            Object.entries(form.address).forEach(([k, v]) => { if (!v) stepErrors[`address.${k}`] = "Required"; });
            if (!form.facePhoto) stepErrors.facePhoto = "Face verification required";
        }
        if (currentStep === 3) {
            if (!form.password || form.password.length < 6) stepErrors.password = "Password must be at least 6 characters";
            if (form.password !== form.confirmPassword) stepErrors.confirmPassword = "Passwords do not match";
            if (!form.termsAccepted) stepErrors.termsAccepted = "Please accept the terms";
        }
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const nextStep = () => { if (validateStep()) setCurrentStep((s) => s + 1); };
    const prevStep = () => setCurrentStep((s) => s - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;
        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
            const user = cred.user;
            await updateProfile(user, { displayName: `${form.firstName} ${form.lastName}` });
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                ...form,
                fullName: `${form.firstName} ${form.lastName}`,
                verificationStatus,
                faceVerified: verificationStatus === "verified",
                createdAt: serverTimestamp(),
            });
            navigate("/dashboard");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
            stopCamera();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Create Your Account</h2>
                <ProgressBar step={currentStep} total={3} />

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                        >
                            {currentStep === 1 && (
                                <Step1 form={form} onChange={handleChange} errors={errors} />
                            )}
                            {currentStep === 2 && (
                                <Step2
                                    form={form}
                                    onChange={handleChange}
                                    errors={errors}
                                    startCamera={startCamera}
                                    capturePhoto={capturePhoto}
                                    handleFileUpload={handleFileUpload}
                                    fileInputRef={fileInputRef}
                                    videoRef={videoRef}
                                    verificationStatus={verificationStatus}
                                    setForm={setForm}
                                    setVerificationStatus={setVerificationStatus}
                                />
                            )}
                            {currentStep === 3 && (
                                <Step3 form={form} onChange={handleChange} errors={errors} />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-5 py-2 flex items-center gap-1 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                        )}
                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="ml-auto px-6 py-2 flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow hover:from-blue-600 transition"
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="ml-auto px-6 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow hover:from-green-600 transition disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : "Finish & Register"}
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

/* ---------- Components ---------- */

const ProgressBar = ({ step, total }) => {
    const percent = (step / total) * 100;
    return (
        <div className="mb-4">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.4 }}
                />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                {[...Array(total)].map((_, i) => (
                    <span key={i} className={i + 1 <= step ? "text-blue-600 font-semibold" : ""}>
                        Step {i + 1}
                    </span>
                ))}
            </div>
        </div>
    );
};

const Input = ({ label, name, value, onChange, type = "text", error, help }) => (
    <div>
        <label className="font-medium text-gray-700">{label}</label>
        <input
            name={name}
            value={value}
            type={type}
            onChange={onChange}
            className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${error ? "border-red-500" : "border-gray-300"
                }`}
        />
        {help && <small className="text-gray-400">{help}</small>}
        {error && <small className="text-red-500 block">{error}</small>}
    </div>
);

const Step1 = ({ form, onChange, errors }) => (
    <div className="space-y-4">
        <Input label="First Name" name="firstName" value={form.firstName} onChange={onChange} error={errors.firstName} help="Enter your given name" />
        <Input label="Last Name" name="lastName" value={form.lastName} onChange={onChange} error={errors.lastName} help="Enter your family name" />
        <Input label="Email" name="email" value={form.email} onChange={onChange} error={errors.email} help="We'll never share your email" />
        <Input label="Phone" name="phone" value={form.phone} onChange={onChange} error={errors.phone} help="10 digits starting with 0" />
    </div>
);

const Step2 = ({
    form, onChange, errors, startCamera, capturePhoto,
    handleFileUpload, fileInputRef, videoRef,
    verificationStatus, setForm, setVerificationStatus,
}) => (
    <div className="space-y-4">
        <Input label="ID Number" name="idNumber" value={form.idNumber} onChange={onChange} error={errors.idNumber} help="13-digit SA ID" />
        <Input label="Street" name="address.street" value={form.address.street} onChange={onChange} />
        <Input label="City" name="address.city" value={form.address.city} onChange={onChange} />
        <Input label="Province" name="address.province" value={form.address.province} onChange={onChange} />
        <Input label="Postal Code" name="address.postalCode" value={form.address.postalCode} onChange={onChange} error={errors["address.postalCode"]} />

        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
            {!form.facePhoto ? (
                <>
                    <Camera className="mx-auto w-10 h-10 text-gray-400" />
                    <p className="text-gray-500 mt-1">Face verification required</p>
                    <div className="flex justify-center gap-2 mt-3">
                        <button onClick={startCamera} type="button" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Open Camera</button>
                        <button onClick={() => fileInputRef.current?.click()} type="button" className="bg-gray-200 px-4 py-2 rounded-lg">Upload</button>
                        <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0])} />
                    </div>
                    <video ref={videoRef} autoPlay muted className="w-full h-64 mt-3 rounded-lg object-cover" />
                    <button onClick={capturePhoto} type="button" className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg">Capture</button>
                    {errors.facePhoto && <p className="text-red-500 mt-2">{errors.facePhoto}</p>}
                </>
            ) : (
                <div>
                    <img src={form.facePhoto} alt="Face" className="w-32 h-32 rounded-xl mx-auto border-4 border-green-500" />
                    {verificationStatus === "verified" && (
                        <CheckCircle2 className="text-green-500 mx-auto mt-2" size={22} />
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            setForm((p) => ({ ...p, facePhoto: null }));
                            setVerificationStatus("pending");
                        }}
                        className="mt-2 text-red-500 underline text-sm"
                    >
                        Retake
                    </button>
                </div>
            )}
        </div>
    </div>
);

const Step3 = ({ form, onChange, errors }) => (
    <div className="space-y-4">
        <Input label="Password" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} help="Minimum 6 characters" />
        <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} error={errors.confirmPassword} />
        <div className="flex items-center gap-2">
            <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={onChange} />
            <p className="text-gray-700 text-sm">I accept the <span className="text-blue-600 underline">terms & privacy policy</span></p>
        </div>
        {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}
    </div>
);
