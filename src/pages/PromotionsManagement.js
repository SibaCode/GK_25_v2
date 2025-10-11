// PromotionsManagement.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Award, Search } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const COLORS = ["#4ade80", "#facc15", "#f87171"]; // green, yellow, red

const PromotionsManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const q = query(collection(db, "promotions"), orderBy("validUntil", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const promos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPromotions(promos);
        });

        return () => unsubscribe();
    }, []);

    // Parse conversion string "70%" -> 70
    const parseConversion = (conv) => (conv ? parseFloat(conv.replace("%", "")) : 0);

    // Metrics
    const totalPromotions = promotions.length;
    const activePromotions = promotions.filter((p) => p.active === "true").length;
    const upcomingExpiring = promotions.filter((p) => {
        const today = new Date();
        const validDate = new Date(p.validUntil);
        const diffDays = (validDate - today) / (1000 * 60 * 60 * 24);
        return diffDays > 0 && diffDays <= 7;
    }).length;
    const avgConversion =
        promotions.length > 0
            ? promotions.reduce((sum, p) => sum + parseConversion(p.conversions), 0) / promotions.length
            : 0;
    const topPromotion = promotions.reduce(
        (prev, curr) => (parseConversion(curr.conversions) > parseConversion(prev.conversions) ? curr : prev),
        promotions[0] || {}
    );

    // Category distribution for bar chart
    const categoryCounts = {};
    promotions.forEach((p) => {
        const cat = p.category || "Other";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const categoryData = Object.keys(categoryCounts).map((key) => ({ category: key, count: categoryCounts[key] }));

    // Active vs Inactive for pie chart
    const pieData = [
        { name: "Active", value: activePromotions },
        { name: "Inactive", value: totalPromotions - activePromotions },
    ];

    // Filtered promotions
    const filteredPromotions = promotions.filter(
        (promo) =>
            promo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
                                <Award className="w-8 h-8 text-primary" />
                                Promotions Management
                            </h1>
                            <p className="text-muted-foreground mt-2">View all promotions provided by Telkom</p>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">Total Promotions</p>
                                <p className="text-2xl font-bold">{totalPromotions}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">Active Promotions</p>
                                <p className="text-2xl font-bold text-success">{activePromotions}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">Expiring Soon (7 days)</p>
                                <p className="text-2xl font-bold text-warning">{upcomingExpiring}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">Avg Conversion</p>
                                <p className="text-2xl font-bold text-accent">{avgConversion.toFixed(1)}%</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">Top Promotion</p>
                                <p className="text-2xl font-bold text-foreground">{topPromotion?.title || "N/A"}</p>
                                <p className="text-xs text-muted-foreground">{topPromotion?.conversions || "0%"}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pie Chart: Active vs Inactive */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={70} fill="#8884d8" label>
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Bar Chart: Promotions per Category */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Promotions per Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={categoryData}>
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#4ade80" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <div className="flex gap-4 items-center mt-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search promotions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Promotions Grid */}
                    <Card className="card-elevated">
                        <CardHeader>
                            <CardTitle>Available Promotions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredPromotions.length > 0 ? (
                                    filteredPromotions.map((promo) => (
                                        <div
                                            key={promo.id}
                                            className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 bg-gradient-card"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <Badge
                                                    variant={promo.active === "true" ? "success" : "warning"}
                                                    className="text-xs"
                                                >
                                                    {promo.active === "true" ? "Active" : "Limited Time"}
                                                </Badge>
                                                <span className="text-xl font-bold text-accent">{promo.discount}</span>
                                            </div>

                                            <h4 className="font-semibold text-sm mb-2">{promo.title}</h4>
                                            <p className="text-xs text-muted-foreground mb-3">{promo.description}</p>

                                            <div className="space-y-2 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Category:</span>
                                                    <span className="font-medium">{promo.category}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Valid Until:</span>
                                                    <span className="font-medium">{promo.validUntil}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Conversions:</span>
                                                    <span className="font-medium">{promo.conversions}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center col-span-full">No promotions available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PromotionsManagement;
