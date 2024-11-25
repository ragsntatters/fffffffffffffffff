import { useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_TOKEN, MAPBOX_STYLE } from '../../config/mapbox'

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
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      center: center,
      zoom: 13,
      interactive: true
    })

    map.current.on('load', () => {
      if (!map.current) return

      // Add ranking points
      map.current.addSource('rankings', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: rankings.map(ranking => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: ranking.position
            },
            properties: {
              rank: ranking.rank
            }
          }))
        }
      })

      // Add circles for rankings
      map.current.addLayer({
        id: 'ranking-points',
        type: 'circle',
        source: 'rankings',
        paint: {
          'circle-radius': 10,
          'circle-color': [
            'case',
            ['<=', ['get', 'rank'], 3], '#38A169', // Green for top 3
            ['<=', ['get', 'rank'], 10], '#ECC94B', // Yellow for top 10
            '#E53E3E' // Red for others
          ],
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      })

      // Add rank numbers
      map.current.addLayer({
        id: 'ranking-numbers',
        type: 'symbol',
        source: 'rankings',
        layout: {
          'text-field': ['get', 'rank'],
          'text-size': 12,
          'text-allow-overlap': true
        },
        paint: {
          'text-color': '#fff'
        }
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [center, rankings])

  return (
    <Box 
      ref={mapContainer} 
      height="400px" 
      width="100%" 
      borderRadius="md" 
      overflow="hidden"
      borderWidth="1px"
      borderColor="gray.200"
    />
  )
}

export default RankingGrid