import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Shield, Brain, AlertTriangle, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, query, orderBy, doc, updateDoc } from "firebase/firestore";

const getRiskColor = (score) => {
    if (score >= 80) return "bg-destructive text-destructive-foreground";
    if (score >= 60) return "bg-warning text-warning-foreground";
    return "bg-success text-success-foreground";
};

const getStatusIcon = (status) => {
    switch (status) {
        case "high-risk": return <AlertTriangle className="h-4 w-4 text-destructive" />;
        case "medium-risk": return <Clock className="h-4 w-4 text-warning" />;
        case "low-risk": return <CheckCircle className="h-4 w-4 text-success" />;
        default: return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
};

const FraudManagement = () => {
    const [fraudReports, setFraudReports] = useState([]);
    const [verificationData, setVerificationData] = useState({
        simNumber: "",
        customerID: "",
        reportedIssue: ""
    });

    // Listen to fraudReport collection
    useEffect(() => {
        const q = query(collection(db, "fraudReport"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reportsFromDB = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setFraudReports(reportsFromDB);
        });
        return () => unsubscribe();
    }, []);

    // Add new fraud report
    const handleAddReport = async (e) => {
        e.preventDefault();
        if (!verificationData.simNumber || !verificationData.customerID) return;

        // Simple AI simulation for risk score
        const riskScore = Math.floor(Math.random() * 100);
        const status = riskScore >= 80 ? "high-risk" : riskScore >= 60 ? "medium-risk" : "low-risk";

        const newReport = {
            simNumber: verificationData.simNumber,
            customerID: verificationData.customerID,
            reportedIssue: verificationData.reportedIssue,
            riskScore,
            status,
            date: new Date(),
            verificationStatus: "pending"
        };

        await addDoc(collection(db, "fraudReport"), newReport);
        setVerificationData({ simNumber: "", customerID: "", reportedIssue: "" });
    };

    const handleUpdateStatus = async (reportId, newStatus) => {
        const reportRef = doc(db, "fraudReport", reportId);
        await updateDoc(reportRef, { verificationStatus: newStatus });
    };

    // Metrics
    const highRiskCount = fraudReports.filter(r => r.riskScore >= 80).length;
    const mediumRiskCount = fraudReports.filter(r => r.riskScore >= 60 && r.riskScore < 80).length;
    const lowRiskCount = fraudReports.filter(r => r.riskScore < 60).length;
    const totalSIMs = fraudReports.length;

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
                                <Shield className="w-8 h-8 text-primary" />
                                SIM Fraud Management
                            </h1>
                            <p className="text-muted-foreground mt-2">Detect and manage fraudulent SIM activity</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm">High Risk</p>
                                <p className="text-2xl font-bold text-destructive">{highRiskCount}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm">Medium Risk</p>
                                <p className="text-2xl font-bold text-warning">{mediumRiskCount}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm">Low Risk</p>
                                <p className="text-2xl font-bold text-success">{lowRiskCount}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm">Total SIMs</p>
                                <p className="text-2xl font-bold">{totalSIMs}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Verification Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="h-5 w-5 mr-2" />
                                Quick SIM Verification
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddReport} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="SIM Number"
                                        value={verificationData.simNumber}
                                        onChange={(e) => setVerificationData({ ...verificationData, simNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Customer ID"
                                        value={verificationData.customerID}
                                        onChange={(e) => setVerificationData({ ...verificationData, customerID: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Reported Issue"
                                        value={verificationData.reportedIssue}
                                        onChange={(e) => setVerificationData({ ...verificationData, reportedIssue: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <Button type="submit" className="w-full flex items-center justify-center">
                                    <Brain className="h-4 w-4 mr-2" />
                                    Run AI Fraud Analysis
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Fraud Reports Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Fraud Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-2">SIM Number</th>
                                        <th className="px-4 py-2">Customer ID</th>
                                        <th className="px-4 py-2">Reported Issue</th>
                                        <th className="px-4 py-2">Risk Score</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Verification</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fraudReports.map((report) => (
                                        <tr key={report.id} className="border-b hover:bg-muted/50">
                                            <td className="px-4 py-2">{report.simNumber}</td>
                                            <td className="px-4 py-2">{report.customerID}</td>
                                            <td className="px-4 py-2">{report.reportedIssue}</td>
                                            <td className="px-4 py-2">
                                                <Badge className={getRiskColor(report.riskScore)}>{report.riskScore}%</Badge>
                                            </td>
                                            <td className="px-4 py-2">{getStatusIcon(report.status)} {report.status.replace('-', ' ')}</td>
                                            <td className="px-4 py-2">{report.verificationStatus}</td>
                                            <td className="px-4 py-2 space-x-1">
                                                <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(report.id, "verified")}>Verify</Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(report.id, "failed")}>Fail</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FraudManagement;
