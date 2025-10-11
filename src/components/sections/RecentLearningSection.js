import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AssignCourseModal } from "../modals/AssignCourseModal";

// Replace this with backend/Firebase data later
const upcomingCourses = [
  { id: "UC-001", title: "SIM Cloning Awareness", region: "KwaZulu-Natal", scheduledDate: "2025-09-28T10:00:00Z", expectedParticipants: 20, priority: "High" },
  { id: "UC-002", title: "E-Waste Disposal Best Practices", region: "Gauteng", scheduledDate: "2025-09-29T14:00:00Z", expectedParticipants: 15, priority: "Medium" },
];

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High": return "bg-red-500 text-white";
    case "Medium": return "bg-yellow-500 text-black";
    case "Low": return "bg-green-500 text-white";
    default: return "bg-gray-300 text-black";
  }
};

export const RecentLearningSection = ({ handleAssignCourse }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <GraduationCap className="w-5 h-5 text-primary" />
          Upcoming Learning Sessions
        </CardTitle>
        <Link to="/learning">
          <Button className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow transition-all rounded">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingCourses.map((course) => (
          <div key={course.id} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="space-y-1">
              <p className="font-medium text-sm text-gray-800">{course.title}</p>
              <p className="text-xs text-gray-500">{course.region}</p>
              <p className="text-xs text-gray-500">{new Date(course.scheduledDate).toLocaleString()}</p>
              <div className="flex justify-between text-xs mt-1">
                <span>{course.expectedParticipants} participants</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(course.priority)}`}>{course.priority}</span>
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
                Assign Course
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentLearningSection;
