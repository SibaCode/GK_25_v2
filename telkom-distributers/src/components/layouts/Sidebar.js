// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Shield, Users, ShieldCheck, CreditCard } from "lucide-react";

const Sidebar = () => {
    return (
        <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
            {/* Header */}
            <div className="p-6 font-bold text-xl text-primary border-b">SIM Alerts</div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                <Link
                    className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded"
                    to="/dashboard/home"
                >
                    <LayoutDashboard className="w-5 h-5 text-primary" />
                    Home
                </Link>

                <Link
                    className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded"
                    to="/dashboard/registerSim"
                >
                    <CreditCard className="w-5 h-5 text-warning" />
                    Register SIM
                </Link>

                <Link
                    className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded"
                    to="/dashboard/alerts"
                >
                    <ShieldCheck className="w-5 h-5 text-danger" />
                    Alerts
                </Link>

                {/*<Link*/}
                {/*    className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded"*/}
                {/*    to="/dashboard/linked"*/}
                {/*>*/}
                {/*    <Users className="w-5 h-5 text-primary" />*/}
                {/*    Linked SIMs*/}
                {/*</Link>*/}

                {/*<Link*/}
                {/*    className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded"*/}
                {/*    to="/dashboard/profile"*/}
                {/*>*/}
                {/*    <Shield className="w-5 h-5 text-success" />*/}
                {/*    Profile*/}
                {/*</Link>*/}
            </nav>
        </div>
    );
};

export default Sidebar;
