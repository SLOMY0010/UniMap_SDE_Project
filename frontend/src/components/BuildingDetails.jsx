import React from "react";
import { Button } from "./ui/button"; // Assuming a Button component exists
import { BUILDINGS_BY_CAMPUS } from "../constants/mockData"; // Import building data

const BuildingDetails = ({ selectedBuildingName, onBackToBuildings }) => {
  // Find the building details from BUILDINGS_BY_CAMPUS
  let currentBuilding = null;
  for (const campusName in BUILDINGS_BY_CAMPUS) {
    const foundBuilding = BUILDINGS_BY_CAMPUS[campusName].find(
      (building) => building.name === selectedBuildingName
    );
    if (foundBuilding) {
      currentBuilding = foundBuilding;
      break;
    }
  }

  // Fallback if building is not found
  if (!currentBuilding) {
    currentBuilding = {
      description: "Details not available.",
      floors: [],
    };
  }

  return (
    <div className="p-4">
      <Button onClick={onBackToBuildings} className="mb-4">
        &larr; Back to Buildings
      </Button>
      <h2 className="text-2xl font-bold mb-4">Details for {selectedBuildingName}</h2>
      <p className="mb-4">{currentBuilding.description}</p>

      {currentBuilding.floors.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Floors:</h3>
          <ul className="list-disc pl-5">
            {currentBuilding.floors.map((floor, index) => (
              <li key={index}>{floor}</li>
            ))}
          </ul>
        </div>
      )}

      {/* You can add more detailed information or even integrate a map component here */}
    </div>
  );
};

export default BuildingDetails;
