import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

export default function SurveyResponsesModal({ survey }) {
    const responses = Array.isArray(survey.responses) ? survey.responses : [];

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button size="sm" variant="outline">View Responses</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg">
                    <Dialog.Title className="text-xl font-bold mb-4">{survey.title} - Responses</Dialog.Title>

                    {responses.length === 0 ? (
                        <p>No responses yet.</p>
                    ) : (
                        <ul className="space-y-2 max-h-80 overflow-y-auto">
                            {responses.map((resp, idx) => {
                                // Ensure answers is always an array
                                const answersArray = Array.isArray(resp.answers) ? resp.answers : [];
                                return (
                                    <li key={idx} className="border p-2 rounded">
                                        {answersArray.map((a, i) => (
                                            <p key={i}><strong>Q{i + 1}:</strong> {a}</p>
                                        ))}
                                        <small className="text-muted">
                                            {resp.submittedAt?.toDate?.()?.toLocaleString() || new Date(resp.submittedAt).toLocaleString()}
                                        </small>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
