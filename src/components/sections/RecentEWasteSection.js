// RecentEWasteSection.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Recycle, ArrowRight, Plus } from "lucide-react";
import { AddEWasteModal } from "../modals/AddEWasteModal";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
// import { db } from "../firebase";
// import { addEWaste } from "../services/eWasteService";
// RecentEWasteSection.js

// Import Firestore (if needed)
import { db } from "../../firebase"; 

// Import your eWaste service
import { addEWaste } from "../../services/eWasteService";

export const RecentEWasteSection = () => {
  const [recentEWasteLogs, setRecentEWasteLogs] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "eWasteEntries"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentEWasteLogs(entries);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleAddEWasteEntry = async (entryData) => {
    try {
      await addEWaste({ ...entryData, createdAt: new Date() });
      // No need to manually fetch — onSnapshot will handle realtime update
    } catch (error) {
      console.error("Error adding e-waste entry:", error);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Recycle className="w-5 h-5 text-blue-500" />
          Recent E-Waste Logs
        </CardTitle>
        <Link to="/e-waste">
          <Button className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow transition-all rounded">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentEWasteLogs.map((log) => (
          <div
            key={log.id}
            className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm text-gray-800">{log.customer}</p>
              <p className="text-xs text-gray-500">{log.items}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-medium text-blue-500">{log.weight} kg</p>
              <p className="text-xs text-green-600">{log.rewardPoints} pts</p>
            </div>
          </div>
        ))}

        <AddEWasteModal
          onAddEntry={handleAddEWasteEntry}
          trigger={
            <Button className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-4 h-4" />
              Add E-Waste Entry
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
};

export default RecentEWasteSection;
