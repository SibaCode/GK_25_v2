import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { GraduationCap, BookOpen, Award, Play } from "lucide-react";
import { AssignCourseModal } from "../components/modals/AssignCourseModal";

// Example structure for recommended courses
const recommendedCoursesMock = [
  {
    id: "RC-001",
    name: "SIM Cloning Awareness",
    description: "Learn how to detect SIM cloning trends in your region",
    modules: 5,
    pointsValue: 80,
    badgeReward: "Fraud Detector",
    completionRate: 0,
    expectedParticipants: 20,
    priority: "High",
  },
  {
    id: "RC-002",
    name: "E-Waste Management",
    description: "Best practices for safe disposal of electronic waste",
    modules: 4,
    pointsValue: 60,
    badgeReward: "Eco Champion",
    completionRate: 0,
    expectedParticipants: 15,
    priority: "Medium",
  },
];

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High": return "bg-red-500 text-white";
    case "Medium": return "bg-yellow-500 text-black";
    case "Low": return "bg-green-500 text-white";
    default: return "bg-gray-300 text-black";
  }
};

const LearningHub = () => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  // Simulate fetching system-recommended courses based on region trends
  useEffect(() => {
    // In a real app, call API to fetch recommended courses for distributor
    setRecommendedCourses(recommendedCoursesMock);
  }, []);

  const handleAssignCourse = (assignment) => {
    console.log("Course assigned:", assignment);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary" /> Learning Hub
        </h1>
        <AssignCourseModal onAssignCourse={handleAssignCourse} />
      </div>

      {/* Recommended Courses */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recommended Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedCourses.map((course) => (
              <Card key={course.id} className="border hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Modules: {course.modules}</span>
                    <span>Points: {course.pointsValue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge className={getPriorityColor(course.priority)}>{course.priority}</Badge>
                    <span>{course.expectedParticipants} participants</span>
                  </div>
                  <Button className="w-full flex items-center gap-2">
                    <Play className="w-4 h-4" /> Start Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningHub;
