import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const communityStats = {
  activeMembers: 42,
  messagesToday: 127,
  popularTopics: [
    { topic: "E-Waste Best Practices", messages: 24, color: "text-primary" },
    { topic: "Fraud Prevention Tips", messages: 18, color: "text-secondary" },
  ],
};

export const CommunitySection = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Users className="w-5 h-5 text-blue-500" />
          Community Activity
        </CardTitle>
        <Link to="/community">
          <Button variant="ghost" size="sm">
            Join Chat <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-100 rounded-lg">
            <p className="text-2xl font-bold text-blue-500">{communityStats.activeMembers}</p>
            <p className="text-xs text-gray-500">Active Members</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <p className="text-2xl font-bold text-blue-500">{communityStats.messagesToday}</p>
            <p className="text-xs text-gray-500">Messages Today</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Popular Topics</h4>
          <div className="space-y-1 text-sm">
            {communityStats.popularTopics.map((topic, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{topic.topic}</span>
                <span className={topic.color}>{topic.messages} msgs</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunitySection;
