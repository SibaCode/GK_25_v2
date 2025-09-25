import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input"; 
import { Recycle, Search, Award } from "lucide-react";

import { AddEWasteModal } from "../components/modals/AddEWasteModal";
import { EWasteDetailsModal } from "../components/modals/EWasteDetailsModal";

import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";

// Status colors
const getStatusColor = (status) => {
  switch (status) {
    case "Collected": return "bg-warning text-warning-foreground";
    case "Processing": return "bg-secondary text-secondary-foreground";
    case "Recycled": return "bg-success text-success-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const EWasteManagement = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Firestore listener
  useEffect(() => {
    const q = query(collection(db, "eWasteEntries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsFromDB = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(logsFromDB);
    });
    return () => unsubscribe();
  }, []);

  const handleAddEntry = async (entryData) => {
    try {
      const { addEWasteLog } = await import("../../services/ewasteService");
      await addEWasteLog({ ...entryData, createdAt: new Date() });
      // onSnapshot will automatically update the UI
    } catch (error) {
      console.error("Failed to add e-waste log:", error);
    }
  };

  const handleStatusChange = async (logId, newStatus) => {
    try {
      const logRef = doc(db, "eWasteEntries", logId);
      await updateDoc(logRef, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const totalWeight = logs.reduce((sum, log) => sum + (log.weight || 0), 0);
  const totalRewards = logs.reduce((sum, log) => sum + (log.rewardPoints || 0), 0);

  const filteredLogs = logs.filter(log => 
    log.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.distributor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.items?.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                <Recycle className="w-8 h-8 text-primary" />
                E-Waste Tracking
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage electronic waste collection and reward distribution
              </p>
            </div>
            <AddEWasteModal onAddEntry={handleAddEntry} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Collections</p>
                  <p className="text-2xl font-bold text-foreground">{logs.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Weight (kg)</p>
                  <p className="text-2xl font-bold text-primary">{totalWeight.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rewards Distributed</p>
                  <p className="text-2xl font-bold text-accent">{totalRewards}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Items Recycled</p>
                  <p className="text-2xl font-bold text-success">
                    {logs.filter(log => log.status === "Recycled").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-success" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* E-Waste Logs */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Collection Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs.map(log => (
                  <div key={log.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{log.customer}</h3>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {log.createdAt?.toDate().toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Items</p>
                        <p className="font-medium text-foreground">{log.items?.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium text-foreground">{log.weight || 0} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reward Points</p>
                        <p className="font-medium text-accent">{log.rewardPoints || 0} pts</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Distributor</p>
                        <p className="font-medium text-foreground">{log.distributor}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <EWasteDetailsModal
                        log={log}
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

export default EWasteManagement;
