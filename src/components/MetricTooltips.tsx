import { Tooltip, Icon } from '@chakra-ui/react'
import { FaInfoCircle } from 'react-icons/fa'

export const tooltips = {
  AGR: "Average Growth Rate - Measures the overall growth in visibility and ranking over time",
  ATGR: "Average Top Growth Rate - Tracks improvement in rankings specifically for top positions (1-3)",
  SoLV: "Share of Local Voice - Represents your business's visibility compared to local competitors"
}

export const MetricTooltip = ({ metric, children }) => (
  <Tooltip 
    label={tooltips[metric]} 
    hasArrow 
    placement="top" 
    bg="gray.700" 
    color="white"
    px={3}
    py={2}
    borderRadius="md"
  >
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {children}
      <Icon as={FaInfoCircle} color="gray.400" w={3} h={3} />
    </span>
  </Tooltip>
)