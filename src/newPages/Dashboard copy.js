//// src/pages/Register.js
//import React, { useState, useRef } from 'react';
//import { motion } from 'framer-motion';
//import { Camera, Upload, CheckCircle, AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';
//import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
//import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
//import { auth, db } from '../firebase';
//import { useNavigate, Link } from 'react-router-dom';

//const Register = () => {
//    const [formData, setFormData] = useState({
//        firstName: '',
//        lastName: '',
//        idNumber: '',
//        email: '',
//        phone: '',
//        password: '',
//        confirmPassword: '',
//        address: {
//            street: '',
//            city: '',
//            province: '',
//            postalCode: ''
//        },
//        facePhoto: null,
//        termsAccepted: false
//    });

//    const [loading, setLoading] = useState(false);
//    const [errors, setErrors] = useState({});
//    const [verificationStatus, setVerificationStatus] = useState('pending');
//    const [uploadProgress, setUploadProgress] = useState(0);
//    const [currentStep, setCurrentStep] = useState(1);
//    const [showPassword, setShowPassword] = useState(false);
//    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//    const [firebaseError, setFirebaseError] = useState('');

//    const fileInputRef = useRef(null);
//    const videoRef = useRef(null);
//    const streamRef = useRef(null);
//    const navigate = useNavigate();

//    const regex = {
//        name: /^[A-Za-z\s]{2,}$/,
//        idNumber: /^\d{13}$/,
//        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//        phone: /^0\d{9}$/,
//        postalCode: /^\d{4}$/,
//        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
//    };

//    const validateField = (name, value) => {
//        switch (name) {
//            case 'firstName':
//            case 'lastName':
//                return regex.name.test(value) ? '' : 'Name must contain only letters and be at least 2 characters long';
//            case 'idNumber':
//                if (!regex.idNumber.test(value)) return 'ID number must be exactly 13 digits';
//                return validateSAID(value) ? '' : 'Invalid South African ID number';
//            case 'email':
//                return regex.email.test(value) ? '' : 'Please enter a valid email address';
//            case 'phone':
//                return regex.phone.test(value) ? '' : 'Phone number must be 10 digits starting with 0';
//            case 'password':
//                if (!regex.password.test(value)) {
//                    return 'Password must be at least 8 characters with uppercase, lowercase, number and special character';
//                }
//                return '';
//            case 'confirmPassword':
//                return value === formData.password ? '' : 'Passwords do not match';
//            case 'postalCode':
//                return regex.postalCode.test(value) ? '' : 'Postal code must be 4 digits';
//            case 'street':
//            case 'city':
//            case 'province':
//                return value.trim().length >= 2 ? '' : 'This field is required';
//            default:
//                return '';
//        }
//    };

//    // South African ID validation using Luhn algorithm
//    const validateSAID = (idNumber) => {
//        if (idNumber.length !== 13 || !/^\d+$/.test(idNumber)) return false;

//        let sum = 0;
//        for (let i = 0; i < 12; i++) {
//            let digit = parseInt(idNumber[i]);
//            if (i % 2 === 0) {
//                sum += digit;
//            } else {
//                sum += digit * 2 > 9 ? digit * 2 - 9 : digit * 2;
//            }
//        }

//        const checkDigit = (10 - (sum % 10)) % 10;
//        return checkDigit === parseInt(idNumber[12]);
//    };

//    const handleChange = (e) => {
//        const { name, value, type, checked } = e.target;

//        // Clear any Firebase errors when user starts typing
//        if (firebaseError) {
//            setFirebaseError('');
//        }

//        if (name.startsWith('address.')) {
//            const addressField = name.split('.')[1];
//            setFormData(prev => ({
//                ...prev,
//                address: { ...prev.address, [addressField]: value }
//            }));

//            if (errors[`address.${addressField}`]) {
//                setErrors(prev => ({ ...prev, [`address.${addressField}`]: '' }));
//            }
//        } else {
//            setFormData(prev => ({
//                ...prev,
//                [name]: type === 'checkbox' ? checked : value
//            }));

//            if (errors[name]) {
//                setErrors(prev => ({ ...prev, [name]: '' }));
//            }

//            // Validate confirm password when password changes
//            if (name === 'password' && formData.confirmPassword) {
//                const confirmError = validateField('confirmPassword', formData.confirmPassword);
//                setErrors(prev => ({
//                    ...prev,
//                    confirmPassword: confirmError
//                }));
//            }
//        }
//    };

//    const startCamera = async () => {
//        try {
//            const stream = await navigator.mediaDevices.getUserMedia({
//                video: {
//                    width: 1280,
//                    height: 720,
//                    facingMode: 'user'
//                }
//            });
//            streamRef.current = stream;
//            if (videoRef.current) {
//                videoRef.current.srcObject = stream;
//            }
//        } catch (error) {
//            console.error("Error accessing camera:", error);
//            alert("Unable to access camera. Please check permissions and ensure you're using HTTPS.");
//        }
//    };

//    const capturePhoto = () => {
//        if (videoRef.current) {
//            const canvas = document.createElement('canvas');
//            canvas.width = videoRef.current.videoWidth;
//            canvas.height = videoRef.current.videoHeight;
//            const ctx = canvas.getContext('2d');
//            ctx.drawImage(videoRef.current, 0, 0);

//            canvas.toBlob((blob) => {
//                const reader = new FileReader();
//                reader.onloadend = () => {
//                    setFormData(prev => ({ ...prev, facePhoto: reader.result }));
//                    setVerificationStatus('captured');

//                    // Simulate face verification
//                    setTimeout(() => {
//                        setVerificationStatus('verified');
//                    }, 2000);
//                };
//                reader.readAsDataURL(blob);
//            }, 'image/jpeg', 0.8);

//            stopCamera();
//        }
//    };

//    const stopCamera = () => {
//        if (streamRef.current) {
//            streamRef.current.getTracks().forEach(track => track.stop());
//        }
//    };

//    const handleFileUpload = (file) => {
//        if (!file.type.startsWith('image/')) {
//            alert('Please select an image file');
//            return;
//        }

//        if (file.size > 5 * 1024 * 1024) {
//            alert('Please select an image smaller than 5MB');
//            return;
//        }

//        const reader = new FileReader();
//        setUploadProgress(0);

//        reader.onprogress = (e) => {
//            if (e.lengthComputable) {
//                const progress = (e.loaded / e.total) * 100;
//                setUploadProgress(progress);
//            }
//        };

//        reader.onloadend = () => {
//            setFormData(prev => ({ ...prev, facePhoto: reader.result }));
//            setVerificationStatus('captured');

//            // Simulate face verification
//            setTimeout(() => {
//                setVerificationStatus('verified');
//            }, 2000);
//        };

//        reader.readAsDataURL(file);
//    };

//    const validateStep = (step) => {
//        const newErrors = {};

//        if (step === 1) {
//            ['firstName', 'lastName', 'idNumber', 'email', 'phone', 'password', 'confirmPassword'].forEach(key => {
//                const error = validateField(key, formData[key]);
//                if (error) newErrors[key] = error;
//            });
//        } else if (step === 2) {
//            Object.keys(formData.address).forEach(key => {
//                const error = validateField(key, formData.address[key]);
//                if (error) newErrors[`address.${key}`] = error;
//            });
//        } else if (step === 3) {
//            if (!formData.facePhoto) {
//                newErrors.facePhoto = 'Face verification photo is required';
//            }
//            if (!formData.termsAccepted) {
//                newErrors.termsAccepted = 'You must accept the terms and conditions';
//            }
//        }

//        setErrors(newErrors);
//        return Object.keys(newErrors).length === 0;
//    };

//    const nextStep = () => {
//        if (validateStep(currentStep)) {
//            setCurrentStep(prev => prev + 1);
//        }
//    };

//    const prevStep = () => {
//        setCurrentStep(prev => prev - 1);
//    };

//    const validateForm = () => {
//        return validateStep(1) && validateStep(2) && validateStep(3);
//    };

//    const handleSubmit = async (e) => {
//        e.preventDefault();

//        if (!validateForm()) {
//            alert('Please fix all errors before submitting');
//            return;
//        }

//        setLoading(true);
//        setFirebaseError('');

//        try {
//            console.log('Starting registration process...');

//            // Create user with email and password
//            const userCredential = await createUserWithEmailAndPassword(
//                auth,
//                formData.email,
//                formData.password
//            );

//            const user = userCredential.user;
//            console.log('Firebase Auth user created:', user.uid);

//            // Update user profile
//            await updateProfile(user, {
//                displayName: `${formData.firstName} ${formData.lastName}`,
//                photoURL: formData.facePhoto
//            });
//            console.log('User profile updated');

//            // Prepare user data for Firestore
//            const userData = {
//                uid: user.uid,
//                firstName: formData.firstName.trim(),
//                lastName: formData.lastName.trim(),
//                fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
//                idNumber: formData.idNumber,
//                email: formData.email.toLowerCase().trim(),
//                phone: formData.phone,
//                address: {
//                    street: formData.address.street.trim(),
//                    city: formData.address.city.trim(),
//                    province: formData.address.province,
//                    postalCode: formData.address.postalCode
//                },
//                facePhoto: formData.facePhoto,
//                faceVerified: true,
//                faceVerificationDate: serverTimestamp(),
//                preferredLanguage: 'en',
//                createdAt: serverTimestamp(),
//                updatedAt: serverTimestamp(),
//                status: 'active'
//            };

//            console.log('Saving user data to Firestore:', userData);

//            // Save user data to Firestore
//            await setDoc(doc(db, "users", user.uid), userData);
//            console.log('User data saved to Firestore successfully');

//            alert('Registration successful! You can now set up SIM protection.');
//            navigate('/dashboard');

//        } catch (error) {
//            console.error('Registration error:', error);
//            console.error('Error details:', {
//                code: error.code,
//                message: error.message,
//                stack: error.stack
//            });

//            let errorMessage = 'Registration failed. Please try again.';

//            if (error.code === 'auth/email-already-in-use') {
//                errorMessage = 'Email already registered. Please use a different email or try logging in.';
//            } else if (error.code === 'auth/invalid-email') {
//                errorMessage = 'Invalid email address.';
//            } else if (error.code === 'auth/operation-not-allowed') {
//                errorMessage = 'Email/password accounts are not enabled. Please contact support.';
//            } else if (error.code === 'auth/network-request-failed') {
//                errorMessage = 'Network error. Please check your connection and try again.';
//            } else if (error.code === 'auth/weak-password') {
//                errorMessage = 'Password is too weak. Please use a stronger password.';
//            } else if (error.code === 'permission-denied') {
//                errorMessage = 'Firestore permission denied. Please check database rules.';
//            } else if (error.code === 'firestore/unavailable') {
//                errorMessage = 'Firestore is unavailable. Please check your connection.';
//            }

//            setFirebaseError(errorMessage);
//            alert(errorMessage);
//        } finally {
//            setLoading(false);
//            stopCamera();
//        }
//    };

//    const steps = [
//        { number: 1, title: 'Personal Info' },
//        { number: 2, title: 'Address' },
//        { number: 3, title: 'Verification' }
//    ];

//    const togglePasswordVisibility = () => {
//        setShowPassword(!showPassword);
//    };

//    const toggleConfirmPasswordVisibility = () => {
//        setShowConfirmPassword(!showConfirmPassword);
//    };

//    return (
//        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//            <motion.div
//                initial={{ opacity: 0, y: 20 }}
//                animate={{ opacity: 1, y: 0 }}
//                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden"
//            >
//                {/* Header with Logo */}
//                <div className="bg-white border-b border-gray-200 p-6">
//                    <div className="flex items-center justify-center gap-3">
//                        <Shield className="w-8 h-8 text-blue-600" />
//                        <div className="text-center">
//                            <h1 className="text-3xl font-bold text-blue-600">SimSure</h1>
//                            <p className="text-gray-500 text-sm">FSP License #123456</p>
//                        </div>
//                    </div>
//                </div>

//                <div className="p-6 lg:p-8 overflow-y-auto max-h-screen">
//                    {/* Progress Steps */}
//                    <div className="mb-8">
//                        <div className="flex justify-between items-center mb-4">
//                            {steps.map((step, index) => (
//                                <React.Fragment key={step.number}>
//                                    <div className="flex flex-col items-center">
//                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${currentStep >= step.number
//                                                ? 'bg-blue-600 text-white border-blue-600'
//                                                : 'bg-white text-gray-500 border-gray-300'
//                                            }`}>
//                                            {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
//                                        </div>
//                                        <span className="text-xs mt-2 text-gray-600 font-medium">{step.title}</span>
//                                    </div>
//                                    {index < steps.length - 1 && (
//                                        <div className={`flex-1 h-1 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
//                                            }`} />
//                                    )}
//                                </React.Fragment>
//                            ))}
//                        </div>
//                    </div>

//                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Create Your Account</h2>
//                    <p className="text-gray-600 mb-6 text-center">Secure your identity with bank-level verification</p>

//                    {/* Firebase Error Display */}
//                    {firebaseError && (
//                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//                            <div className="flex items-center gap-2 text-red-800">
//                                <AlertCircle className="w-5 h-5" />
//                                <span className="font-semibold">Registration Error</span>
//                            </div>
//                            <p className="text-red-600 text-sm mt-1">{firebaseError}</p>
//                        </div>
//                    )}

//                    <form onSubmit={handleSubmit} className="space-y-6">
//                        {/* Step 1: Personal Information */}
//                        {currentStep === 1 && (
//                            <motion.div
//                                initial={{ opacity: 0, x: 20 }}
//                                animate={{ opacity: 1, x: 0 }}
//                                className="space-y-6"
//                            >
//                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                    <div>
//                                        <label className="block text-gray-700 font-medium mb-2">
//                                            First Name *
//                                        </label>
//                                        <input
//                                            type="text"
//                                            name="firstName"
//                                            value={formData.firstName}
//                                            onChange={handleChange}
//                                            className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                                }`}
//                                            placeholder="Enter your first name"
//                                        />
//                                        {errors.firstName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                            <AlertCircle className="w-3 h-3" /> {errors.firstName}
//                                        </p>}
//                                    </div>

//                                    <div>
//                                        <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
//                                        <input
//                                            type="text"
//                                            name="lastName"
//                                            value={formData.lastName}
//                                            onChange={handleChange}
//                                            className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                                }`}
//                                            placeholder="Enter your last name"
//                                        />
//                                        {errors.lastName && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                            <AlertCircle className="w-3 h-3" /> {errors.lastName}
//                                        </p>}
//                                    </div>
//                                </div>

//                                <div>
//                                    <label className="block text-gray-700 font-medium mb-2">
//                                        South African ID Number *
//                                    </label>
//                                    <input
//                                        type="text"
//                                        name="idNumber"
//                                        value={formData.idNumber}
//                                        onChange={handleChange}
//                                        maxLength={13}
//                                        className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.idNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                            }`}
//                                        placeholder="Enter 13-digit ID number"
//                                    />
//                                    {errors.idNumber && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                        <AlertCircle className="w-3 h-3" /> {errors.idNumber}
//                                    </p>}
//                                </div>

//                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                    <div>
//                                        <label className="block text-gray-700 font-medium mb-2">
//                                            Email Address *
//                                        </label>
//                                        <input
//                                            type="email"
//                                            name="email"
//                                            value={formData.email}
//                                            onChange={handleChange}
//                                            className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                                }`}
//                                            placeholder="your@email.com"
//                                        />
//                                        {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                            <AlertCircle className="w-3 h-3" /> {errors.email}
//                                        </p>}
//                                    </div>

//                                    <div>
//                                        <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
//                                        <input
//                                            type="tel"
//                                            name="phone"
//                                            value={formData.phone}
//                                            onChange={handleChange}
//                                            className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                                }`}
//                                            placeholder="082 123 4567"
//                                        />
//                                        {errors.phone && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                            <AlertCircle className="w-3 h-3" /> {errors.phone}
//                                        </p>}
//                                    </div>
//                                </div>

//                                {/* Password Fields */}
//                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                    <div>
//                                        <label className="block text-gray-700 font-medium mb-2">
//                                            Password *
//                                        </label>
//                                        <div className="relative">
//                                            <input
//                                                type={showPassword ? "text" : "password"}
//                                                name="password"
//                                                value={formData.password}
//                                                onChange={handleChange}
//                                                className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition pr-10 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                                    }`}
//                                                placeholder="Create a strong password"
//                                            />
//                                            <button
//                                                type="button"
//                                                onClick={togglePasswordVisibility}
//                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                                            >
//                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                            </button>
//                                        </div>
//                                        {errors.password && (
//                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                                <AlertCircle className="w-3 h-3" /> {errors.password}
//                                            </p>
//                                        )}
//                                        <p className="text-gray-500 text-xs mt-2">
//                                            Must be at least 8 characters with uppercase, lowercase, number and special character
//                                        </p>
//                                    </div>

//                                    <div>
//                                        <label className="block text-gray-700 font-medium mb-2">
//                                            Confirm Password *
//                                        </label>
//                                        <div className="relative">
//                                            <input
//                                                type={showConfirmPassword ? "text" : "password"}
//                                                name="confirmPassword"
//                                                value={formData.confirmPassword}
//                                                onChange={handleChange}
//                                                className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition pr-10 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                                    }`}
//                                                placeholder="Confirm your password"
//                                            />
//                                            <button
//                                                type="button"
//                                                onClick={toggleConfirmPasswordVisibility}
//                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                                            >
//                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                            </button>
//                                        </div>
//                                        {errors.confirmPassword && (
//                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                                <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
//                                            </p>
//                                        )}
//                                    </div>
//                                </div>
//                            </motion.div>
//                        )}

//                        {/* Step 2: Address Information */}
//                        {currentStep === 2 && (
//                            <motion.div
//                                initial={{ opacity: 0, x: 20 }}
//                                animate={{ opacity: 1, x: 0 }}
//                                className="space-y-6"
//                            >
//                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                                    <div className="flex items-center gap-2 text-blue-800">
//                                        <span className="font-semibold">Residential Address</span>
//                                    </div>
//                                    <p className="text-blue-600 text-sm mt-1">
//                                        Please provide your physical residential address as it appears on your official documents.
//                                    </p>
//                                </div>

//                                <div>
//                                    <label className="block text-gray-700 font-medium mb-2">Street Address *</label>
//                                    <input
//                                        type="text"
//                                        name="address.street"
//                                        value={formData.address.street}
//                                        onChange={handleChange}
//                                        className={`w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors['address.street'] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                            }`}
//                                        placeholder="123 Main Street, Suburb"
//                                    />
//                                    {errors['address.street'] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                        <AlertCircle className="w-3 h-3" /> {errors['address.street']}
//                                    </p>}
//                                </div>

//                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                    <div>
//                                        <label className="block text-gray-700 font-medium mb-2">City *</label>
//                                        <input
//                                            type="text"
//                                            name="address.city"
//                                            value={formData.address.city}
//                                            onChange={handleChange}
//                                            className={`border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition w-full ${errors['address.city'] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                                }`}
//                                            placeholder="City"
//                                        />
//                                        {errors['address.city'] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                            <AlertCircle className="w-3 h-3" /> {errors['address.city']}
//                                        </p>}
//                                    </div>

//                                    <div>
//                                        <label className="block text-gray-700 font-medium mb-2">Province *</label>
//                                        <select
//                                            name="address.province"
//                                            value={formData.address.province}
//                                            onChange={handleChange}
//                                            className={`border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition w-full ${errors['address.province'] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                                }`}
//                                        >
//                                            <option value="">Select Province</option>
//                                            <option value="Eastern Cape">Eastern Cape</option>
//                                            <option value="Free State">Free State</option>
//                                            <option value="Gauteng">Gauteng</option>
//                                            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
//                                            <option value="Limpopo">Limpopo</option>
//                                            <option value="Mpumalanga">Mpumalanga</option>
//                                            <option value="Northern Cape">Northern Cape</option>
//                                            <option value="North West">North West</option>
//                                            <option value="Western Cape">Western Cape</option>
//                                        </select>
//                                        {errors['address.province'] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                            <AlertCircle className="w-3 h-3" /> {errors['address.province']}
//                                        </p>}
//                                    </div>

//                                    <div>
//                                        <label className="block text-gray-700 font-medium mb-2">Postal Code *</label>
//                                        <input
//                                            type="text"
//                                            name="address.postalCode"
//                                            value={formData.address.postalCode}
//                                            onChange={handleChange}
//                                            maxLength={4}
//                                            className={`border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition w-full ${errors['address.postalCode'] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
//                                                }`}
//                                            placeholder="Postal Code"
//                                        />
//                                        {errors['address.postalCode'] && <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                                            <AlertCircle className="w-3 h-3" /> {errors['address.postalCode']}
//                                        </p>}
//                                    </div>
//                                </div>
//                            </motion.div>
//                        )}

//                        {/* Step 3: Face Verification & Terms */}
//                        {currentStep === 3 && (
//                            <motion.div
//                                initial={{ opacity: 0, x: 20 }}
//                                animate={{ opacity: 1, x: 0 }}
//                                className="space-y-6"
//                            >
//                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                                    <label className="block text-gray-700 font-medium mb-4 flex items-center gap-2">
//                                        <Camera className="w-5 h-5" />
//                                        Face Verification *
//                                    </label>

//                                    {!formData.facePhoto ? (
//                                        <div className="text-center">
//                                            <div className="bg-white rounded-lg p-6 mb-4 border">
//                                                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Verify Your Identity</h3>
//                                                <p className="text-gray-600 mb-6">
//                                                    For your security, we need to verify your identity with a live photo.
//                                                    This helps prevent fraud and ensures your account remains secure.
//                                                </p>

//                                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                                                    <button
//                                                        type="button"
//                                                        onClick={startCamera}
//                                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
//                                                    >
//                                                        <Camera className="w-4 h-4" />
//                                                        Take Live Photo
//                                                    </button>
//                                                    <button
//                                                        type="button"
//                                                        onClick={() => fileInputRef.current?.click()}
//                                                        className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
//                                                    >
//                                                        <Upload className="w-4 h-4" />
//                                                        Upload Photo
//                                                    </button>
//                                                </div>

//                                                <input
//                                                    type="file"
//                                                    ref={fileInputRef}
//                                                    className="hidden"
//                                                    accept="image/*"
//                                                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
//                                                />

//                                                <p className="text-gray-500 text-sm mt-4">
//                                                    Supported formats: JPG, PNG • Max size: 5MB
//                                                </p>
//                                            </div>

//                                            {/* Camera Feed */}
//                                            {streamRef.current && (
//                                                <div className="relative bg-black rounded-lg overflow-hidden border-2 border-blue-500">
//                                                    <video
//                                                        ref={videoRef}
//                                                        autoPlay
//                                                        playsInline
//                                                        muted
//                                                        className="w-full h-64 object-cover"
//                                                    />
//                                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
//                                                        <button
//                                                            type="button"
//                                                            onClick={capturePhoto}
//                                                            className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
//                                                        >
//                                                            Capture Photo
//                                                        </button>
//                                                        <button
//                                                            type="button"
//                                                            onClick={stopCamera}
//                                                            className="bg-gray-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-700 transition"
//                                                        >
//                                                            Cancel
//                                                        </button>
//                                                    </div>
//                                                </div>
//                                            )}
//                                        </div>
//                                    ) : (
//                                        <div className="text-center">
//                                            <div className="relative inline-block">
//                                                <img
//                                                    src={formData.facePhoto}
//                                                    alt="Face verification"
//                                                    className="w-40 h-40 object-cover rounded-lg border-4 border-green-500 mx-auto shadow-lg"
//                                                />
//                                                {verificationStatus === 'verified' && (
//                                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
//                                                        <CheckCircle className="w-6 h-6" />
//                                                    </div>
//                                                )}
//                                            </div>

//                                            <div className="mt-6">
//                                                {verificationStatus === 'captured' && (
//                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-flex items-center gap-2">
//                                                        <AlertCircle className="w-5 h-5 text-yellow-600" />
//                                                        <p className="text-yellow-800 font-medium">Verifying your photo...</p>
//                                                    </div>
//                                                )}
//                                                {verificationStatus === 'verified' && (
//                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-flex items-center gap-2">
//                                                        <CheckCircle className="w-5 h-5 text-green-600" />
//                                                        <p className="text-green-800 font-medium">Face verification successful!</p>
//                                                    </div>
//                                                )}
//                                            </div>

//                                            <button
//                                                type="button"
//                                                onClick={() => {
//                                                    setFormData(prev => ({ ...prev, facePhoto: null }));
//                                                    setVerificationStatus('pending');
//                                                }}
//                                                className="text-red-600 text-sm mt-4 hover:text-red-700 font-medium"
//                                            >
//                                                Retake photo
//                                            </button>
//                                        </div>
//                                    )}

//                                    {errors.facePhoto && (
//                                        <p className="text-red-500 text-sm mt-2 text-center flex items-center justify-center gap-1">
//                                            <AlertCircle className="w-4 h-4" /> {errors.facePhoto}
//                                        </p>
//                                    )}
//                                </div>

//                                {/* Terms and Conditions */}
//                                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
//                                    <div className="flex items-start gap-3">
//                                        <input
//                                            type="checkbox"
//                                            name="termsAccepted"
//                                            checked={formData.termsAccepted}
//                                            onChange={handleChange}
//                                            className="w-5 h-5 mt-1 accent-blue-600 flex-shrink-0"
//                                        />
//                                        <label className="text-sm text-gray-600">
//                                            I agree to the{' '}
//                                            <a href="#" className="text-blue-600 hover:underline font-semibold">Terms and Conditions</a>
//                                            {' '}and{' '}
//                                            <a href="#" className="text-blue-600 hover:underline font-semibold">Privacy Policy</a>
//                                            . I confirm that all information provided is accurate and complete. I understand that
//                                            SimSure will use this information for identity verification and fraud prevention purposes
//                                            in compliance with South African regulations.
//                                        </label>
//                                    </div>
//                                    {errors.termsAccepted && (
//                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
//                                            <AlertCircle className="w-3 h-3" /> {errors.termsAccepted}
//                                        </p>
//                                    )}
//                                </div>
//                            </motion.div>
//                        )}

//                        {/* Navigation Buttons */}
//                        <div className="flex gap-3 pt-6">
//                            {currentStep > 1 && (
//                                <button
//                                    type="button"
//                                    onClick={prevStep}
//                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
//                                >
//                                    Back
//                                </button>
//                            )}

//                            {currentStep < 3 ? (
//                                <button
//                                    type="button"
//                                    onClick={nextStep}
//                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition ml-auto"
//                                >
//                                    Continue
//                                </button>
//                            ) : (
//                                <button
//                                    type="submit"
//                                    disabled={loading || verificationStatus !== 'verified'}
//                                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed ml-auto flex items-center gap-2"
//                                >
//                                    {loading ? (
//                    <>
//                                            <div className="w-4 h-4 border-2 border-white border-t-trans