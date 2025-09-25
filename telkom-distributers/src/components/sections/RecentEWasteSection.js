import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Recycle, ArrowRight, Plus } from "lucide-react";
import { AddEWasteModal } from "../modals/AddEWasteModal";

const recentEWasteLogs = [
  { customer: "Sarah Wilson", items: "Smartphone, Charger", weight: "0.8kg", reward: "80 pts" },
  { customer: "Robert Chen", items: "Feature phone, Cables", weight: "1.2kg", reward: "120 pts" },
  { customer: "Maria Garcia", items: "Laptop battery", weight: "2.1kg", reward: "210 pts" },
];

export const RecentEWasteSection = () => {
  const handleAddEWasteEntry = (entryData) => {
    console.log("New e-waste entry:", entryData);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Recycle className="w-5 h-5 text-blue-500" />
          Recent E-Waste Logs
        </CardTitle>
        <Link
          to="/e-waste"
          className="text-sm text-blue-500 hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentEWasteLogs.map((log, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <div className="flex-1 space-y-1">
              <p className="font-medium text-sm text-gray-800">{log.customer}</p>
              <p className="text-xs text-gray-500">{log.items}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm font-medium text-blue-500">{log.weight}</p>
              <p className="text-xs text-green-600">{log.reward}</p>
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
