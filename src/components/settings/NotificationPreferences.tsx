import {
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Card,
  CardBody,
  Text,
  SimpleGrid,
  Select,
  Button,
  Divider
} from '@chakra-ui/react'
import { useState } from 'react'

interface NotificationPreferencesProps {
  onUpdate: (preferences: any) => void
}

const NotificationPreferences = ({ onUpdate }: NotificationPreferencesProps) => {
  const [preferences, setPreferences] = useState({
    email: {
      rankChanges: true,
      newReviews: true,
      reviewResponses: true,
      competitorUpdates: false,
      weeklyReports: true,
      monthlyReports: true
    },
    inApp: {
      rankChanges: true,
      newReviews: true,
      reviewResponses: true,
      competitorUpdates: true,
      weeklyReports: false,
      monthlyReports: false
    },
    frequency: {
      rankChanges: 'immediate',
      reviews: 'daily',
      reports: 'weekly'
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(preferences)
  }

  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch" as="form" onSubmit={handleSubmit}>
          <Text fontSize="lg" fontWeight="bold">Email Notifications</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Rank Changes</FormLabel>
              <Switch
                isChecked={preferences.email.rankChanges}
                onChange={(e) => setPreferences({
                  ...preferences,
                  email: { ...preferences.email, rankChanges: e.target.checked }
                })}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">New Reviews</FormLabel>
              <Switch
                isChecked={preferences.email.newReviews}
                onChange={(e) => setPreferences({
                  ...preferences,
                  email: { ...preferences.email, newReviews: e.target.checked }
                })}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Review Responses</FormLabel>
              <Switch
                isChecked={preferences.email.reviewResponses}
                onChange={(e) => setPreferences({
                  ...preferences,
                  email: { ...preferences.email, reviewResponses: e.target.checked }
                })}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Competitor Updates</FormLabel>
              <Switch
                isChecked={preferences.email.competitorUpdates}
                onChange={(e) => setPreferences({
                  ...preferences,
                  email: { ...preferences.email, competitorUpdates: e.target.checked }
                })}
              />
            </FormControl>
          </SimpleGrid>

          <Divider />

          <Text fontSize="lg" fontWeight="bold">In-App Notifications</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Rank Changes</FormLabel>
              <Switch
                isChecked={preferences.inApp.rankChanges}
                onChange={(e) => setPreferences({
                  ...preferences,
                  inApp: { ...preferences.inApp, rankChanges: e.target.checked }
                })}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">New Reviews</FormLabel>
              <Switch
                isChecked={preferences.inApp.newReviews}
                onChange={(e) => setPreferences({
                  ...preferences,
                  inApp: { ...preferences.inApp, newReviews: e.target.checked }
                })}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Review Responses</FormLabel>
              <Switch
                isChecked={preferences.inApp.reviewResponses}
                onChange={(e) => setPreferences({
                  ...preferences,
                  inApp: { ...preferences.inApp, reviewResponses: e.target.checked }
                })}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Competitor Updates</FormLabel>
              <Switch
                isChecked={preferences.inApp.competitorUpdates}
                onChange={(e) => setPreferences({
                  ...preferences,
                  inApp: { ...preferences.inApp, competitorUpdates: e.target.checked }
                })}
              />
            </FormControl>
          </SimpleGrid>

          <Divider />

          <Text fontSize="lg" fontWeight="bold">Notification Frequency</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <FormLabel>Rank Changes</FormLabel>
              <Select
                value={preferences.frequency.rankChanges}
                onChange={(e) => setPreferences({
                  ...preferences,
                  frequency: { ...preferences.frequency, rankChanges: e.target.value }
                })}
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Reviews</FormLabel>
              <Select
                value={preferences.frequency.reviews}
                onChange={(e) => setPreferences({
                  ...preferences,
                  frequency: { ...preferences.frequency, reviews: e.target.value }
                })}
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          <Button type="submit" colorScheme="blue">
            Save Preferences
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default NotificationPreferences