import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { LogOut, CreditCard, Bell, Clock, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import RegisterSimProtectionModal from "./RegisterSimProtectionModal";
import ViewSimProtectionModal from "./ViewSimProtectionModal";
import EditSimProtectionModal from "./EditSimProtectionModal";
import AlertHistoryModal from "./AlertHistoryModal";
import DashboardTabs from "./DashboardTabs";

export default function Dashboard() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [openModal, setOpenModal] = useState(null);
    const { t, i18n } = useTranslation();

    const refreshCurrentUser = async () => {
        if (!auth.currentUser) return;
        const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (docSnap.exists()) setCurrentUser(docSnap.data());
    };

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) setCurrentUser(docSnap.data());
                    setLoading(false);
                });
                return () => unsubscribeSnapshot();
            } else setLoading(false);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (currentUser?.preferredLanguage) {
            i18n.changeLanguage(currentUser.preferredLanguage);
        }
    }, [currentUser, i18n]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (error) {
            console.error(error);
            alert(t("logoutFailed") || "Failed to logout. Try again.");
        }
    };

    const handleLanguageChange = async (newLang) => {
        i18n.changeLanguage(newLang);
        if (auth.currentUser) {
            const docRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(docRef, { preferredLanguage: newLang });
            setCurrentUser({ ...currentUser, preferredLanguage: newLang });
        }
    };

    if (loading) return <p className="text-center mt-10">{t("loadingUser")}</p>;
    if (!currentUser) return <p className="text-center mt-10">{t("noUser")}</p>;

    const alerts = currentUser.simProtection?.activeAlertsArray || [];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
                {/* Sidebar */}
                <div className="lg:col-span-1 bg-white rounded-3xl shadow-md p-5 flex flex-col gap-6 overflow-auto max-h-[90vh]">
                    {/* Profile */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center text-blue-600 font-bold text-lg shadow">
                            {currentUser.fullName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                        </div>
                        <div className="flex flex-col justify-center truncate">
                            <h2 className="font-semibold">{currentUser.fullName}</h2>
                            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                            <p className="text-xs text-gray-500">{currentUser.phone}</p>
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold">{t("preferredLanguage")}</label>
                        <select
                            value={currentUser.preferredLanguage || "en"}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 text-sm"
                        >
                            <option value="en">English</option>
                            <option value="af">Afrikaans</option>
                            <option value="zu">Zulu</option>
                            <option value="xh">Xhosa</option>
                        </select>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="mt-auto flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl"
                    >
                        <LogOut className="w-4 h-4" /> {t("logout")}
                    </button>
                </div>

                {/* Main Dashboard */}
                <div className="lg:col-span-3 space-y-6 overflow-auto max-h-[90vh]">
                    <div className="bg-white p-6 rounded-3xl shadow-lg">
                        <h2 className="text-xl font-bold mb-5">{t("yourDataSummary")}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-2xl flex flex-col justify-between shadow-md">
                                <CreditCard className="w-8 h-8 mb-2" />
                                <p>{t("totalSims")}</p>
                                <p className="text-3xl font-bold mt-1">
                                    {currentUser.simProtection?.selectedNumber ? 1 : 0}
                                </p>
                                <div className="flex flex-col gap-2 mt-3">
                                    {currentUser.simProtection?.selectedNumber && (
                                        <button onClick={() => setOpenModal("view")} className="btn">
                                            Manage SIM
                                        </button>
                                    )}
                                    <button onClick={() => setOpenModal("register")} className="btn">
                                        Register SIM
                                    </button>
                                </div>
                            </div>

                            <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white p-5 rounded-2xl flex flex-col justify-between shadow-md">
                                <Bell className="w-8 h-8 mb-2" />
                                <p>{t("activeAlerts")}</p>
                                <p className="text-3xl font-bold mt-1">{alerts.length}</p>
                                <button
                                    onClick={() => setIsAlertModalOpen(true)}
                                    className="mt-3 bg-white text-red-600 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 relative"
                                >
                                    <Eye className="w-4 h-4" /> {t("viewAlerts")}
                                    {alerts.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {alerts.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="bg-gray-200 text-gray-800 p-5 rounded-2xl flex flex-col justify-center text-center shadow-sm">
                                <Clock className="w-8 h-8 mb-2" />
                                <p>{t("lastUpdated")}</p>
                                <p className="text-2xl font-semibold mt-1">
                                    {new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <DashboardTabs t={t} />
                    </div>
                </div>
            </div>

            {/* Modals */}
            {openModal === "register" && (
                <RegisterSimProtectionModal
                    isOpen={true}
                    onClose={() => {
                        setOpenModal(null);
                        refreshCurrentUser();
                    }}
                />
            )}

            {openModal === "view" && (
                <ViewSimProtectionModal
                    data={currentUser.simProtection}
                    onEdit={() => setOpenModal("edit")}
                    onClose={() => setOpenModal(null)}
                />
            )}

            {openModal === "edit" && (
                <EditSimProtectionModal
                    data={currentUser.simProtection}
                    onClose={() => setOpenModal(null)}
                />
            )}

            <AlertHistoryModal
                isOpen={isAlertModalOpen}
                onClose={() => setIsAlertModalOpen(false)}
                alerts={alerts}
            />
        </div>
    );
}
