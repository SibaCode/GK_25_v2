import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
    Shield, Brain, Phone, AlertTriangle, CheckCircle,
    XCircle, Clock, Ban, RefreshCw, Flag, Users, Activity
} from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, query, orderBy } from "firebase/firestore";
import { useToast } from "../hooks/use-toast"; // Make sure this hook exists
import AddFraudModal from "../components/modals/AddFraudModal"; // The modal we just created
const FraudManagement = () => {
    const { toast } = useToast();
    const [fraudCases, setFraudCases] = useState([]);
    const [newReport, setNewReport] = useState({
        phoneNumber: "",
        customerName: "",
        reportedIssue: ""
    });

    // Fetch fraud reports
    useEffect(() => {
        const q = query(collection(db, "fraudReport"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, snapshot => {
            const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFraudCases(reports);
        });
        return () => unsubscribe();
    }, []);

    const handleAddReport = async (e) => {
        e.preventDefault();
        if (!newReport.phoneNumber || !newReport.customerName) {
            toast({ title: "Error", description: "Phone number and customer name are required", variant: "destructive" });
            return;
        }
        try {
            await addDoc(collection(db, "fraudReport"), {
                ...newReport,
                riskScore: Math.floor(Math.random() * 100),
                status: "pending",
                verificationStatus: "pending",
                anomalies: ["SIM anomaly detected"],
                aiRecommendation: "AI analysis pending",
                activityPattern: "Normal activity",
                createdAt: new Date()
            });
            toast({ title: "Report Added", description: "Fraud report submitted successfully" });
            setNewReport({ phoneNumber: "", customerName: "", reportedIssue: "" });
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Failed to add report", variant: "destructive" });
        }
    };

    const getRiskScoreColor = (score) => {
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

    const getVerificationIcon = (status) => {
        switch (status) {
            case "verified": return <CheckCircle className="h-3 w-3 text-success" />;
            case "pending": return <Clock className="h-3 w-3 text-warning" />;
            case "failed": return <XCircle className="h-3 w-3 text-destructive" />;
            default: return <XCircle className="h-3 w-3 text-muted-foreground" />;
        }
    };

    const handleAction = (action, caseId) => {
        toast({ title: "Action Executed", description: `${action} applied to case ${caseId}` });
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="p-6 space-y-6 overflow-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <Shield className="w-8 h-8 text-primary" />
                                Sales Management
                            </h1>
                            <p className="text-muted-foreground mt-2">AI-powered fraud detection and risk assessment</p>
                        </div>
                        <AddFraudModal />
                    </div>

                    {/* Quick SIM Verification */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Activity className="h-5 w-5 mr-2" />
                                Fraud Risk Overview
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Real-time AI risk assessment</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* High Risk */}
                                <div className={`p-4 rounded-lg ${fraudCases.some(f => f.riskScore >= 80) ? 'bg-red-100 border border-red-500' : 'bg-destructive/10'}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-red-600">High Risk</p>
                                            <p className="text-2xl font-bold text-red-700">{fraudCases.filter(f => f.riskScore >= 80).length}</p>
                                        </div>
                                        <AlertTriangle className="h-8 w-8 text-red-700" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Requires immediate action</p>
                                </div>

                                {/* Medium Risk */}
                                <div className="p-4 bg-warning/10 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-warning">Medium Risk</p>
                                            <p className="text-2xl font-bold text-warning">{fraudCases.filter(f => f.riskScore >= 60 && f.riskScore < 80).length}</p>
                                        </div>
                                        <Clock className="h-8 w-8 text-warning" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Monitor closely</p>
                                </div>

                                {/* Low Risk */}
                                <div className="p-4 bg-success/10 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-success">Low Risk</p>
                                            <p className="text-2xl font-bold text-success">{fraudCases.filter(f => f.riskScore < 60).length}</p>
                                        </div>
                                        <CheckCircle className="h-8 w-8 text-success" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Normal activity</p>
                                </div>

                                {/* Total SIMs */}
                                <div className="p-4 bg-accent/10 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">Total SIMs</p>
                                            <p className="text-2xl font-bold">{fraudCases.length}</p>
                                        </div>
                                        <Users className="h-8 w-8 text-primary" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Under monitoring</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Fraud Cases */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2" /> Active Fraud Cases
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">AI-detected anomalies requiring attention</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {fraudCases.map(fraudCase => (
                                    <div key={fraudCase.id} className="p-4 border rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline">{fraudCase.id}</Badge>
                                                <Badge className={getRiskScoreColor(fraudCase.riskScore)}>
                                                    Risk Score: {fraudCase.riskScore}%
                                                </Badge>
                                                <Badge variant="outline">
                                                    {getVerificationIcon(fraudCase.verificationStatus)}
                                                    <span className="ml-1 capitalize">{fraudCase.verificationStatus}</span>
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                {getStatusIcon(fraudCase.status)}
                                                <span className="text-sm font-medium capitalize">{fraudCase.status.replace('-', ' ')}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                                    <Phone className="h-3 w-3 mr-1" />
                                                    {fraudCase.phoneNumber} - {fraudCase.customerName}
                                                </div>
                                                <p className="text-sm font-medium">Activity Pattern:</p>
                                                <p className="text-sm text-muted-foreground">{fraudCase.activityPattern}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Detected Anomalies:</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {fraudCase.anomalies?.map((anomaly, i) => (
                                                        <Badge key={i} variant="secondary" className="text-xs">{anomaly}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-accent/50 p-3 rounded-lg">
                                            <div className="flex items-start space-x-2">
                                                <Brain className="h-4 w-4 text-primary mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium">AI Recommendation:</p>
                                                    <p className="text-sm text-muted-foreground">{fraudCase.aiRecommendation}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            {fraudCase.riskScore >= 80 && (
                                                <Button size="sm" variant="destructive" onClick={() => handleAction("Block SIM", fraudCase.id)}>
                                                    <Ban className="h-3 w-3 mr-1" /> Block SIM
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline" onClick={() => handleAction("Issue Replacement", fraudCase.id)}>
                                                <RefreshCw className="h-3 w-3 mr-1" /> Replace SIM
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleAction("Flag Transaction", fraudCase.id)}>
                                                <Flag className="h-3 w-3 mr-1" /> Flag Transaction
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default FraudManagement;
