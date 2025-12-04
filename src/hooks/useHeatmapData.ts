import { useState, useEffect } from 'react'
import type { HeatmapDataPoint } from '../components/HeatmapLayer'
import { apiService } from '../services/api'

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
        // Try to fetch heatmap data from API
        // For now, the API doesn't have a heatmap endpoint yet
        // So we return empty data instead of generating mock data
        // TODO: Implement /api/heatmap endpoint in backend
        const dateStr = date ? date.toISOString().split('T')[0] : '2020-01-01'
        
        // Paris bounding box
        const bbox: [number, number, number, number] = [2.2, 48.8, 2.5, 49.0]
        const startDate = dateStr
        const endDate = dateStr
        
        try {
          // Try to fetch ERA5 data which could be used for heatmap
          const era5Data = await apiService.getERA5Data(bbox, startDate, endDate, ['t2m'])
          
          // Convert ERA5 data to heatmap points if available
          if (era5Data && era5Data.data && Array.isArray(era5Data.data)) {
            const heatmapPoints: HeatmapDataPoint[] = era5Data.data.map((point: any) => ({
              position: [point.longitude || point.lon, point.latitude || point.lat],
              weight: point.temperature || point.t2m || 0
            }))
            setData(heatmapPoints)
          } else {
            // No heatmap data available - return empty instead of mock
            setData([])
          }
        } catch (apiError) {
          // API endpoint not available or failed - return empty data
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

