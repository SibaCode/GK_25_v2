import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

export function TimelineModal({ fraudCases }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button className="bg-blue-500 text-white px-3 py-1 rounded">View Timeline</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
                    <Dialog.Title className="text-xl font-bold mb-4">Case Timeline</Dialog.Title>
                    {fraudCases.map(c => (
                        <div key={c.id} className="mb-4 p-2 border rounded">
                            <p><strong>ITC Number:</strong> {c.itcNumber}</p>
                            {c.timeline.map((t, idx) => (
                                <p key={idx}>{new Date(t.date).toLocaleString()} - {t.action} ({t.actor})</p>
                            ))}
                        </div>
                    ))}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
