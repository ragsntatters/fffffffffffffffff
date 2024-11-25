import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  useToast
} from '@chakra-ui/react'
import { useState } from 'react'

interface RejectPostModalProps {
  isOpen: boolean
  onClose: () => void
  post: any
  onReject: (postId: number, reason: string) => void
}

const RejectPostModal = ({ isOpen, onClose, post, onReject }: RejectPostModalProps) => {
  const [reason, setReason] = useState('')
  const toast = useToast()

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    onReject(post.id, reason)
    setReason('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reject Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Reason for Rejection</FormLabel>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this post..."
                rows={4}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Reject Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default RejectPostModal