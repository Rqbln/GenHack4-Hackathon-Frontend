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
          const dateStr = date ? date.toISOString().split('T')[0] : '2020-01-01'
          
          // Paris bounding box
          const bbox: [number, number, number, number] = [2.2, 48.8, 2.5, 49.0]
          
          try {
            // Try to fetch heatmap data from API
            const heatmapData = await apiService.getHeatmapData(dateStr, bbox)
            
            if (heatmapData && heatmapData.data && Array.isArray(heatmapData.data)) {
              const heatmapPoints: HeatmapDataPoint[] = heatmapData.data.map((point: any) => ({
                position: point.position || [point.lon || point.longitude, point.lat || point.latitude],
                weight: point.weight || point.temperature || 0
              }))
              setData(heatmapPoints)
            } else {
              setData([])
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

