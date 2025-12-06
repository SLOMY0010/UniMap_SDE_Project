import { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import api from '../../utils/api'; // Import the API utility

export default function ClassSearch({ onSearchStateChange }) {
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

const handleSearch = async (query) => {
    setIsSearching(true);
    setError('');
    setSearchResult(null); // Clear previous results

    try {
      const response = await api.get(`/uni/search/?q=${encodeURIComponent(query)}`);
      const { campuses, buildings, rooms, matched_type } = response.data;

      if (matched_type === 'room' && rooms.length > 0) {
        const room = rooms[0];
        const building = buildings.find(b => b.id === room.building);
        const campus = campuses.find(c => c.id === building?.campus);

        // Fetch floor map details for the room
        let floorMapImage = null;
        let floorNumber = 'Unknown';
        
        if (room.floor_map) {
          try {
            const floorMapResponse = await api.get(`/uni/floormaps/${room.floor_map}/`);
            const floorMap = floorMapResponse.data;
            // Handle image URL properly
            floorMapImage = floorMap.image.startsWith('http') 
              ? floorMap.image 
              : `http://127.0.0.1:8000${floorMap.image}`;
            floorNumber = floorMap.floor_number;
          } catch (err) {
            console.warn('Could not fetch floor map:', err);
          }
        }

        // Calculate pin position from room coordinates
        let pinPosition = { x: 50, y: 50 }; // Default center
        if (room.map_x !== null && room.map_y !== null) {
          // Convert coordinates to percentages (assuming image dimensions)
          // These are rough estimates - you may need to adjust based on actual image dimensions
          pinPosition = {
            x: Math.min(Math.max((room.map_x / 600) * 100, 5), 95), // Assuming 600px width
            y: Math.min(Math.max((room.map_y / 800) * 100, 5), 95)  // Assuming 800px height
          };
        }

        setSearchResult({
          className: `${room.name} - ${room.type}`,
          campus: campus ? campus.name : 'Unknown Campus',
          campusAddress: campus ? campus.address : 'Unknown Address',
          building: building ? building.name : 'Unknown Building',
          room: room.name,
          floor: `Floor ${floorNumber}`,
          googleMapUrl: campus ? campus.maps_url : 'https://maps.google.com',
          floorPlanImage: floorMapImage,
          pinPosition: pinPosition,
          roomType: room.type,
          coordinates: { x: room.map_x, y: room.map_y }
        });
        onSearchStateChange?.(true);
      } else if (matched_type === 'building' && buildings.length > 0) {
        const building = buildings[0];
        const campus = campuses.find(c => c.id === building.campus);

        // Fetch first floor map for the building
        let floorMapImage = null;
        try {
          const floorsResponse = await api.get(`/uni/floormaps/?building=${building.id}`);
          const floors = floorsResponse.data;
          if (floors.length > 0) {
            // Handle image URL properly
            floorMapImage = floors[0].image.startsWith('http') 
              ? floors[0].image 
              : `http://127.0.0.1:8000${floors[0].image}`;
          }
        } catch (err) {
          console.warn('Could not fetch building floor maps:', err);
        }

        setSearchResult({
          className: `Building: ${building.name}`,
          campus: campus ? campus.name : 'Unknown Campus',
          campusAddress: campus ? campus.address : 'Unknown Address',
          building: building.name,
          room: 'Building Entrance',
          floor: floorMapImage ? 'Ground Floor' : 'N/A',
          googleMapUrl: building.maps_url,
          floorPlanImage: floorMapImage,
          pinPosition: { x: 50, y: 50 }, // Center of building
          roomType: 'building',
          coordinates: null
        });
        onSearchStateChange?.(true);
      } else if (matched_type === 'campus' && campuses.length > 0) {
        const campus = campuses[0];
        
        setSearchResult({
          className: `Campus: ${campus.name}`,
          campus: campus.name,
          campusAddress: campus.address,
          building: 'Campus',
          room: 'Main Campus',
          floor: 'Campus Map',
          googleMapUrl: campus.maps_url,
          floorPlanImage: campus.image ? (campus.image.startsWith('http') 
            ? campus.image 
            : `http://127.0.0.1:8000${campus.image}`) : null,
          pinPosition: { x: 50, y: 50 },
          roomType: 'campus',
          coordinates: null
        });
        onSearchStateChange?.(true);
      } else {
        setError('No results found for your query.');
        onSearchStateChange?.(false);
      }
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      console.error('Error during search:', err);
      onSearchStateChange?.(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchResult(null);
    setError('');
    onSearchStateChange?.(false);
  };

  return (
    <div className="w-full">
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClear}
        isSearching={isSearching}
        hasResults={!!searchResult}
        error={error}
      />
      <SearchResults result={searchResult} />
    </div>
  );
}
