import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input"; 
import { Shield, Search } from "lucide-react";

import { cn } from "../lib/utils"; 
import { AddFraudCaseModal } from "../components/modals/AddFraudCaseModal";
import { FraudCaseDetailsModal } from "../components/modals/FraudCaseDetailsModal";

import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending": return "bg-warning text-warning-foreground";
    case "Resolved": return "bg-success text-success-foreground";
    case "Not Finished": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const FraudManagementDashboard = () => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "fraudCases"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const casesFromDB = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCases(casesFromDB);
    });
    return () => unsubscribe();
  }, []);

  const handleAddCase = async (caseData) => {
    try {
      const { addFraudCase } = await import("../../services/fraudService");
      await addFraudCase(caseData);
    } catch (error) {
      console.error("Failed to add fraud case:", error);
    }
  };

  const handleStatusChange = async (caseId, newStatus) => {
    try {
      const caseRef = doc(db, "fraudCases", caseId);
      await updateDoc(caseRef, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredCases = cases.filter(fraudCase => {
    const matchesSearch =
      fraudCase.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fraudCase.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fraudCase.simNumber.includes(searchTerm);

    const matchesFilter = filterStatus === "all" || fraudCase.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="p-6 space-y-6 overflow-auto">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                Fraud Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Track and manage customer fraud reports and security incidents
              </p>
            </div>
            <AddFraudCaseModal onAddCase={handleAddCase} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Total Cases", count: cases.length, color: "primary" },
              { label: "Pending", count: cases.filter(c => c.status === "Pending").length, color: "primary" },
              { label: "Resolved", count: cases.filter(c => c.status === "Resolved").length, color: "primary" },
              { label: "Not Finished", count: cases.filter(c => c.status === "Not Finished").length, color: "primary" },
            ].map((stat, idx) => (
              <Card key={idx} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}/10 rounded-lg flex items-center justify-center`}>
                    <Shield className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Not Finished">Not Finished</option>
            </select>
          </div>

          {/* Cases List */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Fraud Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCases.map(fraudCase => (
                  <div
                    key={fraudCase.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{fraudCase.caseNumber}</h3>
                        <Badge className={cn("text-xs", getStatusColor(fraudCase.status))}>
                          {fraudCase.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {fraudCase.createdAt?.toDate?.()?.toLocaleString() || ""}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-medium text-foreground">{fraudCase.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">SIM Number</p>
                        <p className="font-medium text-foreground">{fraudCase.simNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium text-foreground">{fraudCase.category}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{fraudCase.description}</p>

                    <div className="flex gap-2">
                      <FraudCaseDetailsModal
                        fraudCase={fraudCase}
                        onStatusChange={handleStatusChange}
                        trigger={<button className="px-3 py-1 border rounded-md text-sm">View Details</button>}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FraudManagementDashboard;
