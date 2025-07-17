import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUser, FiSettings, FiClock, FiCalendar, FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  const navItems = [
    {
      name: 'Home',
      icon: FiHome,
      path: '/',
      role: 'user'
    },
    {
      name: 'Profile',
      icon: FiUser,
      path: '/profile',
      role: 'user'
    },
    {
      name: 'Settings',
      icon: FiSettings,
      path: '/settings',
      role: 'user'
    },
    {
      name: 'Attendance',
      icon: FiClock,
      path: '/attendance',
      role: 'user'
    },
    {
      name: 'Leave Requests',
      icon: FiCalendar,
      path: '/leave-request',
      role: 'user'
    },
    {
      name: 'Attendance Management',
      icon: FiUsers,
      path: '/admin/attendance',
      role: 'admin'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Team Collab</h2>
      </div>
      <div className="sidebar-content">
        <ul>
          {navItems.map(item => (
            <li key={item.name}>
              <NavLink to={item.path} activeClassName="active">
                <item.icon />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;