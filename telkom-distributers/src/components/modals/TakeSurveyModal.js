import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "../ui/button"; // adjust if you have your Button component

export const TakeSurveyModal = ({ survey, trigger, onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [responses, setResponses] = useState({});

    // Initialize empty responses when survey changes
    useEffect(() => {
        if (survey.questions) {
            const initialResponses = {};
            survey.questions.forEach((q, index) => {
                initialResponses[index] = "";
            });
            setResponses(initialResponses);
        }
    }, [survey]);

    const handleChange = (index, value) => {
        setResponses(prev => ({ ...prev, [index]: value }));
    };

    const handleSubmit = async () => {
        try {
            const surveyRef = doc(db, "surveys", survey.id);
            await updateDoc(surveyRef, {
                responses,
                status: "Completed",
                submittedAt: new Date()
            });

            if (onSubmit) onSubmit(responses);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to submit survey:", error);
        }
    };

    return (
        <>
            {/* Trigger element */}
            <span onClick={() => setIsOpen(true)}>{trigger}</span>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ?
                        </button>

                        {/* Modal title */}
                        <h2 className="text-xl font-bold mb-4">{survey.title}</h2>

                        {/* Survey questions */}
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {survey.questions?.map((q, index) => (
                                <div key={index}>
                                    <label className="block font-medium mb-1">{q.question}</label>

                                    {q.type === "text" && (
                                        <input
                                            type="text"
                                            className="border p-2 rounded w-full"
                                            value={responses[index] || ""}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                        />
                                    )}

                                    {q.type === "rating" && (
                                        <select
                                            className="border p-2 rounded w-full"
                                            value={responses[index] || ""}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                        >
                                            <option value="">Select rating</option>
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                    )}

                                    {q.type === "multipleChoice" && (
                                        <div className="flex flex-col gap-2">
                                            {q.options.map((opt, i) => (
                                                <label key={i} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={`question-${index}`}
                                                        value={opt}
                                                        checked={responses[index] === opt}
                                                        onChange={() => handleChange(index, opt)}
                                                    />
                                                    {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Modal footer */}
                        <div className="mt-6 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={Object.values(responses).some(v => v === "")}
                            >
                                Submit Survey
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
