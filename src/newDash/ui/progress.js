import React from "react";

export const Progress = ({ value = 0, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-primary h-2 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default Progress;
