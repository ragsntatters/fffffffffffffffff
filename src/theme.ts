import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: "'Roboto', sans-serif",
    body: "'Roboto', sans-serif"
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        fontFamily: "'Roboto', sans-serif"
      }
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'blue'
      }
    }
  }
})

export default theme