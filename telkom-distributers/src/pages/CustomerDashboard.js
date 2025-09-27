import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { ReportFraudModal } from "../components/modals/ReportFraudModal";
import { TimelineModal } from "../components/modals/TimelineModal";
import { NotificationsModal } from "../components/modals/NotificationsModal";

// Mock Data
const MOCK_SIMs = [
    { id: "sim1", number: "0821234567", provider: "Vodacom", status: "Active" },
    { id: "sim2", number: "0829876543", provider: "MTN", status: "Active" }
];

const MOCK_FRAUD_CASES = [
    {
        id: "case1",
        simId: "sim1",
        itcNumber: "ITC-10001",
        status: "Pending CAS",
        timeline: [
            { date: new Date(), action: "Fraud Report Submitted", actor: "Customer", notes: "" },
            { date: new Date(), action: "ITC Issued & SIM Blocked", actor: "System", notes: "" }
        ]
    }
];

const MOCK_NOTIFICATIONS = [
    { id: "notif1", message: "Your SIM 0821234567 has been blocked.", date: new Date() }
];

// Badge colors
const getStatusColor = (status) => {
    switch (status) {
        case "Active": return "bg-success text-success-foreground";
        case "Blocked": return "bg-destructive text-destructive-foreground";
        case "Pending CAS": return "bg-warning text-warning-foreground";
        default: return "bg-muted text-muted-foreground";
    }
};

export function CustomerDashboard() {
    const [sims] = useState(MOCK_SIMs);
    const [fraudCases, setFraudCases] = useState(MOCK_FRAUD_CASES);
    const [notifications] = useState(MOCK_NOTIFICATIONS);
    const [searchTerm, setSearchTerm] = useState("");

    // Handle adding a new fraud case
    const handleReportFraud = (simId, description) => {
        const caseId = `case-${Date.now()}`;
        const newCase = {
            id: caseId,
            simId,
            itcNumber: `ITC-${Date.now()}`,
            status: "Pending CAS",
            timeline: [
                { date: new Date(), action: "Fraud Report Submitted", actor: "Customer", notes: description },
                { date: new Date(), action: "ITC Issued & SIM Blocked", actor: "System", notes: "" }
            ]
        };
        setFraudCases(prev => [...prev, newCase]);
    };

    // Filter SIMs
    const filteredSIMs = sims.filter(sim =>
        sim.number.includes(searchTerm) || sim.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="p-6 space-y-6 overflow-auto">

                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <AlertCircle className="w-8 h-8 text-primary" />
                                Customer Dashboard
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                View linked SIMs, report fraud, track cases and notifications
                            </p>
                        </div>
                        <NotificationsModal notifications={notifications} />
                    </div>

                    {/* Search SIMs */}
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search SIMs..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* SIM Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {filteredSIMs.map(sim => (
                            <Card key={sim.id}>
                                <CardHeader>
                                    <CardTitle>{sim.number}</CardTitle>
                                    <Badge className={getStatusColor(sim.status)}>{sim.status}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p>Provider: {sim.provider}</p>
                                    <div className="flex gap-2 mt-4">
                                        <ReportFraudModal simId={sim.id} onReportFraud={handleReportFraud} />
                                        <TimelineModal fraudCases={fraudCases.filter(c => c.simId === sim.id)} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
