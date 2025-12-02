import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import type { Layer } from '@deck.gl/core'

export interface HeatmapDataPoint {
  position: [number, number] // [longitude, latitude]
  weight: number // Temperature or intensity value
}

export interface HeatmapLayerProps {
  data: HeatmapDataPoint[]
  radiusPixels?: number
  intensity?: number
  threshold?: number
  colorRange?: number[][]
  visible?: boolean
  id?: string
}

/**
 * Create a Deck.gl HeatmapLayer for temperature visualization
 */
export function createHeatmapLayer(props: HeatmapLayerProps): HeatmapLayer | null {
  const {
    data,
    radiusPixels = 30,
    intensity = 1.0,
    threshold = 0.05,
    colorRange = [
      [0, 0, 255, 0],      // Blue (cold)
      [0, 255, 255, 128],  // Cyan
      [0, 255, 0, 192],    // Green
      [255, 255, 0, 255],  // Yellow
      [255, 128, 0, 255],  // Orange
      [255, 0, 0, 255]     // Red (hot)
    ],
    visible = true,
    id = 'heatmap'
  } = props

  if (!visible || data.length === 0) {
    return null
  }

  return new HeatmapLayer({
    id,
    data,
    getPosition: (d: HeatmapDataPoint) => d.position,
    getWeight: (d: HeatmapDataPoint) => d.weight,
    radiusPixels,
    intensity,
    threshold,
    colorRange,
    updateTriggers: {
      getWeight: [data]
    }
  })
}

