import { useState } from "react";
import jsPDF from "jspdf";

export default function AlertHistoryModal({ isOpen, onClose, alerts }) {
  const [searchSim, setSearchSim] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [twoFAAlert, setTwoFAAlert] = useState(null);
  const [twoFACode, setTwoFACode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [twoFAImage, setTwoFAImage] = useState("");

  if (!isOpen) return null;

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSim = alert.simNumber.includes(searchSim);
    const matchesDate = filterDate
      ? new Date(alert.timestamp?.toDate().toDateString()) ===
        new Date(filterDate).toDateString()
      : true;
    return matchesSim && matchesDate;
  });

  // 2FA logic
  const handleAuthorizeClick = (alert) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const images = ["/2fa1.png", "/2fa2.png", "/2fa3.png"]; // Add these to /public
    const randomImage = images[Math.floor(Math.random() * images.length)];

    setGeneratedCode(randomCode);
    setTwoFAImage(randomImage);
    setTwoFAAlert(alert);
  };

  const handleNotAuthorizeClick = (alert) => {
    alert.status = "Not Authorized";
  };

  const handle2FASubmit = () => {
    if (twoFACode === generatedCode) {
      twoFAAlert.status = "Authorized";
      setTwoFAAlert(null);
      setTwoFACode("");
      setGeneratedCode("");
      alert("✅ Authorization successful");
    } else {
      alert("❌ Incorrect 2FA code. Please try again.");
    }
  };

  // Export functions
  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["SIM,Time,Affected Banks,Notified,Status"]
        .concat(
          filteredAlerts.map(
            (a) =>
              `${a.simNumber},${a.timestamp?.toDate().toLocaleString()},${a.affectedBanks.join(
                "|"
              )},${a.notifiedNextOfKin.join("|")},${a.status}`
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
        )} | Notified: ${a.notifiedNextOfKin.join(", ")} | Status: ${a.status}`,
        10,
        10 + i * 10
      );
    });
    doc.save("alerts.pdf");
  };

  // Helper: Colored badge for status
  const getStatusColor = (status) => {
    if (status === "Authorized") return "bg-green-100 text-green-700 border-green-400";
    if (status === "Not Authorized") return "bg-red-100 text-red-700 border-red-400";
    return "bg-yellow-100 text-yellow-700 border-yellow-400"; // default for pending
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg p-5 rounded-2xl shadow-lg overflow-y-auto max-h-[90vh]">
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

                {/* Colored Status Badge */}
                <p
                  className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(
                    alert.status
                  )}`}
                >
                  {alert.status || "Pending"}
                </p>

                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleAuthorizeClick(alert)}
                  >
                    Authorize
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleNotAuthorizeClick(alert)}
                  >
                    Not Authorize
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 2FA Modal */}
        {twoFAAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white w-full max-w-sm p-5 rounded-2xl shadow-lg">
              <h3 className="text-lg font-bold mb-3">2FA Verification</h3>
              <p className="mb-2">
                To authorize SIM:{" "}
                <span className="font-semibold">{twoFAAlert.simNumber}</span>
              </p>
              <img
                src={twoFAImage}
                alt="2FA"
                className="mb-3 w-full h-40 object-contain border rounded"
              />
              <p className="text-sm mb-2 text-gray-600">
                Enter this 4-digit code:{" "}
                <span className="font-mono text-lg text-blue-600">
                  {generatedCode}
                </span>
              </p>
              <input
                type="text"
                placeholder="Enter 2FA code"
                className="border rounded px-3 py-1 w-full mb-3"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  onClick={() => setTwoFAAlert(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={handle2FASubmit}
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
