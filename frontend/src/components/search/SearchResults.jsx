import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Building2, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function SearchResults({ result }) {
  const [pinPosition, setPinPosition] = useState(null);
  const floorPlanContainerRef = useRef(null);

  if (!result) return null;

  // Function to get Google Maps embed URL or fallback
  const getGoogleMapsEmbed = (url) => {
    if (!url) return null;

    if (url.includes("maps.app.goo.gl")) return null;
    if (url.includes("google.com/maps")) return url;

    return null;
  };

  // Handle floor plan loading and calculate pin position
  const handleFloorPlanLoad = useCallback(
    (e) => {
      const coords = result?.coordinates;
      if (!coords || coords.x == null || coords.y == null) {
        setPinPosition(null);
        return;
      }

      const img = e.target;
      const container = floorPlanContainerRef.current;
      if (!container) return;

      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      if (!naturalWidth || !naturalHeight || !containerWidth || !containerHeight) {
        return;
      }

      // Image scaling (object-contain logic)
      const scale = Math.min(
        containerWidth / naturalWidth,
        containerHeight / naturalHeight
      );

      const imageDisplayWidth = naturalWidth * scale;
      const imageDisplayHeight = naturalHeight * scale;

      const offsetX = (containerWidth - imageDisplayWidth) / 2;
      const offsetY = (containerHeight - imageDisplayHeight) / 2;

      // Move pin slightly UP to fix "too low" issue on bottom rooms
      const VERTICAL_OFFSET_PX = 10;

      const displayX = coords.x * scale + offsetX;
      const displayY = coords.y * scale + offsetY - VERTICAL_OFFSET_PX;

      const xPercent = (displayX / containerWidth) * 100;
      const yPercent = (displayY / containerHeight) * 100;

      setPinPosition({ x: xPercent, y: yPercent });
    },
    [result]
  );

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
        {/* Class Info */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl text-foreground mb-4">{result.className}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campus */}
            <div className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" size={20} />
              <div>
                <p className="text-muted-foreground text-sm">Campus</p>
                <p className="text-foreground">{result.campus}</p>
                <p className="text-muted-foreground text-sm">
                  {result.campusAddress}
                </p>
              </div>
            </div>

            {/* Building */}
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

        {/* Map + Floor Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Google Map Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
          >
            <div className="bg-primary text-primary-foreground px-4 py-3">
              <h4 className="font-semibold">Building Location</h4>
            </div>

            <div className="h-80 bg-muted">
              {getGoogleMapsEmbed(result.googleMapUrl) ? (
                <iframe
                  src={getGoogleMapsEmbed(result.googleMapUrl)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : result.googleMapUrl ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-green-50">
                  <MapPin size={48} className="text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Location Available
                  </h3>
                  <p className="text-sm text-gray-600">{result.building}</p>
                  <a
                    href={result.googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <ExternalLink size={16} />
                    Open in Google Maps
                  </a>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Map not available</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Floor Plan Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
          >
            <div className="bg-primary text-primary-foreground px-4 py-3">
              <h4 className="font-semibold">Floor Plan - {result.floor}</h4>
            </div>

            <div
              className="h-80 bg-muted relative overflow-hidden"
              ref={floorPlanContainerRef}
            >
              {result.floorPlanImage ? (
                <>
                  <ImageWithFallback
                    src={
                      result.floorPlanImage.startsWith("http")
                        ? result.floorPlanImage
                        : `http://127.0.0.1:8000${result.floorPlanImage}`
                    }
                    alt="Floor plan"
                    className="w-full h-full object-contain"
                    onLoad={handleFloorPlanLoad}
                  />

                  {/* PIN */}
                  {pinPosition && (
                    <div
                      className="absolute"
                      style={{
                        left: `${pinPosition.x}%`,
                        top: `${pinPosition.y}%`,
                        transform: "translate(-50%, -100%)",
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="relative"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-red-500 rounded-full"
                          style={{ width: 40, height: 40, left: -20, top: -20 }}
                        />

                        <MapPin
                          size={40}
                          className="text-red-600 drop-shadow-lg relative z-10"
                          fill="#dc2626"
                        />

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
                      </motion.div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Building2 size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No floor plan available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <p className="text-sm text-gray-700">
            <strong>🔍 Search Results:</strong> Found {result.roomType}
            {result.coordinates && (
              <> with precise coordinates ({result.coordinates.x}, {result.coordinates.y})</>
            )}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
