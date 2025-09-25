import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Shield, Recycle, TrendingUp, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const summaryCards = [
  {
    title: "Total Fraud Cases",
    value: "156",
    percent: "↑ 12% this month",
    icon: <Shield className="w-6 h-6 text-blue-500" />,
    iconBg: "bg-blue-100",
    link: "/fraud",
  },
  {
    title: "E-Waste Collected",
    value: "2.1T",
    percent: "↑ 8% this month",
    icon: <Recycle className="w-6 h-6 text-blue-500" />,
    iconBg: "bg-blue-100",
    link: "/e-waste",
  },
  {
    title: "Rewards Distributed",
    value: "1,250",
    percent: "↑ 15% this month",
    icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
    iconBg: "bg-blue-100",
    link: "/learning",
  },
  {
    title: "Courses Completed",
    value: "89",
    percent: "↑ 23% this month",
    icon: <GraduationCap className="w-6 h-6 text-blue-500" />,
    iconBg: "bg-blue-100",
    link: "/learning",
  },
];

export const SummarySection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, idx) => (
        <Card key={idx} className="shadow-lg hover:shadow-xl transition-all cursor-pointer">
          <Link to={card.link}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-green-500">{card.percent}</p>
              </div>
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg ${card.iconBg} transition-shadow`}
              >
                {card.icon}
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default SummarySection;
