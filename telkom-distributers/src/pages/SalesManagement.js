// SalesManagement.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { DollarSign, Search } from "lucide-react";

import { AddSaleModal } from "../components/modals/AddSaleModal";
import { SaleDetailsModal } from "../components/modals/SaleDetailsModal";

import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";

// Helper for badge colors
const getStatusColor = (status) => {
    switch (status) {
        case "Pending": return "bg-warning text-warning-foreground";
        case "Completed": return "bg-success text-success-foreground";
        case "Cancelled": return "bg-destructive text-destructive-foreground";
        default: return "bg-muted text-muted-foreground";
    }
};

const SalesManagement = () => {
    const [sales, setSales] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Example product list for dropdown in modal
    const availableProducts = [
        { id: 1, name: "SIM Card" },
        { id: 2, name: "Router" },
        { id: 3, name: "Smartphone" },
        { id: 4, name: "Charger" },
    ];

    // Firestore listener
    useEffect(() => {
        const q = query(collection(db, "sales"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const salesFromDB = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setSales(salesFromDB);
        });
        return () => unsubscribe();
    }, []);

    const handleAddSale = async (saleData) => {
        try {
            const { addSale } = await import("../../services/salesService");
            await addSale(saleData);
        } catch (error) {
            console.error("Failed to add sale:", error);
        }
    };

    const handleStatusChange = async (saleId, newStatus) => {
        try {
            const saleRef = doc(db, "sales", saleId);
            await updateDoc(saleRef, { status: newStatus });
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    // Metrics calculations
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const completedSales = sales.filter((s) => s.status === "Completed").length;
    const pendingSales = sales.filter((s) => s.status === "Pending").length;
    const cancelledSales = sales.filter((s) => s.status === "Cancelled").length;
    const avgSaleValue = sales.length ? totalRevenue / sales.length : 0;

    // Top product sold by quantity
    const productQuantities = {};
    sales.forEach((sale) => {
        if (sale.product) {
            productQuantities[sale.product] = (productQuantities[sale.product] || 0) + sale.quantity;
        }
    });
    const topProduct = Object.keys(productQuantities).reduce(
        (a, b) => (productQuantities[a] > productQuantities[b] ? a : b),
        ""
    );

    // Highest single sale
    const highestSale = sales.reduce((prev, curr) => (curr.total > (prev.total || 0) ? curr : prev), {});

    const filteredSales = sales.filter(
        (sale) =>
            sale.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.distributor?.toLowerCase().includes(searchTerm.toLowerCase())
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
                                <DollarSign className="w-8 h-8 text-primary" />
                                Sales Management
                            </h1>
                            <p className="text-muted-foreground mt-2">Manage distributor sales and track revenue</p>
                        </div>
                        <AddSaleModal onAddEntry={handleAddSale} availableProducts={availableProducts} />
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Sales</p>
                                    <p className="text-2xl font-bold text-foreground">{sales.length}</p>
                                </div>
                                <DollarSign className="w-6 h-6 text-primary" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                                    <p className="text-2xl font-bold text-success">R {totalRevenue.toFixed(2)}</p>
                                </div>
                                <DollarSign className="w-6 h-6 text-success" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed Sales</p>
                                    <p className="text-2xl font-bold text-accent">{completedSales}</p>
                                </div>
                                <DollarSign className="w-6 h-6 text-accent" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex flex-col justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending Sales</p>
                                    <p className="text-2xl font-bold text-warning">{pendingSales}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex flex-col justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Cancelled Sales</p>
                                    <p className="text-2xl font-bold text-destructive">{cancelledSales}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex flex-col justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Average Sale Value</p>
                                    <p className="text-2xl font-bold text-foreground">R {avgSaleValue.toFixed(2)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex flex-col justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Top Product Sold</p>
                                    <p className="text-2xl font-bold text-foreground">{topProduct || "N/A"}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex flex-col justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Highest Sale</p>
                                    <p className="text-2xl font-bold text-success">R {highestSale.total?.toFixed(2) || 0}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <div className="flex gap-4 items-center mt-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search sales..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Sales Records */}
                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle>Sales Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredSales.map((sale) => (
                                    <div
                                        key={sale.id}
                                        className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-foreground">{sale.product || "N/A"}</h3>
                                                <Badge className={getStatusColor(sale.status)}>{sale.status}</Badge>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {sale.date?.toDate
                                                    ? sale.date.toDate().toLocaleString()
                                                    : new Date(sale.date).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Quantity</p>
                                                <p className="font-medium text-foreground">{sale.quantity || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Price</p>
                                                <p className="font-medium text-foreground">R {sale.price?.toFixed(2) || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total</p>
                                                <p className="font-medium text-success">R {sale.total?.toFixed(2) || 0}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <SaleDetailsModal
                                                sale={sale}
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

export default SalesManagement;
