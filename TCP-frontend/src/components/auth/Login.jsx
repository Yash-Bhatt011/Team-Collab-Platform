import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack, // Add this import
  Text,
  Flex,
  Heading,
  useColorModeValue,
  IconButton,
  InputGroup,
  InputRightElement,
  Select,
  useToast,
  Icon,
  FormErrorMessage,
  Checkbox,
  Link,
  Divider,
  Collapse,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Popup from '../ui/Popup'

const Login = () => {
  const [role, setRole] = useState(localStorage.getItem('rememberedRole') || '')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [loginAttempts, setLoginAttempts] = useState(0)
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const formBackground = useColorModeValue('whiteAlpha.900', 'whiteAlpha.100')
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.100')

  useEffect(() => {
    // Check for remembered credentials
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginAttempts >= 3) {
      toast({
        title: 'Too many attempts',
        description: 'Please try again later or reset your password',
        status: 'error',
        duration: 5000,
      })
      return;
    }

    if (!email.trim() || !password.trim() || !role.trim()) {
      setErrors({
        email: !email.trim() ? 'Email is required' : '',
        password: !password.trim() ? 'Password is required' : '',
        role: !role.trim() ? 'Role is required' : '',
      })

      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('Sending login request:', { email, role }); // Add logging

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          role: role.trim(),
        }),
      });

      const data = await response.json();
      console.log('Server response:', data); // Add logging

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (!data.token) {
        throw new Error('No token received');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      await login(data.user)

      toast({
        title: 'Success',
        description: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email)
        localStorage.setItem('rememberedRole', role)
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberedRole')
      }

      // Navigate based on role
      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/employee')
      }

      // Reset login attempts on success
      setLoginAttempts(0)
    } catch (error) {
      setLoginAttempts((prev) => prev + 1)
      toast({
        title: 'Error',
        description: error.message || 'Invalid credentials',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setErrors({
        email: '',
        password: 'Invalid email or password',
        role: '',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    toast({
      title: 'Info',
      description: `${provider} login is not implemented yet`,
      status: 'info',
      duration: 3000,
    })
  }

  const handleForgotPassword = async (email) => {
    try {
      // Mock password reset
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: 'Reset Link Sent',
        description: 'Check your email for password reset instructions',
        status: 'success',
        duration: 3000,
      })
      setIsResetModalOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reset link',
        status: 'error',
        duration: 3000,
      })
    }
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      position="relative"
      overflow="hidden"
    >
      {/* Animated background elements */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          as={motion.div}
          position="absolute"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: i * 2,
          }}
          w={["100px", "200px"]}
          h={["100px", "200px"]}
          bg="whiteAlpha.100"
          borderRadius="full"
          filter="blur(30px)"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          p={8}
          width="400px"
          borderRadius="2xl"
          bg={formBackground}
          backdropFilter="blur(10px)"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="2xl"
          position="relative"
          zIndex={1}
        >
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Heading
                bgGradient="linear(to-r, #00c6fb, #005bea)"
                bgClip="text"
                fontSize="4xl"
                mb={6}
              >
                Welcome Back
              </Heading>
            </motion.div>

            <FormControl isInvalid={errors.role} isRequired>
              <FormLabel>Role</FormLabel>
              <Select
                placeholder="Select role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                variant="filled"
                bg="whiteAlpha.100"
                borderWidth="1px"
                borderColor="whiteAlpha.200"
                _hover={{ bg: "whiteAlpha.200" }}
                _focus={{ bg: "whiteAlpha.300", borderColor: "blue.400" }}
              >
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </Select>
              <FormErrorMessage>{errors.role}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password} isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="filled"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  size="lg"
                  bg="whiteAlpha.100"
                  borderWidth="1px"
                  borderColor="whiteAlpha.200"
                  _hover={{ bg: "whiteAlpha.200" }}
                  _focus={{ bg: "whiteAlpha.300", borderColor: "blue.400" }}
                />
                <InputRightElement h="full">
                  <IconButton
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            {/* Add Remember Me checkbox */}
            <HStack justify="space-between" w="full">
              <Checkbox
                isChecked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              >
                Remember me
              </Checkbox>
              <Link
                color="blue.400"
                onClick={() => setIsResetModalOpen(true)}
                fontSize="sm"
              >
                Forgot Password?
              </Link>
            </HStack>

            {/* Show warning after 2 failed attempts */}
            <Collapse in={loginAttempts >= 2}>
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                {`${3 - loginAttempts} login ${
                  loginAttempts === 2 ? 'attempt' : 'attempts'
                } remaining`}
              </Alert>
            </Collapse>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              mt={4}
              isLoading={isLoading}
            >
              Login
            </Button>

            <Text>Or continue with</Text>

            <Flex gap={4}>
              <IconButton
                as={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                icon={<FaGoogle />}
                rounded="full"
                size="lg"
                colorScheme="red"
                onClick={() => handleSocialLogin('Google')}
              />
              <IconButton
                as={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                icon={<FaGithub />}
                rounded="full"
                size="lg"
                colorScheme="gray"
                onClick={() => handleSocialLogin('GitHub')}
              />
            </Flex>

            <Divider />
            <Text>
              Don't have an account?{' '}
              <Link
                color="blue.400"
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Link>
            </Text>
          </VStack>
        </Box>
      </motion.div>

      {/* Password Reset Modal */}
      <Popup
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Password"
      >
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>
          <Button
            colorScheme="blue"
            onClick={() => handleForgotPassword(resetEmail)}
            width="full"
          >
            Send Reset Link
          </Button>
        </VStack>
      </Popup>
    </Flex>
  )
}

export default Login