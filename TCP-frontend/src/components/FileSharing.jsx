import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Container,
  Heading,
} from '@chakra-ui/react'
import {
  DownloadIcon,
  DeleteIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
} from '@chakra-ui/icons'
import { useAuth } from '../contexts/AuthContext'
import { mockFiles } from '../utils/mockData'
import { motion } from 'framer-motion'
import Popup from './ui/Popup'

const FileSharing = () => {
  const { user } = useAuth()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedFile, setSelectedFile] = useState(null)
  const [files, setFiles] = useState(mockFiles)
  const [fileDescription, setFileDescription] = useState('')

  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 50MB',
          status: 'error',
          duration: 3000,
        })
        return
      }

      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.name.split('.').pop(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: user.email,
        uploadDate: new Date().toISOString().split('T')[0],
        description: fileDescription,
      }
      setFiles([...files, newFile])
      setFileDescription('')
      toast({
        title: 'File Uploaded',
        description: `${file.name} has been uploaded successfully`,
        status: 'success',
        duration: 3000,
      })
    }
  }

  const handleDeleteFile = (fileId) => {
    setFiles(files.filter((file) => file.id !== fileId))
    toast({
      title: 'File Deleted',
      status: 'success',
      duration: 3000,
    })
  }

  const handleDownloadFile = (file) => {
    // In a real app, this would trigger a file download
    toast({
      title: 'Download Started',
      description: `Downloading ${file.name}...`,
      status: 'info',
      duration: 3000,
    })
  }

  const handleViewFile = (file) => {
    setSelectedFile(file)
    onOpen()
  }

  return (
    <Box
      minH="100vh"
      pt="64px"
      bg={useColorModeValue(
        'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(120deg, #2C3E50 0%, #000000 100%)'
      )}
    >
      <Container maxW="container.xl" py={8}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={6}>
            {/* Header */}
            <HStack w="full" justify="space-between">
              <Heading
                bgGradient="linear(to-r, blue.400, teal.400)"
                bgClip="text"
                fontSize="3xl"
              >
                Team Files
              </Heading>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  leftIcon={<AddIcon />}
                  onClick={() => document.getElementById('file-upload').click()}
                  bgGradient="linear(to-r, blue.400, teal.400)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, blue.500, teal.500)",
                  }}
                >
                  Upload File
                </Button>
              </motion.div>
            </HStack>

            {/* File List */}
            <Box
              w="full"
              bg={useColorModeValue('whiteAlpha.800', 'blackAlpha.400')}
              backdropFilter="blur(10px)"
              borderRadius="2xl"
              p={6}
              boxShadow="2xl"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'whiteAlpha.100')}
            >
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>Size</Th>
                    <Th>Uploaded By</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {files.map((file) => (
                    <motion.tr
                      key={file.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: useColorModeValue('gray.50', 'whiteAlpha.50') }}
                    >
                      <Td>{file.name}</Td>
                      <Td>{file.type.toUpperCase()}</Td>
                      <Td>{file.size}</Td>
                      <Td>{file.uploadedBy}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<ViewIcon />}
                            size="sm"
                            onClick={() => handleViewFile(file)}
                          />
                          <IconButton
                            icon={<DownloadIcon />}
                            size="sm"
                            onClick={() => handleDownloadFile(file)}
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDeleteFile(file.id)}
                          />
                        </HStack>
                      </Td>
                    </motion.tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </VStack>
        </motion.div>
      </Container>

      {/* File Preview Modal */}
      <Popup isOpen={isOpen} onClose={onClose} title="File Preview">
        {selectedFile && (
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">{selectedFile.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {selectedFile.size}
              </Text>
            </HStack>
            <Text>Uploaded by: {selectedFile.uploadedBy}</Text>
            <Text>Upload date: {selectedFile.uploadDate}</Text>
            <Text>Description: {selectedFile.description}</Text>
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="blue"
              onClick={() => handleDownloadFile(selectedFile)}
            >
              Download File
            </Button>
          </VStack>
        )}
      </Popup>
    </Box>
  )
}

export default FileSharing