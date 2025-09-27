import { useState, useEffect } from "react";
import { db } from "../firebase"; // adjust path if needed
import { collection, addDoc, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Shield, Brain, Phone, AlertTriangle, CheckCircle, XCircle, Clock, Ban, RefreshCw, Flag } from "lucide-react";

// Simple AI mock for risk assignment
const detectFraud = ({ duplicateSIM, spikes }) => {
    if (duplicateSIM || spikes > 5)
        return { status: "high-risk", riskScore: 90, recommendation: "Immediate SIM block" };
    if (spikes > 2)
        return { status: "medium-risk", riskScore: 65, recommendation: "Monitor / Review" };
    return { status: "low-risk", riskScore: 35, recommendation: "No Action Needed" };
};

const FraudManagement = () => {
    const [verificationData, setVerificationData] = useState({
        phoneNumber: "",
        customerID: "",
        reportedIssue: "",
        distributor: "",
        duplicateSIM: false,
        spikes: 0
    });

    const [fraudReports, setFraudReports] = useState([]);

    // Firestore real-time listener
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "fraudReports"), snapshot => {
            const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFraudReports(reports);
        });
        return () => unsubscribe();
    }, []);

    const handleVerification = async (e) => {
        e.preventDefault();
        const { phoneNumber, customerID, distributor, duplicateSIM, spikes, reportedIssue } = verificationData;

        if (!phoneNumber || !customerID || !distributor) {
            return alert("Please fill in all required fields");
        }

        const aiResult = detectFraud({ duplicateSIM, spikes });

        try {
            const docRef = await addDoc(collection(db, "fraudReports"), {
                phoneNumber,
                customerID,
                reportedIssue,
                distributor,
                anomalies: duplicateSIM ? ["Duplicate SIM usage"] : [],
                activityPattern: `Data spike: ${spikes}`,
                status: aiResult.status,
                riskScore: aiResult.riskScore,
                aiRecommendation: aiResult.recommendation,
                verificationStatus: "pending",
                actionsTaken: [],
                date: serverTimestamp()
            });

            alert(`Fraud report submitted. ID: ${docRef.id}`);
            setVerificationData({ phoneNumber: "", customerID: "", reportedIssue: "", distributor: "", duplicateSIM: false, spikes: 0 });
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleAction = async (action, reportId) => {
        const reportRef = doc(db, "fraudReports", reportId);
        const report = fraudReports.find(r => r.id === reportId);
        const updatedActions = Array.isArray(report.actionsTaken) ? [...report.actionsTaken, action] : [action];
        await updateDoc(reportRef, { actionsTaken: updatedActions });
        alert(`${action} applied to report ${reportId}`);
    };

    const getRiskColor = (score) => {
        if (score >= 80) return "bg-destructive text-destructive-foreground";
        if (score >= 60) return "bg-warning text-warning-foreground";
        return "bg-success text-success-foreground";
    };

    return (
        <div className="space-y-6 p-6">
            {/* Quick SIM Verification */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Quick SIM Verification
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Distributor enters SIM details for fraud assessment
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerification} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number *</Label>
                            <Input
                                id="phoneNumber"
                                value={verificationData.phoneNumber}
                                onChange={(e) =>
                                    setVerificationData({ ...verificationData, phoneNumber: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customerID">Customer ID *</Label>
                            <Input
                                id="customerID"
                                value={verificationData.customerID}
                                onChange={(e) =>
                                    setVerificationData({ ...verificationData, customerID: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="distributor">Distributor *</Label>
                            <Input
                                id="distributor"
                                value={verificationData.distributor}
                                onChange={(e) =>
                                    setVerificationData({ ...verificationData, distributor: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reportedIssue">Reported Issue</Label>
                            <Textarea
                                id="reportedIssue"
                                value={verificationData.reportedIssue}
                                onChange={(e) =>
                                    setVerificationData({ ...verificationData, reportedIssue: e.target.value })
                                }
                                rows={2}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="checkbox"
                                checked={verificationData.duplicateSIM}
                                onChange={(e) =>
                                    setVerificationData({ ...verificationData, duplicateSIM: e.target.checked })
                                }
                            />
                            <span>Duplicate SIM detected</span>
                            <Input
                                type="number"
                                placeholder="Activity spikes"
                                value={verificationData.spikes}
                                onChange={(e) =>
                                    setVerificationData({ ...verificationData, spikes: parseInt(e.target.value) || 0 })
                                }
                                className="w-24"
                            />
                        </div>
                        <Button type="submit" className="mt-2">
                            <Brain className="h-4 w-4 mr-2" />
                            Run AI Fraud Analysis
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Fraud Reports Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Fraud Reports</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Distributor actions and AI recommendations
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>SIM</th>
                                    <th>Distributor</th>
                                    <th>Risk</th>
                                    <th>AI Recommendation</th>
                                    <th>Actions Taken</th>
                                    <th>Distributor Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fraudReports.map((r) => (
                                    <tr key={r.id} className="border-b hover:bg-muted/50">
                                        <td>{r.date?.toDate ? r.date.toDate().toLocaleString() : "Pending"}</td>
                                        <td>{r.customerID}</td>
                                        <td>{r.phoneNumber}</td>
                                        <td>{r.distributor}</td>
                                        <td>
                                            <Badge className={getRiskColor(r.riskScore)}> {r.status} </Badge>
                                        </td>
                                        <td>{r.aiRecommendation}</td>
                                        <td>{Array.isArray(r.actionsTaken) ? r.actionsTaken.join(", ") : r.actionsTaken || "None"}</td>
                                        <td className="flex gap-2">
                                            <Button size="sm" variant="destructive" onClick={() => handleAction("Block SIM", r.id)}>
                                                <Ban className="h-3 w-3 mr-1" />Block SIM
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleAction("Issue Replacement", r.id)}>
                                                <RefreshCw className="h-3 w-3 mr-1" />Replace SIM
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleAction("Flag Transaction", r.id)}>
                                                <Flag className="h-3 w-3 mr-1" />Flag Transaction
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FraudManagement;
