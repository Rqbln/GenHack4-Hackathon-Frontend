/**
 * Hook to fetch stations from the API
 */

import { useState, useEffect } from 'react'
import { apiService, type StationData } from '../services/api'

export function useStations() {
  const [stations, setStations] = useState<StationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiService.getStations()
        setStations(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stations'))
        console.error('Error fetching stations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [])

  return { stations, loading, error }
}

