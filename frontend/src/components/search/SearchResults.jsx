import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Building2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function SearchResults({ result }) {
  if (!result) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="search-result"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Class Information Header */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl text-foreground mb-4">{result.className}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" size={20} />
              <div>
                <p className="text-muted-foreground text-sm">Campus</p>
                <p className="text-foreground">{result.campus}</p>
                <p className="text-muted-foreground text-sm">{result.campusAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="text-primary mt-1" size={20} />
              <div>
                <p className="text-muted-foreground text-sm">Building & Room</p>
                <p className="text-foreground">{result.building}</p>
                <p className="text-muted-foreground text-sm">
                  Room: {result.room} ({result.floor})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Maps Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
          >
            <div className="bg-primary text-primary-foreground px-4 py-3">
              <h4>Building Location</h4>
            </div>
            <div className="h-80 bg-muted">
              <iframe
                src={result.googleMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Building location on Google Maps"
              />
            </div>
          </motion.div>

          {/* Floor Plan with Pin */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
          >
            <div className="bg-primary text-primary-foreground px-4 py-3">
              <h4>Floor Plan - {result.floor}</h4>
            </div>
            <div className="h-80 bg-muted relative overflow-hidden">
              <ImageWithFallback
                src={result.floorPlanImage}
                alt="Floor plan"
                className="w-full h-full object-cover"
              />
              {/* Room Marker Pin */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="absolute"
                style={{
                  left: `${result.pinPosition.x}%`,
                  top: `${result.pinPosition.y}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <div className="relative">
                  {/* Pulsing circle animation */}
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 bg-red-500 rounded-full"
                    style={{
                      width: '40px',
                      height: '40px',
                      left: '-20px',
                      top: '-20px',
                    }}
                  />
                  {/* Pin icon */}
                  <MapPin
                    size={40}
                    className="text-red-600 drop-shadow-lg relative z-10"
                    fill="#dc2626"
                  />
                  {/* Room label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg whitespace-nowrap"
                  >
                    <span className="text-xs font-medium text-gray-900">
                      {result.room}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-accent/10 border border-accent/20 rounded-lg p-4"
        >
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This is a mock demonstration. In production, this search will
            connect to your backend API to fetch real-time classroom information, building
            locations, and floor plans.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
