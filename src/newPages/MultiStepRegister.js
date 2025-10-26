import React, { useState } from "react";
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
        reader.onload = (e) => {
          setPreviews((prev) => ({ ...prev, [name]: e.target.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleNext = () => {
    if (!form.fullName || form.fullName.length < 2) return toast.error("Name must be at least 2 characters");
    if (!form.dob) return toast.error("Please enter your date of birth");
    if (!form.simNumber.match(/^[0-9]{10,15}$/)) return toast.error("Enter a valid SIM number");
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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 font-[Poppins] p-4">
      <Toaster position="top-right" />
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-lg relative transition-all duration-500">
        {/* Progress Bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step 1 of 2</span>
            <span>{step === 1 ? "Personal Info" : "KYC & Policy"}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                step === 1 ? "w-1/2 bg-blue-500" : "w-full bg-blue-600"
              }`}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          {step === 1 ? "Step 1: Personal Info" : "Step 2: KYC & Policy Selection"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-gray-700 font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="John Doe"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter your full legal name (min 2 characters)</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">You must be at least 18 years old</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">SIM / Phone Number</label>
                <input
                  type="text"
                  name="simNumber"
                  value={form.simNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0834567890"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">10–15 digits only</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Email (optional)</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Min 8 chars, 1 number & 1 symbol</p>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Next
              </button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-gray-700 font-medium">Government ID</label>
                <input
                  type="file"
                  name="governmentId"
                  accept="image/*,application/pdf"
                  onChange={handleChange}
                  className="w-full"
                  required
                />
                {previews.governmentId && (
                  <img
                    src={previews.governmentId}
                    alt="Government ID preview"
                    className="mt-2 rounded-lg shadow-md w-32 h-32 object-cover"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">JPEG/PNG/PDF | Max 5MB</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Selfie / Live Photo</label>
                <input
                  type="file"
                  name="selfie"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full"
                />
                {previews.selfie && (
                  <img
                    src={previews.selfie}
                    alt="Selfie preview"
                    className="mt-2 rounded-lg shadow-md w-32 h-32 object-cover"
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Proof of Address</label>
                <input
                  type="file"
                  name="proofOfAddress"
                  accept="image/*,application/pdf"
                  onChange={handleChange}
                  className="w-full"
                />
                {previews.proofOfAddress && (
                  <img
                    src={previews.proofOfAddress}
                    alt="Proof of address preview"
                    className="mt-2 rounded-lg shadow-md w-32 h-32 object-cover"
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Insurance Type</label>
                <select
                  name="insuranceType"
                  value={form.insuranceType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Insurance Type</option>
                  {insuranceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium">Coverage</label>
                  <select
                    name="coverageAmount"
                    value={form.coverageAmount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Amount</option>
                    {coverageOptions.map((amt) => (
                      <option key={amt} value={amt}>
                        {amt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">Policy Term</label>
                  <select
                    name="policyTerm"
                    value={form.policyTerm}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Term</option>
                    {policyTerms.map((term) => (
                      <option key={term} value={term}>
                        {term}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Method</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Payment Details</label>
                <input
                  type="text"
                  name="paymentDetails"
                  value={form.paymentDetails}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Card / Mobile Number"
                  required
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
