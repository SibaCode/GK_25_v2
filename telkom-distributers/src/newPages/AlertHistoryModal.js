import { useState, useRef, useEffect } from "react";
import { ShieldCheck, X, AlertTriangle, Eye } from "lucide-react";
import jsPDF from "jspdf";

// --- Simple Face Verification ---
function SimpleFaceVerify({ onVerify, onCancel }) {
  const videoRef = useRef();
  const [error, setError] = useState("");

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch {
        setError("Cannot access camera. Please allow camera access.");
      }
    };
    startCamera();
    return () => {
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleVerify = () => {
    const video = videoRef.current;
    if (video && video.readyState === 4) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      onVerify();
    } else {
      setError("No face detected. Make sure your face is in view.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg flex flex-col gap-4">
        <h3 className="text-xl font-bold text-center">Face Verification</h3>
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-60 bg-gray-100 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
            onClick={handleVerify}
          >
            <ShieldCheck className="w-4 h-4" /> Verify
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Modal ---
export default function AlertHistoryModal({ isOpen, onClose, alerts, currentUser }) {
  const [searchSim, setSearchSim] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [faceAlert, setFaceAlert] = useState(null);

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((a) => {
    const matchesSim = a.simNumber.includes(searchSim);
    const matchesDate = filterDate
      ? new Date(a.timestamp?.toDate().toDateString()) ===
        new Date(filterDate).toDateString()
      : true;
    return matchesSim && matchesDate;
  });

  const handleAuthorize = (alert) => setFaceAlert(alert);
  const handleDeny = (alert) => {
    alert.status = "Not Authorized";
    alert.authorizedBy = currentUser?.fullName || "Admin";
    alert.authorizationTime = new Date();
  };

  const getStatusClass = (status) => {
    if (status === "Authorized") return "bg-green-100 text-green-700 border-green-400";
    if (status === "Not Authorized") return "bg-red-100 text-red-700 border-red-400";
    return "bg-yellow-100 text-yellow-700 border-yellow-400"; // pending
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["SIM,Time,Status,Authorized By,Authorization Time"]
        .concat(
          filteredAlerts.map(
            (a) =>
              `${a.simNumber},${a.timestamp?.toDate().toLocaleString()},${a.status || "Pending"},${
                a.authorizedBy || "-"
              },${a.authorizationTime ? new Date(a.authorizationTime).toLocaleString() : "-"}`
          )
        )
        .join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "alerts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    filteredAlerts.forEach((a, i) => {
      doc.text(
        `SIM: ${a.simNumber} | Time: ${a.timestamp?.toDate().toLocaleString()} | Status: ${
          a.status || "Pending"
        } | Authorized By: ${a.authorizedBy || "-"} | Authorization: ${
          a.authorizationTime ? new Date(a.authorizationTime).toLocaleString() : "-"
        }`,
        10,
        10 + i * 10
      );
    });
    doc.save("alerts.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-lg overflow-y-auto max-h-[90vh] flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" /> Alert History
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800 font-medium"
            onClick={onClose}
          >
            Close
          </button>
        </div>

     
        {/* Export Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
            onClick={exportToCSV}
          >
            <Eye className="w-4 h-4" /> Export CSV
          </button>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1"
            onClick={exportToPDF}
          >
            <Eye className="w-4 h-4" /> Export PDF
          </button>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-4">No alerts found.</p>
        ) : (
          <ul className="space-y-3 mt-2">
            {filteredAlerts.map((alert, idx) => (
              <li
                key={idx}
                className="border border-gray-200 p-4 rounded-lg flex flex-col md:flex-row md:justify-between gap-2 items-start hover:shadow-sm transition bg-white"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold">SIM: {alert.simNumber}</p>
                  <p className="text-sm text-gray-600">
                    Time: {alert.timestamp?.toDate().toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${getStatusClass(
                      alert.status
                    )}`}
                  >
                    {alert.status || "Pending"}
                  </span>

                  {alert.status === "pending" && (
                    <>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                        onClick={() => handleDeny(alert)}
                      >
                        <X className="w-4 h-4" /> Deny
                      </button>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                        onClick={() => handleAuthorize(alert)}
                      >
                        <ShieldCheck className="w-4 h-4" /> Authorize
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Face Verification */}
        {faceAlert && (
          <SimpleFaceVerify
            onVerify={() => {
              faceAlert.status = "Authorized";
              faceAlert.authorizedBy = currentUser?.fullName || "Admin";
              faceAlert.authorizationTime = new Date();
              setFaceAlert(null);
              alert("✅ Authorization successful");
            }}
            onCancel={() => setFaceAlert(null)}
          />
        )}
      </div>
    </div>
  );
}
