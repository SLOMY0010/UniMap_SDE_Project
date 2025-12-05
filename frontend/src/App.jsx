import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import CampusSelection from "./components/CampusSelection";
import CalendarComponent from "./components/Calendar";
import MainCampus from "./components/MainCampus";
import KassaiCampus from "./components/KassaiCampus";
import EngineeringCampus from "./components/EngineeringCampus";
import BuildingMap from "./components/BuildingMap.tsx";
import Login from "./components/Login";
import Register from "./components/Register";
import RoomBooking from "./components/RoomBooking";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("campus");
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout, loading } = useAuth(); // Get user, logout, and loading from AuthContext

  // If authentication state is still loading, render a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading authentication...
      </div>
    );
  }

  const renderPage = () => {
    const pageVariants = {
      initial: {
        opacity: 0,
        x: 20,
        scale: 0.95,
      },
      animate: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      },
      exit: {
        opacity: 0,
        x: -20,
        scale: 0.95,
        transition: {
          duration: 0.3,
          ease: "easeIn",
        },
      },
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 p-6"
        >
          {currentPage === "login" ? (
            <Login
              onBack={() => setCurrentPage("campus")}
              onRegisterClick={() => setCurrentPage("register")}
            />
          ) : currentPage === "register" ? (
            <Register
              onBack={() => setCurrentPage("campus")}
              onLoginClick={() => setCurrentPage("login")}
            />
          ) : currentPage === "calendar" ? (
            <CalendarComponent
              onBack={() => setCurrentPage("campus")}
            />
          ) : currentPage === "main-campus" ? (
            <MainCampus
              onBack={() => setCurrentPage("campus")}
            />
          ) : currentPage === "kassai-campus" ? (
            <KassaiCampus
              onBack={() => setCurrentPage("campus")}
              onBuildingMapClick={(buildingName) => {
                setSelectedBuilding(buildingName);
                setCurrentPage("building-map");
              }}
            />
          ) : currentPage === "engineering-campus" ? (
            <EngineeringCampus
              onBack={() => setCurrentPage("campus")}
            />
          ) : currentPage === "building-map" ? (
            <BuildingMap
              buildingName={selectedBuilding}
              onBack={() => setCurrentPage("kassai-campus")}
            />
          ) : currentPage === "room-booking" ? (
            <RoomBooking
              onBack={() => setCurrentPage("campus")}
            />
          ) : (
            <CampusSelection
              onCampusClick={(campus) => {
                if (campus === "Main\ncampus") {
                  setCurrentPage("main-campus");
                } else if (campus === "Kassai\ncampus") {
                  setCurrentPage("kassai-campus");
                } else if (campus === "Engineering\ncampus") {
                  setCurrentPage("engineering-campus");
                }
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  // Don't show sidebar and navbar for login and register pages
  if (currentPage === "login" || currentPage === "register") {
    return <div className="min-h-screen bg-background">{renderPage()}</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          currentPage={currentPage}
          selectedBuilding={selectedBuilding}
          setCurrentPage={setCurrentPage}
          // No longer passing user and logout as props, they are accessed via useAuth in Navbar
        />

        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
