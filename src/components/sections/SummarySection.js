import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";
import { Shield, Recycle, TrendingUp, GraduationCap } from "lucide-react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const SummarySection = () => {
  const [summary, setSummary] = useState({
    totalFraudCases: 0,
    eWasteCollected: 0,
    rewardsDistributed: 0,
    coursesCompleted: 0,
  });

  useEffect(() => {
    // Fraud Cases
    const fraudUnsub = onSnapshot(collection(db, "fraudCases"), (snapshot) => {
      setSummary((prev) => ({ ...prev, totalFraudCases: snapshot.size }));
    });

    // E-Waste Entries
    const eWasteUnsub = onSnapshot(collection(db, "eWasteEntries"), (snapshot) => {
      let totalWeight = 0;
      let totalRewards = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        totalWeight += data.weight || 0;
        totalRewards += data.rewardPoints || 0;
      });

      setSummary((prev) => ({
        ...prev,
        eWasteCollected: totalWeight,
        rewardsDistributed: totalRewards,
      }));
    });

    // Courses Completed
    const coursesUnsub = onSnapshot(collection(db, "courses"), (snapshot) => {
      setSummary((prev) => ({ ...prev, coursesCompleted: snapshot.size }));
    });

    // Cleanup subscriptions
    return () => {
      fraudUnsub();
      eWasteUnsub();
      coursesUnsub();
    };
  }, []);

  const summaryCards = [
    {
      title: "Total Fraud Cases",
      value: summary.totalFraudCases,
      percent: "↑ 12% this month",
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      iconBg: "bg-blue-100",
      link: "/fraud",
    },
    {
      title: "E-Waste Collected",
      value: summary.eWasteCollected + " kg",
      percent: "↑ 8% this month",
      icon: <Recycle className="w-6 h-6 text-blue-500" />,
      iconBg: "bg-blue-100",
      link: "/e-waste",
    },
    {
      title: "Rewards Distributed",
      value: summary.rewardsDistributed,
      percent: "↑ 15% this month",
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
      iconBg: "bg-blue-100",
      link: "/learning",
    },
    {
      title: "Courses Completed",
      value: summary.coursesCompleted,
      percent: "↑ 23% this month",
      icon: <GraduationCap className="w-6 h-6 text-blue-500" />,
      iconBg: "bg-blue-100",
      link: "/learning",
    },
  ];

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
