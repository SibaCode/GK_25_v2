import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../../firebase";
import toast, { Toaster } from "react-hot-toast";

export function SurveyDetailsModal({ survey, trigger }) {
    const [open, setOpen] = useState(false);
    const [answers, setAnswers] = useState({});

    const handleChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleSubmit = async () => {
        try {
            const surveyRef = doc(db, "surveys", survey.id);
            await updateDoc(surveyRef, {
                responses: increment(1),
                answers: arrayUnion(answers),
            });
            toast.success("Survey submitted!");
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit survey");
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Toaster position="top-right" />
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 overflow-auto max-h-[90vh]">
                    <Dialog.Title className="text-xl font-bold mb-4">{survey.title}</Dialog.Title>
                    <p className="mb-4 text-muted-foreground">{survey.description}</p>

                    <div className="space-y-4">
                        {survey.questions?.map((q, idx) => (
                            <div key={idx} className="flex flex-col">
                                <label className="font-semibold text-gray-700 mb-1">{q}</label>
                                <Textarea
                                    placeholder="Your answer..."
                                    value={answers[idx] || ""}
                                    onChange={e => handleChange(idx, e.target.value)}
                                    className="border-gray-300 rounded-lg p-2"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
