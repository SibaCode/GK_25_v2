import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../ui/button";

export default function Login() {
    const navigate = useNavigate();
    // Pre-fill email and password
    const [form, setForm] = useState({
        email: "mvubusiba@gmail.com",
        password: "mvubusiba@gmail.com" // If this is just a placeholder, replace with the actual password
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, form.email, form.password);
            toast.success("Login successful!");
            navigate("/dashboard/home");
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-4">
            <Toaster position="top-right" />
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">Login</h2>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>

                <Button type="submit" className="w-full bg-blue-500 text-white">Login</Button>
                <p className="text-sm text-gray-600 text-center">
                    Don't have an account? <Link to="/register" className="text-green-500 underline">Register</Link>
                </p>
            </form>
        </div>
    );
}
