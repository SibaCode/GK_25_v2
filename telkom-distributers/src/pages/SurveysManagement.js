import React, { useEffect, useState } from "react";
import AddSurveyModal from "../components/modals/AddSurveyModal";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function SurveysManagement() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "surveys"), (snapshot) => {
      const surveysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSurveys(surveysData);
    });
    return () => unsubscribe();
  }, []);

  const handleSurveyAdded = (newSurvey) => {
    setSurveys(prev => [newSurvey, ...prev]); // optional local update
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Surveys Management</h1>
      <AddSurveyModal onSurveyAdded={handleSurveyAdded} />

      <div className="mt-6 space-y-4">
        {surveys.map((survey) => (
          <div key={survey.id} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{survey.title}</h3>
            <p className="text-sm text-muted-foreground">{survey.description}</p>
            <p className="text-xs text-muted-foreground">
              Category: {survey.category} • Audience: {survey.targetAudience} • Status: {survey.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
