import { useState, useEffect } from 'react'
import type { HeatmapDataPoint } from '../components/HeatmapLayer'
import { apiService } from '../services/api'

// Expose baseUrl for direct fetch (workaround)
declare module '../services/api' {
  interface ApiService {
    baseUrl: string
  }
}

interface UseHeatmapDataOptions {
  date?: Date
  variable?: 'temperature' | 'ndvi' | 'uhi'
  enabled?: boolean
}

/**
 * Hook to fetch and prepare heatmap data from backend API
 * Returns empty data if API endpoint is not available
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
          const dateStr = date ? date.toISOString().split('T')[0] : '2020-01-01'
          
          // Paris bounding box
          const bbox: [number, number, number, number] = [2.2, 48.8, 2.5, 49.0]
          
          try {
            // Try to fetch heatmap data from API
            const bboxStr = bbox.join(',')
            const url = `${apiService['baseUrl']}/api/heatmap?date=${dateStr}&bbox=${bboxStr}`
            const response = await fetch(url)
            
            if (response.ok) {
              const result = await response.json()
              if (result && result.data && Array.isArray(result.data)) {
                const heatmapPoints: HeatmapDataPoint[] = result.data.map((point: any) => ({
                  position: point.position || [point.lon || point.longitude, point.lat || point.latitude],
                  weight: point.weight || point.temperature || 0
                }))
                setData(heatmapPoints)
              } else {
                setData([])
              }
            } else {
              // Fallback to ERA5 endpoint
              const era5Data = await apiService.getERA5Data(bbox, dateStr, dateStr, ['t2m'])
              if (era5Data && era5Data.data && Array.isArray(era5Data.data)) {
                const heatmapPoints: HeatmapDataPoint[] = era5Data.data.map((point: any) => ({
                  position: [point.longitude || point.lon, point.latitude || point.lat],
                  weight: point.temperature || point.t2m || 0
                }))
                setData(heatmapPoints)
              } else {
                setData([])
              }
            }
          } catch (apiError) {
            console.warn('Heatmap API endpoint not available:', apiError)
            setData([])
          }
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

