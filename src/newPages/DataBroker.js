// src/pages/DataBrokerRemoval.js
import React from "react";
import { Database } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DataBroker() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">{t("dataBrokerRemoval")}</h1>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700">
          <p>
            {t("dataBrokerInfo") || "Request removal from data brokers to protect your privacy. This helps prevent unsolicited marketing and reduces exposure of your personal information."}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="font-semibold text-green-600 mb-2">{t("whyRemove") || "Why Remove?"}</h2>
            <p>{t("whyRemoveInfo") || "Data brokers collect and sell your information. Removing it reduces spam, marketing, and potential identity theft."}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl shadow hover:shadow-md transition">
            <h2 className="font-semibold text-green-600 mb-2">{t("howItWorks") || "How It Works"}</h2>
            <p>{t("howRemoveWorksInfo") || "You submit a request to have your data removed from broker databases. It may take several days for the removal to take effect."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
