import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { submitSurveyResponse } from "../../services/surveyService";

export function TakeSurveyModal({ survey }) {
    const [open, setOpen] = useState(false);
    const [answers, setAnswers] = useState([]);
    const questions = survey.questions || [];

    useEffect(() => {
        setAnswers(Array(questions.length).fill(""));
    }, [questions.length]);

    const handleChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        await submitSurveyResponse(survey.id, {
            answers,
            takenAt: new Date().toISOString()
        });
        setOpen(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button className="px-3 py-1 border rounded text-sm">Take Survey</Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
                    <Dialog.Title className="text-xl font-bold mb-4">{survey.title}</Dialog.Title>

                    {questions.length === 0 ? (
                        <p>No questions for this survey</p>
                    ) : (
                        <div className="space-y-3">
                            {questions.map((q, i) => (
                                <div key={i}>
                                    <p className="font-semibold">{q}</p>
                                    <input
                                        type="text"
                                        value={answers[i] || ""}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                            ))}
                            <Button className="mt-4 bg-blue-500 text-white" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
