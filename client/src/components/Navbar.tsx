import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut, Home, Upload, Gavel } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/portals');
  };

  if (!isAuthenticated) {
    return null;
  }

  const getNavItems = () => {
    switch (user?.role) {
      case 'judge':
        return [
          { label: 'Dashboard', path: '/judge', icon: Home },
          { label: 'Score Projects', path: '/judge/score', icon: Gavel },
        ];
      case 'participant':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: Home },
          { label: 'Submit Project', path: '/submit', icon: Upload },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-semibold text-purple-600">InnovateHer 2026</h1>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="font-medium text-gray-900">{user?.name}</div>
              <div className="text-gray-500 capitalize">{user?.role}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
