import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import CampusSelection from "./components/CampusSelection";
import CalendarComponent from "./components/Calendar";
// import MainCampus from "./components/MainCampus"; // Removed
// import KassaiCampus from "./components/KassaiCampus"; // Removed
// import EngineeringCampus from "./components/EngineeringCampus"; // Removed
import BuildingMap from "./components/BuildingMap.tsx";
import Login from "./components/Login";
import Register from "./components/Register";
import RoomBooking from "./components/RoomBooking";
import BuildingList from "./components/BuildingList"; // New import
import SearchResultsPage from "./components/SearchResultsPage"; // New import
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading authentication...
      </div>
    );
  }

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-background flex">
      {!isAuthPage && (
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      )}

      <div className="flex-1 flex flex-col">
        {!isAuthPage && (
          <Navbar />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 p-6"
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/calendar" element={<CalendarComponent />} />
              <Route path="/room-booking" element={<RoomBooking />} />
              <Route path="/campus/:campusName/buildings" element={<BuildingList />} /> {/* New route */}
              <Route path="/building/:buildingName" element={<BuildingMap />} /> {/* Updated route */}
              <Route path="/search-results" element={<SearchResultsPage />} /> {/* New route */}
              <Route path="/" element={<CampusSelection />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
