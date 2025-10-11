import { useState ,useRef} from "react";
import jsPDF from "jspdf";

// Simple Face Verification Component
function SimpleFaceVerify({ onVerify, onCancel }) {
  const videoRef = useRef();
  const [error, setError] = useState("");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      setError("Cannot access camera. Please allow camera access.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const handleVerify = () => {
    const video = videoRef.current;
    if (video && video.readyState === 4) {
      stopCamera();
      onVerify();
    } else {
      setError("No face detected. Make sure your face is in the camera view.");
    }
  };

  // Start camera automatically
  if (videoRef.current && !videoRef.current.srcObject) startCamera();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-5 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold mb-3">Face Verification</h3>
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-60 bg-gray-200 rounded mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            onClick={() => {
              stopCamera();
              onCancel();
            }}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={handleVerify}
          >
            Verify Face
          </button>
        </div>
      </div>
    </div>
  );
}

// Main AlertHistoryModal Component
export default function AlertHistoryModal({ isOpen, onClose, alerts, currentUser }) {
  const [searchSim, setSearchSim] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [faceAlert, setFaceAlert] = useState(null);

  if (!isOpen) return null;

  // --- Filter alerts ---
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSim = alert.simNumber.includes(searchSim);
    const matchesDate = filterDate
      ? new Date(alert.timestamp?.toDate().toDateString()) ===
        new Date(filterDate).toDateString()
      : true;
    return matchesSim && matchesDate;
  });

  // --- User Actions ---
  const handleAuthorizeClick = (alert) => setFaceAlert(alert);

  const handleNotAuthorizeClick = (alert) => {
    alert.status = "Not Authorized";
    alert.authorizedBy = currentUser;
    alert.authorizationTime = new Date();
  };

  const getStatusColor = (status) => {
    if (status === "Authorized") return "bg-green-100 text-green-700 border-green-400";
    if (status === "Not Authorized") return "bg-red-100 text-red-700 border-red-400";
    return "bg-yellow-100 text-yellow-700 border-yellow-400"; // pending
  };

  // --- Export Functions ---
  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["SIM,Time,Affected Banks,Notified,Status,Authorized By,Authorization Time"]
        .concat(
          filteredAlerts.map(
            (a) =>
              `${a.simNumber},${a.timestamp?.toDate().toLocaleString()},${a.affectedBanks.join(
                "|"
              )},${a.notifiedNextOfKin.join("|")},${a.status || "Pending"},${a.authorizedBy || "-"},${
                a.authorizationTime ? new Date(a.authorizationTime).toLocaleString() : "-"
              }`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "alerts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    filteredAlerts.forEach((a, i) => {
      doc.text(
        `SIM: ${a.simNumber} | Time: ${a.timestamp?.toDate().toLocaleString()} | Banks: ${a.affectedBanks.join(
          ", "
        )} | Notified: ${a.notifiedNextOfKin.join(", ")} | Status: ${a.status || "Pending"} | Authorized By: ${
          a.authorizedBy || "-"
        } | Authorization Time: ${a.authorizationTime ? new Date(a.authorizationTime).toLocaleString() : "-"}`,
        10,
        10 + i * 10
      );
    });
    doc.save("alerts.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg p-5 rounded-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Alert History</h2>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Search SIM"
            className="border rounded px-3 py-1 w-full sm:w-1/2"
            value={searchSim}
            onChange={(e) => setSearchSim(e.target.value)}
          />
          <input
            type="date"
            className="border rounded px-3 py-1 w-full sm:w-1/2"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={exportToCSV}
          >
            Export CSV
          </button>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            onClick={exportToPDF}
          >
            Export PDF
          </button>
        </div>

        {/* Alerts */}
        {filteredAlerts.length === 0 ? (
          <p className="text-sm text-gray-500">No alerts found.</p>
        ) : (
          <ul className="space-y-3">
            {filteredAlerts.map((alert, idx) => (
              <li
                key={idx}
                className="border-l-4 border-blue-500 pl-3 p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="text-sm font-semibold">SIM: {alert.simNumber}</p>
                <p className="text-sm">
                  Time: {alert.timestamp?.toDate().toLocaleString()}
                </p>
                <p className="text-sm">
                  Affected Banks: {alert.affectedBanks.join(", ") || "-"}
                </p>
                <p className="text-sm">
                  Notified: {alert.notifiedNextOfKin.join(", ") || "-"}
                </p>

                <p
                  className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(
                    alert.status
                  )}`}
                >
                  {alert.status || "Pending"}
                </p>

                {alert.status && (
                  <p className="text-xs mt-1 text-gray-600">
                    Authorized By: {alert.authorizedBy || "-"} <br />
                    Authorization Time:{" "}
                    {alert.authorizationTime
                      ? new Date(alert.authorizationTime).toLocaleString()
                      : "-"}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleAuthorizeClick(alert)}
                    disabled={alert.status === "Authorized"}
                  >
                    Authorize
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleNotAuthorizeClick(alert)}
                    disabled={alert.status === "Not Authorized"}
                  >
                    Not Authorize
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Face Verification Modal */}
        {faceAlert && (
          <SimpleFaceVerify
            onVerify={() => {
              faceAlert.status = "Authorized";
              faceAlert.authorizedBy = currentUser;
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
