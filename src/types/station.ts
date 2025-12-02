export interface Station {
  staid: number
  staname: string
  country: string
  latitude: number
  longitude: number
  elevation: number
}

export interface StationData {
  station: Station
  date: string
  temperature: number
  quality: number
}

