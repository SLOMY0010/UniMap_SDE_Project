import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import CampusCard from './CampusCard';
import api from '../../utils/api'; // Import the API utility

export default function CampusGrid() {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await api.get('/uni/campuses/');
        // Map the fetched data to match the structure expected by CampusCard
        const formattedCampuses = response.data.map(campus => ({
          id: campus.id,
          name: campus.name,
          address: campus.address,
          image: campus.image, // Assuming the API returns a direct URL or path
          displayName: campus.name.replace(' ', '\n'), // Adjust based on actual display need
        }));
        setCampuses(formattedCampuses);
      } catch (err) {
        setError('Failed to fetch campuses.');
        console.error('Error fetching campuses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampuses();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading campuses...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="mb-8 mt-12">
        <div className="border-b-2 border-dotted border-accent pb-4">
          <h2 className="text-accent text-lg">All Campuses</h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {campuses.map((campus, index) => (
          <CampusCard
            key={campus.id} // Use unique ID from backend
            campus={campus}
            index={index}
          />
        ))}
      </motion.div>
    </>
  );
}
