import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Ticket, 
  BarChart2, 
  Users, 
  Settings, 
  FileText, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { authService } from '../../services/authService';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 size={20} /> },
  { name: 'Tickets', path: '/tickets', icon: <Ticket size={20} /> },
  { name: 'Knowledge Base', path: '/knowledge', icon: <FileText size={20} /> },
  { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
  { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  { name: 'Help', path: '/help', icon: <HelpCircle size={20} /> },
];

export const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.photoURL ?? undefined);

  useEffect(() => {
    setAvatarUrl(currentUser?.photoURL ?? undefined);
  }, [currentUser?.photoURL]);

  // Use the private method via bracket notation
  const handleAvatarError = async () => {
    if (currentUser?.uid) {
      try {
        // @ts-ignore
        const photoUrl = await authService['getPhotoUrlByFirebaseUid'](currentUser.uid);
        setAvatarUrl(photoUrl ?? undefined);
      } catch (error) {
        setAvatarUrl(undefined);
      }
    }
  };

  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-20 m-4">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
        <div className="flex items-center justify-center h-16 flex-shrink-0 px-6">
          <h1 className="text-xl font-bold text-indigo-600">HelpDesk</h1>
        </div>
        
        <div className="mt-6 flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${location.pathname.startsWith(item.path) 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <span className={`
                  mr-3 flex-shrink-0 
                  ${location.pathname.startsWith(item.path) 
                    ? 'text-indigo-600' 
                    : 'text-gray-500 group-hover:text-gray-600'}
                `}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {currentUser && (
          <div className="flex items-center px-4 py-3 border-t border-gray-200">
            <div className="flex-shrink-0">
              <Avatar src={currentUser.photoURL ?? undefined} name={currentUser.displayName ?? currentUser.email ?? 'User'} size="sm" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">{currentUser.displayName ?? currentUser.email}</div>
              <div className="text-xs text-gray-500 truncate">{currentUser.email}</div>
            </div>
            <button
              onClick={logout}
              className="ml-auto text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}>
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
              <h1 className="text-xl font-bold text-indigo-600">HelpDesk</h1>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-500 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="mt-5 px-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    group flex items-center px-3 py-2 text-base font-medium rounded-md transition-all duration-200
                    ${location.pathname.startsWith(item.path) 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                  onClick={toggleMobileMenu}
                >
                  <span className={`
                    mr-3 flex-shrink-0 
                    ${location.pathname.startsWith(item.path) 
                      ? 'text-indigo-600' 
                      : 'text-gray-500 group-hover:text-gray-600'}
                  `}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {currentUser && (
              <div className="absolute bottom-0 w-full flex items-center px-4 py-3 border-t border-gray-200">
                <div className="flex-shrink-0">
                  <Avatar src={avatarUrl} name={currentUser.displayName ?? currentUser.email ?? 'User'} size="sm" onError={handleAvatarError} />
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{currentUser.displayName ?? currentUser.email}</div>
                  <div className="text-xs text-gray-500 truncate">{currentUser.email}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="ml-auto text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};


