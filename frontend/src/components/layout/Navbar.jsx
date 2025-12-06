import { useState, useEffect } from 'react';
import { LogIn, LogOut, User, BookOpen, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    // Check for saved preference or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return saved === 'true';
      }
      // Check system preference
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDark.toString());
    
    // Apply dark class to document root
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const getPageTitle = () => {
    // Extract building name from path if applicable
    const buildingMatch = location.pathname.match(/\/building\/(.+)/);
    if (buildingMatch && buildingMatch[1]) {
      const buildingName = decodeURIComponent(buildingMatch[1]).replace(/-/g, ' ');
      return `${buildingName} Map`;
    }

    // Extract campus name from path if applicable
    const campusMatch = location.pathname.match(/\/campus\/(.+)\/buildings/);
    if (campusMatch && campusMatch[1]) {
      const campusName = decodeURIComponent(campusMatch[1]).replace(/-/g, ' ');
      return `Buildings in ${campusName}`;
    }

    switch (location.pathname) {
      case '/':
        return 'All Campuses';
      case '/calendar':
        return 'My Classes';
      case '/room-booking':
        return 'Room Booking';
      default:
        return 'Campus Navigation';
    }
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

return (
    <div className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium text-foreground">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle - Always visible */}
        <button
          onClick={toggleDarkMode}
          className={`flex items-center ${isDark? 'text-white': 'text-black'} gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors`}
          title="Switch to light mode"
        >
          <Sun size={18} />
          <span className="text-sm font-medium ">{isDark? 'Light-Mode': 'Dark-Mode'}</span>
        </button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8 ring-2 ring-primary dark:ring-primary-foreground">
                  <AvatarFallback className="text-white dark:text-gray-900">
                    {user.username ? user.username.substring(0, 2).toUpperCase() : ''}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.username || user.email}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/calendar')}>
                <BookOpen className="mr-2 h-4 w-4 text-primary dark:text-primary-foreground" />
                <span>My Classes</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
        )}
      </div>
    </div>
  );
}