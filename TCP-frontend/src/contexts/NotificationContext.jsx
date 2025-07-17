import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockNotifications, mockAnnouncements } from '../utils/mockData';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addAnnouncement = useCallback((announcement) => {
    setAnnouncements(prev => [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...announcement
    }, ...prev]);

    // Create notification for the announcement
    addNotification({
      type: 'announcement',
      title: 'New Announcement',
      message: announcement.title,
      priority: announcement.priority,
      link: `/announcements/${Date.now()}`
    });
  }, []);

  const markAnnouncementAsRead = useCallback((id) => {
    setAnnouncements(prev =>
      prev.map(a => a.id === id ? { ...a, read: true } : a)
    );
  }, []);

  // Add reaction to announcement
  const addReaction = useCallback((announcementId, reaction) => {
    setAnnouncements(prev =>
      prev.map(a => {
        if (a.id === announcementId) {
          const reactions = { ...a.reactions };
          reactions[reaction] = (reactions[reaction] || 0) + 1;
          return { ...a, reactions };
        }
        return a;
      })
    );
  }, []);

  const value = {
    notifications,
    announcements,
    unreadCount: notifications.filter(n => !n.read).length,
    addNotification,
    markAsRead,
    clearNotification,
    addAnnouncement,
    markAnnouncementAsRead,
    addReaction,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
