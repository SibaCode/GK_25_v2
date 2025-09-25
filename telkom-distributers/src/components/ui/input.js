import * as React from "react";

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border border-gray-300 rounded-md px-3 py-2 text-sm ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";
