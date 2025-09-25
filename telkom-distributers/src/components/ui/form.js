import React from "react";

export function Form({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function FormField({ control, name, render }) {
  return render({ field: { value: "", onChange: () => {} } });
}

export function FormItem({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function FormLabel({ children }) {
  return <label className="block text-sm font-medium">{children}</label>;
}

export function FormControl({ children }) {
  return <div>{children}</div>;
}

export function FormMessage({ children }) {
  return <p className="text-xs text-red-500">{children}</p>;
}
