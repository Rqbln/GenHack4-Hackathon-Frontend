/**
 * API service for backend communication
 * Handles data fetching from the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://genhack4-hackathon-vertex.vercel.app'

export interface StationData {
  staid: number
  staname: string
  country: string
  latitude: number
  longitude: number
  elevation: number
}

export interface TemperatureData {
  date: string
  temperature: number
  quality: number
}

export interface GADMIndicators {
  zone_id: string
  zone_name: string
  mean_temp: number
  min_temp: number
  max_temp: number
  std_temp: number
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Fetch all weather stations
   */
  async getStations(city?: string): Promise<StationData[]> {
    try {
      const url = city 
        ? `${this.baseUrl}/api/stations?city=${encodeURIComponent(city)}`
        : `${this.baseUrl}/api/stations`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Handle both {stations: [...]} and [...] formats
      return Array.isArray(data) ? data : (data.stations || [])
    } catch (error) {
      console.error('Failed to fetch stations:', error)
      throw error
    }
  }

  /**
   * Fetch temperature data for a station
   */
  async getStationTemperature(
    stationId: number,
    startDate?: string,
    endDate?: string
  ): Promise<TemperatureData[]> {
    try {
      const params = new URLSearchParams()
      params.append('station_id', stationId.toString())
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)

      const url = `${this.baseUrl}/api/temperature?${params.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Handle both {data: [...]} and [...] formats
      return Array.isArray(data) ? data : (data.data || [])
    } catch (error) {
      console.error(`Failed to fetch temperature for station ${stationId}:`, error)
      throw error
    }
  }

  /**
   * Fetch GADM indicators for a region
   */
  async getGADMIndicators(
    countryCode: string,
    adminLevel?: number
  ): Promise<GADMIndicators[]> {
    try {
      const params = new URLSearchParams()
      params.append('country', countryCode)
      if (adminLevel !== undefined) {
        params.append('admin_level', adminLevel.toString())
      }

      const url = `${this.baseUrl}/api/gadm/indicators?${params.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch GADM indicators:', error)
      throw error
    }
  }

  /**
   * Fetch ERA5 data for a region and time period
   */
  async getERA5Data(
    bbox: [number, number, number, number], // [lon_min, lat_min, lon_max, lat_max]
    startDate: string,
    endDate: string,
    variables?: string[]
  ): Promise<any> {
    try {
      const params = new URLSearchParams()
      params.append('bbox', bbox.join(','))
      params.append('start_date', startDate)
      params.append('end_date', endDate)
      if (variables) {
        params.append('variables', variables.join(','))
      }

      const url = `${this.baseUrl}/api/era5?${params.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch ERA5 data:', error)
      throw error
    }
  }

  /**
   * Fetch heatmap data for a specific date
   */
  async getHeatmapData(
    date: string,
    bbox?: [number, number, number, number]
  ): Promise<any> {
    try {
      const params = new URLSearchParams()
      params.append('date', date)
      if (bbox) {
        params.append('bbox', bbox.join(','))
      }

      const url = `${this.baseUrl}/api/heatmap?${params.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error)
      throw error
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return response.ok
    } catch (error) {
      return false
    }
  }
}

export const apiService = new ApiService()

