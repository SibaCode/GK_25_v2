import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Shield, Recycle, GraduationCap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { AddFraudCaseModal } from "../modals/AddFraudCaseModal";
import { AddEWasteModal } from "../modals/AddEWasteModal";
import { AssignCourseModal } from "../modals/AssignCourseModal";

export const QuickActionsSection = ({ handleAddFraudCase, handleAddEWasteEntry, handleAssignCourse }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <AddFraudCaseModal
            onAddCase={handleAddFraudCase}
            trigger={
              <Button className="flex flex-col items-center justify-center gap-2 p-4 w-full h-auto border border-gray-200 rounded-lg hover:shadow-lg transition-all">
                <Shield className="w-6 h-6 text-yellow-500" />
                <span className="font-medium">Add Fraud Case</span>
              </Button>
            }
          />
          <AddEWasteModal
            onAddEntry={handleAddEWasteEntry}
            trigger={
              <Button className="flex flex-col items-center justify-center gap-2 p-4 w-full h-auto border border-gray-200 rounded-lg hover:shadow-lg transition-all">
                <Recycle className="w-6 h-6 text-blue-500" />
                <span className="font-medium">Log E-Waste</span>
              </Button>
            }
          />
          <AssignCourseModal
            onAssignCourse={handleAssignCourse}
            trigger={
              <Button className="flex flex-col items-center justify-center gap-2 p-4 w-full h-auto border border-gray-200 rounded-lg hover:shadow-lg transition-all">
                <GraduationCap className="w-6 h-6 text-purple-500" />
                <span className="font-medium">Assign Course</span>
              </Button>
            }
          />
          <Link to="/reports">
            <Button className="flex flex-col items-center justify-center gap-2 p-4 w-full h-auto border border-gray-200 rounded-lg hover:shadow-lg transition-all">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <span className="font-medium">View Reports</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsSection;
