import React from "react";

export const Checkbox = ({ checked, onCheckedChange, label }) => {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
                className="w-4 h-4"
            />
            <span>{label}</span>
        </label>
    );
};
