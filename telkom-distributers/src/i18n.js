import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      loadingUser: "Loading user data...",
      noUser: "No user logged in",
      nextOfKin: "Next of Kin",
      noNextOfKin: "No next of kin added",
      logout: "Logout",
      yourDataSummary: "Your Data Summary",
      totalSims: "Total SIMs",
      registerSim: "Register / Manage SIM",
      activeAlerts: "Active Alerts",
      viewAlerts: "View Alerts",
      lastUpdated: "Last Updated",
      about: "About",
      legal: "Legal",
      accessibility: "Accessibility",
      aboutUs: "About Us",
      aboutText: "We provide SIM protection services to secure your mobile line and linked accounts. Stay safe and in control.",
      legalList: [
        "Data Protection Act (POPIA) compliance",
        "FSCA regulations for banks and insurers",
        "Telecommunications (ICASA) rules for SIM registration",
        "Cybersecurity measures to prevent breaches",
        "Consumer Protection Act compliance"
      ],
      accessibilityText: "Accessible on all devices and screen readers.",
      contactSupport: "Contact Support",
      securityReminders: "Security Reminders",
      neverShareOtp: "Never share your OTP or PIN.",
      checkAccounts: "Check your linked accounts regularly.",
      updateRecovery: "Update your recovery number."
    }
  },
  af: {
    translation: {
      loadingUser: "Laai gebruikersdata...",
      noUser: "Geen gebruiker aangemeld nie",
      nextOfKin: "Naaste familie",
      noNextOfKin: "Geen naaste familie bygevoeg nie",
      logout: "Teken uit",
      yourDataSummary: "Jou Data Opsomming",
      totalSims: "Totale SIMs",
      registerSim: "Registreer / Bestuur SIM",
      activeAlerts: "Aktiewe Waarskuwings",
      viewAlerts: "Sien Waarskuwings",
      lastUpdated: "Laas opgedateer",
      about: "Oor",
      legal: "Regulasies",
      accessibility: "Toeganklikheid",
      aboutUs: "Oor Ons",
      aboutText: "Ons verskaf SIM-beskerming dienste om jou selfoonlyn en gekoppelde rekeninge te beveilig. Bly veilig en in beheer.",
      legalList: [
        "Naleving van die Databeskermingswet (POPIA)",
        "FSCA regulasies vir banke en versekeringsmaatskappye",
        "Telekommunikasie (ICASA) reëls vir SIM-registrasie",
        "Kuberveiligheidsmaatreëls om oortredings te voorkom",
        "Naleving van die Wet op Verbruikersbeskerming"
      ],
      accessibilityText: "Toeganklik op alle toestelle en skermlesers.",
      contactSupport: "Kontak Ondersteuning",
      securityReminders: "Sekuriteitsherinnerings",
      neverShareOtp: "Moet nooit jou OTP of PIN deel nie.",
      checkAccounts: "Kontroleer jou gekoppelde rekeninge gereeld.",
      updateRecovery: "Werk jou herstelnommer op."
    }
  },
  // Add Zulu, Xhosa, Sotho here (zu, xh, st)
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
