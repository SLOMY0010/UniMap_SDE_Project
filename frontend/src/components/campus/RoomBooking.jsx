import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, MapPin, Building2, CheckCircle2 } from 'lucide-react';

export default function RoomBooking({ onBack }) {
  const [formData, setFormData] = useState({
    campus: '',
    building: '',
    room: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    participants: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const campuses = [
    { value: 'main', label: 'Main Campus' },
    { value: 'kassai', label: 'Kassai Campus' },
    { value: 'engineering', label: 'Engineering Campus' },
  ];

  const buildings = {
    main: ['Main Building', 'Library Building', 'Student Center'],
    kassai: ['Faculty of Informatics', 'Science Building', 'Research Center'],
    engineering: ['Engineering Building A', 'Engineering Building B', 'Laboratory Complex'],
  };

  const rooms = {
    'Main Building': ['MB-101', 'MB-102', 'MB-201', 'MB-202'],
    'Library Building': ['LB-101', 'LB-102', 'LB-Study-Room-1'],
    'Student Center': ['SC-Hall-A', 'SC-Hall-B', 'SC-Meeting-Room'],
    'Faculty of Informatics': ['IF-101', 'IF-102', 'IF-201', 'IF-202'],
    'Science Building': ['SB-101', 'SB-102', 'SB-Lab-1'],
    'Research Center': ['RC-Conference-A', 'RC-Conference-B', 'RC-Meeting-1'],
    'Engineering Building A': ['ENG-A-101', 'ENG-A-102', 'ENG-A-201'],
    'Engineering Building B': ['ENG-B-101', 'ENG-B-102', 'ENG-B-Lab'],
    'Laboratory Complex': ['LAB-1', 'LAB-2', 'LAB-Workshop'],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Reset dependent fields
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
                {campuses.map((campus) => (
                  <option key={campus.value} value={campus.value}>
                    {campus.label}
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
                {formData.campus &&
                  buildings[formData.campus]?.map((building) => (
                    <option key={building} value={building}>
                      {building}
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
                {formData.building &&
                  rooms[formData.building]?.map((room) => (
                    <option key={room} value={room}>
                      {room}
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
              Number of Participants *
            </label>
            <input
              type="number"
              required
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
