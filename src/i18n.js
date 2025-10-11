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
      updateRecovery: "Update your recovery number.",
      preferredLanguage: "Preferred Language",
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
      updateRecovery: "Werk jou herstelnommer op.",
                preferredLanguage: "Voorkeurtaal"

    }
  },
  zu: {
    translation: {
      loadingUser: "Kulayisha idatha yomsebenzisi...",
      noUser: "Akekho umsebenzisi ongene ngemvume",
      nextOfKin: "Osondelene nabo",
      noNextOfKin: "Akukho osendelene nabo abafakiwe",
      logout: "Phuma",
      yourDataSummary: "Isifinyezo Sedatha Yakho",
      totalSims: "I-SIMs Eziphelele",
      registerSim: "Bhalisa / Phatha i-SIM",
      activeAlerts: "Izexwayiso Ezisebenzayo",
      viewAlerts: "Buka Izexwayiso",
      lastUpdated: "Kuvuselelwe Okokugcina",
      about: "Mayelana",
      legal: "Ezomthetho",
      accessibility: "Ukufinyeleleka",
      aboutUs: "Mayelana Nathi",
      aboutText: "Sinikeza izinsizakalo zokuvikela i-SIM ukuze uqinisekise umugqa wakho weselula namakhonto axhunyiwe. Hlala uphephile futhi ulawule.",
      legalList: [
        "Ukuhambisana nomthetho wokuvikela idatha (POPIA)",
        "Izimiso ze-FSCA zamabhange nabahlinzeki bezinsurances",
        "Imithetho ye-Telecommunications (ICASA) yokubhaliswa kwe-SIM",
        "Izinyathelo zokuphepha kwe-cyber ukugwema ukuvuza",
        "Ukuhambisana noMthetho Wokuvikela Abathengi"
      ],
      accessibilityText: "Iyatholakala kuzo zonke izisetshenziswa nezifundi zesikrini.",
      contactSupport: "Xhumana Noxhaso",
      securityReminders: "Izikhumbuzo Zokuphepha",
      neverShareOtp: "Ungalokothi wabelane nge-OTP noma i-PIN yakho.",
      checkAccounts: "Hlola ama-akhawunti axhunyiwe njalo.",
      updateRecovery: "Vuselela inombolo yakho yokubuyisela.",
      preferredLanguage: "Ulimi Oluthandayo"    }
  },
  xh: {
    translation: {
      loadingUser: "Ukulayisha idatha yomsebenzisi...",
      noUser: "Akukho msebenzisi ungene",
      nextOfKin: "Abaseduze",
      noNextOfKin: "Akukho abaseduze bongezwa",
      logout: "Phuma",
      yourDataSummary: "Isishwankathelo seDatha Yakho",
      totalSims: "I-SIMs Ezipheleleyo",
      registerSim: "Bhalisa / Lawula i-SIM",
      activeAlerts: "Izilumkiso Eziphambili",
      viewAlerts: "Jonga Izilumkiso",
      lastUpdated: "Ihlaziywe Okokugqibela",
      about: "Malunga",
      legal: "Ezomthetho",
      accessibility: "Ukufikeleleka",
      aboutUs: "Malunga Nathi",
      aboutText: "Sinikezela ngeenkonzo zokhuseleko lwe-SIM ukukhusela umgca wakho weselfowuni kunye neakhawunti ezinxulumeneyo. Hlala ukhuselekile kwaye ulawule.",
      legalList: [
        "Ukuthobela uMthetho woKhuselo lweeDatha (POPIA)",
        "Imimiselo ye-FSCA yamabhanki kunye nabashishini bezemali",
        "Imithetho ye-Telecommunications (ICASA) yokubhaliswa kwe-SIM",
        "Amanyathelo okhuseleko lwe-cyber ukuvimbela ukuphulwa",
        "Ukuthobela uMthetho woKhuseleko lwaBathengi"
      ],
      accessibilityText: "Ifikeleleka kuzo zonke izixhobo kunye neefundisi zesikrini.",
      contactSupport: "Qhagamshelana nokuXhasa",
      securityReminders: "Izikhumbuzo zoKhuseleko",
      neverShareOtp: "Ungabelani nge-OTP okanye i-PIN yakho.",
      checkAccounts: "Jonga ii-akhawunti zakho ezinxulumene rhoqo.",
      updateRecovery: "Hlaziya inombolo yakho yokubuyisela.",
       preferredLanguage: "Ulimi Oluthandwayo"
    }
  },
  st: {
    translation: {
      loadingUser: "Ho kenya data ya mosebedisi...",
      noUser: "Ha ho mosebedisi ya kene",
      nextOfKin: "Batho ba haufi",
      noNextOfKin: "Ha ho batho ba haufi ba kenyelletsoeng",
      logout: "Baka",
      yourDataSummary: "Kakaretso ya Data ya Hao",
      totalSims: "SIMs Kakaretso",
      registerSim: "Ingola / Laola SIM",
      activeAlerts: "Ditsebiso Tse Sebetsang",
      viewAlerts: "Sheba Ditsebiso",
      lastUpdated: "E ntlafaditswe ho qetela",
      about: "Mabapi",
      legal: "Molao",
      accessibility: "Ho fihlelleha",
      aboutUs: "Mabapi le Rona",
      aboutText: "Re fana ka ditshebeletso tsa tshireletso ea SIM ho sireletsa mola wa hau wa mobile le diakhaonto tse amanang. Lula o bolokehile ebile o laola.",
      legalList: [
        "Ho latela Molao wa Tshireletso ya Data (POPIA)",
        "Melawana ya FSCA bakeng sa dibanka le bahlahisi ba inshorense",
        "Melao ya Telecom (ICASA) bakeng sa ngoliso ya SIM",
        "Mekgwa ya tshireletso ya cyber ho thibela kgahlanong le data",
        "Ho latela Molao wa Tshireletso ya Bareki"
      ],
      accessibilityText: "E fumaneha ho lisebelisoa tsohle le bafundi ba skrini.",
      contactSupport: "Ikgokanye le Tshehetso",
      securityReminders: "Khopolo-Tshireletso",
      neverShareOtp: "O se ke wa arolelana OTP kapa PIN ya hao.",
      checkAccounts: "Hlola diakhaonto tse amanang khafetsa.",
      updateRecovery: "Ntlafatsa nomoro ya hao ya ho fumana hape.",
            preferredLanguage: "Puo e Khethiloeng"
    }
  }
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
