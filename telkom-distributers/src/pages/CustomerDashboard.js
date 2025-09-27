import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Modal } from "../components/ui/modal";

const CustomerDashboard = () => {
    const [idNumber, setIdNumber] = useState("");
    const [linkedSIMs, setLinkedSIMs] = useState([]);
    const [selectedSIM, setSelectedSIM] = useState(null);
    const [showFraudModal, setShowFraudModal] = useState(false);
    const [fraudDescription, setFraudDescription] = useState("");
    const [fraudCases, setFraudCases] = useState([]);
    const [notification, setNotification] = useState("");

    // ?? Mock SIMs linked to ID
    const mockSIMs = [
        { simNumber: "0821234567", provider: "Vodacom", status: "Active", lastActive: "2025-09-25" },
        { simNumber: "0839876543", provider: "MTN", status: "Active", lastActive: "2025-09-20" },
    ];

    const handleVerifyID = () => {
        // Fetch linked SIMs (mock)
        setLinkedSIMs(mockSIMs);
        setNotification("");
    };

    const handleReportFraud = (sim) => {
        setSelectedSIM(sim);
        setShowFraudModal(true);
    };

    const submitFraudCase = () => {
        const itcNumber = "ITC" + Math.floor(Math.random() * 1000000);
        const newCase = {
            id: fraudCases.length + 1,
            simNumber: selectedSIM.simNumber,
            provider: selectedSIM.provider,
            itcNumber,
            description: fraudDescription,
            status: "Fraud Report Submitted",
            timeline: [
                { step: "Fraud Report Submitted", by: "Customer" },
                { step: "ITC Issued & SIM Blocked", by: "System" },
            ],
        };

        // Update fraud cases
        setFraudCases([...fraudCases, newCase]);
        // Update SIM status to Blocked
        setLinkedSIMs((prev) =>
            prev.map((s) =>
                s.simNumber === selectedSIM.simNumber ? { ...s, status: "Blocked" } : s
            )
        );

        setShowFraudModal(false);
        setFraudDescription("");
        setNotification(`Fraud report submitted. ITC: ${itcNumber}`);
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="p-6 space-y-6 overflow-auto">

                    {/* Page Header */}
                    <div>
                        <h1 className="text-3xl font-bold mb-1">?? Customer Dashboard</h1>
                        <p className="text-muted-foreground">
                            View your SIMs and report fraud cases.
                        </p>
                    </div>

                    {/* Notifications */}
                    {notification && (
                        <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                            {notification}
                        </div>
                    )}

                    {/* Step 1: Enter ID */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Enter South African ID Number</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-3">
                            <Input
                                placeholder="Enter your ID number"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                            />
                            <Button onClick={handleVerifyID}>Verify / Search</Button>
                        </CardContent>
                    </Card>

                    {/* Step 2: View Linked SIMs */}
                    {linkedSIMs.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Linked SIM Cards</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2 text-left">SIM Number</th>
                                            <th className="p-2 text-left">Provider</th>
                                            <th className="p-2 text-left">Status</th>
                                            <th className="p-2 text-left">Last Active</th>
                                            <th className="p-2 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {linkedSIMs.map((sim, idx) => (
                                            <tr key={idx} className="border-b hover:bg-muted/50">
                                                <td className="p-2">{sim.simNumber}</td>
                                                <td className="p-2">{sim.provider}</td>
                                                <td className="p-2">
                                                    <Badge>{sim.status}</Badge>
                                                </td>
                                                <td className="p-2">{sim.lastActive}</td>
                                                <td className="p-2">
                                                    <Button
                                                        onClick={() => handleReportFraud(sim)}
                                                        variant="destructive"
                                                    >
                                                        Report Fraud
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Fraud Cases */}
                    {fraudCases.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Fraud Cases</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {fraudCases.map((fraudCase) => (
                                    <div
                                        key={fraudCase.id}
                                        className="border p-4 rounded-lg mb-3 bg-muted/10"
                                    >
                                        <p>
                                            <strong>SIM:</strong> {fraudCase.simNumber} ({fraudCase.provider})
                                        </p>
                                        <p>
                                            <strong>ITC Number:</strong> {fraudCase.itcNumber}
                                        </p>
                                        <p>
                                            <strong>Status:</strong> {fraudCase.status}
                                        </p>
                                        <div className="mt-2">
                                            <p className="font-semibold">?? Timeline:</p>
                                            <ul className="list-disc ml-6">
                                                {fraudCase.timeline.map((t, i) => (
                                                    <li key={i}>{t.step} – <em>{t.by}</em></li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 4: Report Fraud Modal */}
                    {showFraudModal && (
                        <Modal onClose={() => setShowFraudModal(false)}>
                            <h2 className="text-xl font-bold mb-3">?? Report Fraud</h2>
                            <p>
                                <strong>SIM:</strong> {selectedSIM.simNumber} ({selectedSIM.provider})
                            </p>
                            <textarea
                                className="w-full border p-2 mt-3 rounded-md"
                                rows="4"
                                placeholder="Describe the fraud..."
                                value={fraudDescription}
                                onChange={(e) => setFraudDescription(e.target.value)}
                            />
                            <div className="flex justify-end mt-4 gap-2">
                                <Button variant="secondary" onClick={() => setShowFraudModal(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={submitFraudCase}>Submit</Button>
                            </div>
                        </Modal>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
