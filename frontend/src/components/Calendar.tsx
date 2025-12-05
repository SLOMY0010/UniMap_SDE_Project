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
  Calendar1,
  List,
  Grid3X3,
  Filter,
  Search,
  X,
  Edit3,
  Trash2,
  Bell
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarProps {
  onBack: () => void;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  category: 'class' | 'exam' | 'meeting' | 'social' | 'seminar' | 'deadline';
  description?: string;
  attendees?: number;
}

const eventCategories = {
  class: { color: 'bg-blue-500', icon: <BookOpen size={14} />, name: 'Class' },
  exam: { color: 'bg-red-500', icon: <GraduationCap size={14} />, name: 'Exam' },
  meeting: { color: 'bg-purple-500', icon: <Users size={14} />, name: 'Meeting' },
  social: { color: 'bg-green-500', icon: <Coffee size={14} />, name: 'Social' },
  seminar: { color: 'bg-orange-500', icon: <Mic size={14} />, name: 'Seminar' },
  deadline: { color: 'bg-pink-500', icon: <Clock size={14} />, name: 'Deadline' }
};

// Sample events for University of Debrecen
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Introduction to European Law',
    date: new Date(2025, 0, 15), // January 15, 2025
    time: '10:00 AM',
    location: 'Law Faculty, Room 201',
    category: 'class',
    description: 'Weekly lecture on European Union law fundamentals',
    attendees: 45
  },
  {
    id: '2',
    title: 'Midterm Exam - Mathematics',
    date: new Date(2025, 0, 18),
    time: '2:00 PM',
    location: 'Kassai Campus, Hall A',
    category: 'exam',
    description: 'Calculus and Linear Algebra midterm examination'
  },
  {
    id: '3',
    title: 'Student Council Meeting',
    date: new Date(2025, 0, 20),
    time: '6:00 PM',
    location: 'Main Campus, Conference Room',
    category: 'meeting',
    description: 'Monthly student council meeting to discuss campus issues',
    attendees: 12
  },
  {
    id: '4',
    title: 'International Student Welcome Event',
    date: new Date(2025, 0, 22),
    time: '7:00 PM',
    location: 'University Cultural Center',
    category: 'social',
    description: 'Welcome party for new international students',
    attendees: 120
  },
  {
    id: '5',
    title: 'Research Paper Submission',
    date: new Date(2025, 0, 25),
    time: '11:59 PM',
    location: 'Online Submission',
    category: 'deadline',
    description: 'Final deadline for submitting research proposals'
  },
  {
    id: '6',
    title: 'Digital Innovation Seminar',
    date: new Date(2025, 0, 28),
    time: '3:00 PM',
    location: 'Informatics Faculty, Auditorium',
    category: 'seminar',
    description: 'Guest speakers on AI and digital transformation',
    attendees: 80
  }
];

export default function Calendar({ onBack }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [view, setView] = useState<'month' | 'list'>('month');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
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
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= nextWeek;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={16} />
            Add Event
          </button>
        </div>
      </div>

      {/* Main Content */}
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
                                className={`text-xs px-2 py-1 rounded text-white truncate ${eventCategories[event.category].color}`}
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
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg text-white ${eventCategories[event.category].color}`}>
                          {eventCategories[event.category].icon}
                        </div>
                        <div>
                          <h3 className="text-lg text-gray-800">{event.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar1 size={14} />
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
                            {event.attendees && (
                              <span className="flex items-center gap-1">
                                <Users size={14} />
                                {event.attendees}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setShowEventModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setEvents(events.filter(e => e.id !== event.id))}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                    const eventDate = new Date(e.date);
                    return eventDate.getMonth() === currentDate.getMonth() &&
                           eventDate.getFullYear() === currentDate.getFullYear();
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
              <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="text-sm text-blue-700">University Academic Calendar</div>
                <div className="text-xs text-blue-600">View official dates</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                <div className="text-sm text-green-700">Exam Schedules</div>
                <div className="text-xs text-green-600">Check exam dates</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                <div className="text-sm text-purple-700">Course Registration</div>
                <div className="text-xs text-purple-600">Register for courses</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}