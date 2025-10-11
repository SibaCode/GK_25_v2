import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { assignCourse } from "../../services/learningHubService";

export function AddCourseModal() {
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [distributor, setDistributor] = useState("");
  const [metric, setMetric] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    assignCourse({ courseName, distributor, metric });
    setCourseName("");
    setDistributor("");
    setMetric("");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>Add Course Assignment</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Assign New Course</Dialog.Title>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Course Name</label>
              <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Distributor</label>
              <Input value={distributor} onChange={(e) => setDistributor(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Metric Triggered</label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim_fraud">SIM Fraud</SelectItem>
                  <SelectItem value="eWaste_participation">eWaste Participation</SelectItem>
                  <SelectItem value="sales_performance">Sales Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Assign</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
