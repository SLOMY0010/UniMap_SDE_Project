import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function CampusCard({ campus, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
        <div className="h-48 overflow-hidden bg-muted">
          <ImageWithFallback
            src={campus.image}
            alt={campus.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-foreground text-lg mb-2 group-hover:text-primary transition-colors duration-200">
            {campus.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {campus.address}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
