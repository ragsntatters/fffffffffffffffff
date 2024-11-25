import { LatLng } from '../types/maps'

export function generateGridPoints(center: LatLng, radius: number, gridSize: string): LatLng[] {
  const [rows, cols] = gridSize.split('x').map(Number)
  const points: LatLng[] = []

  // Convert radius from km to degrees
  const kmToDegrees = radius / 111.32 // 1 degree ≈ 111.32 km at equator

  // Calculate grid boundaries
  const latMin = center.lat - kmToDegrees
  const latMax = center.lat + kmToDegrees
  const lngMin = center.lng - kmToDegrees / Math.cos(center.lat * Math.PI / 180)
  const lngMax = center.lng + kmToDegrees / Math.cos(center.lat * Math.PI / 180)

  // Calculate step sizes
  const latStep = (latMax - latMin) / (rows - 1)
  const lngStep = (lngMax - lngMin) / (cols - 1)

  // Generate grid points
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      points.push({
        lat: latMin + (i * latStep),
        lng: lngMin + (j * lngStep)
      })
    }
  }

  return points
}