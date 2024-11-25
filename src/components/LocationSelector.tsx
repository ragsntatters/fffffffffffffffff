import { Select, SelectProps } from '@chakra-ui/react'

interface LocationSelectorProps extends Omit<SelectProps, 'children'> {
  locations: Array<{ id: string; name: string }>
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const LocationSelector = ({ locations, value, onChange, ...props }: LocationSelectorProps) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      maxW="300px"
      bg="white"
      borderColor="gray.200"
      _hover={{ borderColor: 'gray.300' }}
      _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
      {...props}
    >
      {locations.map(location => (
        <option key={location.id} value={location.id}>
          {location.name}
        </option>
      ))}
    </Select>
  )
}

export default LocationSelector