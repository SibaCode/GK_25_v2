// src/components/AlertHistoryModal.jsx
import { useState } from "react";
import jsPDF from "jspdf";

export default function AlertHistoryModal({ isOpen, onClose, alerts }) {
  const [searchSim, setSearchSim] = useState("");
  const [filterDate, setFilterDate] = useState("");

  if (!isOpen) return null;

  // Filter alerts based on SIM and date
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSim = alert.simNumber.includes(searchSim);
    const matchesDate = filterDate
      ? new Date(alert.timestamp?.toDate().toDateString()) ===
        new Date(filterDate).toDateString()
      : true;
    return matchesSim && matchesDate;
  });

  // CSV export
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

  // PDF export
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg p-5 rounded-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Alert History</h2>
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
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
                <p className="text-sm">Status: {alert.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
