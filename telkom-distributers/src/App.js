import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainDashboard from "./pages/MainDashboard";
import FraudManagement from "./pages/FraudManagement";
import EWasteManagement from "./pages/EWasteManagement";
import Community from "./pages/Community";
import Reports from "./pages/Reports";
import SalesManagement from "./pages/SalesManagement";
import PromotionsManagement from "./pages/PromotionsManagement";
import SurveysManagement from "./pages/SurveysManagement";
import LearningHubManagement from "./pages/LearningHubManagement";
import SurveyPage from "./pages/SurveyPage";
import SimProtectionFlow from "./pages/SimProtectionFlow";
import SimProtectionDashboard from "./pages/dashboard/SimProtectionDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainDashboard />} />
        <Route path="/fraud" element={<FraudManagement />} />
        <Route path="/e-waste" element={<EWasteManagement />} />
        <Route path="/learning" element={<LearningHubManagement />} />
        <Route path="/community" element={<Community />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sales" element={<SalesManagement />} />
        <Route path="/promotions" element={<PromotionsManagement />} />
        <Route path="/surveys" element={<SurveysManagement />} />
        <Route path="/survey/:id" element={<SurveyPage />} />
         <Route path="/" element={<SimProtectionFlow />} />
              <Route path="/test2" element={<SimProtectionDashboard />} />


      </Routes>
    </Router>
  );
}

export default App;
