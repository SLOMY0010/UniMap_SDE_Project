import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen, 
  GraduationCap,
  Coffee,
  Mic,
  List,
  Grid3X3,
  Search,
  Edit3,
  Trash2,
  Bell,
  Upload
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import api from '@/utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface CalendarProps {
  onBack: () => void;
}

interface BackendEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string; // ISO 8601 string
  end: string;   // ISO 8601 string
}

interface Event extends BackendEvent {
  date: Date; // Converted from start string
  time: string; // Derived from start string
  category: 'class' | 'exam' | 'meeting' | 'social' | 'seminar' | 'deadline' | 'other'; // Categorize based on title/description
}

const eventCategories = {
  class: { color: 'bg-blue-500', icon: <BookOpen size={14} />, name: 'Class' },
  exam: { color: 'bg-red-500', icon: <GraduationCap size={14} />, name: 'Exam' },
  meeting: { color: 'bg-purple-500', icon: <Users size={14} />, name: 'Meeting' },
  social: { color: 'bg-green-500', icon: <Coffee size={14} />, name: 'Social' },
  seminar: { color: 'bg-orange-500', icon: <Mic size={14} />, name: 'Seminar' },
  deadline: { color: 'bg-pink-500', icon: <Clock size={14} />, name: 'Deadline' },
  other: { color: 'bg-gray-500', icon: <CalendarIcon size={14} />, name: 'Other' }
};

const categorizeEvent = (event: BackendEvent): Event => {
  let category: Event['category'] = 'other';
  const lowerTitle = event.title.toLowerCase();
  const lowerDescription = event.description ? event.description.toLowerCase() : '';

  if (lowerTitle.includes('exam') || lowerDescription.includes('exam')) {
    category = 'exam';
  } else if (lowerTitle.includes('class') || lowerTitle.includes('lecture') || lowerDescription.includes('class')) {
    category = 'class';
  } else if (lowerTitle.includes('meeting') || lowerDescription.includes('meeting')) {
    category = 'meeting';
  } else if (lowerTitle.includes('social') || lowerTitle.includes('party')) {
    category = 'social';
  } else if (lowerTitle.includes('seminar') || lowerDescription.includes('seminar')) {
    category = 'seminar';
  } else if (lowerTitle.includes('deadline') || lowerTitle.includes('submit')) {
    category = 'deadline';
  }

  const startDate = new Date(event.start);
  const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    ...event,
    date: startDate,
    time: startTime,
    category,
  };
};

export default function Calendar({ onBack }: CalendarProps) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'month' | 'list'>('month');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const fetchEvents = async (date: Date) => {
    setLoading(true);
    setError(null);
    try {
      const year = date.getFullYear();
      const month = date.getMonth();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const params = new URLSearchParams({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
      const response = await api.get<BackendEvent[]>(`/class_schedule/my_events/?${params.toString()}`);
      setEvents(response.data.map(categorizeEvent));
    } catch (err) {
      setError('Failed to fetch events.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentDate);
  }, [currentDate]);
  
  // Get first day of month and number of days
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      return event.date.getDate() === day &&
             event.date.getMonth() === currentDate.getMonth() &&
             event.date.getFullYear() === currentDate.getFullYear();
    });
  };

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort for list view

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to start of today
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return events.filter(event => {
      return event.date >= now && event.date <= nextWeek;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadFile(event.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      setUploadError('Please select an ICS file to upload.');
      return;
    }

    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const response = await api.post('/class_schedule/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadSuccess(`Successfully uploaded! Created: ${response.data.created}, Updated: ${response.data.updated}`);
      setShowUploadModal(false);
      setUploadFile(null);
      fetchEvents(currentDate); // Refresh events
    } catch (err: any) {
      console.error('ICS upload failed:', err);
      if (err.response && err.response.data) {
        setUploadError(err.response.data.detail || 'Failed to upload ICS file.');
      } else {
        setUploadError('Failed to upload ICS file. Please try again.');
      }
    }
  };

  const handleEventClick = async (event: Event) => {
    try {
      // Search for the room/location using the backend search API
      const response = await api.get(`/uni/search/?q=${encodeURIComponent(event.location)}`);
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
            floorMapImage = floorMap.image.startsWith('http') 
              ? floorMap.image 
              : `http://127.0.0.1:8000${floorMap.image}`;
            floorNumber = floorMap.floor_number;
          } catch (err) {
            console.warn('Could not fetch floor map:', err);
          }
        }

        // Create search result data similar to ClassSearch
        const searchResultData = {
          className: `${event.title} - ${event.description || 'Class'}`,
          campus: campus ? campus.name : 'Unknown Campus',
          campusAddress: campus ? campus.address : 'Unknown Address',
          building: building ? building.name : 'Unknown Building',
          room: room.name,
          floor: `Floor ${floorNumber}`,
          googleMapUrl: building ? building.maps_url : (campus ? campus.maps_url : 'https://maps.google.com'),
          floorPlanImage: floorMapImage,
          pinPosition: room.map_x && room.map_y ? { x: room.map_x, y: room.map_y } : { x: 50, y: 50 },
          roomType: room.type,
          coordinates: room.map_x && room.map_y ? { x: room.map_x, y: room.map_y } : null
        };

        // Navigate to search results with the room data
        navigate('/search-results', { state: { result: searchResultData } });
      } else if (matched_type === 'building' && buildings.length > 0) {
        const building = buildings[0];
        const campus = campuses.find(c => c.id === building.campus);

        // Fetch first floor map for the building
        let floorMapImage = null;
        try {
          const floorsResponse = await api.get(`/uni/floormaps/?building=${building.id}`);
          const floors = floorsResponse.data;
          if (floors.length > 0) {
            floorMapImage = floors[0].image.startsWith('http') 
              ? floors[0].image 
              : `http://127.0.0.1:8000${floors[0].image}`;
          }
        } catch (err) {
          console.warn('Could not fetch building floor maps:', err);
        }

        const searchResultData = {
          className: `${event.title} - ${event.description || 'Class'}`,
          campus: campus ? campus.name : 'Unknown Campus',
          campusAddress: campus ? campus.address : 'Unknown Address',
          building: building.name,
          room: 'Building Entrance',
          floor: floorMapImage ? 'Ground Floor' : 'N/A',
          googleMapUrl: building.maps_url,
          floorPlanImage: floorMapImage,
          pinPosition: { x: 50, y: 50 },
          roomType: 'building',
          coordinates: null
        };

        navigate('/search-results', { state: { result: searchResultData } });
      } else if (matched_type === 'campus' && campuses.length > 0) {
        const campus = campuses[0];
        
        const searchResultData = {
          className: `${event.title} - ${event.description || 'Class'}`,
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
        };

        navigate('/search-results', { state: { result: searchResultData } });
      } else {
        // If no exact match, try a more general search or show message
        console.log('No exact location found for:', event.location);
        // You could show a toast message here or navigate to a general search
      }
    } catch (err) {
      console.error('Error searching for location:', err);
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
          <span>Back to Campus Selection</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CalendarIcon size={32} className="text-green-500" />
          <h1 className="text-4xl italic text-green-600">University Calendar</h1>
        </div>
        <p className="text-gray-600 text-lg">Manage your academic schedule at University of Debrecen</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('month')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              view === 'month' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Grid3X3 size={16} />
            Month
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              view === 'list' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <List size={16} />
            List
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {Object.entries(eventCategories).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>

          <Button
            onClick={() => setShowUploadModal(true)} // Changed to open upload modal
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Upload size={16} />
            Upload ICS
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        /* Main Content */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar/List View */}
          <div className="lg:col-span-2">
            {view === 'month' ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button 
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={24} className="text-gray-600" />
                  </button>
                  
                  <h2 className="text-2xl text-gray-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  
                  <button 
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight size={24} className="text-gray-600" />
                  </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center py-2 text-gray-600 text-sm">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    const dayEvents = day ? getEventsForDay(day) : [];
                    return (
                      <div
                        key={index}
                        onClick={() => day && setSelectedDay(day)}
                        className={`
                          min-h-[80px] p-2 rounded-lg cursor-pointer transition-all border
                          ${day === null ? 'invisible' : 'hover:bg-gray-50 border-gray-200'}
                          ${isToday(day || 0) ? 'bg-green-50 border-green-300' : ''}
                          ${selectedDay === day ? 'ring-2 ring-green-400' : ''}
                        `}
                      >
                        {day && (
                          <>
                            <div className={`text-sm mb-1 ${isToday(day) ? 'text-green-600' : 'text-gray-700'}`}>
                              {day}
                            </div>
                             <div className="space-y-1">
                               {dayEvents.slice(0, 2).map((event) => (
                                 <div
                                   key={event.id}
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleEventClick(event);
                                   }}
                                   className={`text-xs px-2 py-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity ${eventCategories[event.category].color}`}
                                   title={`Click to view ${event.location} on map`}
                                 >
                                   {event.title}
                                 </div>
                               ))}
                               {dayEvents.length > 2 && (
                                 <div className="text-xs text-gray-500">
                                   +{dayEvents.length - 2} more
                                 </div>
                               )}
                             </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl text-gray-800 mb-6">Event List</h2>
                <div className="space-y-4">
                  {filteredEvents.length === 0 ? (
                    <p className="text-center text-muted-foreground">No events found for this view.</p>
                  ) : (
                     filteredEvents.map((event) => (
                       <div 
                         key={event.id} 
                         className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                         onClick={() => handleEventClick(event)}
                       >
                         <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg text-white ${eventCategories[event.category].color}`}>
                              {eventCategories[event.category].icon}
                            </div>
                            <div>
                              <h3 className="text-lg text-gray-800">{event.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon size={14} />
                                  {event.date.toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {event.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  {event.location}
                                </span>
                              </div>
                              {event.description && (
                                <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                              )}
                            </div>
                          </div>
                          {/* Edit/Delete functionality (if applicable in backend) */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              // onClick={() => { setEditingEvent(event); setShowEventModal(true); }}
                              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                              <Edit3 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              // onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg text-gray-800 mb-4">Quick Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Events</span>
                  <span className="text-lg text-gray-800">{events.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-lg text-green-600">
                    {events.filter(e => {
                      return e.date.getMonth() === currentDate.getMonth() &&
                             e.date.getFullYear() === currentDate.getFullYear();
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Upcoming Week</span>
                  <span className="text-lg text-blue-600">{getUpcomingEvents().length}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg text-gray-800 mb-4 flex items-center gap-2">
                <Bell size={18} />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {getUpcomingEvents().slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-1 rounded text-white ${eventCategories[event.category].color}`}>
                      {eventCategories[event.category].icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{event.title}</p>
                      <p className="text-xs text-gray-600">
                        {event.date.toLocaleDateString()} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
                {getUpcomingEvents().length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No upcoming events this week
                  </p>
                )}
              </div>
            </div>

            {/* Event Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg text-gray-800 mb-4">Event Categories</h3>
              <div className="space-y-2">
                {Object.entries(eventCategories).map(([key, category]) => {
                  const count = events.filter(e => e.category === key).length;
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Academic Calendar Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg text-gray-800 mb-4">Academic Resources</h3>
              <div className="space-y-3">
                <Button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="text-sm text-blue-700">University Academic Calendar</div>
                  <div className="text-xs text-blue-600">View official dates</div>
                </Button>
                <Button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="text-sm text-green-700">Exam Schedules</div>
                  <div className="text-xs text-green-600">Check exam dates</div>
                </Button>
                <Button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                  <div className="text-sm text-purple-700">Course Registration</div>
                  <div className="text-xs text-purple-600">Register for courses</div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload ICS Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload ICS File</DialogTitle>
            <DialogDescription>
              Upload an .ics file to import your class schedule.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icsFile" className="text-right">
                ICS File
              </Label>
              <Input
                id="icsFile"
                type="file"
                accept=".ics"
                onChange={handleFileChange}
                className="col-span-3"
              />
            </div>
            {uploadError && <p className="text-red-500 text-sm col-span-4 text-center">{uploadError}</p>}
            {uploadSuccess && <p className="text-green-500 text-sm col-span-4 text-center">{uploadSuccess}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleUploadSubmit}>Upload</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}