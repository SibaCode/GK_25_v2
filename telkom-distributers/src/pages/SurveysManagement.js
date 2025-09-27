import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Search, FileText } from "lucide-react";
import { TakeSurveyModal } from "../components/modals/TakeSurveyModal";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";

const getStatusColor = (status) => {
    switch (status) {
        case "Pending": return "bg-warning text-warning-foreground";
        case "Completed": return "bg-success text-success-foreground";
        default: return "bg-muted text-muted-foreground";
    }
};

const SurveyManagement = ({ distributorId }) => {
    const [surveys, setSurveys] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!distributorId) return; // Wait for distributorId to be defined

        const q = query(
            collection(db, "surveys"),
            where("assignedTo", "==", distributorId),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const surveysFromDB = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSurveys(surveysFromDB);
        });

        return () => unsubscribe();
    }, [distributorId]);

    const handleSurveySubmit = async (surveyId, responses) => {
        // Update local state after submission
        setSurveys(prev => prev.map(s => s.id === surveyId ? { ...s, status: "Completed", responses } : s));
    };

    const totalSurveys = surveys.length;
    const completedSurveys = surveys.filter(s => s.status === "Completed").length;
    const pendingSurveys = surveys.filter(s => s.status === "Pending").length;

    const filteredSurveys = surveys.filter(s =>
        s.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
                                <FileText className="w-8 h-8 text-primary" />
                                Survey Management
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Complete your assigned surveys and track progress
                            </p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <p>Total Surveys</p>
                                <p className="text-2xl font-bold">{totalSurveys}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p>Completed Surveys</p>
                                <p className="text-2xl font-bold text-success">{completedSurveys}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p>Pending Surveys</p>
                                <p className="text-2xl font-bold text-warning">{pendingSurveys}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <div className="flex gap-4 items-center mt-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search surveys..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Surveys Table */}
                    <Card className="shadow-card">
                        <CardHeader><CardTitle>Assigned Surveys</CardTitle></CardHeader>
                        <CardContent>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-2">Title</th>
                                        <th className="px-4 py-2">Date Assigned</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSurveys.map((survey) => (
                                        <tr key={survey.id} className="border-b hover:bg-muted/50">
                                            <td className="px-4 py-2">{survey.title}</td>
                                            <td className="px-4 py-2">{new Date(survey.date?.toDate?.() || survey.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">
                                                <Badge className={getStatusColor(survey.status)}>{survey.status}</Badge>
                                            </td>
                                            <td className="px-4 py-2">
                                                <TakeSurveyModal
                                                    survey={survey}
                                                    onSubmit={(responses) => handleSurveySubmit(survey.id, responses)}
                                                    trigger={
                                                        <button
                                                            className="px-3 py-1 border rounded-md text-sm"
                                                            disabled={survey.status === "Completed"}
                                                        >
                                                            {survey.status === "Completed" ? "Completed" : "Take Survey"}
                                                        </button>
                                                    }
                                                />
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

export default SurveyManagement;
