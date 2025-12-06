import React from "react";
import { Button } from "./ui/button"; // Assuming a Button component exists
import { BUILDINGS_BY_CAMPUS } from "../constants/mockData"; // Import building data

const CampusBuildings = ({ selectedCampusName, onBackToCampuses, onBuildingClick }) => {
  const currentCampusBuildings = BUILDINGS_BY_CAMPUS[selectedCampusName] || [];

  return (
    <div className="p-4">
      <Button onClick={onBackToCampuses} className="mb-4">
        &larr; Back to Campuses
      </Button>
      <h2 className="text-2xl font-bold mb-4">Buildings in {selectedCampusName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCampusBuildings.length > 0 ? (
          currentCampusBuildings.map((building) => (
            <div
              key={building.id}
              className="bg-card text-card-foreground rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onBuildingClick(building.name)}
            >
              <h3 className="text-xl font-semibold">{building.name}</h3>
              {/* Add more building details here if needed */}
            </div>
          ))
        ) : (
          <p>No buildings found for {selectedCampusName}.</p>
        )}
      </div>
    </div>
  );
};

export default CampusBuildings;
