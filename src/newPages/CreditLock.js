// src/pages/CreditFileLock.js
import React from "react";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CreditLock() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">{t("creditFileLock")}</h1>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700">
          <p>
            {t("creditFileLockInfo") || "Lock your credit file to prevent unauthorized access and potential fraud. You can temporarily lock or permanently unlock your credit report as needed."}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="font-semibold text-blue-600 mb-2">{t("whyLock") || "Why Lock?"}</h2>
            <p>{t("whyLockInfo") || "Protect your personal information and prevent fraudsters from opening accounts in your name."}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="font-semibold text-blue-600 mb-2">{t("howItWorks") || "How It Works"}</h2>
            <p>{t("howItWorksInfo") || "When your credit file is locked, lenders cannot access it, stopping new credit accounts from being opened without your permission."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
