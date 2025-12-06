import api from '../utils/api';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Building, MapPin, Users, Clock, Coffee, Computer, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';


interface RoomData {
  id: number;
  name: string;
  type: string;
  floor_map: number; // ID of the floor map it belongs to
  map_x: number | null;
  map_y: number | null;
  building: number;
  // Assuming 'equipment' and 'capacity' are not directly from backend,
  // or need to be inferred/added during mapping
  capacity?: number;
  equipment?: string[];
}

interface FloorMapData {
  id: number;
  floor_number: number;
  image: string; // URL for the floor map image
}

interface BuildingDetail {
  id: number;
  name: string;
  address: string;
  maps_url: string;
  floors: FloorMapData[]; // Nested floor maps
}


export default function BuildingMap() {
    const { buildingName: routeBuildingName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const buildingId = location.state?.buildingId;
  
    const [building, setBuilding] = useState<BuildingDetail | null>(null);
    const [allFloors, setAllFloors] = useState<FloorMapData[]>([]);
    const [allRooms, setAllRooms] = useState<RoomData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  
    useEffect(() => {
      const fetchBuildingData = async () => {
        if (!buildingId) {
          setError('Building ID not provided in navigation state.');
          setLoading(false);
          return;
        }
        
        try {
          setLoading(true);
          
          // Fetch building details
          const buildingResponse = await api.get(`/uni/buildings/${buildingId}/`);
          const fetchedBuilding = buildingResponse.data;
          setBuilding(fetchedBuilding);
          
          // Fetch all floor maps for this building
          const floorsResponse = await api.get(`/uni/floormaps/?building=${buildingId}`);
          const floors = floorsResponse.data.sort((a, b) => a.floor_number - b.floor_number);
          setAllFloors(floors);
          
          // Fetch all rooms for this building
          const roomsResponse = await api.get(`/uni/rooms/?building=${buildingId}`);
          setAllRooms(roomsResponse.data);
          
          // Select first floor by default
          if (floors.length > 0) {
            setSelectedFloorId(floors[0].id);
          }
  
        } catch (err) {
          setError('Failed to fetch building data.');
          console.error('Error fetching building data:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchBuildingData();
    }, [buildingId]);







// Get rooms for selected floor
  const getRoomsForSelectedFloor = () => {
    if (!selectedFloorId) return [];
    return allRooms.filter(room => room.floor_map === selectedFloorId);
  };

  // Get selected floor details
  const getSelectedFloorDetails = () => {
    return allFloors.find(floor => floor.id === selectedFloorId);
  };

  // Get selected room details
  const getSelectedRoomDetails = () => {
    return allRooms.find(room => room.id === selectedRoomId);
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture hall':
      case 'seminar room': return <Users size={16} className="text-blue-500" />;
      case 'laboratory': return <Computer size={16} className="text-purple-500" />;
      case 'office': return <Building size={16} className="text-green-500" />;
      case 'cafeteria': return <Coffee size={16} className="text-orange-500" />;
      case 'female washroom':
      case 'male washroom':
      case 'service': return <MapPin size={16} className="text-gray-500" />;
      default: return <Building size={16} className="text-gray-500" />;
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'lecture hall':
      case 'seminar room': return 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200';
      case 'laboratory': return 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200';
      case 'office': return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
      case 'cafeteria': return 'bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200';
      case 'female washroom':
      case 'male washroom':
      case 'service': return 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200';
      default: return 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200';
    }
  };

  // Get floor map image URL
  const getFloorMapImageUrl = (floorMap: FloorMapData) => {
    if (!floorMap.image) return null;
    // Handle both relative and absolute URLs
    if (floorMap.image.startsWith('http')) {
      return floorMap.image;
    }
    // Remove /api from baseURL and construct proper media URL
    const baseUrl = api.defaults.baseURL.replace('/api', '');
    return `${baseUrl}${floorMap.image}`;
  };

  // Handle room click to navigate to search results
  const handleRoomClick = async (room: RoomData) => {
    try {
      // Get floor map details for the room
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
        pinPosition = {
          x: Math.min(Math.max((room.map_x / 600) * 100, 5), 95), // Assuming 600px width
          y: Math.min(Math.max((room.map_y / 800) * 100, 5), 95)  // Assuming 800px height
        };
      }

      // Create search result data
      const searchResultData = {
        className: `${room.name} - ${room.type}`,
        campus: building ? building.name : 'Unknown Campus',
        campusAddress: building ? building.address : 'Unknown Address',
        building: building ? building.name : 'Unknown Building',
        room: room.name,
        floor: `Floor ${floorNumber}`,
        googleMapUrl: building ? building.maps_url : 'https://maps.google.com',
        floorPlanImage: floorMapImage,
        pinPosition: pinPosition,
        roomType: room.type,
        coordinates: { x: room.map_x, y: room.map_y }
      };

      // Navigate to search results with the room data
      navigate('/search-results', { state: { result: searchResultData } });
    } catch (err) {
      console.error('Error navigating to room search results:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading building map...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!building) {
    return <div className="text-center py-8">No building data available.</div>;
  }

  return (
    <div className="flex-1 flex flex-col px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
<div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building size={32} className="text-primary" />
          <h1 className="text-4xl font-bold text-foreground">{building.name}</h1>
        </div>
        <p className="text-gray-600 text-lg">Building Floor Plans & Room Directory</p>
      </div>

{/* Floor Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {allFloors.map((floor) => (
            <button
              key={floor.id}
              onClick={() => {
                setSelectedFloorId(floor.id);
                setSelectedRoomId(null); // Reset room selection when floor changes
              }}
              className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                selectedFloorId === floor.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-sm text-center">
                <div className="text-lg">Floor {floor.floor_number}</div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {getSelectedFloorDetails() ? `Floor ${getSelectedFloorDetails().floor_number} - ${getRoomsForSelectedFloor().length} rooms` : 'Select a floor'}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
{/* Building Map Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-gray-800">
                {getSelectedFloorDetails() ? `Floor ${getSelectedFloorDetails().floor_number}` : 'Select a Floor'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Building Hours: 6:00 - 22:00</span>
              </div>
            </div>

            {/* Building Map Image */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-center min-h-[400px]">
              <div className="text-center w-full">
                {getSelectedFloorDetails() && getSelectedFloorDetails()?.image ? (
                  <ImageWithFallback
                    src={getFloorMapImageUrl(getSelectedFloorDetails()!)}
                    alt={`Floor ${getSelectedFloorDetails()!.floor_number} Layout`}
                    className="max-w-full h-auto mb-4 rounded-lg shadow-md mx-auto"
                    style={{ maxHeight: '500px' }}
                  />
                ) : (
                  <div className="py-8">
                    <Building size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {getSelectedFloorDetails() ? 'No floor map available' : 'Select a floor to view its map'}
                    </p>
                  </div>
                )}
                <p className="text-gray-600 text-sm">Official floor plan - Click rooms below for detailed information</p>
                <p className="text-gray-500 text-xs mt-1">University of Debrecen, Faculty of Informatics</p>
              </div>
            </div>

            {/* Room Grid */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Rooms on Floor {getSelectedFloorDetails()?.floor_number || ''}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {getRoomsForSelectedFloor().map((room: RoomData) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomClick(room)}
                    className={`
                      p-3 rounded-lg border-2 transition-all text-left hover:scale-105
                      ${getRoomTypeColor(room.type)}
                      ${selectedRoomId === room.id ? 'ring-2 ring-purple-400' : ''}
                    `}
                  >
<div className="flex items-center gap-2 mb-1">
                    {getRoomTypeIcon(room.type)}
                    <span className="text-xs font-medium capitalize">{room.type}</span>
                    <Search size={12} className="ml-auto text-gray-500" />
                  </div>
                  <div className="text-sm font-semibold">{room.name}</div>
                    {room.map_x && room.map_y && (
                      <div className="text-xs text-gray-500 mt-1">
                        📍 Coordinates: ({room.map_x}, {room.map_y})
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {getRoomsForSelectedFloor().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No rooms found on this floor.
                </div>
              )}
            </div>
          </div>
        </div>

{/* Sidebar */}
        <div className="space-y-6">
          {/* Room Details */}
          {getSelectedRoomDetails() && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                {getRoomTypeIcon(getSelectedRoomDetails()!.type)}
                <div>
                  <h3 className="text-lg text-gray-800">{getSelectedRoomDetails()!.name}</h3>
                  <p className="text-gray-600 capitalize">{getSelectedRoomDetails()!.type}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Room Type:</strong> {getSelectedRoomDetails()!.type}
                  </p>
                </div>

                {getSelectedRoomDetails()!.map_x && getSelectedRoomDetails()!.map_y && (
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Map Coordinates:</strong> ({getSelectedRoomDetails()!.map_x}, {getSelectedRoomDetails()!.map_y})
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Floor:</strong> {getSelectedFloorDetails()?.floor_number}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Building:</strong> {building?.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg text-gray-800 mb-4">Room Types</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-blue-500" />
                <span className="text-sm text-gray-700">Lecture Halls & Classrooms</span>
              </div>
              <div className="flex items-center gap-3">
                <Computer size={16} className="text-purple-500" />
                <span className="text-sm text-gray-700">Laboratories</span>
              </div>
              <div className="flex items-center gap-3">
                <Building size={16} className="text-green-500" />
                <span className="text-sm text-gray-700">Faculty Offices</span>
              </div>
              <div className="flex items-center gap-3">
                <Coffee size={16} className="text-orange-500" />
                <span className="text-sm text-gray-700">Common Areas</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Services & Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

