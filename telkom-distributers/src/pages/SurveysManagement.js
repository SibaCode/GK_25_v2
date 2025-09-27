import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Search, Send } from "lucide-react";

import { AddSurveyModal } from "../components/modals/AddSurveyModal";
import { SurveyDetailsModal } from "../components/modals/SurveyDetailsModal";

import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";

// Status colors
const getStatusColor = (status) => {
    switch (status) {
        case "active": return "bg-success text-success-foreground";
        case "draft": return "bg-secondary text-secondary-foreground";
        case "closed": return "bg-muted text-muted-foreground";
        default: return "bg-muted text-muted-foreground";
    }
};

const SurveyManagement = () => {
    const [surveys, setSurveys] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const q = query(collection(db, "surveys"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const surveysFromDB = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSurveys(surveysFromDB);
        });
        return () => unsubscribe();
    }, []);

    const handleAddSurvey = async (surveyData) => {
        try {
            const { addSurvey } = await import("../../services/surveyService");
            await addSurvey({
                ...surveyData,
                createdAt: new Date(),
                status: "draft",
                responses: 0,
                answers: [],
            });
        } catch (error) {
            console.error("Failed to add survey:", error);
        }
    };

    const filteredSurveys = surveys.filter(survey =>
        survey.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                <Send className="w-8 h-8 text-primary" />
                                Survey Management
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Create, view, and manage community surveys
                            </p>
                        </div>
                        <AddSurveyModal onAddSurvey={handleAddSurvey} />
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Surveys</p>
                                    <p className="text-2xl font-bold">{surveys.length}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Surveys</p>
                                    <p className="text-2xl font-bold text-success">
                                        {surveys.filter(s => s.status === "active").length}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Drafts</p>
                                    <p className="text-2xl font-bold text-secondary">
                                        {surveys.filter(s => s.status === "draft").length}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Closed Surveys</p>
                                    <p className="text-2xl font-bold text-muted">
                                        {surveys.filter(s => s.status === "closed").length}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <div className="flex gap-4 items-center">
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

                    {/* Survey List */}
                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle>All Surveys</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredSurveys.map(survey => (
                                    <div key={survey.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-foreground">{survey.title}</h3>
                                                <Badge className={getStatusColor(survey.status)}>{survey.status}</Badge>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {survey.createdAt?.toDate ? survey.createdAt.toDate().toLocaleString() : new Date(survey.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Category</p>
                                                <p className="font-medium text-foreground">{survey.category}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Responses</p>
                                                <p className="font-medium text-accent">{survey.responses || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Target Audience</p>
                                                <p className="font-medium text-foreground">{survey.targetAudience}</p>
                                            </div>
                                        </div>

                                        <SurveyDetailsModal
                                            survey={survey}
                                            trigger={<button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Send Survey</button>}
                                        />
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

export default SurveyManagement;
