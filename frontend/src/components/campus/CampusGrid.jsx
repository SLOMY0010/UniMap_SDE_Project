import { motion } from 'motion/react';
import CampusCard from './CampusCard';
import { CAMPUSES } from '../../constants/mockData';

export default function CampusGrid({ onCampusClick }) {
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
        {CAMPUSES.map((campus, index) => (
          <CampusCard
            key={campus.name}
            campus={campus}
            index={index}
            onClick={() => onCampusClick?.(campus.displayName)}
          />
        ))}
      </motion.div>
    </>
  );
}
