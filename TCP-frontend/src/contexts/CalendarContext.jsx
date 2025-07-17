import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CalendarService } from '../services/CalendarService';
import { mockCalendarEvents } from '../utils/mockData';
import { useToast } from '@chakra-ui/react';

const CalendarContext = createContext(null);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState(mockCalendarEvents);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const data = await CalendarService.getHolidays();
      setHolidays(data);
    } catch (error) {
      console.error('Error loading holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = (event) => {
    setEvents([...events, { id: Date.now(), ...event }]);
  };

  const updateEvent = (id, updatedEvent) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ));
  };

  const deleteEvent = useCallback((eventId) => {
    setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
    toast({
      title: 'Event Deleted',
      status: 'success',
      duration: 2000,
    });
  }, []);

  const value = {
    events,
    holidays,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    fetchHolidays
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext;
