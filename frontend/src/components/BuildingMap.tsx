import { ArrowLeft, Building, MapPin, Users, Clock, Coffee, Computer } from 'lucide-react';
import { useState, useEffect } from 'react'; // Import useEffect
import { ImageWithFallback } from './figma/ImageWithFallback';
import api from '@/utils/api'; // Import the API utility

// Static image imports for fallback/default if not dynamically loaded
import groundFloorImage from '../asset/b8884073179d49a6cbdb08d12f7206c7d23bf96d.png';
import firstFloorImage from '../asset/58c1532e89856f05a7e27a43bb10f887da9b6b14.png';
import secondFloorImage from '../asset/aceacac033493ecb1a7c27a61fe6b8b4c3660f7c.png';
import thirdFloorImage from '../asset/aab9e60f00c56390691d7af2d187d4207351f908.png';

const STATIC_FLOOR_IMAGES = {
  'f0': groundFloorImage,
  'f1': firstFloorImage,
  'f2': secondFloorImage,
  'f3': thirdFloorImage,
};


interface BuildingMapProps {
  onBack: () => void;
  buildingName: string;
}

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


export default function BuildingMap({ onBack, buildingName }: BuildingMapProps) {
  const [building, setBuilding] = useState<BuildingDetail | null>(null);
  const [floorsData, setFloorsData] = useState<any[]>([]); // Combines floor map and rooms
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null); // Use string for 'f0', 'f1', etc.
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null); // Use room ID

  useEffect(() => {
    const fetchBuildingData = async () => {
      try {
        // First, find the building by name
        const searchResponse = await api.get(`/uni/search?q=${buildingName}`);
        const foundBuilding = searchResponse.data.buildings.find((b: { name: string; }) => b.name === buildingName);

        if (!foundBuilding) {
          setError(`Building "${buildingName}" not found.`);
          setLoading(false);
          return;
        }

        // Fetch detailed building data including nested floors (if available through building endpoint directly)
        // Adjust this if you need to fetch floors separately
        const buildingDetailResponse = await api.get(`/uni/buildings/${foundBuilding.id}/`);
        const fetchedBuilding: BuildingDetail = buildingDetailResponse.data;
        setBuilding(fetchedBuilding);

        // Fetch all rooms and filter by building
        const roomsResponse = await api.get('/uni/rooms/');
        const roomsForBuilding = roomsResponse.data.filter((room: RoomData) => room.building === fetchedBuilding.id);

        // Organize data by floor
        const organizedFloors: any[] = fetchedBuilding.floors.map(floorMap => {
          const roomsOnFloor = roomsForBuilding.filter((room: RoomData) => room.floor_map === floorMap.id);
          return {
            id: `f${floorMap.floor_number}`, // Convert floor_number to 'f0', 'f1' format
            name: `Floor ${floorMap.floor_number}`,
            level: `${floorMap.floor_number}. emelet`, // Hungarian for floor
            description: `Rooms on Floor ${floorMap.floor_number}`, // Placeholder
            image: floorMap.image ? `${api.defaults.baseURL.replace('/api', '')}${floorMap.image}` : undefined, // Full URL for image
            rooms: roomsOnFloor.map((room: RoomData) => ({
              ...room,
              number: room.name, // Using name as number for display
              // Add static capacity and equipment for now if not in backend, or map from room properties
              capacity: room.type.includes('lecture') || room.type.includes('seminar') || room.type.includes('lab') ? 30 : undefined,
              equipment: room.type.includes('lecture') ? ['Projector', 'Whiteboard', 'Audio System'] :
                         room.type.includes('lab') ? ['Computer Workstations', 'Software Development Tools'] : undefined,
            })),
          };
        });
        setFloorsData(organizedFloors.sort((a,b) => a.floor_number - b.floor_number)); // Sort by floor number

        if (organizedFloors.length > 0) {
          setSelectedFloorId(organizedFloors[0].id); // Select the first floor by default
        }

      } catch (err) {
        setError('Failed to fetch building data.');
        console.error('Error fetching building data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildingData();
  }, [buildingName]); // Re-fetch if buildingName changes

  const currentFloor = floorsData.find(f => f.id === selectedFloorId);
  const selectedRoomData = selectedRoom ? currentFloor?.rooms.find((r: RoomData) => r.id === selectedRoom) : null;

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
      case 'seminar room': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'laboratory': return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'office': return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'cafeteria': return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'female washroom':
      case 'male washroom':
      case 'service': return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
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
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
          <span>Back to Kassai Campus</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Building size={32} className="text-purple-500" />
          <h1 className="text-4xl italic text-purple-600">{building.name}</h1>
        </div>
        <p className="text-gray-600 text-lg">Building Floor Plans & Room Directory</p>
      </div>

      {/* Floor Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          {floorsData.map((floor) => (
            <button
              key={floor.id}
              onClick={() => {
                setSelectedFloorId(floor.id);
                setSelectedRoom(null);
              }}
              className={`px-6 py-3 rounded-lg transition-colors ${
                selectedFloorId === floor.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <div className="text-sm text-center">
                <div className="text-lg">{floor.level}</div>
                <div className="text-xs opacity-80">{floor.name}</div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">{currentFloor?.description}</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Building Map Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-gray-800">{currentFloor?.name} ({currentFloor?.level})</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Building Hours: 6:00 - 22:00</span>
              </div>
            </div>

            {/* Building Map Image */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-center min-h-[500px]">
              <div className="text-center w-full">
                <ImageWithFallback
                  src={currentFloor?.image ? currentFloor.image : STATIC_FLOOR_IMAGES[currentFloor?.id as keyof typeof STATIC_FLOOR_IMAGES] || groundFloorImage}
                  alt={`${currentFloor?.name} (${currentFloor?.level}) Layout`}
                  className="max-w-full h-auto mb-4 rounded-lg shadow-md mx-auto"
                  style={{ maxHeight: '600px' }}
                />
                <p className="text-gray-600 text-sm">Official floor plan - Click rooms below for detailed information</p>
                <p className="text-gray-500 text-xs mt-1">University of Debrecen, Faculty of Informatics</p>
              </div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentFloor?.rooms.map((room: RoomData) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-left
                    ${getRoomTypeColor(room.type)}
                    ${selectedRoom === room.id ? 'ring-2 ring-purple-400' : ''}
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getRoomTypeIcon(room.type)}
                    <span className="text-xs text-gray-800">{room.name}</span>
                  </div>
                  <div className="text-sm text-gray-700">{room.name}</div>
                  {room.capacity && (
                    <div className="text-xs text-gray-500 mt-1">
                      👥 {room.capacity} seats
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Room Details */}
          {selectedRoomData && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                {getRoomTypeIcon(selectedRoomData.type)}
                <div>
                  <h3 className="text-lg text-gray-800">{selectedRoomData.name}</h3>
                  <p className="text-gray-600">{selectedRoomData.name}</p>
                </div>
              </div>

              {selectedRoomData.capacity && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <strong>Capacity:</strong> {selectedRoomData.capacity} people
                  </p>
                </div>
              )}

              {selectedRoomData.equipment && selectedRoomData.equipment.length > 0 && (
                <div>
                  <h4 className="text-sm text-gray-800 mb-2">Equipment & Features:</h4>
                  <div className="space-y-1">
                    {selectedRoomData.equipment.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
