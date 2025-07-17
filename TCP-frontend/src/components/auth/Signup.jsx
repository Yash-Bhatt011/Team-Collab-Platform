import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useColorModeValue,
  Container,
  Heading,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  useToast,
  Select,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon, InfoIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    position: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const positions = [
    'Software Developer',
    'Project Manager',
    'UI/UX Designer',
    'QA Engineer',
    'DevOps Engineer',
    'Business Analyst',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form data
    if (!formData.username || !formData.email || !formData.password || !formData.position) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        status: 'error',
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending signup request:', {
        name: formData.username,
        email: formData.email,
        position: formData.position
      });

      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
          position: formData.position
        }),
      });

      const data = await response.json();
      console.log('Signup response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Call login from AuthContext to update auth state and store token
      await login({ token: data.token, ...data.user });

      toast({
        title: 'Account created and logged in.',
        description: data.message,
        status: 'success',
        duration: 5000,
      });

      // Redirect to dashboard or home page after login
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue(
        'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
        'linear-gradient(45deg, #434343 0%, #000000 100%)'
      )}
      position="relative"
      overflow="hidden"
    >
      {/* Animated Background Shapes */}
      <Box position="absolute" w="full" h="full">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 2, 1],
              rotate: [0, 180, 360],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              delay: i * 2,
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: useColorModeValue(
                'rgba(255, 255, 255, 0.1)',
                'rgba(255, 255, 255, 0.05)'
              ),
              filter: 'blur(40px)',
            }}
          />
        ))}
      </Box>

      <Container maxW="lg" py={{ base: '12', md: '24' }} position="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            bg={useColorModeValue('whiteAlpha.900', 'rgba(26, 32, 44, 0.8)')}
            p={8}
            borderRadius="2xl"
            boxShadow="xl"
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
          >
            <VStack spacing={6}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Heading 
                  bgGradient="linear(to-r, #7928CA, #FF0080)"
                  bgClip="text"
                  fontSize="4xl"
                  mb={6}
                >
                  Create Account
                </Heading>
              </motion.div>

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <InfoIcon color="gray.500" />
                      </InputLeftElement>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        variant="filled"
                        placeholder="Enter your username"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <EmailIcon color="gray.500" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        variant="filled"
                        placeholder="Enter your email"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <LockIcon color="gray.500" />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        variant="filled"
                        placeholder="Enter your password"
                      />
                      <InputRightElement>
                        <IconButton
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Position</FormLabel>
                    <Select
                      placeholder="Select position"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      variant="filled"
                    >
                      {positions.map((pos) => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    w="full"
                    size="lg"
                    bgGradient="linear(to-r, #7928CA, #FF0080)"
                    color="white"
                    _hover={{
                      bgGradient: 'linear(to-r, #FF0080, #7928CA)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl',
                    }}
                    _active={{
                      transform: 'translateY(0)',
                    }}
                    isLoading={isLoading}
                  >
                    Sign Up
                  </Button>
                </VStack>
              </form>

              <Text fontSize="sm" color="gray.500">
                Already have an account?{' '}
                <Button
                  variant="link"
                  color={useColorModeValue('blue.500', 'blue.300')}
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
              </Text>
            </VStack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Signup;
