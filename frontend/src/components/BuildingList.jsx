import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Helper function to slugify text
const slugify = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const BuildingList = () => {
  const { campusName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const campusId = location.state?.campusId; // Get campusId from navigation state

  const [buildings, setBuildings] = useState([]);
  const [displayCampusName, setDisplayCampusName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Convert slug back to readable format for display
    const formattedCampusName = campusName.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    setDisplayCampusName(formattedCampusName);

    const fetchBuildings = async () => {
      if (!campusId) {
        setError('Campus ID not provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/uni/buildings/');
        const allBuildings = response.data;

        // Filter buildings by campusId
        const filteredBuildings = allBuildings.filter(building => building.campus === campusId);

        setBuildings(filteredBuildings.map(building => ({
          name: building.name,
          // Assuming 'image' field exists in backend response for buildings
          image: building.image || 'https://via.placeholder.com/400x200?text=Building+Image',
          id: building.id,
        })));
      } catch (err) {
        console.error('Error fetching buildings:', err);
        setError('Failed to load buildings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [campusName, campusId]); // Re-run effect if campusName or campusId changes

  const handleBuildingClick = (buildingName, buildingId) => {
    const buildingSlug = slugify(buildingName);
    navigate(`/building/${buildingSlug}`, { state: { buildingId: buildingId } });
  };

  if (loading) {
    return <div className="text-center py-8">Loading buildings...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (buildings.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Buildings in {displayCampusName}</h2>
        <p>No buildings found for this campus.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 mt-12">
        <h2 className="text-xl font-semibold text-foreground mb-6 pb-4 border-b border-gray-200">
          Buildings in {displayCampusName}
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {buildings.map((building, index) => (
          <motion.div
            key={building.id} // Use building.id as key for uniqueness
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group cursor-pointer"
            onClick={() => handleBuildingClick(building.name, building.id)}
          >
            <Card className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
              <CardHeader className="p-0">
                <div className="h-48 overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={building.image}
                    alt={building.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-foreground text-lg group-hover:text-primary transition-colors duration-200">
                  {building.name}
                </CardTitle>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default BuildingList;