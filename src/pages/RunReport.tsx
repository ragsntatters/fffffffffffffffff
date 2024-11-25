import { useState } from 'react'
import { Box, Heading, FormControl, FormLabel, Input, Select, Button, VStack, HStack, useToast } from '@chakra-ui/react'

const RunReport = () => {
  const [location, setLocation] = useState('')
  const [keyword, setKeyword] = useState('')
  const [radius, setRadius] = useState('')
  const [distance, setDistance] = useState('')
  const [unit, setUnit] = useState('km')
  const toast = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send this data to your backend or API
    console.log({ location, keyword, radius, distance, unit })
    toast({
      title: "Report Started",
      description: "Your keyword report is being generated.",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
  }

  return (
    <Box>
      <Heading mb={6}>Run Keyword Report</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Select placeholder="Select location" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="location1">Location 1</option>
              <option value="location2">Location 2</option>
              <option value="location3">Location 3</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Keyword</FormLabel>
            <Input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Enter keyword" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Radius</FormLabel>
            <Input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="Enter radius" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Distance</FormLabel>
            <Input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Enter distance" />
          </FormControl>
          <FormControl>
            <FormLabel>Unit</FormLabel>
            <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="km">Kilometers</option>
              <option value="mi">Miles</option>
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="blue">Run Report</Button>
        </VStack>
      </form>
    </Box>
  )
}

export default RunReport