// src/components/Modal.js
export default function Modal({ show, onClose, title, children }) {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-11/12 md:w-2/3 lg:w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    );
  }
  