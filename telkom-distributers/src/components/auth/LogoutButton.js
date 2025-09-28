import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

export default function LogoutButton() {
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");
            navigate("/login"); // Redirect to login page
        } catch (err) {
            console.error(err);
            toast.error("Error logging out.");
        }
    };

    return (
        <Button className="bg-accent text-white" onClick={handleLogout}>
            Logout
        </Button>

    );
}
