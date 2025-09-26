// PromotionsManagement.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Award, Search } from "lucide-react";

import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const PromotionsManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const q = query(collection(db, "promotions"), orderBy("validUntil", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const promos = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPromotions(promos);
        });

        return () => unsubscribe();
    }, []);

    // Metrics
    const totalPromotions = promotions.length;
    const activePromotions = promotions.filter((p) => p.status === "active").length;
    const upcomingExpiring = promotions.filter((p) => {
        const today = new Date();
        const validDate = new Date(p.validUntil);
        const diffDays = (validDate - today) / (1000 * 60 * 60 * 24);
        return diffDays > 0 && diffDays <= 7;
    }).length;
    const topConversion = promotions.length
        ? Math.max(...promotions.map((p) => p.conversions || 0))
        : 0;

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
                            <p className="text-muted-foreground mt-2">
                                View all promotions provided by Telkom
                            </p>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                <p className="text-sm text-muted-foreground">Top Conversion</p>
                                <p className="text-2xl font-bold text-accent">{topConversion}</p>
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
                                                    variant={promo.status === "active" ? "success" : "warning"}
                                                    className="text-xs"
                                                >
                                                    {promo.status === "active" ? "Active" : "Limited Time"}
                                                </Badge>
                                                <span className="text-xl font-bold text-accent">
                                                    {promo.discount}
                                                </span>
                                            </div>

                                            <h4 className="font-semibold text-sm mb-2">{promo.title}</h4>
                                            <p className="text-xs text-muted-foreground mb-3">
                                                {promo.description}
                                            </p>

                                            <div className="space-y-2 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Category:</span>
                                                    <span className="font-medium">{promo.category}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Valid Until:</span>
                                                    <span className="font-medium">{promo.validUntil}</span>
                                                </div>
/
                                            </div>

                                            <Button className="w-full mt-3" variant="accent" size="sm">
                                                Promote Now
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center col-span-full">
                                        No promotions available.
                                    </p>
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
