import React from "react";

const Header = () => {
  return (
    <div className="bg-white p-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold text-primary">Main Dashboard</h1>
      <div>
        <span className="text-muted-foreground mr-4">{new Date().toLocaleDateString()}</span>
        <button className="bg-accent text-white px-4 py-2 rounded hover:brightness-90 transition">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
