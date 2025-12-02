import { useState, useMemo, useCallback } from 'react'
import type { Layer } from '@deck.gl/core'

interface LayerConfig {
  id: string
  factory: () => Layer | null
  priority: number // Higher priority loads first
  enabled?: boolean
}

/**
 * Hook for lazy loading multiple layers with priority-based loading
 * Loads layers asynchronously to prevent blocking the UI
 */
export function useLazyLayers(
  layerConfigs: LayerConfig[],
  maxConcurrent: number = 2
): [Layer[], boolean, Record<string, Error | null>] {
  const [loadedLayers, setLoadedLayers] = useState<Map<string, Layer>>(new Map())
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, Error | null>>({})

  // Sort by priority
  const sortedConfigs = useMemo(() => {
    return [...layerConfigs]
      .filter(config => config.enabled !== false)
      .sort((a, b) => b.priority - a.priority)
  }, [layerConfigs])

  const loadLayers = useCallback(async () => {
    setLoading(true)
    setErrors({})
    const newLayers = new Map<string, Layer>()
    const newErrors: Record<string, Error | null> = {}

    // Load layers in batches
    for (let i = 0; i < sortedConfigs.length; i += maxConcurrent) {
      const batch = sortedConfigs.slice(i, i + maxConcurrent)
      
      await Promise.all(
        batch.map(async (config) => {
          try {
            // Use requestIdleCallback for non-blocking execution
            await new Promise<void>((resolve) => {
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => resolve(), { timeout: 500 })
              } else {
                setTimeout(() => resolve(), 0)
              }
            })

            const layer = config.factory()
            if (layer) {
              newLayers.set(config.id, layer)
            }
            newErrors[config.id] = null
          } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error))
            newErrors[config.id] = err
            console.error(`Failed to load layer ${config.id}:`, err)
          }
        })
      )

      // Update state after each batch
      setLoadedLayers(new Map(newLayers))
      setErrors({ ...newErrors })
    }

    setLoading(false)
  }, [sortedConfigs, maxConcurrent])

  // Reload when configs change
  useMemo(() => {
    loadLayers()
  }, [loadLayers])

  const layers = useMemo(() => {
    return Array.from(loadedLayers.values())
  }, [loadedLayers])

  return [layers, loading, errors]
}

