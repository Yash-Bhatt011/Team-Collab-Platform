import React, { useCallback, useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Progress,
  useColorModeValue,
  Image,
  useDisclosure,
} from '@chakra-ui/react'
import {
  AttachmentIcon,
  DownloadIcon,
  DeleteIcon,
  ViewIcon,
} from '@chakra-ui/icons'
import { useDropzone } from 'react-dropzone'
import Popup from './ui/Popup'

const FileAttachment = ({ attachments = [], onFileUpload }) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedFile, setSelectedFile] = useState(null)

  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const onDrop = useCallback(
    (acceptedFiles) => {
      onFileUpload(acceptedFiles)
    },
    [onFileUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
        '.docx',
      ],
    },
  })

  function handleFileDrop(acceptedFiles) {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          onFileUpload(file)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handlePreview = (file) => {
    setSelectedFile(file)
    onOpen()
  }

  const handleDownload = (file) => {
    // In a real app, this would trigger a file download
    window.open(file.url, '_blank')
  }

  const isImage = (file) => {
    return file.type.startsWith('image/')
  }

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {/* File Drop Area */}
        <Box
          {...getRootProps()}
          p={4}
          bg={bgColor}
          borderRadius="md"
          border="2px dashed"
          borderColor={isDragActive ? 'blue.400' : borderColor}
          textAlign="center"
          cursor="pointer"
          _hover={{ borderColor: 'blue.400' }}
        >
          <input {...getInputProps()} />
          <AttachmentIcon boxSize={6} mb={2} />
          <Text>
            {isDragActive
              ? 'Drop the file here'
              : 'Drag and drop a file here, or click to select'}
          </Text>
        </Box>

        {/* Upload Progress */}
        {uploading && (
          <Box>
            <Text mb={2}>Uploading...</Text>
            <Progress value={uploadProgress} size="sm" colorScheme="blue" />
          </Box>
        )}

        {/* Attached Files */}
        <VStack spacing={2} align="stretch">
          {attachments.map((file, index) => (
            <HStack
              key={index}
              p={2}
              bg={bgColor}
              borderRadius="md"
              border="1px"
              borderColor={borderColor}
              justify="space-between"
            >
              <HStack>
                <AttachmentIcon />
                <Text>{file.name}</Text>
              </HStack>
              <HStack>
                {isImage(file) && (
                  <IconButton
                    icon={<ViewIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePreview(file)}
                  />
                )}
                <IconButton
                  icon={<DownloadIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownload(file)}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => {
                    const newAttachments = attachments.filter(
                      (_, i) => i !== index
                    )
                    onFileUpload(newAttachments)
                  }}
                />
              </HStack>
            </HStack>
          ))}
        </VStack>
      </VStack>

      {/* Image Preview Modal */}
      <Popup isOpen={isOpen} onClose={onClose} title="Image Preview">
        {selectedFile && (
          <Image
            src={selectedFile.url}
            alt={selectedFile.name}
            maxH="80vh"
            objectFit="contain"
          />
        )}
      </Popup>
    </Box>
  )
}

export default FileAttachment