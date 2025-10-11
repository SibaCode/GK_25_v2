import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";

export function NotificationsModal({ notifications }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button className="bg-yellow-400 text-black p-2 rounded-full">
                    <Bell className="w-5 h-5" />
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
                    <Dialog.Title className="text-xl font-bold mb-4">Notifications</Dialog.Title>
                    {notifications.map(n => (
                        <div key={n.id} className="mb-2 p-2 border rounded">
                            <p>{n.message}</p>
                            <p className="text-xs text-gray-500">{new Date(n.date).toLocaleString()}</p>
                        </div>
                    ))}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
