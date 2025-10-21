import React, { useState } from 'react';
import { Bell, Search, HelpCircle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate, DateFormats } from '../../utils/dateUtils';

export const Header: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 min-w-0">
            <div className="max-w-2xl relative text-gray-400 focus-within:text-gray-500">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                className="block w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search tickets, knowledge base..."
                type="search"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={toggleNotifications}
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-2 px-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                        onClick={() => markAllAsRead()}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-4 px-3 text-sm text-gray-500 text-center">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-3 py-2 hover:bg-gray-50 border-b border-gray-100 ${
                            !notification.read ? 'bg-indigo-50' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.createdAt, DateFormats.TIME_ONLY)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <HelpCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};