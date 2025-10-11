import { useState } from "react";

export default function DashboardTabs({ t }) {
  const [activeTab, setActiveTab] = useState("About");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [expandedTips, setExpandedTips] = useState([]);

  // Recovery steps
  const recoverySteps = [
    { text: "Contact telecom provider", link: "tel:+27831234567", linkText: "Call provider" },
    { text: "Recover mobile banking access", link: "https://yourbank.co.za/recovery", linkText: "Bank portal" },
    { text: "Reset passwords for linked accounts" },
    { text: "Enable 2FA on all accounts" },
  ];

  // Education tips
  const educationTips = [
    { title: "Protect your OTP", details: "Never share your OTP with anyone." },
    { title: "Avoid phishing", details: "Be cautious of calls/SMS asking for codes." },
    { title: "Understand SIM swaps", details: "SIM swaps often happen via social engineering." },
    { title: "Use trusted apps", details: "Use only official banking apps." },
  ];

  const toggleStep = (idx) => {
    setCompletedSteps(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const toggleTip = (idx) => {
    setExpandedTips(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const tabs = ["About", "Legal", "Accessibility", "Education", "Recovery"];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm text-gray-700">
      {/* Tab Buttons */}
  <div className="flex space-x-4 mb-4 overflow-x-auto">
  {tabs.map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-3 py-2 font-medium rounded-lg whitespace-nowrap ${
        activeTab === tab
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {t(tab)}
    </button>
  ))}
</div>

      {/* Tab Content */}
   {activeTab === "About" && (
  <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700">
    <h2 className="text-lg font-bold mb-3">{t("aboutUs")}</h2>
    <p className="text-sm leading-relaxed">{t("aboutText")}</p>
  </div>
)}

{activeTab === "Legal" && (
  <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700">
    <h2 className="text-lg font-bold mb-2">{t("legal")}</h2>
    <p className="text-sm mb-3">{t("legalText") || "Key Regulations:"}</p>
    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
      {t("legalList", { returnObjects: true }).map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
)}

{activeTab === "Accessibility" && (
  <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700">
    <h2 className="text-lg font-bold mb-2">♿ {t("accessibility")}</h2>
    <p className="text-sm mb-2 leading-relaxed">{t("accessibilityText")}</p>
    <p className="text-sm">
      {t("contactSupport")}:{" "}
      <span className="text-blue-600 font-medium">support@simprotect.co.za</span>
    </p>
  </div>
)}

{activeTab === "Education" && (
  <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700">
    <h2 className="text-lg font-bold mb-4">{t("Education")}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {educationTips.map((tip, idx) => (
        <div
          key={idx}
          className="flex items-start p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer"
          onClick={() => toggleTip(idx)}
        >
          <div className="flex-shrink-0 mr-3 text-xl">
            {idx === 0 && <span className="text-blue-500">🔑</span>}
            {idx === 1 && <span className="text-red-500">⚠️</span>}
            {idx === 2 && <span className="text-yellow-500">📱</span>}
            {idx === 3 && <span className="text-green-500">✅</span>}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{tip.title}</p>
            {expandedTips.includes(idx) && (
              <p className="text-xs text-gray-600 mt-1 leading-snug">{tip.details}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{activeTab === "Recovery" && (
  <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700 space-y-4">
    {/* Progress Bar */}
    <div className="flex items-center mb-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full">
        <div
          className="h-2 bg-blue-500 rounded-full transition-all"
          style={{ width: `${(completedSteps.length / recoverySteps.length) * 100}%` }}
        />
      </div>
      <span className="ml-2 text-sm font-medium">
        {completedSteps.length}/{recoverySteps.length} steps completed
      </span>
    </div>

    {/* Checklist */}
    <ul className="space-y-2">
      {recoverySteps.map((step, idx) => (
        <li
          key={idx}
          className={`flex items-start p-3 rounded-md border-l-4 transition ${
            completedSteps.includes(idx)
              ? "border-green-500 bg-green-50"
              : "border-blue-500 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <input
            type="checkbox"
            checked={completedSteps.includes(idx)}
            onChange={() => toggleStep(idx)}
            className="mt-1 mr-3 w-5 h-5 accent-blue-500"
          />
          <div className="flex-1 text-sm">
            <p className="leading-relaxed">{step.text}</p>
            {step.link && (
              <a
                href={step.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-xs mt-1 block"
              >
                {step.linkText || "Open Link"}
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  </div>
)}

    </div>
  );
}
