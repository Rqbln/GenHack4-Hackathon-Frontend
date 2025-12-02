import { useState, useEffect, useMemo } from 'react'
import type { HeatmapDataPoint } from '../components/HeatmapLayer'
import { apiService } from '../services/api'

interface UseHeatmapDataOptions {
  date?: Date
  variable?: 'temperature' | 'ndvi' | 'uhi'
  enabled?: boolean
}

/**
 * Hook to fetch and prepare heatmap data from backend
 */
export function useHeatmapData(options: UseHeatmapDataOptions = {}) {
  const { date, variable = 'temperature', enabled = true } = options
  const [data, setData] = useState<HeatmapDataPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled) {
      setData([])
      return
    }

    const fetchHeatmapData = async () => {
      setLoading(true)
      setError(null)

      try {
        // For now, generate mock data
        // In production, this would call the backend API
        const mockData: HeatmapDataPoint[] = generateMockHeatmapData(date, variable)
        setData(mockData)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchHeatmapData()
  }, [date, variable, enabled])

  return { data, loading, error }
}

/**
 * Generate mock heatmap data for demonstration
 * In production, this would fetch from backend API
 */
function generateMockHeatmapData(
  date?: Date,
  variable: 'temperature' | 'ndvi' | 'uhi' = 'temperature'
): HeatmapDataPoint[] {
  const data: HeatmapDataPoint[] = []
  
  // Paris area bounds
  const lonMin = 2.2
  const lonMax = 2.5
  const latMin = 48.8
  const latMax = 49.0
  
  // Generate grid of points
  const nPoints = 100
  const stepLon = (lonMax - lonMin) / Math.sqrt(nPoints)
  const stepLat = (latMax - latMin) / Math.sqrt(nPoints)
  
  for (let i = 0; i < Math.sqrt(nPoints); i++) {
    for (let j = 0; j < Math.sqrt(nPoints); j++) {
      const lon = lonMin + i * stepLon
      const lat = latMin + j * stepLat
      
      // Generate mock temperature (warmer in center = urban heat island)
      const centerLon = (lonMin + lonMax) / 2
      const centerLat = (latMin + latMax) / 2
      const dist = Math.sqrt(
        Math.pow(lon - centerLon, 2) + Math.pow(lat - centerLat, 2)
      )
      
      let weight: number
      if (variable === 'temperature') {
        // Urban heat island effect: warmer in center
        weight = 20 + 8 * Math.exp(-dist * 10) + Math.random() * 2
      } else if (variable === 'ndvi') {
        // NDVI: higher in green areas
        weight = 0.3 + 0.4 * Math.exp(-dist * 5) + Math.random() * 0.2
      } else {
        // UHI intensity
        weight = dist * 2 + Math.random() * 0.5
      }
      
      data.push({
        position: [lon, lat],
        weight
      })
    }
  }
  
  return data
}

