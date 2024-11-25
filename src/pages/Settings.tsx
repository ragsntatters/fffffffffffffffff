import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast
} from '@chakra-ui/react'
import PageHeader from '../components/PageHeader'
import ProfileSettings from '../components/settings/ProfileSettings'
import NotificationPreferences from '../components/settings/NotificationPreferences'
import NotificationCenter from '../components/settings/NotificationCenter'
import APIKeySettings from '../components/settings/APIKeySettings'

const Settings = () => {
  const toast = useToast()

  const handleProfileUpdate = (data: any) => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleNotificationUpdate = (preferences: any) => {
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box>
      <PageHeader 
        title="Settings"
        subtitle="Manage your account settings and preferences"
      />

      <Tabs>
        <TabList>
          <Tab>Profile</Tab>
          <Tab>API Keys</Tab>
          <Tab>Notification Preferences</Tab>
          <Tab>Notification Center</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProfileSettings onUpdate={handleProfileUpdate} />
          </TabPanel>
          <TabPanel>
            <APIKeySettings />
          </TabPanel>
          <TabPanel>
            <NotificationPreferences onUpdate={handleNotificationUpdate} />
          </TabPanel>
          <TabPanel>
            <NotificationCenter />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default Settings