// src/pages/Dashboard.js
import { useState } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';

// Sample data
const fraudCases = [
  { caseNumber: 'F001', customer: 'John Doe', sim: '1234567890', description: 'SIM fraud', status: 'Pending' },
  { caseNumber: 'F002', customer: 'Jane Smith', sim: '0987654321', description: 'Identity theft', status: 'Resolved' },
  { caseNumber: 'F003', customer: 'Mike Johnson', sim: '1122334455', description: 'SIM swap', status: 'Pending' },
  { caseNumber: 'F004', customer: 'Alice Brown', sim: '6677889900', description: 'Fraudulent charges', status: 'Not Finished' },
  { caseNumber: 'F005', customer: 'Bob White', sim: '5566778899', description: 'Fake registration', status: 'Pending' },
];

const eWasteLogs = [
  { id: 'E001', customer: 'John Doe', items: 'Phone, Charger', weight: '2kg', reward: '20 pts', distributor: 'Distributor A' },
  { id: 'E002', customer: 'Jane Smith', items: 'Laptop', weight: '3kg', reward: '50 pts', distributor: 'Distributor B' },
];

const learningSessions = [
  { id: 'L001', distributor: 'Distributor A', module: 'Fraud Detection', participants: 5, badges: 3 },
  { id: 'L002', distributor: 'Distributor B', module: 'E-Waste Collection', participants: 4, badges: 2 },
];

export default function Dashboard() {
  const [selectedFraud, setSelectedFraud] = useState(null);
  const [selectedEWaste, setSelectedEWaste] = useState(null);
  const [selectedLearning, setSelectedLearning] = useState(null);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Card title="Total Fraud Cases" value="23" />
        <Card title="E-Waste Collected" value="1,234kg" />
        <Card title="Rewards Distributed" value="5,670 pts" />
        <Card title="Courses Completed" value="120" />
        <Card title="Community Posts" value="450" />
      </div>

      {/* Recent Fraud Cases */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Fraud Cases</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Case #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">SIM</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {fraudCases.map(f => (
              <tr key={f.caseNumber} className="border-b hover:bg-gray-50">
                <td className="p-3">{f.caseNumber}</td>
                <td className="p-3">{f.customer}</td>
                <td className="p-3">{f.sim}</td>
                <td className="p-3">{f.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedFraud(f)}
                    className="bg-accent text-white px-3 py-1 rounded hover:bg-orange-600"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={selectedFraud !== null}
        onClose={() => setSelectedFraud(null)}
        title={`Fraud Case ${selectedFraud?.caseNumber}`}
      >
        {selectedFraud && (
          <div className="space-y-2">
            <p><strong>Customer:</strong> {selectedFraud.customer}</p>
            <p><strong>SIM:</strong> {selectedFraud.sim}</p>
            <p><strong>Description:</strong> {selectedFraud.description}</p>
            <p><strong>Status:</strong> {selectedFraud.status}</p>
          </div>
        )}
      </Modal>

      {/* E-Waste Logs */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold text-gray-700 mb-4">Recent E-Waste Logs</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Weight</th>
              <th className="p-3">Reward</th>
              <th className="p-3">Distributor</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {eWasteLogs.map(e => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{e.customer}</td>
                <td className="p-3">{e.items}</td>
                <td className="p-3">{e.weight}</td>
                <td className="p-3">{e.reward}</td>
                <td className="p-3">{e.distributor}</td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedEWaste(e)}
                    className="bg-accent text-white px-3 py-1 rounded hover:bg-orange-600"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={selectedEWaste !== null}
        onClose={() => setSelectedEWaste(null)}
        title={`E-Waste Log`}
      >
        {selectedEWaste && (
          <div className="space-y-2">
            <p><strong>Customer:</strong> {selectedEWaste.customer}</p>
            <p><strong>Items:</strong> {selectedEWaste.items}</p>
            <p><strong>Weight:</strong> {selectedEWaste.weight}</p>
            <p><strong>Reward:</strong> {selectedEWaste.reward}</p>
            <p><strong>Distributor:</strong> {selectedEWaste.distributor}</p>
          </div>
        )}
      </Modal>

      {/* Learning Sessions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Learning Sessions</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Distributor</th>
              <th className="p-3">Module</th>
              <th className="p-3">Participants</th>
              <th className="p-3">Badges</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {learningSessions.map(l => (
              <tr key={l.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{l.distributor}</td>
                <td className="p-3">{l.module}</td>
                <td className="p-3">{l.participants}</td>
                <td className="p-3">{l.badges}</td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedLearning(l)}
                    className="bg-accent text-white px-3 py-1 rounded hover:bg-orange-600"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={selectedLearning !== null}
        onClose={() => setSelectedLearning(null)}
        title={`Learning Session`}
      >
        {selectedLearning && (
          <div className="space-y-2">
            <p><strong>Distributor:</strong> {selectedLearning.distributor}</p>
            <p><strong>Module:</strong> {selectedLearning.module}</p>
            <p><strong>Participants:</strong> {selectedLearning.participants}</p>
            <p><strong>Badges:</strong> {selectedLearning.badges}</p>
          </div>
        )}
      </Modal>

      {/* Community Chat */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold text-gray-700 mb-4">Community Chat</h3>
        <iframe src="https://your-u2-iframe-url.com" className="w-full h-64 border rounded-lg"></iframe>
      </div>
    </div>
  );
}
