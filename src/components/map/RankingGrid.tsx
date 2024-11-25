import { useEffect, useRef, useState } from 'react'
import { Box, Spinner, Text } from '@chakra-ui/react'
import { useGoogleMaps } from '../../contexts/GoogleMapsContext'
import { generateGridPoints } from '../../lib/grid-utils'

interface RankingGridProps {
  center: [number, number]
  radius: number
  gridSize: string
  rankings: Array<{
    position: [number, number]
    rank: number
  }>
}

const RankingGrid = ({ center, radius, gridSize, rankings }: RankingGridProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<google.maps.Map | null>(null)
  const markers = useRef<google.maps.Marker[]>([])
  const { isLoaded, loadError, google } = useGoogleMaps()
  const [isMapInitialized, setIsMapInitialized] = useState(false)

  useEffect(() => {
    if (!isLoaded || !mapContainer.current || !google || isMapInitialized) return

    // Initialize map
    map.current = new google.maps.Map(mapContainer.current, {
      center: { lat: center[1], lng: center[0] },
      zoom: 13,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false
    })

    setIsMapInitialized(true)
  }, [isLoaded, google, center, isMapInitialized])

  useEffect(() => {
    if (!isLoaded || !google || !map.current || !isMapInitialized) return

    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null))
    markers.current = []

    // Generate grid points
    const points = generateGridPoints(
      { lat: center[1], lng: center[0] },
      radius,
      gridSize
    )

    // Add markers for each point
    points.forEach((point, index) => {
      const ranking = rankings[index]
      if (!ranking) return

      // Create custom marker label
      const label = {
        text: ranking.rank.toString(),
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 'bold'
      }

      // Determine marker color based on rank
      const markerColor = ranking.rank <= 3 ? '#38A169' : 
                         ranking.rank <= 10 ? '#ECC94B' : '#E53E3E'

      // Create standard marker
      const marker = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: map.current,
        label,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 12
        },
        title: `Ranking Position #${ranking.rank}`
      })

      // Add click listener for marker
      marker.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <strong>Ranking Position #${ranking.rank}</strong>
            </div>
          `
        })
        infoWindow.open(map.current, marker)
      })

      markers.current.push(marker)
    })

    // Fit bounds to show all markers
    const bounds = new google.maps.LatLngBounds()
    points.forEach(point => bounds.extend({ lat: point.lat, lng: point.lng }))
    map.current.fitBounds(bounds, {
      padding: 50
    })
  }, [isLoaded, google, center, radius, gridSize, rankings, isMapInitialized])

  if (loadError) {
    return (
      <Box p={4} bg="red.100" color="red.700" borderRadius="md">
        <Text>Error loading map: {loadError.message}</Text>
      </Box>
    )
  }

  if (!isLoaded) {
    return (
      <Box height="400px" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  return (
    <Box 
      ref={mapContainer}
      height="400px"
      width="100%"
      borderRadius="md"
      overflow="hidden"
      boxShadow="base"
    />
  )
}

export default RankingGrid