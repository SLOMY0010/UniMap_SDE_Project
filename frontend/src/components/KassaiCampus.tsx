import { ArrowLeft, MapPin, Building, Cpu, Atom, Calculator } from 'lucide-react';
 // Removed unused icons
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import api from '@/utils/api';

interface KassaiCampusProps {
  onBack: () => void;
  onBuildingMapClick?: (buildingName: string) => void;
}

const faculties = [
  { 
    id: 'science',
    name: 'Faculty of Science and Technology', 
    color: 'bg-blue-200',
    hoverColor: 'hover:bg-blue-300',
    icon: <Atom size={24} />,
    description: 'Mathematics, Physics, Chemistry, Computer Science',
    address: 'Kassai út 26, 4028 Debrecen, Hungary',
    fullDescription: 'The Faculty of Science and Technology is at the forefront of research and education in natural sciences and computer science. Our faculty provides state-of-the-art laboratories and cutting-edge research opportunities in collaboration with international institutions.',
    departments: ['Mathematics and Computer Science', 'Physics', 'Chemistry', 'Earth Sciences', 'Environmental Sciences'],
    students: '2,400+',
    established: '1949',
    coordinates: '47.5434,21.6344',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2728.4567890123456!2d21.632400076840326!3d47.54340047118533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e1d8c4c7965%3A0x5ec09f7238bb7c76!2sKassai%20%C3%BAt%2026%2C%204028%20Debrecen%2C%20Hungary!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus'
  },
  { 
    id: 'engineering',
    name: 'Faculty of Engineering', 
    color: 'bg-green-200',
    hoverColor: 'hover:bg-green-300',
    icon: <Building size={24} />,
    description: 'Mechanical, Electrical, Civil Engineering',
    address: 'Ótemető utca 2-4, 4028 Debrecen, Hungary',
    fullDescription: 'The Faculty of Engineering offers comprehensive engineering programs with emphasis on practical application and innovation. Our modern facilities include advanced laboratories for mechanical, electrical, and civil engineering research and education.',
    departments: ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Environmental Engineering', 'Engineering Management'],
    students: '1,800+',
    established: '1968',
    coordinates: '47.5445,21.6355',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2728.3567890123456!2d21.633500076840326!3d47.54450047118533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e1d8c4c7965%3A0x5ec09f7238bb7c76!2s%C3%93temet%C5%91%20utca%202-4%2C%204028%20Debrecen%2C%20Hungary!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus'
  },
  { 
    id: 'informatics',
    name: 'Faculty of Informatics', 
    color: 'bg-purple-200',
    hoverColor: 'hover:bg-purple-300',
    icon: <Cpu size={24} />,
    description: 'Computer Science, Software Engineering, IT Management',
    address: 'Kassai út 26, Building B, 4028 Debrecen, Hungary',
    fullDescription: 'The Faculty of Informatics is dedicated to cutting-edge education in computer science, software engineering, and information technology. Our programs emphasize both theoretical foundations and practical skills needed in the rapidly evolving tech industry.',
    departments: ['Computer Science', 'Software Engineering', 'Data Science', 'Cybersecurity', 'IT Management', 'Artificial Intelligence'],
    students: '1,600+',
    established: '1996',
    coordinates: '47.5438,21.6340',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2728.4067890123456!2d21.632000076840326!3d47.54380047118533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e1d8c4c7965%3A0x5ec09f7238bb7c76!2sKassai%20%C3%BAt%2026%2C%204028%20Debrecen%2C%20Hungary!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus'
  },
  { 
    id: 'technology',
    name: 'Institute of Technology', 
    color: 'bg-orange-200',
    hoverColor: 'hover:bg-orange-300',
    icon: <Calculator size={24} />,
    description: 'Applied Sciences, Technical Research, Innovation',
    address: 'Kassai út 28, 4028 Debrecen, Hungary',
    fullDescription: 'The Institute of Technology focuses on applied research and development in collaboration with industry partners. Our institute bridges the gap between academic research and practical applications in various technological fields.',
    departments: ['Applied Research', 'Technology Transfer', 'Innovation Management', 'Technical Consulting', 'Industrial Cooperation'],
    students: '400+',
    established: '2003',
    coordinates: '47.5442,21.6348',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2728.3867890123456!2d21.632800076840326!3d47.54420047118533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e1d8c4c7965%3A0x5ec09f7238bb7c76!2sKassai%20%C3%BAt%2028%2C%204028%20Debrecen%2C%20Hungary!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus'
  }
];

export default function KassaiCampus({ onBack, onBuildingMapClick }: KassaiCampusProps) {
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [showFacultyDialog, setShowFacultyDialog] = useState(false);

  const handleFacultyClick = (facultyId: string) => {
    // If it's informatics and we have the handler, navigate directly to building map
    if (facultyId === 'informatics' && onBuildingMapClick) {
      onBuildingMapClick('Faculty of Informatics');
    } else {
      setSelectedFaculty(facultyId);
      setShowFacultyDialog(true);
    }
  };

  const handleDialogAction = () => {
    if (selectedFaculty === 'informatics' && onBuildingMapClick) {
      setShowFacultyDialog(false);
      onBuildingMapClick('Faculty of Informatics');
    }
  };

  const selected = selectedFaculty ? faculties.find(f => f.id === selectedFaculty) : null;
  
  // Get current map URL - show selected faculty or default campus view
  const getCurrentMapUrl = () => {
    if (selected) {
      return selected.mapEmbed;
    }
    // Default Kassai campus overview
    return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2728.4366966486406!2d21.632023976840326!3d47.54340047118533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e1d8c4c7965%3A0x5ec09f7238bb7c76!2sKassai%20Campus%2C%20University%20of%20Debrecen!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus';
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
          <span>Back to Campus Selection</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MapPin size={32} className="text-blue-500" />
          <h1 className="text-4xl italic text-blue-600">Kassai Campus</h1>
        </div>
        <p className="text-gray-600 text-lg">Science, Technology & Engineering Hub of University of Debrecen</p>
        <p className="text-sm text-gray-500 mt-2">💡 Click on the colored faculty pins below to explore buildings and departments</p>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 relative">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
          {/* Map Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg text-gray-800">University of Debrecen - Kassai Campus Interactive Map</h3>
            <p className="text-sm text-gray-600 mt-1">Click faculty pins to view details • Kassai út 26, 4028 Debrecen, Hungary</p>
          </div>
          
          {/* Map and Faculty Pins */}
          <div className="relative h-[600px]">
            <iframe
              src={getCurrentMapUrl()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="University of Debrecen Kassai Campus Map"
            ></iframe>
            
            {/* Faculty Pin Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="relative w-full h-full">
                {faculties.map((faculty, index) => (
                  <button
                    key={faculty.id}
                    onClick={() => handleFacultyClick(faculty.id)}
                    className={`
                      absolute pointer-events-auto 
                      ${faculty.color.replace('bg-', 'bg-opacity-90 bg-')} 
                      ${faculty.hoverColor} 
                      hover:bg-opacity-100 hover:scale-110
                      p-4 rounded-full shadow-lg hover:shadow-xl 
                      transition-all duration-200 cursor-pointer
                      border-2 border-white
                    `}
                    style={{
                      left: `${20 + (index * 180)}px`,
                      top: `${80 + (index % 2) * 80}px`
                    }}
                    title={faculty.name}
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-gray-700 mb-1">
                        {faculty.icon}
                      </div>
                      <span className="text-xs text-gray-800 text-center max-w-[60px] leading-tight">
                        {faculty.name.replace('Faculty of ', '').replace('Institute of ', '')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Campus Info Cards */}
        <div className="absolute bottom-6 left-6 right-6 flex gap-4">
          {/* Campus Quick Stats */}
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 flex-1">
            <h4 className="text-sm text-gray-800 mb-2">🏛️ Campus Overview</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-600"><strong>Students:</strong> 6,200+</p>
                <p className="text-gray-600"><strong>Faculties:</strong> 4</p>
              </div>
              <div>
                <p className="text-gray-600"><strong>Size:</strong> 80+ hectares</p>
                <p className="text-gray-600"><strong>Established:</strong> 1949</p>
              </div>
            </div>
          </div>

          {/* Transportation */}
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 flex-1">
            <h4 className="text-sm text-gray-800 mb-2">🚌 Transportation</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-5 h-3 bg-blue-500 rounded text-white text-center text-[10px] leading-3">15</div>
                <span className="text-gray-600">City Center (15 min)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-5 h-3 bg-green-500 rounded text-white text-center text-[10px] leading-3">19</div>
                <span className="text-gray-600">Train Station (20 min)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Details Dialog */}
      <Dialog open={showFacultyDialog} onOpenChange={setShowFacultyDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selected?.icon}
              <span>{selected?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Detailed information about {selected?.name} including departments, contact details, and available programs.
            </DialogDescription>
          </DialogHeader>
          
          {selected && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className={`${selected.color} p-4 rounded-xl`}>
                <p className="text-gray-700 mb-3">{selected.fullDescription}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-700"><strong>Students:</strong> {selected.students}</p>
                    <p className="text-gray-700"><strong>Established:</strong> {selected.established}</p>
                  </div>
                  <div>
                    <p className="text-gray-700"><strong>Address:</strong> {selected.address}</p>
                  </div>
                </div>
              </div>

              {/* Departments */}
              <div>
                <h4 className="text-lg text-gray-800 mb-3">Departments & Programs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selected.departments.map((dept, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-gray-700">{dept}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="text-lg text-gray-800 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">📧 {selected.name.toLowerCase().replace(/\s+/g, '').replace('faculty', '').replace('institute', '')}@unideb.hu</p>
                  <p className="text-gray-600">📞 +36 52 415 155</p>
                  <p className="text-gray-600">📍 {selected.address}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selected.id === 'informatics' ? (
                  <button
                    onClick={handleDialogAction}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Building size={20} />
                    <span>Explore Building Map</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowFacultyDialog(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-colors"
                  >
                    Building Map Coming Soon
                  </button>
                )}
                <button
                  onClick={() => setShowFacultyDialog(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}