import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui";
import { updateSurvey } from "../../services/surveysService";
import toast from "react-hot-toast";

export default function EditSurveyModal({ survey, onSurveyUpdated, trigger }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(survey);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSurvey(survey.id, form);
    onSurveyUpdated({ ...survey, ...form });
    toast.success("Survey updated!");
    setOpen(false);
  };

  const defaultTrigger = trigger || <Button>Edit</Button>;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{defaultTrigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50"/>
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6">
          <Dialog.Title className="font-bold text-lg mb-4">Edit Survey</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="Title" 
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
              required 
            />
            <Textarea 
              placeholder="Description" 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              required 
            />
            <Select value={form.category} onValueChange={(val) => setForm({ ...form, category: val })}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="service_quality">Service Quality</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
            <Select value={form.targetAudience} onValueChange={(val) => setForm({ ...form, targetAudience: val })}>
              <SelectTrigger><SelectValue placeholder="Target Audience" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all_customers">All Customers</SelectItem>
                <SelectItem value="business_customers">Business Customers</SelectItem>
                <SelectItem value="residential">Residential Users</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="distributors">Distributors</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
