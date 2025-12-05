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
import { useAuth } from '../AuthContext'; // Import useAuth

export default function Navbar({ currentPage, selectedBuilding, setCurrentPage }) {
  const { user, logout } = useAuth(); // Use useAuth hook

  const getPageTitle = () => {
    switch (currentPage) {
      case 'campus':
        return 'All Campuses';
      case 'calendar':
        return 'My Classes';
      case 'room-booking':
        return 'Room Booking';
      case 'main-campus':
        return 'Main Campus';
      case 'kassai-campus':
        return 'Kassai Campus';
      case 'engineering-campus':
        return 'Engineering Campus';
      case 'building-map':
        return `${selectedBuilding} Map`;
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
        <div
          className="flex items-center gap-2 bg-accent px-3 py-1 rounded-full cursor-pointer hover:bg-accent/80 transition-colors"
          onClick={() => setCurrentPage('calendar')}
        >
          <BookOpen size={14} />
          <span className="text-sm">My Classes</span>
          <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
            0
          </div>
        </div>
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
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
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
            onClick={() => setCurrentPage('login')}
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
