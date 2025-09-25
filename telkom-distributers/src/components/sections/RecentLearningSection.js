import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AssignCourseModal } from "../modals/AssignCourseModal";

const recentLearningSessions = [
  { distributor: "Alice Johnson", course: "Fraud Detection Fundamentals", participants: 8, badges: 5, timestamp: "Today" },
  { distributor: "David Lee", course: "E-Waste Management", participants: 12, badges: 8, timestamp: "Yesterday" },
];

export const RecentLearningSection = ({ handleAssignCourse }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <GraduationCap className="w-5 h-5 text-primary" />
          Recent Learning Sessions
        </CardTitle>
        <Link to="/learning">
        <Button
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow transition-all rounded"
        >
            View All <ArrowRight className="w-4 h-4" />
        </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentLearningSessions.map((session, index) => (
          <div
            key={index}
            className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-gray-800">{session.distributor}</p>
                <span className="text-xs text-gray-500">{session.timestamp}</span>
              </div>
              <p className="text-xs text-gray-600">{session.course}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-primary">{session.participants} participants</span>
                <span className="text-green-500">{session.badges} badges earned</span>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2">
          <AssignCourseModal
            onAssignCourse={handleAssignCourse}
            trigger={
              <Button className="w-full bg-primary hover:bg-purple-600 text-white flex items-center justify-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Schedule Session
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentLearningSection;
