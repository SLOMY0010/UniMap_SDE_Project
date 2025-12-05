import { motion, AnimatePresence } from 'motion/react';
import { Menu, BookOpen, Calendar, DoorOpen, HelpCircle, Mail } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import logoImage from 'figma:asset/3377312f0bb7ddd1aa5296a07ac4c8b8453a8ede.png';

export default function Sidebar({ currentPage, setCurrentPage, collapsed, setCollapsed }) {
  const navItems = [
    { id: 'campus', label: 'All Campuses', icon: BookOpen },
    { id: 'calendar', label: 'My Classes', icon: Calendar },
    { id: 'room-booking', label: 'Room Booking', icon: DoorOpen },
  ];

  const bottomItems = [
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ];

  return (
    <motion.div
      className="bg-sidebar border-r border-sidebar-border flex flex-col"
      initial={false}
      animate={{
        width: collapsed ? '80px' : '256px',
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border bg-primary">
        <div className="flex items-center gap-3">
          <motion.button
            className="text-primary-foreground hover:bg-white/10 p-1 rounded transition-colors"
            onClick={() => setCollapsed(!collapsed)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} />
          </motion.button>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="cursor-pointer hover:opacity-80 transition-opacity flex items-center"
                onClick={() => setCurrentPage('campus')}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ImageWithFallback
                  src={logoImage}
                  alt="UniMap Logo"
                  className="h-8 w-auto"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2 rounded-lg cursor-pointer transition-colors ${
                  currentPage === item.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
                onClick={() => setCurrentPage(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={18} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-lg cursor-pointer transition-colors`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={18} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
