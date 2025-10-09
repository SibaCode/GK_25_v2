import React from "react";

export const Modal = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative p-6">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    ?
                </button>

                {children}
            </div>
        </div>
    );
};
