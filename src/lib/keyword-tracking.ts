import { Client } from '@googlemaps/google-maps-services-js'
import { config } from '../config'
import type { Keyword } from '../types/keyword'

const client = new Client({})

interface GridPoint {
  lat: number
  lng: number
}

interface RankingResult {
  rank: number
  avgAGR: number
  ATGR: number
  SoLV: number
  competitors: Array<{
    placeId: string
    name: string
    rank: number
  }>
}

function generateGrid(
  centerLat: number,
  centerLng: number,
  radius: number,
  gridSize: string
): GridPoint[] {
  const [rows, cols] = gridSize.split('x').map(Number)
  const points: GridPoint[] = []
  const step = (radius * 2) / (rows - 1)

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const lat = centerLat - radius + (i * step)
      const lng = centerLng - radius + (j * step)
      points.push({ lat, lng })
    }
  }

  return points
}

async function searchAtPoint(
  point: GridPoint,
  keyword: string,
  radius: number
): Promise<Array<{ placeId: string; name: string; rank: number }>> {
  const response = await client.placesNearby({
    params: {
      location: point,
      radius: Math.round(radius * 1000), // Convert to meters
      keyword,
      key: config.google.apiKey
    }
  })

  return response.data.results.map((place, index) => ({
    placeId: place.place_id,
    name: place.name,
    rank: index + 1
  }))
}

export async function trackKeyword(
  keyword: Keyword,
  location: { latitude: number; longitude: number }
): Promise<RankingResult> {
  const gridPoints = generateGrid(
    location.latitude,
    location.longitude,
    keyword.radius,
    keyword.gridSize
  )

  const results = await Promise.all(
    gridPoints.map(point => searchAtPoint(point, keyword.term, keyword.radius))
  )

  // Flatten and aggregate results
  const allResults = results.flat()
  const placeRanks = new Map<string, number[]>()

  allResults.forEach(result => {
    const ranks = placeRanks.get(result.placeId) || []
    ranks.push(result.rank)
    placeRanks.set(result.placeId, ranks)
  })

  // Calculate metrics
  const competitors = Array.from(placeRanks.entries())
    .map(([placeId, ranks]) => ({
      placeId,
      name: allResults.find(r => r.placeId === placeId)!.name,
      rank: Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length)
    }))
    .sort((a, b) => a.rank - b.rank)

  const targetRanks = placeRanks.get(location.placeId) || []
  const avgRank = targetRanks.length
    ? Math.round(targetRanks.reduce((a, b) => a + b, 0) / targetRanks.length)
    : 0

  // Calculate AGR (Average Growth Rate)
  const avgAGR = targetRanks.length
    ? (targetRanks.filter(r => r <= 5).length / targetRanks.length) * 100
    : 0

  // Calculate ATGR (Average Top Growth Rate)
  const ATGR = targetRanks.length
    ? (targetRanks.filter(r => r <= 3).length / targetRanks.length) * 100
    : 0

  // Calculate SoLV (Share of Local Voice)
  const totalRanks = allResults.length
  const SoLV = targetRanks.length
    ? (targetRanks.reduce((acc, rank) => acc + (1 / rank), 0) /
        totalRanks) * 100
    : 0

  return {
    rank: avgRank,
    avgAGR,
    ATGR,
    SoLV,
    competitors: competitors.slice(0, 10) // Top 10 competitors
  }
}