// Sidebar.js
// import { Link } from 'react-router-dom';
// import { FaTachometerAlt, FaExclamationTriangle, FaRecycle } from 'react-icons/fa';

// export default function Sidebar() {
//   return (
//     <div className="w-64 bg-sidebar text-white flex flex-col p-6">
//       <h1 className="text-2xl font-bold mb-10">Telkom Dist.</h1>
//       <ul className="space-y-6">
//         <li><Link to="/" className="flex items-center gap-3 hover:text-primary"><FaTachometerAlt /> Dashboard</Link></li>
//         <li><Link to="/fraud" className="flex items-center gap-3 hover:text-primary"><FaExclamationTriangle /> Fraud Mgmt</Link></li>
//         <li><Link to="/ewaste" className="flex items-center gap-3 hover:text-primary"><FaRecycle /> E-Waste</Link></li>
//       </ul>
//     </div>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Shield, Recycle, GraduationCap, Users, TrendingUp, DollarSign } from "lucide-react";
import { CgAwards } from "react-icons/cg";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 font-bold text-xl text-primary border-b">Telkom Hub</div>
      <nav className="flex-1 p-4 space-y-2">
        <Link className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded" to="/">
          <LayoutDashboard className="w-5 h-5 text-primary" /> Dashboard
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded" to="/sales">
          <DollarSign className="w-5 h-5 text-primary" /> Sales
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded" to="/promotions">
          <CgAwards className="w-5 h-5 text-primary" /> Promotions
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded" to="/fraud">
          <Shield className="w-5 h-5 text-warning" /> Fraud Management
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded" to="/e-waste">
          <Recycle className="w-5 h-5 text-primary" /> E-Waste
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded" to="/learning">
          <GraduationCap className="w-5 h-5 text-accent" /> Learning Hub
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded" to="/community">
          <Users className="w-5 h-5 text-primary" /> Community
        </Link>
        <Link className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded" to="/reports">
          <TrendingUp className="w-5 h-5 text-accent" /> Reports
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
