// AddSurveyModal.js
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { addSurvey } from "../../services/surveysService";

const surveySchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    targetAudience: z.string().min(1, "Target audience is required"),
    questions: z.array(z.string()).optional(),
});

export function AddSurveyModal({ onAddSurvey }) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(surveySchema),
        defaultValues: {
            title: "",
            category: "",
            targetAudience: "",
            questions: [""], // Start with one empty question
        },
    });

    const { fields, append, remove } = form.control._defaultValues.questions
        ? { fields: form.control._defaultValues.questions, append: () => { }, remove: () => { } }
        : { fields: [""], append: () => { }, remove: () => { } };

    const onSubmit = async (data) => {
        try {
            // Ensure questions is always an array
            const surveyData = {
                ...data,
                createdAt: new Date(),
                status: "draft",
                responses: [],
                questions: Array.isArray(data.questions) ? data.questions : [],
            };

            await addSurvey(surveyData);
            onAddSurvey && onAddSurvey(surveyData);
            toast.success("Survey added successfully!");
            form.reset({
                title: "",
                category: "",
                targetAudience: "",
                questions: [""],
            });
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to add survey");
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Toaster position="top-right" />
            <Dialog.Trigger asChild>
                <Button className="bg-blue-500 text-white flex items-center gap-2">Add Survey</Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
                    <Dialog.Title className="text-xl font-bold mb-4">Create New Survey</Dialog.Title>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="font-semibold">Title</label>
                            <input
                                type="text"
                                {...form.register("title")}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Category</label>
                            <input
                                type="text"
                                {...form.register("category")}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Target Audience</label>
                            <input
                                type="text"
                                {...form.register("targetAudience")}
                                className="border p-2 rounded w-full"
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Questions</label>
                            {form.watch("questions")?.map((q, i) => (
                                <div key={i} className="flex gap-2 mt-1">
                                    <input
                                        type="text"
                                        value={q}
                                        onChange={(e) => {
                                            const newQuestions = [...form.watch("questions")];
                                            newQuestions[i] = e.target.value;
                                            form.setValue("questions", newQuestions);
                                        }}
                                        className="border p-2 rounded flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newQuestions = [...form.watch("questions")];
                                            newQuestions.splice(i, 1);
                                            form.setValue("questions", newQuestions.length ? newQuestions : [""]);
                                        }}
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    form.setValue("questions", [...form.watch("questions"), ""])
                                }
                                className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
                            >
                                Add Question
                            </button>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-blue-500 text-white">
                                Save Survey
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
