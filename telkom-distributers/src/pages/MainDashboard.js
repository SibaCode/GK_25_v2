import React from "react";
import { Link } from "react-router-dom";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  LayoutDashboard, Shield, Recycle, GraduationCap, 
  Users, TrendingUp, Plus, ArrowRight
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { RecentFraudSection } from "../components/sections/RecentFraudSection";
import { SummarySection } from "../components/sections/SummarySection";
import { RecentEWasteSection } from "../components/sections/RecentEWasteSection";

import { AddFraudCaseModal } from "../components/modals/AddFraudCaseModal";
import { AddEWasteModal } from "../components/modals/AddEWasteModal";
import { AssignCourseModal } from "../components/modals/AssignCourseModal";

const MainDashboard = () => {

  // Mock data
  const recentFraudCases = [
    { id: "FR-001", customer: "John Doe", status: "Pending", timestamp: "2h ago" },
    { id: "FR-002", customer: "Jane Smith", status: "Resolved", timestamp: "5h ago" },
  ];

  const recentEWasteLogs = [
    { customer: "Sarah Wilson", items: "Phone, Charger", weight: "0.8kg", reward: "80 pts", timestamp: "1h ago" },
    { customer: "Robert Chen", items: "Laptop Battery", weight: "2kg", reward: "200 pts", timestamp: "3h ago" },
  ];

  const recentLearningSessions = [
    { distributor: "Alice Johnson", course: "Fraud Fundamentals", participants: 8, badges: 5, timestamp: "Today" },
  ];

  const getStatusColor = (status) => {
    switch(status){
      case "Pending": return "bg-warning text-warning-foreground";
      case "Resolved": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="p-6 space-y-6 overflow-auto">
          {/* Welcome */}
          

          <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white"/>
              </div>
              Welcome to EcoTelecom Hub
            </h1>
          <p className="text-muted-foreground mt-2">
            Manage fraud cases, track e-waste collection, and support distributor learning
          </p>
        </div>



          {/* Summary Cards */}
          <SummarySection />

         

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fraud Cases */}
            <RecentFraudSection />
          

            {/* E-Waste */}
            <RecentEWasteSection />


            {/* Learning Sessions */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-secondary"/> Recent Learning
                </CardTitle>
                <Link to="/learning">
                  <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4 ml-1"/></Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentLearningSessions.map((s,i) => (
                  <div key={i} className="p-2 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{s.distributor}</p>
                      <span className="text-xs text-muted-foreground">{s.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.course}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
