import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Box, Text } from '@chakra-ui/react'
import { generateGridPoints } from '../../lib/grid-utils'

interface RankingGridProps {
  center?: [number, number]
  radius?: number
  gridSize?: string
  accessToken?: string
}

const RankingGrid = ({ 
  center = [-122.4194, 37.7749], // Default to San Francisco
  radius = 2, // Default 2km radius
  gridSize = '3x3', // Default 3x3 grid
  accessToken = 'pk.eyJ1IjoicmFnc250YXR0ZXJzIiwiYSI6ImNtMnhhdHE2ODAyeWMybHEyZHdsYzc1bWkifQ.yEOH1FDBc2F5rLuRikSckA'
}: RankingGridProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || !accessToken) return

    try {
      mapboxgl.accessToken = accessToken

      // Validate gridSize format
      const [rows, cols] = (gridSize || '3x3').split('x').map(Number)
      if (isNaN(rows) || isNaN(cols)) {
        throw new Error('Invalid grid size format')
      }

      // Calculate grid points
      const kmToDegrees = radius / 111.32 // approximate conversion at equator
      const gridPoints = generateGridPoints(
        { lat: center[1], lng: center[0] },
        radius,
        gridSize
      )

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center,
        zoom: 12
      })

      map.current.on('load', () => {
        if (!map.current) return

        // Add grid lines
        const gridFeatures = []

        // Vertical lines
        for (let i = 0; i <= cols; i++) {
          const lng = center[0] - kmToDegrees + (i * (2 * kmToDegrees) / cols)
          gridFeatures.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [lng, center[1] - kmToDegrees],
                [lng, center[1] + kmToDegrees]
              ]
            }
          })
        }

        // Horizontal lines
        for (let i = 0; i <= rows; i++) {
          const lat = center[1] - kmToDegrees + (i * (2 * kmToDegrees) / rows)
          gridFeatures.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [center[0] - kmToDegrees, lat],
                [center[0] + kmToDegrees, lat]
              ]
            }
          })
        }

        // Add grid source and layer
        map.current.addSource('grid', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: gridFeatures
          }
        })

        map.current.addLayer({
          id: 'grid-lines',
          type: 'line',
          source: 'grid',
          paint: {
            'line-color': '#ccc',
            'line-width': 1,
            'line-dasharray': [2, 2]
          }
        })

        // Add intersection points
        const intersectionFeatures = gridPoints.map((point, index) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.lng, point.lat]
          },
          properties: {
            rank: Math.floor(Math.random() * 20) + 1 // Simulated ranks for demo
          }
        }))

        map.current.addSource('intersections', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: intersectionFeatures
          }
        })

        // Add circles for intersection points
        map.current.addLayer({
          id: 'intersection-points',
          type: 'circle',
          source: 'intersections',
          paint: {
            'circle-radius': 15,
            'circle-color': [
              'case',
              ['<=', ['get', 'rank'], 3], '#38A169', // Green for top 3
              ['<=', ['get', 'rank'], 10], '#ECC94B', // Yellow for top 10
              '#E53E3E' // Red for others
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff'
          }
        })

        // Add rank numbers
        map.current.addLayer({
          id: 'rank-numbers',
          type: 'symbol',
          source: 'intersections',
          layout: {
            'text-field': ['to-string', ['get', 'rank']],
            'text-size': 12,
            'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
            'text-allow-overlap': true
          },
          paint: {
            'text-color': '#fff'
          }
        })

        // Add hover effect
        map.current.on('mouseenter', 'intersection-points', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer'
          }
        })

        map.current.on('mouseleave', 'intersection-points', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = ''
          }
        })

        // Add click popup
        map.current.on('click', 'intersection-points', (e) => {
          if (!e.features?.[0]) return

          const rank = e.features[0].properties?.rank
          const coordinates = e.features[0].geometry.coordinates.slice()

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <strong>Ranking Position</strong><br>
              Rank: #${rank}
            `)
            .addTo(map.current!)
        })
      })
    } catch (error) {
      console.error('Error initializing map:', error)
      return (
        <Box p={4} bg="red.100" color="red.700" borderRadius="md">
          <Text>Error loading map. Please check your configuration.</Text>
        </Box>
      )
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [center, radius, gridSize, accessToken])

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