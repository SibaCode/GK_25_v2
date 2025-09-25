import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainDashboard from "./pages/MainDashboard";
import FraudManagement from "./pages/FraudManagement";
import EWasteManagement from "./pages/EWasteManagement";
import LearningHub from "./pages/LearningHub";
import Community from "./pages/Community";
import Reports from "./pages/Reports";

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
      </Routes>
    </Router>
  );
}

export default App;
