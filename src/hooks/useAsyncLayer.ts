import { useState, useEffect, useCallback, useRef } from 'react'
import type { Layer } from '@deck.gl/core'

interface UseAsyncLayerOptions {
  enabled?: boolean
  onLoad?: (layer: Layer | null) => void
  onError?: (error: Error) => void
}

/**
 * Hook for async layer loading with performance optimization
 * Prevents blocking the main thread during layer creation
 */
export function useAsyncLayer<T extends Layer>(
  layerFactory: () => Promise<T | null> | T | null,
  deps: React.DependencyList = [],
  options: UseAsyncLayerOptions = {}
): [T | null, boolean, Error | null] {
  const { enabled = true, onLoad, onError } = options
  const [layer, setLayer] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  // Use ref to store the latest factory function without causing re-renders
  const factoryRef = useRef(layerFactory)
  const onLoadRef = useRef(onLoad)
  const onErrorRef = useRef(onError)
  
  // Update refs when they change
  useEffect(() => {
    factoryRef.current = layerFactory
    onLoadRef.current = onLoad
    onErrorRef.current = onError
  }, [layerFactory, onLoad, onError])

  const loadLayer = useCallback(async () => {
    if (!enabled) {
      setLayer(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Use requestIdleCallback if available, otherwise setTimeout
      const scheduleLoad = (callback: () => void) => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(callback, { timeout: 1000 })
        } else {
          setTimeout(callback, 0)
        }
      }

      await new Promise<void>((resolve) => {
        scheduleLoad(() => {
          resolve()
        })
      })

      const result = await factoryRef.current()
      setLayer(result)
      onLoadRef.current?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onErrorRef.current?.(error)
      setLayer(null)
    } finally {
      setLoading(false)
    }
  }, [enabled, ...deps])

  useEffect(() => {
    loadLayer()
  }, [loadLayer])

  return [layer, loading, error]
}

