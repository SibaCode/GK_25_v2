import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { Button } from "../components/ui/button";

const SurveyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchSurvey = async () => {
            const docRef = doc(db, "surveys", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setSurvey(docSnap.data());
        };
        fetchSurvey();
    }, [id]);

    const handleChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleSubmit = async () => {
        if (!survey) return;
        const docRef = doc(db, "surveys", id);
        await updateDoc(docRef, {
            responses: arrayUnion({
                distributor: "DistributorName", // replace with logged-in user
                answers,
                submittedAt: new Date()
            })
        });
        alert("Survey submitted successfully!");
        navigate("/survey-management");
    };

    if (!survey) return <p>Loading survey...</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{survey.title}</h1>
            <p className="mb-6 text-muted-foreground">{survey.category}</p>

            {survey.questions?.map(q => (
                <div key={q.id} className="mb-4">
                    <p className="font-medium">{q.question}</p>
                    <input
                        className="border p-2 rounded w-full"
                        placeholder="Your answer"
                        value={answers[q.id] || ""}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                    />
                </div>
            ))}

            <Button onClick={handleSubmit}>Submit Survey</Button>
        </div>
    );
};

export default SurveyPage;
