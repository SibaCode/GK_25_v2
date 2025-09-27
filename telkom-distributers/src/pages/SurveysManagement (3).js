// SurveyManagement.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Search, Send } from "lucide-react";
import { Button } from "../components/ui/button";

import { AddSurveyModal } from "../components/modals/AddSurveyModal";
import SurveyResponsesModal from "../components/modals/SurveyResponsesModal";

import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";

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
                responses: []
            });
        } catch (error) {
            console.error("Failed to add survey:", error);
        }
    };

    const handleStatusChange = async (surveyId, newStatus) => {
        try {
            const surveyRef = doc(db, "surveys", surveyId);
            await updateDoc(surveyRef, { status: newStatus });
        } catch (error) {
            console.error("Failed to update status:", error);
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
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                <Send className="w-8 h-8 text-primary" />
                                Survey Management
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Create, view, and manage surveys
                            </p>
                        </div>
                        <AddSurveyModal onAddSurvey={handleAddSurvey} />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card><CardContent className="p-6">Total: {surveys.length}</CardContent></Card>
                        <Card><CardContent className="p-6">Active: {surveys.filter(s => s.status === "active").length}</CardContent></Card>
                        <Card><CardContent className="p-6">Draft: {surveys.filter(s => s.status === "draft").length}</CardContent></Card>
                        <Card><CardContent className="p-6">Closed: {surveys.filter(s => s.status === "closed").length}</CardContent></Card>
                    </div>

                    {/* Search */}
                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search surveys..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
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
                                    <div key={survey.id} className="p-4 border rounded-lg flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold">{survey.title}</h3>
                                            <Badge className={getStatusColor(survey.status)}>{survey.status}</Badge>
                                            <p>Responses: {survey.responses?.length || 0}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            {survey.status === "active" && (
                                                <Button onClick={() => window.open(`/survey/${survey.id}`, "_blank")}>
                                                    Take Survey
                                                </Button>
                                            )}
                                            {survey.responses?.length > 0 && (
                                                <SurveyResponsesModal
                                                    survey={survey}
                                                    trigger={<Button variant="secondary">View Responses</Button>}
                                                />
                                            )}
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

export default SurveyManagement;
