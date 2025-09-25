import React from "react";

export function Dialog({ open, onOpenChange, children }) {
  return <div>{children}</div>; // basic wrapper for now
}

export function DialogTrigger({ asChild, children }) {
  return children;
}

export function DialogContent({ children, className }) {
  return <div className={`bg-white p-4 rounded-lg shadow ${className}`}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}
