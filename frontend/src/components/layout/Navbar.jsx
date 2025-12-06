import { LogIn, LogOut, User, BookOpen } from 'lucide-react';
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

  return (
    <div className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium text-foreground">
          {getPageTitle()}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-8 w-8" style={{ backgroundColor: '#3361AC' }}>
                  <AvatarFallback className="text-white">
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
                <BookOpen className="mr-2 h-4 w-4" />
                <span>My Classes</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
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
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
        )}
      </div>
    </div>
  );
}