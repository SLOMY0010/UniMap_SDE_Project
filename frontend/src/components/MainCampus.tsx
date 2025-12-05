import { ArrowLeft, MapPin, Building, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/utils/api'; // Import the API utility

interface MainCampusProps {
  onBack: () => void;
}

export default function MainCampus({ onBack }: MainCampusProps) {
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);

  const faculties = [
    { 
      id: 'humanities',
      name: 'Faculty of Humanities', 
      color: 'bg-pink-200',
      hoverColor: 'hover:bg-pink-300',
      icon: <Users size={24} />,
      description: 'Literature, History, Philosophy, Cultural Studies',
      address: 'Egyetem tér 1, 4032 Debrecen, Hungary',
      fullDescription: 'The Faculty of Humanities is the oldest faculty of the university, offering comprehensive programs in literature, linguistics, history, philosophy, and cultural studies. Known for excellence in research and international collaborations across Europe and beyond.',
      departments: ['Hungarian Language and Literature', 'History', 'Philosophy', 'English and American Studies', 'German Studies', 'Romance Languages'],
      students: '2,800+',
      established: '1538',
      coordinates: '47.5551,21.6225',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2727.8366966486406!2d21.620023976840326!3d47.55507347118533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e1d8c4c7965%3A0x5ec09f7238bb7c76!2sEgyetem%20t%C3%A9r%201%2C%204032%20Debrecen%2C%20Hungary!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus'
    },
    { 
      id: 'law',
      name: 'Faculty of Law', 
      color: 'bg-indigo-200',
      hoverColor: 'hover:bg-indigo-300',
      icon: <Building size={24} />,
      description: 'Law, Political Science, International Relations',
      address: 'Kassai út 26, 4028 Debrecen, Hungary',
      fullDescription: 'The Faculty of Law provides comprehensive legal education and is recognized for its strong programs in constitutional law, international law, and European Union law. Our graduates serve in various legal professions across Hungary and internationally.',
      departments: ['Constitutional Law', 'Civil Law', 'Criminal Law', 'International Law', 'European Law', 'Political Science'],
      students: '1,500+',
      established: '1914',
      coordinates: '47.5434,21.6344',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2728.4567890123456!2d21.632400076840326!3d47.54340047118533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e1d8c4c7965%3A0x5ec09f7238bb7c76!2sKassai%20%C3%BAt%2026%2C%204028%20Debrecen%2C%20Hungary!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus'
    },
    { 
      id: 'economics',
      name: 'Faculty of Economics', 
      color: 'bg-green-200',
      hoverColor: 'hover:bg-green-300',
      icon: <Building size={24} />,
      description: 'Business Administration, Economics, Management',
      address: 'Böszörményi út 138, 4032 Debrecen, Hungary',
      fullDescription: 'The Faculty of Economics and Business offers modern business education with focus on entrepreneurship, international business, and sustainable development. Our programs are designed to meet the demands of the global economy.',
      departments: ['Business Administration', 'Economics', 'Management and Organization', 'Finance and Accounting', 'Marketing', 'International Business'],
      students: '3,200+',
      established: '1970',
      coordinates: '47.5583,21.6189',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2727.5234567890123!2d21.616900076840326!3d47.55830047118533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e1d8c4c7965%3A0x5ec09f7238bb7c76!2sB%C3%B6sz%C3%B6rm%C3%A9nyi%20%C3%BAt%20138%2C%204032%20Debrecen%2C%20Hungary!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus'
    },
    { 
      id: 'childhealth',
      name: 'Faculty of Child Health', 
      color: 'bg-orange-200',
      hoverColor: 'hover:bg-orange-300',
      icon: <Heart size={24} />,
      description: 'Pediatric Nursing, Child Development, Family Support',
      address: 'Miklós utca 1, 4026 Debrecen, Hungary',
      fullDescription: 'The Faculty of Child Health is dedicated to training professionals in pediatric care, child development, and family support services. Our innovative programs focus on holistic child welfare and evidence-based practices.',
      departments: ['Pediatric Nursing', 'Child Development', 'Family and Child Welfare', 'Early Childhood Education', 'Child Psychology'],
      students: '800+',
      established: '1993',
      coordinates: '47.5578,21.6182',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2727.6123456789012!2d21.616200076840326!3d47.55780047118533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e1d8c4c7965%3A0x5ec09f7238bb7c76!2sMikl%C3%B3s%20utca%201%2C%204026%20Debrecen%2C%20Hungary!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus'
    }
  ];

  const handleFacultyClick = (facultyId: string) => {
    setSelectedFaculty(selectedFaculty === facultyId ? null : facultyId);
  };

  const selected = selectedFaculty ? faculties.find(f => f.id === selectedFaculty) : null;
  
  // Get current map URL - show selected faculty or default campus view
  const getCurrentMapUrl = () => {
    if (selected) {
      return selected.mapEmbed;
    }
    // Default campus overview
    return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2727.8366966486406!2d21.622023976840326!3d47.55507347118533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470e1d8c4c7965%3A0x5ec09f7238bb7c76!2sUniversity%20of%20Debrecen!5e0!3m2!1sen!2sus!4v1635789123456!5m2!1sen!2sus';
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MapPin size={32} className="text-pink-500" />
          <h1 className="text-4xl italic text-pink-600">Main Campus</h1>
        </div>
        <p className="text-gray-600 text-lg">Explore University of Debrecen faculties and locate them on the campus map</p>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Faculties */}
        <div className="space-y-6">
          <h2 className="text-2xl text-gray-800 mb-4">Faculties</h2>
          
          <div className="space-y-4">
            {faculties.map((faculty) => (
              <div
                key={faculty.id}
                onClick={() => handleFacultyClick(faculty.id)}
                className={`
                  ${faculty.color} ${faculty.hoverColor} 
                  p-6 rounded-2xl shadow-lg hover:shadow-xl 
                  transition-all duration-200 cursor-pointer hover:scale-[1.02] transform
                  ${selectedFaculty === faculty.id ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-gray-700 mt-1">
                    {faculty.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-black mb-2">{faculty.name}</h3>
                    <p className="text-gray-700 text-sm">{faculty.description}</p>
                    {selectedFaculty === faculty.id && (
                      <div className="mt-4 pt-4 border-t border-gray-400/30">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-800"><strong>Location:</strong> {faculty.address}</p>
                          <p className="text-sm text-gray-700">{faculty.fullDescription}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Faculty Details */}
          {selected && (
            <div className="bg-white p-6 rounded-2xl shadow-lg mt-8 border-l-4 border-blue-400">
              <h3 className="text-xl text-gray-800 mb-4 flex items-center gap-2">
                {selected.icon}
                {selected.name} - Detailed Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600"><strong>Students:</strong> {selected.students}</p>
                    <p className="text-gray-600"><strong>Established:</strong> {selected.established}</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><strong>Location:</strong> {selected.address}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-800 mb-2">Departments:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.departments.map((dept, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campus Info */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
            <h3 className="text-lg text-gray-800 mb-4">Main Campus Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Main Address:</strong> Egyetem tér 1, 4032 Debrecen, Hungary</p>
              <p><strong>Campus Students:</strong> 8,300+</p>
              <p><strong>Established:</strong> 1538</p>
              <p><strong>Campus Focus:</strong> Humanities, Law, Economics, Child Health</p>
              <p><strong>Notable Features:</strong> Historic main building, Central library, Administrative offices</p>
            </div>
          </div>
        </div>

        {/* Right Side - Google Map */}
        <div className="flex flex-col">
          <h2 className="text-2xl text-gray-800 mb-4">Campus Map</h2>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex-1">
            {/* Map Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm text-gray-700">
                {selected ? `${selected.name} Location` : 'University of Debrecen - Main Campus Overview'}
              </h3>
              {selected && (
                <p className="text-xs text-gray-500 mt-1">{selected.address}</p>
              )}
            </div>
            
            <iframe
              key={selectedFaculty || 'default'} // Force re-render when selection changes
              src={getCurrentMapUrl()}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={selected ? `${selected.name} Faculty Map` : "University of Debrecen Main Campus Map"}
            ></iframe>
          </div>

          {/* Map Legend & Instructions - Now below the map */}
          <div className="bg-white p-4 rounded-xl shadow-lg mt-4">
            <h4 className="text-sm text-gray-800 mb-3">Map Guide</h4>
            {!selected ? (
              <div className="text-xs text-gray-600 mb-3">
                💡 Click on any faculty above to view its specific location on the map
              </div>
            ) : (
              <div className="text-xs text-green-600 mb-3 font-medium">
                📍 Showing: {selected.name}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {faculties.map((faculty) => (
                <div 
                  key={faculty.id}
                  className={`flex items-center gap-2 p-1 rounded transition-colors ${
                    selectedFaculty === faculty.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    faculty.id === 'humanities' ? 'bg-pink-400' :
                    faculty.id === 'law' ? 'bg-indigo-400' :
                    faculty.id === 'economics' ? 'bg-green-400' :
                    faculty.id === 'childhealth' ? 'bg-orange-400' :
                    'bg-purple-400'
                  }`}></div>
                  <span className={selectedFaculty === faculty.id ? 'font-medium' : ''}>
                    {faculty.name.replace('Faculty of ', '')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Quick Info - Additional content below map */}
          <div className="bg-white p-4 rounded-xl shadow-lg mt-4">
            <h4 className="text-sm text-gray-800 mb-3">Campus Quick Info</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-gray-600"><strong>🏛️ Founded:</strong> 1538</p>
                <p className="text-gray-600"><strong>👥 Students:</strong> 8,300+</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600"><strong>🏢 Faculties:</strong> 4</p>
                <p className="text-gray-600"><strong>📍 Location:</strong> City Center</p>
              </div>
            </div>
            {selected && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs">
                  <p className="text-gray-700 mb-1"><strong>📞 Contact Information:</strong></p>
                  <p className="text-gray-600">📧 {selected.name.toLowerCase().replace(/\s+/g, '').replace('faculty', '')}@unideb.hu</p>
                  <p className="text-gray-600">📞 +36 52 512 000</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
