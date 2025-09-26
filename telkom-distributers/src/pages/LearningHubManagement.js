// src/pages/LearningHubManagement.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Search, Book, Users, CheckCircle } from "lucide-react";

import { AddCourseModal } from "../components/modals/AddCourseModal";
import { CourseDetailsModal } from "../components/modals/CourseDetailsModal";

// Pre-filled sample data
const sampleData = [
  {
    id: 1,
    region: "North Region",
    distributor: "John Doe",
    simFraud: 12,
    eWasteParticipation: 45,
    sales: 300,
    recommendedCourse: "SIM Security Awareness",
    status: "Pending",
  },
  {
    id: 2,
    region: "East Region",
    distributor: "Jane Smith",
    simFraud: 3,
    eWasteParticipation: 70,
    sales: 200,
    recommendedCourse: "eWaste Engagement Training",
    status: "Scheduled",
  },
  {
    id: 3,
    region: "South Region",
    distributor: "Mike Brown",
    simFraud: 8,
    eWasteParticipation: 60,
    sales: 150,
    recommendedCourse: "Sales Booster Workshop",
    status: "Pending",
  },
];

const LearningHubManagement = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setCourses(sampleData);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setCourses(prev =>
      prev.map(c => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const filteredCourses = courses.filter(c =>
    c.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.distributor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.recommendedCourse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalCourses = courses.length;
  const scheduled = courses.filter(c => c.status === "Scheduled").length;
  const completed = courses.filter(c => c.status === "Completed").length;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-6 space-y-6 overflow-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Book className="w-8 h-8 text-primary" />
                Learning Hub Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Assign courses and track distributor training performance
              </p>
            </div>
            <AddCourseModal />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold text-foreground">{totalCourses}</p>
                </div>
                <Book className="w-6 h-6 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold text-accent">{scheduled}</p>
                </div>
                <Users className="w-6 h-6 text-accent" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{completed}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-success" />
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search courses, distributors, regions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Courses Table */}
          <Card>
            <CardHeader>
              <CardTitle>Distributor Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full border rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Region</th>
                      <th className="p-2 text-left">Distributor</th>
                      <th className="p-2 text-left">SIM Fraud</th>
                      <th className="p-2 text-left">eWaste %</th>
                      <th className="p-2 text-left">Sales</th>
                      <th className="p-2 text-left">Recommended Course</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map(c => (
                      <tr key={c.id} className="border-t">
                        <td className="p-2">{c.region}</td>
                        <td className="p-2">{c.distributor}</td>
                        <td className="p-2">{c.simFraud}</td>
                        <td className="p-2">{c.eWasteParticipation}%</td>
                        <td className="p-2">{c.sales}</td>
                        <td className="p-2">{c.recommendedCourse}</td>
                        <td className="p-2">{c.status}</td>
                        <td className="p-2">
                          <CourseDetailsModal
                            course={c}
                            onStatusChange={handleStatusChange}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningHubManagement;
