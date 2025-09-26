// PromotionsManagement.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Award } from "lucide-react";

import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const PromotionsManagement = () => {
  const [promotions, setPromotions] = useState([]);

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
                Manage and view all active promotions
              </p>
            </div>
          </div>

          {/* Promotions Grid */}
          <Card className="card-elevated">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotions.length > 0 ? (
                  promotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 bg-gradient-card"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <Badge 
                          variant={promo.status === 'active' ? 'success' : 'warning'}
                          className="text-xs"
                        >
                          {promo.status === 'active' ? 'Active' : 'Limited Time'}
                        </Badge>
                        <span className="text-xl font-bold text-accent">{promo.discount}</span>
                      </div>

                      <h4 className="font-semibold text-sm mb-2">{promo.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{promo.description}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium">{promo.category}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Valid Until:</span>
                          <span className="font-medium">{promo.validUntil}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Conversion:</span>
                          <span className="font-medium text-success">{promo.conversions}</span>
                        </div>
                      </div>

                      <Button className="w-full mt-3" variant="accent" size="sm">
                        Promote Now
                      </Button>
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
