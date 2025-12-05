import { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import api from '@/utils/api'; // Import the API utility

export default function ClassSearch({ onSearchStateChange }) {
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (query) => {
    setIsSearching(true);
    setError('');
    setSearchResult(null); // Clear previous results

    try {
      const response = await api.get(`/uni/search?q=${query}`);
      const { campuses, buildings, rooms, matched_type } = response.data;

      if (matched_type === 'room' && rooms.length > 0) {
        const room = rooms[0];
        const building = buildings.find(b => b.id === room.building);
        const campus = campuses.find(c => c.id === building.campus);

        // This is a simplified mapping. In a real application, you'd fetch
        // specific floor plans and pin positions from the backend.
        setSearchResult({
          className: `Class in ${room.name}`, // Placeholder
          campus: campus ? campus.name : 'Unknown Campus',
          campusAddress: campus ? campus.address : 'Unknown Address',
          building: building ? building.name : 'Unknown Building',
          room: room.name,
          floor: room.floor_map ? `Floor ${room.floor_map.floor_number}` : 'Unknown Floor', // Assuming floor_map has floor_number
          googleMapUrl: campus ? campus.maps_url : 'https://www.google.com/maps', // Placeholder
          floorPlanImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', // Placeholder
          pinPosition: { x: 50, y: 50 }, // Placeholder
        });
        onSearchStateChange?.(true);
      } else if (matched_type === 'building' && buildings.length > 0) {
        const building = buildings[0];
        const campus = campuses.find(c => c.id === building.campus);

        setSearchResult({
          className: `Building: ${building.name}`,
          campus: campus ? campus.name : 'Unknown Campus',
          campusAddress: campus ? campus.address : 'Unknown Address',
          building: building.name,
          room: 'N/A',
          floor: 'N/A',
          googleMapUrl: building.maps_url,
          floorPlanImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', // Placeholder
          pinPosition: { x: 50, y: 50 }, // Placeholder
        });
        onSearchStateChange?.(true);
      } else if (matched_type === 'campus' && campuses.length > 0) {
        const campus = campuses[0];
        setSearchResult({
          className: `Campus: ${campus.name}`,
          campus: campus.name,
          campusAddress: campus.address,
          building: 'N/A',
          room: 'N/A',
          floor: 'N/A',
          googleMapUrl: campus.maps_url,
          floorPlanImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', // Placeholder
          pinPosition: { x: 50, y: 50 }, // Placeholder
        });
        onSearchStateChange?.(true);
      }
      else {
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
