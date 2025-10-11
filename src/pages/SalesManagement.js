import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { DollarSign, Search, TrendingUp } from "lucide-react";
import { AddSaleModal } from "../components/modals/AddSaleModal";
import { SaleDetailsModal } from "../components/modals/SaleDetailsModal";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";

// Badge colors
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

    // Handle add sale (updates state immediately)
    const handleAddSale = async (saleData) => {
        setSales(prev => [...prev, saleData]);
    };

    const handleStatusChange = async (saleId, newStatus) => {
        try {
            const saleRef = doc(db, "sales", saleId);
            await updateDoc(saleRef, { status: newStatus });
            setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: newStatus } : s));
        } catch (error) {
            console.error(error);
        }
    };

    // Metrics
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const completedSales = sales.filter((s) => s.status === "Completed").length;
    const pendingSales = sales.filter((s) => s.status === "Pending").length;
    const cancelledSales = sales.filter((s) => s.status === "Cancelled").length;
    const avgSaleValue = sales.length ? totalRevenue / sales.length : 0;

    // Top product
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

    // Highest sale
    const highestSale = sales.reduce((prev, curr) => (curr.total > (prev.total || 0) ? curr : prev), {});

    // Chart datasets
    const statusData = [
        { name: "Completed", value: completedSales },
        { name: "Pending", value: pendingSales },
        { name: "Cancelled", value: cancelledSales }
    ];

    const salesOverTimeData = Object.values(
        sales.reduce((acc, sale) => {
            const dateKey = new Date(sale.date?.toDate?.() || sale.date).toLocaleDateString();
            acc[dateKey] = acc[dateKey] || { date: dateKey, total: 0 };
            acc[dateKey].total += sale.total || 0;
            return acc;
        }, {})
    );

    const topProductsData = Object.entries(productQuantities).map(([name, quantity]) => ({ name, quantity }));

    const filteredSales = sales.filter(
        (sale) =>
            sale.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.distributor?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const COLORS = ["#28a745", "#ffc107", "#dc3545"]; // Completed, Pending, Cancelled

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="p-6 space-y-6 overflow-auto">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <DollarSign className="w-8 h-8 text-primary" />
                                Sales Management
                            </h1>
                            <p className="text-muted-foreground mt-2">Manage distributor sales and track revenue</p>
                        </div>
                        <AddSaleModal onAddEntry={handleAddSale} availableProducts={availableProducts} />
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card><CardContent className="p-6 flex justify-between"><div><p>Total Sales</p><p className="text-2xl font-bold">{sales.length}</p></div><DollarSign className="w-6 h-6 text-primary" /></CardContent></Card>
                        <Card><CardContent className="p-6 flex justify-between"><div><p>Total Revenue</p><p className="text-2xl font-bold text-success">R {totalRevenue.toFixed(2)}</p></div><DollarSign className="w-6 h-6 text-success" /></CardContent></Card>
                        <Card><CardContent className="p-6 flex justify-between"><div><p>Average Sale Value</p><p className="text-2xl font-bold">R {avgSaleValue.toFixed(2)}</p></div><TrendingUp className="w-6 h-6 text-accent" /></CardContent></Card>
                        <Card><CardContent className="p-6"><p>Top Product Sold</p><p className="text-2xl font-bold">{topProduct || "N/A"}</p></CardContent></Card>
                        <Card><CardContent className="p-6"><p>Completed Sales</p><p className="text-2xl font-bold text-success">{completedSales}</p></CardContent></Card>
                        <Card><CardContent className="p-6"><p>Pending Sales</p><p className="text-2xl font-bold text-warning">{pendingSales}</p></CardContent></Card>
                        <Card><CardContent className="p-6"><p>Cancelled Sales</p><p className="text-2xl font-bold text-destructive">{cancelledSales}</p></CardContent></Card>
                        <Card>
                            <CardContent className="p-6">
                                <p>Highest Sale</p>
                                {highestSale && highestSale.total ? (
                                    <div>
                                        <p className="text-2xl font-bold text-success">R {highestSale.total.toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground">{highestSale.product} • {highestSale.distributor}</p>
                                    </div>
                                ) : <p className="text-sm">No sales yet</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Status Pie */}
                        <Card>
                            <CardHeader><CardTitle>Status Breakdown</CardTitle></CardHeader>
                            <CardContent>
                                <PieChart width={250} height={250}>
                                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </CardContent>
                        </Card>

                        {/* Sales Over Time */}
                        <Card>
                            <CardHeader><CardTitle>Sales Over Time</CardTitle></CardHeader>
                            <CardContent>
                                <LineChart width={300} height={250} data={salesOverTimeData}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="total" stroke="#28a745" />
                                </LineChart>
                            </CardContent>
                        </Card>

                        {/* Top Products */}
                        <Card>
                            <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
                            <CardContent>
                                <BarChart width={300} height={250} data={topProductsData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="quantity" fill="#ffc107" />
                                </BarChart>
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

                    {/* Sales Table */}
                    <Card className="shadow-card">
                        <CardHeader><CardTitle>Sales Records</CardTitle></CardHeader>
                        <CardContent>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Distributor</th>
                                        <th className="px-4 py-2">Product</th>
                                        <th className="px-4 py-2">Quantity</th>
                                        <th className="px-4 py-2">Price</th>
                                        <th className="px-4 py-2">Total</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSales.map((sale) => (
                                        <tr key={sale.id} className="border-b hover:bg-muted/50">
                                            <td className="px-4 py-2">{sale.date?.toDate ? sale.date.toDate().toLocaleString() : new Date(sale.date).toLocaleString()}</td>
                                            <td className="px-4 py-2">{sale.distributor}</td>
                                            <td className="px-4 py-2">{sale.product}</td>
                                            <td className="px-4 py-2">{sale.quantity}</td>
                                            <td className="px-4 py-2">R {sale.price?.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-success">R {sale.total?.toFixed(2)}</td>
                                            <td className="px-4 py-2">
                                                <Badge className={getStatusColor(sale.status)}>{sale.status}</Badge>
                                            </td>
                                            <td className="px-4 py-2">
                                                <SaleDetailsModal sale={sale} onStatusChange={handleStatusChange} trigger={<button className="px-3 py-1 border rounded-md text-sm">View Details</button>} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SalesManagement;
