// src/newDash/auth/MultiStepRegister.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";

export default function MultiStepRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({ governmentId: "", selfie: "", proofOfAddress: "" });

  const videoRef = useRef();
  const canvasRef = useRef();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    simNumber: "",
    email: "",
    address: "",
    password: "",
    governmentId: null,
    selfie: null,
    proofOfAddress: null,
    insuranceType: "",
    coverageAmount: "",
    policyTerm: "",
    paymentMethod: "",
    paymentDetails: "",
  });

  const insuranceTypes = ["SIM Theft", "Device Protection", "Data Protection"];
  const coverageOptions = ["R500", "R1000", "R2000", "R5000"];
  const policyTerms = ["3 months", "6 months", "12 months"];
  const paymentMethods = ["Card", "Mobile Money", "Bank Transfer"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setForm({ ...form, [name]: file });
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviews((prev) => ({ ...prev, [name]: e.target.result }));
        reader.readAsDataURL(file);
      } else {
        setPreviews((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // --- Camera logic for live selfie ---
  useEffect(() => {
    if (!cameraOpen) return;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setCameraError("Cannot access camera — allow camera permissions and retry.");
      }
    };
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraOpen]);

  const captureSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setForm({ ...form, selfie: blob });
      const url = URL.createObjectURL(blob);
      setPreviews((prev) => ({ ...prev, selfie: url }));
      setCameraOpen(false);
    }, "image/jpeg", 0.9);
    video.srcObject.getTracks().forEach((t) => t.stop());
  };

  const handleNext = () => {
    if (!form.fullName || form.fullName.length < 2) return toast.error("Name must be at least 2 characters");
    if (!form.dob) return toast.error("Please enter your date of birth");
    if (!form.simNumber.match(/^[0-9]{10,15}$/)) return toast.error("Enter a valid SIM number (10–15 digits)");
    if (form.password.length < 8 || !/\d/.test(form.password) || !/[!@#$%^&*]/.test(form.password))
      return toast.error("Password must have 8+ chars, 1 number & 1 symbol");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.fullName });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName: form.fullName,
        dob: form.dob,
        simNumber: form.simNumber,
        address: form.address,
        email: form.email,
        insuranceType: form.insuranceType,
        coverageAmount: form.coverageAmount,
        policyTerm: form.policyTerm,
        paymentMethod: form.paymentMethod,
        createdAt: new Date(),
      });

      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 font-[Poppins] px-4 py-6">
      <Toaster position="top-right" />
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-2xl p-8 transition-all duration-500 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-700">Secure SIM Protection</h1>
          <p className="text-gray-500 mt-2 text-sm">Complete your registration in 2 simple steps.</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? "Personal Information" : "KYC & Policy"}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                step === 1 ? "w-1/2 bg-blue-500" : "w-full bg-blue-600"
              }`}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter your full legal name (min 2 characters)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">SIM / Phone Number</label>
                  <input
                    type="text"
                    name="simNumber"
                    value={form.simNumber}
                    onChange={handleChange}
                    placeholder="0834567890"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">10–15 digits only</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Min 8 chars, 1 number & 1 symbol</p>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md"
                >
                  Continue to Step 2 →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Government ID */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Government ID</label>
                <input
                  type="file"
                  name="governmentId"
                  accept="image/*,application/pdf"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  required
                />
                {previews.governmentId && (
                  <img
                    src={previews.governmentId}
                    alt="ID Preview"
                    className="mt-2 rounded-lg shadow-md w-32 h-32 object-cover"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">JPEG/PNG/PDF | Max 5MB</p>
              </div>

              {/* Selfie / Live Photo */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Selfie / Live Photo</label>
                {!previews.selfie && !cameraOpen && (
                  <button
                    type="button"
                    onClick={() => setCameraOpen(true)}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition"
                  >
                    Open Camera
                  </button>
                )}
                {cameraOpen && (
                  <div className="flex flex-col items-center gap-2">
                    <video ref={videoRef} autoPlay muted className="w-full rounded-xl shadow-md h-64 object-cover" />
                    {cameraError && <p className="text-red-500 text-sm">{cameraError}</p>}
                    <button
                      type="button"
                      onClick={captureSelfie}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                      Capture Photo
                    </button>
                  </div>
                )}
                {previews.selfie && (
                  <img
                    src={previews.selfie}
                    alt="Selfie preview"
                    className="mt-2 rounded-lg shadow-md w-32 h-32 object-cover"
                  />
                )}
                <canvas ref={canvasRef} style={{ display: "none" }} />
              </div>

              {/* Proof of Address */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Proof of Address</label>
                <input
                  type="file"
                  name="proofOfAddress"
                  accept="image/*,application/pdf"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                  required
                />
                {previews.proofOfAddress && (
                  <img
                    src={previews.proofOfAddress}
                    alt="Address Preview"
                    className="mt-2 rounded-lg shadow-md w-32 h-32 object-cover"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">JPEG/PNG/PDF | Max 5MB</p>
              </div>

              {/* Insurance / Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Insurance Type</label>
                  <select
                    name="insuranceType"
                    value={form.insuranceType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3"
                    required
                  >
                    <option value="">Select</option>
                    {insuranceTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Coverage Amount</label>
                  <select
                    name="coverageAmount"
                    value={form.coverageAmount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3"
                    required
                  >
                    <option value="">Select</option>
                    {coverageOptions.map((amt) => (
                      <option key={amt}>{amt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Policy Term</label>
                  <select
                    name="policyTerm"
                    value={form.policyTerm}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3"
                    required
                  >
                    <option value="">Select</option>
                    {policyTerms.map((term) => (
                      <option key={term}>{term}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3"
                    required
                  >
                    <option value="">Select</option>
                    {paymentMethods.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Payment Details</label>
                <input
                  type="text"
                  name="paymentDetails"
                  value={form.paymentDetails}
                  onChange={handleChange}
                  placeholder="Card or Mobile Money number"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
