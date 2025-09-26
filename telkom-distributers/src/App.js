import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainDashboard from "./pages/MainDashboard";
import FraudManagement from "./pages/FraudManagement";
import EWasteManagement from "./pages/EWasteManagement";
import LearningHub from "./pages/LearningHub";
import Community from "./pages/Community";
import Reports from "./pages/Reports";
import SalesManagement from "./pages/SalesManagement";
import PromotionsManagement from "./pages/PromotionsManagement";
import SurveysManagement from "./pages/SurveysManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/fraud" element={<FraudManagement />} />
        <Route path="/e-waste" element={<EWasteManagement />} />
        <Route path="/learning" element={<LearningHub />} />
        <Route path="/community" element={<Community />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sales" element={<SalesManagement />} />
        <Route path="/promotions" element={<PromotionsManagement />} />
        <Route path="/surveys" element={<SurveysManagement />} />


      </Routes>
    </Router>
  );
}

export default App;
