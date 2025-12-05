import { ArrowLeft, Building, MapPin, Users, Clock, Wifi, Coffee, Book, Computer } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import groundFloorImage from 'figma:asset/b8884073179d49a6cbdb08d12f7206c7d23bf96d.png';
import firstFloorImage from 'figma:asset/58c1532e89856f05a7e27a43bb10f887da9b6b14.png';
import secondFloorImage from 'figma:asset/aceacac033493ecb1a7c27a61fe6b8b4c3660f7c.png';
import thirdFloorImage from 'figma:asset/aab9e60f00c56390691d7af2d187d4207351f908.png';

const floors = [
  {
    id: 'f0',
    name: 'Ground Floor',
    level: 'Földszint',
    description: 'Reception, administration, Dean\'s office, cafeteria, IT Systems department',
    rooms: [
      { id: 'f0-porta', number: 'Porta', name: 'Reception', type: 'service', equipment: ['Information Desk', 'Security', 'Visitor Access'] },
      { id: 'f0-dean', number: 'Dean', name: 'Dékáni Hivatal (Dean\'s Office)', type: 'office', equipment: ['Administrative Services', 'Academic Affairs'] },
      { id: 'f0-edu', number: 'Study', name: 'Tanulmányi Osztály (Education Office)', type: 'office', equipment: ['Student Services', 'Academic Records'] },
      { id: 'f0-hok', number: 'HÖK', name: 'HÖK iroda (Student Union Office)', type: 'office', equipment: ['Student Representation', 'Student Activities'] },
      { id: 'f0-bufe', number: 'Büfé', name: 'Büfé (Cafeteria)', type: 'common', capacity: 50, equipment: ['Food Service', 'Seating Area', 'Vending Machines'] },
      { id: 'f0-it-dept', number: 'IT-Net', name: 'Informatikai Rendszerek és Hálózatok Tanszék', type: 'office', equipment: ['IT Systems', 'Network Administration', 'Technical Support'] },
      { id: 'f0-f0', number: 'F0', name: 'Lecture Hall F0', type: 'lecture', capacity: 50, equipment: ['Projector', 'Whiteboard', 'Audio System'] },
      { id: 'f0-if01', number: 'IF01', name: 'Lecture Hall IF01', type: 'lecture', capacity: 40, equipment: ['Projector', 'Whiteboard', 'Audio System'] },
      { id: 'f0-if02', number: 'IF02', name: 'Lecture Hall IF02', type: 'lecture', capacity: 40, equipment: ['Projector', 'Whiteboard', 'Audio System'] },
      { id: 'f0-if03', number: 'IF03', name: 'Laboratory IF03', type: 'lab', capacity: 30, equipment: ['Computer Workstations', 'Software Development Tools'] },
      { id: 'f0-if05', number: 'IF05', name: 'Laboratory IF05', type: 'lab', capacity: 25, equipment: ['Computer Workstations', 'Testing Equipment'] },
      { id: 'f0-if06', number: 'IF06', name: 'Laboratory IF06', type: 'lab', capacity: 25, equipment: ['Computer Workstations', 'Development Tools'] },
      { id: 'f0-if07', number: 'IF07', name: 'Laboratory IF07', type: 'lab', capacity: 25, equipment: ['Computer Workstations', 'Programming Software', 'Network Equipment'] },
      { id: 'f0-if09', number: 'IF09', name: 'Laboratory IF09', type: 'lab', capacity: 30, equipment: ['Computer Workstations', 'Testing Environment'] },
      { id: 'f0-if10', number: 'IF10', name: 'Classroom IF10', type: 'lecture', capacity: 30 },
      { id: 'f0-if11', number: 'IF11', name: 'Classroom IF11', type: 'lecture', capacity: 25 },
      { id: 'f0-if12', number: 'IF12', name: 'Office IF12', type: 'office' },
      { id: 'f0-if13', number: 'IF13', name: 'Office IF13', type: 'office' },
      { id: 'f0-if14', number: 'IF14', name: 'Office IF14', type: 'office' },
      { id: 'f0-if15', number: 'IF15', name: 'Office IF15', type: 'office' },
      { id: 'f0-if16', number: 'IF16', name: 'Office IF16', type: 'office' }
    ]
  },
  {
    id: 'f1',
    name: 'First Floor',
    level: '1. emelet',
    description: 'Computer Science department, Data Science & Visualization department, council room',
    rooms: [
      { id: 'f1-cs-dept', number: 'CS-Dept', name: 'Számítógéptudományi Tanszék (Department of Computer Science)', type: 'office', equipment: ['Faculty Offices', 'Research Labs', 'Student Consultation'] },
      { id: 'f1-dv-dept', number: 'DV-Dept', name: 'Adattudomány és Vizualizáció Tanszék (Data Science & Visualization)', type: 'office', equipment: ['Data Analytics', 'Visualization Lab', 'Research Facilities'] },
      { id: 'f1-council', number: 'Council', name: 'Tanácsterem (Council Room)', type: 'common', capacity: 20, equipment: ['Meeting Room', 'Video Conferencing', 'Presentation System'] },
      { id: 'f1-i105', number: 'I105', name: 'Office I105', type: 'office' },
      { id: 'f1-i106', number: 'I106', name: 'Office I106', type: 'office' },
      { id: 'f1-i107', number: 'I107', name: 'Office I107', type: 'office' },
      { id: 'f1-i108', number: 'I108', name: 'Office I108', type: 'office' },
      { id: 'f1-i102', number: 'I102', name: 'Classroom I102', type: 'lecture', capacity: 35, equipment: ['Smart Board', 'Projector'] },
      { id: 'f1-i103', number: 'I103', name: 'Classroom I103', type: 'lecture', capacity: 30, equipment: ['Smart Board', 'Projector'] },
      { id: 'f1-i104', number: 'I104', name: 'Classroom I104', type: 'lecture', capacity: 25, equipment: ['Smart Board', 'Projector'] },
      { id: 'f1-i110', number: 'I110', name: 'Office I110', type: 'office' },
      { id: 'f1-i111', number: 'I111', name: 'Office I111', type: 'office' },
      { id: 'f1-i112', number: 'I112', name: 'Office I112', type: 'office' },
      { id: 'f1-i113', number: 'I113', name: 'Office I113', type: 'office' },
      { id: 'f1-i114', number: 'I114', name: 'Office I114', type: 'office' },
      { id: 'f1-i115', number: 'I115', name: 'Office I115', type: 'office' },
      { id: 'f1-i116', number: 'I116', name: 'Office I116', type: 'office' },
      { id: 'f1-i117', number: 'I117', name: 'Office I117', type: 'office' },
      { id: 'f1-i120', number: 'I120', name: 'Lab I120', type: 'lab', capacity: 20, equipment: ['Computer Lab', 'Programming Environment'] },
      { id: 'f1-i121', number: 'I121', name: 'Lab I121', type: 'lab', capacity: 25, equipment: ['Computer Lab', 'Development Tools'] },
      { id: 'f1-i130', number: 'I130', name: 'Classroom I130', type: 'lecture', capacity: 40, equipment: ['Lecture Hall', 'Audio-Visual System'] },
      { id: 'f1-i132', number: 'I132', name: 'Seminar Room I132', type: 'lecture', capacity: 15, equipment: ['Small Group Sessions', 'Interactive Whiteboard'] }
    ]
  },
  {
    id: 'f2',
    name: 'Second Floor',
    level: '2. emelet',
    description: 'Applied Mathematics & Probability Theory, Information Technology department',
    rooms: [
      { id: 'f2-math-dept', number: 'Math-Dept', name: 'Alkalmazott Matematika és Valószínűségszámítás Tanszék', type: 'office', equipment: ['Mathematical Research', 'Statistical Analysis', 'Probability Theory'] },
      { id: 'f2-it-dept', number: 'IT-Dept', name: 'Információ Technológia Tanszék (Information Technology)', type: 'office', equipment: ['IT Research', 'Technology Development', 'Systems Analysis'] },
      { id: 'f2-i205', number: 'I205', name: 'Office I205', type: 'office' },
      { id: 'f2-i206', number: 'I206', name: 'Office I206', type: 'office' },
      { id: 'f2-i207', number: 'I207', name: 'Office I207', type: 'office' },
      { id: 'f2-i201', number: 'I201', name: 'Lecture Hall I201', type: 'lecture', capacity: 50, equipment: ['Large Lecture Hall', 'Multimedia System', 'Recording Equipment'] },
      { id: 'f2-i202', number: 'I202', name: 'Classroom I202', type: 'lecture', capacity: 35, equipment: ['Smart Board', 'Projector'] },
      { id: 'f2-i203', number: 'I203', name: 'Classroom I203', type: 'lecture', capacity: 30, equipment: ['Smart Board', 'Projector'] },
      { id: 'f2-i204', number: 'I204', name: 'Classroom I204', type: 'lecture', capacity: 25, equipment: ['Smart Board', 'Projector'] },
      { id: 'f2-i210', number: 'I210', name: 'Office I210', type: 'office' },
      { id: 'f2-i211', number: 'I211', name: 'Office I211', type: 'office' },
      { id: 'f2-i212', number: 'I212', name: 'Office I212', type: 'office' },
      { id: 'f2-i213', number: 'I213', name: 'Office I213', type: 'office' },
      { id: 'f2-i214', number: 'I214', name: 'Office I214', type: 'office' },
      { id: 'f2-i215', number: 'I215', name: 'Office I215', type: 'office' },
      { id: 'f2-i216', number: 'I216', name: 'Office I216', type: 'office' },
      { id: 'f2-i217', number: 'I217', name: 'Office I217', type: 'office' },
      { id: 'f2-i220', number: 'I220', name: 'Lab I220', type: 'lab', capacity: 20, equipment: ['Mathematics Lab', 'Statistical Software', 'Analysis Tools'] },
      { id: 'f2-i221', number: 'I221', name: 'Lab I221', type: 'lab', capacity: 25, equipment: ['IT Lab', 'Development Environment', 'Testing Facilities'] },
      { id: 'f2-i230', number: 'I230', name: 'Research Lab I230', type: 'lab', capacity: 15, equipment: ['Advanced Research', 'Specialized Equipment', 'Data Analysis'] },
      { id: 'f2-i231', number: 'I231', name: 'Seminar Room I231', type: 'lecture', capacity: 20, equipment: ['Small Lectures', 'Group Work', 'Presentations'] },
      { id: 'f2-i232', number: 'I232', name: 'Conference Room I232', type: 'common', capacity: 15, equipment: ['Meetings', 'Video Conferencing', 'Collaboration Space'] }
    ]
  },
  {
    id: 'f3',
    name: 'Third Floor',
    level: '3. emelet',
    description: 'Research offices, graduate programs, advanced study areas',
    rooms: [
      { id: 'i310', number: 'I310', name: 'Laboratory I310', type: 'lab', capacity: 20, equipment: ['Computer Workstations', 'Development Tools', 'Research Software'] },
      { id: 'i311', number: 'I311', name: 'Laboratory I311', type: 'lab', capacity: 20, equipment: ['Computer Workstations', 'Programming Environment', 'Testing Tools'] },
      { id: 'i312', number: 'I312', name: 'Laboratory I312', type: 'lab', capacity: 20, equipment: ['Computer Workstations', 'Software Development', 'Analysis Tools'] },
      { id: 'i320', number: 'I320', name: 'Laboratory I320', type: 'lab', capacity: 20, equipment: ['Computer Workstations', 'Research Software', 'Testing Equipment'] },
      { id: 'i321', number: 'I321', name: 'Laboratory I321', type: 'lab', capacity: 20, equipment: ['Computer Workstations', 'Specialized Software', 'Testing Equipment'] },
      { id: 'i322', number: 'I322', name: 'Laboratory I322', type: 'lab', capacity: 20, equipment: ['Computer Workstations', 'Development Tools', 'Whiteboard'] },
      { id: 'i323', number: 'I323', name: 'Laboratory I323', type: 'lab', capacity: 20, equipment: ['Computer Workstations', 'Programming Software', 'Analysis Tools'] },
      { id: 'i324', number: 'I324', name: 'Laboratory I324', type: 'lab', capacity: 20, equipment: ['Computer Workstations', 'Research Software', 'Data Analysis Tools'] },
      { id: 'i325', number: 'I325', name: 'Laboratory I325', type: 'lab', capacity: 20, equipment: ['Computer Workstations', 'Development Environment', 'Testing Tools'] },
      { id: 'i330', number: 'I330', name: 'Office I330', type: 'office', equipment: ['Computer Workstation', 'Desk', 'Storage'] },
      { id: 'i331', number: 'I331', name: 'Office I331', type: 'office', equipment: ['Computer Workstation', 'Desk', 'Meeting Space'] },
      { id: 'i332', number: 'I332', name: 'Office I332', type: 'office', equipment: ['Computer Workstation', 'Desk', 'Bookshelves'] },
      { id: 'lift-3', number: 'Lift', name: 'Elevator / Lift', type: 'service', equipment: ['Accessible for all floors'] },
      { id: 'wc-3', number: 'WC', name: 'Akadálymentes WC / Accessible Toilet', type: 'service', equipment: ['Accessible facilities', 'Baby changing station'] },
      { id: 'stairs-3', number: 'Lépcső', name: 'Lépcső / Staircase', type: 'service', equipment: ['Emergency exit route'] }
    ]
  }
];

export default function BuildingMap({ onBack, buildingName }) {
  const [selectedFloor, setSelectedFloor] = useState('f0');
  const [selectedRoom, setSelectedRoom] = useState(null);

  const currentFloor = floors.find(f => f.id === selectedFloor) || floors[0];
  const selectedRoomData = selectedRoom ? currentFloor.rooms.find(r => r.id === selectedRoom) : null;

  const getRoomTypeIcon = (type) => {
    switch (type) {
      case 'lecture': return <Users size={16} className="text-blue-500" />;
      case 'lab': return <Computer size={16} className="text-purple-500" />;
      case 'office': return <Building size={16} className="text-green-500" />;
      case 'common': return <Coffee size={16} className="text-orange-500" />;
      case 'service': return <MapPin size={16} className="text-gray-500" />;
      default: return <Building size={16} className="text-gray-500" />;
    }
  };

  const getRoomTypeColor = (type) => {
    switch (type) {
      case 'lecture': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'lab': return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'office': return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'common': return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'service': return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

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
          <h1 className="text-4xl italic text-purple-600">{buildingName}</h1>
        </div>
        <p className="text-gray-600 text-lg">Building Floor Plans & Room Directory</p>
      </div>

      {/* Floor Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          {floors.map((floor) => (
            <button
              key={floor.id}
              onClick={() => {
                setSelectedFloor(floor.id);
                setSelectedRoom(null);
              }}
              className={`px-6 py-3 rounded-lg transition-colors ${
                selectedFloor === floor.id 
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
        <p className="text-sm text-gray-600 mt-2">{currentFloor.description}</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Building Map Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-gray-800">{currentFloor.name} ({currentFloor.level})</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Building Hours: 6:00 - 22:00</span>
              </div>
            </div>
            
            {/* Building Map Image */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-center min-h-[500px]">
              <div className="text-center w-full">
                <ImageWithFallback 
                  src={
                    selectedFloor === 'f0' ? groundFloorImage :
                    selectedFloor === 'f1' ? firstFloorImage :
                    selectedFloor === 'f2' ? secondFloorImage :
                    selectedFloor === 'f3' ? thirdFloorImage :
                    groundFloorImage
                  } 
                  alt={`${currentFloor.name} (${currentFloor.level}) Layout`}
                  className="max-w-full h-auto mb-4 rounded-lg shadow-md mx-auto"
                  style={{ maxHeight: '600px' }}
                />
                <p className="text-gray-600 text-sm">Official floor plan - Click rooms below for detailed information</p>
                <p className="text-gray-500 text-xs mt-1">University of Debrecen, Faculty of Informatics</p>
              </div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {currentFloor.rooms.map((room) => (
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
                    <span className="text-xs text-gray-800">{room.number}</span>
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
                  <h3 className="text-lg text-gray-800">{selectedRoomData.number}</h3>
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
