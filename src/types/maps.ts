export interface LatLng {
  lat: number
  lng: number
}

export interface GridPoint {
  coordinates: LatLng
  rank: number | null
}

export interface RankingData {
  position: LatLng
  rank: number
  competitors?: Array<{
    name: string
    rank: number
  }>
}