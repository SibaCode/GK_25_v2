import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Shield, ArrowRight, Plus } from "lucide-react";
import { AddFraudCaseModal } from "../modals/AddFraudCaseModal";

// Firebase imports
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

// Tailwind badge component
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Not Finished": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export const RecentFraudSection = () => {
  const [fraudCases, setFraudCases] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "fraudCases"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFraudCases(cases);
    }, (error) => {
      console.error("Error fetching fraud cases:", error);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleAddFraudCase = (newCase) => {
    // No need to fetch again, onSnapshot updates automatically
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Shield className="w-5 h-5 text-primary" />
          Recent Fraud Cases
        </CardTitle>
        <Link to="/fraud">
          <Button className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow transition-all rounded">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        {fraudCases.map((fraudCase) => (
          <div
            key={fraudCase.id}
            className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <div>
              <p className="font-medium text-sm">{fraudCase.caseNumber}</p>
              <p className="text-xs text-gray-600">{fraudCase.customerName}</p>
              <p className="text-xs text-gray-500">Priority: {fraudCase.priority}</p>
            </div>
            <StatusBadge status={fraudCase.status} />
          </div>
        ))}

        <AddFraudCaseModal
          onAddCase={handleAddFraudCase}
          trigger={
            <Button
              size="sm"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Add New Case
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
};

export default RecentFraudSection;
