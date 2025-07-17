import React from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Switch,
  Button,
  HStack,
} from '@chakra-ui/react';

const CalendarEventForm = ({ event, onSubmit, onDelete, isReadOnly = false }) => {
  const [formData, setFormData] = React.useState(event || {
    title: '',
    description: '',
    type: 'meeting',
    start: '',
    end: '',
    isAllDay: false,
    participants: [],
    location: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <VStack as="form" spacing={4} onSubmit={handleSubmit}>
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Event title"
          isReadOnly={isReadOnly}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Event description"
          isReadOnly={isReadOnly}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Event Type</FormLabel>
        <Select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          isReadOnly={isReadOnly}
        >
          <option value="meeting">Meeting</option>
          <option value="deadline">Deadline</option>
          <option value="team">Team Event</option>
          <option value="personal">Personal</option>
        </Select>
      </FormControl>

      <HStack width="full">
        <FormControl flex={1}>
          <FormLabel>Start</FormLabel>
          <Input
            type="datetime-local"
            value={formData.start}
            onChange={(e) => setFormData({ ...formData, start: e.target.value })}
            isReadOnly={isReadOnly}
          />
        </FormControl>
        <FormControl flex={1}>
          <FormLabel>End</FormLabel>
          <Input
            type="datetime-local"
            value={formData.end}
            onChange={(e) => setFormData({ ...formData, end: e.target.value })}
            isReadOnly={isReadOnly}
          />
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel>Location</FormLabel>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Event location"
          isReadOnly={isReadOnly}
        />
      </FormControl>

      <HStack width="full" justify="space-between">
        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">All Day</FormLabel>
          <Switch
            isChecked={formData.isAllDay}
            onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
            isReadOnly={isReadOnly}
          />
        </FormControl>
      </HStack>

      {!isReadOnly && (
        <HStack width="full" spacing={4}>
          <Button type="submit" colorScheme="blue" flex={1}>
            {event ? 'Update Event' : 'Create Event'}
          </Button>
          {event && (
            <Button colorScheme="red" onClick={() => onDelete(event.id)}>
              Delete
            </Button>
          )}
        </HStack>
      )}
    </VStack>
  );
};

export default CalendarEventForm;
