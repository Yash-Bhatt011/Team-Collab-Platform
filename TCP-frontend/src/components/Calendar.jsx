import React, { useState } from 'react';
import {
  Box,
  Grid,
  Text,
  VStack,
  HStack,
  IconButton,
  Button,
  useColorModeValue,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  FormControl,
  FormLabel,
  Select,
  Tooltip,
  Spinner,
  useDisclosure
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import CalendarEventForm from './CalendarEventForm';
import { useCalendar } from '../contexts/CalendarContext';
import { useAuth } from '../contexts/AuthContext';
import { mockCulturalHolidays } from '../utils/mockData';
import Popup from './ui/Popup';

const EVENT_CATEGORIES = {
  meeting: { color: 'blue', icon: '🤝', label: 'Meeting' },
  deadline: { color: 'red', icon: '⏰', label: 'Deadline' },
  personal: { color: 'green', icon: '👤', label: 'Personal' },
  team: { color: 'purple', icon: '👥', label: 'Team' }
};

const Calendar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month');
  const { events, holidays, loading, addEvent, updateEvent, deleteEvent } = useCalendar();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Use Chakra UI's useDisclosure hook for modal state management
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    onOpen();
  };

  const handleAddEventClick = () => {
    setSelectedEvent(null);
    onOpen();
  };

  const handleEventSubmit = (eventData) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    onClose();
    setSelectedEvent(null);
  };

  const getEventCategoryStyle = (type) => {
    const category = EVENT_CATEGORIES[type] || EVENT_CATEGORIES.personal;
    return {
      bg: `${category.color}.100`,
      color: `${category.color}.700`,
      borderColor: `${category.color}.300`
    };
  };

  const getHolidaysForDate = (date) => {
    const combinedHolidays = [...(holidays || []), ...mockCulturalHolidays];
    return combinedHolidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate.getDate() === date &&
             holidayDate.getMonth() === currentDate.getMonth() &&
             holidayDate.getFullYear() === currentDate.getFullYear();
    });
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
          variant="ghost"
        />
        <VStack>
          <Text fontSize="xl" fontWeight="bold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <Tabs variant="soft-rounded" size="sm" onChange={(index) => setView(['month', 'week', 'day'][index])}>
            <TabList>
              <Tab>Month</Tab>
              <Tab>Week</Tab>
              <Tab>Day</Tab>
            </TabList>
          </Tabs>
        </VStack>
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
          variant="ghost"
        />
      </HStack>

      <Grid templateColumns="repeat(7, 1fr)" gap={{ base: 1, md: 2 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text
            key={day}
            textAlign="center"
            fontSize={{ base: 'xs', md: 'sm' }}
            fontWeight="bold"
            color="gray.500"
          >
            {day}
          </Text>
        ))}

        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, index) => {
          const date = index + 1;
          const eventsForDate = events.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.getDate() === date &&
                   eventDate.getMonth() === currentDate.getMonth() &&
                   eventDate.getFullYear() === currentDate.getFullYear();
          });
          const holidaysForDate = getHolidaysForDate(date);

          return (
            <Box
              key={date}
              p={{ base: 1, md: 2 }}
              cursor="pointer"
              onClick={() => setSelectedDate(date)}
              borderWidth={selectedDate === date ? "2px" : "1px"}
              borderColor={selectedDate === date ? "blue.400" : useColorModeValue('gray.200', 'whiteAlpha.200')}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{ bg: useColorModeValue('gray.100', 'whiteAlpha.200') }}
              bg={useColorModeValue('white', 'whiteAlpha.100')}
              backdropFilter="blur(10px)"
              position="relative"
            >
              <VStack align="stretch" spacing={{ base: 0.5, md: 1 }}>
                <Text textAlign="center" fontSize={{ base: 'sm', md: 'md' }}>{date}</Text>
                {holidaysForDate.map((holiday) => (
                  <Tooltip key={holiday.id} label={`${holiday.name} - ${holiday.description}`}>
                    <Badge
                      colorScheme={holiday.color.split('.')[0]}
                      fontSize={{ base: '2xs', md: 'xs' }}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Text>{holiday.icon}</Text>
                      <Text noOfLines={1}>{holiday.name}</Text>
                    </Badge>
                  </Tooltip>
                ))}
                {eventsForDate.map((event, i) => (
                  <Badge
                    key={i}
                    colorScheme={EVENT_CATEGORIES[event.type]?.color || 'gray'}
                    fontSize={{ base: '2xs', md: 'xs' }}
                    noOfLines={1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    {event.title}
                  </Badge>
                ))}
              </VStack>
            </Box>
          );
        })}
      </Grid>

      {/* Only show Add Event button for admins */}
      {isAdmin && (
        <Button
          position="fixed"
          bottom={4}
          right={4}
          leftIcon={<AddIcon />}
          onClick={() => {
            setSelectedEvent(null);
            setModalIsOpen(true);
          }}
          bg="blue.400"
          color="white"
          shadow="lg"
          _hover={{
            bg: 'blue.500',
            transform: 'translateY(-2px)',
            shadow: 'xl',
          }}
          _active={{
            bg: 'blue.600',
            transform: 'translateY(0)',
          }}
          zIndex={2}
        >
          Add Event
        </Button>
      )}

      {/* Disable event editing for non-admins */}
      <Popup
        isOpen={isOpen}
        onClose={onClose}
        title={selectedEvent ? (isAdmin ? 'Edit Event' : 'Event Details') : 'Add Event'}
      >
        <CalendarEventForm
          event={selectedEvent}
          onSubmit={handleEventSubmit}
          onDelete={deleteEvent}
          isReadOnly={!isAdmin}
          culturalHolidays={mockCulturalHolidays}
        />
      </Popup>
    </Box>
  );
};

export default Calendar;
