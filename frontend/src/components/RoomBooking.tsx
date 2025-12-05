import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import api from '@/utils/api'; // Import the API utility

interface Campus {
  id: number;
  name: string;
  address: string;
}

interface Building {
  id: number;
  name: string;
  campus: number; // campus ID
}

interface Room {
  id: number;
  name: string;
  building: number; // building ID
}


export default function RoomBooking({ onBack }) {
  const [formData, setFormData] = useState({
    campus: '',
    building: '',
    room: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    participants: '', // This will not be sent to backend, as there is no field for it.
  });

  const [availableCampuses, setAvailableCampuses] = useState<Campus[]>([]);
  const [allBuildings, setAllBuildings] = useState<Building[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const campusesResponse = await api.get<Campus[]>('/uni/campuses/');
        setAvailableCampuses(campusesResponse.data);

        const buildingsResponse = await api.get<Building[]>('/uni/buildings/');
        setAllBuildings(buildingsResponse.data);

        // Fetch all rooms initially, will filter based on selected building
        const roomsResponse = await api.get<Room[]>('/uni/rooms/');
        setAvailableRooms(roomsResponse.data);

      } catch (err) {
        setError('Failed to fetch campus, building, or room data.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { campus, building, room, date, startTime, endTime, purpose } = formData;

    if (!campus || !building || !room || !date || !startTime || !endTime || !purpose) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      // The API expects room ID, not room name
      const selectedRoomObj = availableRooms.find(r => String(r.id) === room);
      if (!selectedRoomObj) {
        setError('Invalid room selected.');
        return;
      }

      await api.post('/booking/mybookings/', {
        room: selectedRoomObj.id, // Send room ID
        date,
        start_time: startTime,
        end_time: endTime,
        purpose,
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          campus: '',
          building: '',
          room: '',
          date: '',
          startTime: '',
          endTime: '',
          purpose: '',
          participants: '',
        });
      }, 3000);

    } catch (err: any) {
      console.error('Booking failed:', err);
      // More detailed error handling based on API response structure
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Booking failed. Please check your input.');
      } else {
        setError('Booking failed. Please try again later.');
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset dependent fields when parent selection changes
      if (field === 'campus') {
        newData.building = '';
        newData.room = '';
      }
      if (field === 'building') {
        newData.room = '';
      }
      return newData;
    });
  };

  const filteredBuildings = formData.campus
    ? allBuildings.filter(b => String(b.campus) === formData.campus)
    : [];

  const filteredRooms = formData.building
    ? availableRooms.filter(r => String(r.building) === formData.building)
    : [];


  if (loading) {
    return <div className="text-center py-8">Loading booking form...</div>;
  }

  if (error && !submitted) { // Display error unless submission was successful
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl text-foreground mb-2">Booking Request Submitted!</h2>
          <p className="text-muted-foreground">
            Your room booking request has been sent for approval.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className="text-2xl text-foreground mb-2">Room Booking Request</h1>
        <p className="text-muted-foreground">
          Request to book a room for your event, meeting, or study session.
        </p>
      </div>

      {error && ( // Display submission errors here
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <MapPin size={16} /> {/* Placeholder icon */}
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Booking Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-lg border border-border p-6 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-foreground mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Campus *
              </label>
              <select
                required
                value={formData.campus}
                onChange={(e) => handleChange('campus', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Campus</option>
                {availableCampuses.map((campus) => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">
                <Building2 className="inline w-4 h-4 mr-1" />
                Building *
              </label>
              <select
                required
                value={formData.building}
                onChange={(e) => handleChange('building', e.target.value)}
                disabled={!formData.campus}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Building</option>
                {filteredBuildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">
                Room/Hall *
              </label>
              <select
                required
                value={formData.room}
                onChange={(e) => handleChange('room', e.target.value)}
                disabled={!formData.building}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Room</option>
                {filteredRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-foreground mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                End Time *
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm text-foreground mb-2">
              Number of Participants
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={formData.participants}
              onChange={(e) => handleChange('participants', e.target.value)}
              placeholder="e.g., 20"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground mb-2">
              Purpose of Booking *
            </label>
            <textarea
              required
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              placeholder="Please describe the purpose of your room booking..."
              rows={4}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="bg-accent/20 border border-accent/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> All room booking requests are subject to approval.
              You will receive a confirmation email within 24-48 hours. For urgent requests, please contact the facilities management office.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Submit Booking Request
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
