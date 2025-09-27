
import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Shield, Recycle, GraduationCap, Users, TrendingUp, DollarSign } from "lucide-react";
import { CgAwards } from "react-icons/cg";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 font-bold text-xl text-primary border-b">Telkom Hub</div>
      <nav className="flex-1 p-4 space-y-2">
       
        <Link className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded" to="/fraud">
          <Shield className="w-5 h-5 text-warning" /> Fraud Management
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded" to="/community">
          <Users className="w-5 h-5 text-primary" /> Community
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
