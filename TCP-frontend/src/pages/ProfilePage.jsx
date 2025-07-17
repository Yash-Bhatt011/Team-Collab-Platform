import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Divider,
  useColorModeValue,
  Badge,
  SimpleGrid,
  IconButton,
  Flex,
  Spacer,
  Spinner,
} from '@chakra-ui/react';
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar, FiStar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../services/api/profileApi';

const ProfilePage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    phoneNumber: '',
    address: '',
    bio: '',
    skills: [],
    joinDate: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.success) {
        setFormData(response.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch profile data. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(formData);
      if (response.success) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isLoading) {
    return (
      <Box pt="80px" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.lg" py={8}>
          <Flex justify="center" align="center" minH="400px">
            <Spinner size="xl" />
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box pt="80px" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            border="1px solid"
            borderColor={borderColor}
          >
            <Flex align="center">
              <Avatar
                size="2xl"
                name={formData.name}
                src={`https://i.pravatar.cc/300?u=${formData.email}`}
              />
              <Box ml={6}>
                <Heading size="lg">{formData.name}</Heading>
                <Text color="gray.500">{formData.position}</Text>
                <Badge colorScheme="blue" mt={2}>{user?.role}</Badge>
              </Box>
              <Spacer />
              <IconButton
                icon={<FiEdit2 />}
                aria-label="Edit profile"
                onClick={() => setIsEditing(true)}
              />
            </Flex>
          </Box>

          {/* Profile Details */}
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            border="1px solid"
            borderColor={borderColor}
          >
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      isReadOnly
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Position</FormLabel>
                    <Input
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Department</FormLabel>
                    <Input
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Skills (comma-separated)</FormLabel>
                    <Input
                      name="skills"
                      value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
                      }))}
                      placeholder="e.g. JavaScript, React, Node.js"
                    />
                  </FormControl>
                </SimpleGrid>
                <FormControl mt={6}>
                  <FormLabel>Bio</FormLabel>
                  <Input
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    as="textarea"
                    rows={3}
                  />
                </FormControl>
                <HStack mt={6} spacing={4}>
                  <Button type="submit" colorScheme="blue">
                    Save Changes
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </HStack>
              </form>
            ) : (
              <VStack align="stretch" spacing={4}>
                <HStack>
                  <FiMail />
                  <Text>{formData.email}</Text>
                </HStack>
                <HStack>
                  <FiPhone />
                  <Text>{formData.phoneNumber || 'Not specified'}</Text>
                </HStack>
                <HStack>
                  <FiMapPin />
                  <Text>{formData.address || 'Not specified'}</Text>
                </HStack>
                <HStack>
                  <FiCalendar />
                  <Text>Joined {new Date(formData.joinDate).toLocaleDateString()}</Text>
                </HStack>
                <Divider />
                <Box>
                  <Heading size="sm" mb={2}>Skills</Heading>
                  <HStack wrap="wrap" spacing={2}>
                    {(formData.skills || []).map((skill, index) => (
                      <Badge key={index} colorScheme="green">
                        {skill}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
                <Box>
                  <Heading size="sm" mb={2}>Bio</Heading>
                  <Text color="gray.600">{formData.bio || 'No bio provided'}</Text>
                </Box>
              </VStack>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default ProfilePage; 