import { Box, Heading, Text, VStack } from '@chakra-ui/react'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <Box mb={8} borderBottom="1px" borderColor="gray.200" pb={4}>
      <VStack align="start" spacing={1}>
        <Heading size="lg">{title}</Heading>
        {subtitle && (
          <Text color="gray.600">{subtitle}</Text>
        )}
      </VStack>
    </Box>
  )
}

export default PageHeader