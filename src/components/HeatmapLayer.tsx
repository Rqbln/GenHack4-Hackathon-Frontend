import { HeatmapLayer } from '@deck.gl/aggregation-layers'

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
      [0, 0, 255, 0] as const,      // Blue (cold)
      [0, 255, 255, 128] as const,  // Cyan
      [0, 255, 0, 192] as const,    // Green
      [255, 255, 0, 255] as const,  // Yellow
      [255, 128, 0, 255] as const,  // Orange
      [255, 0, 0, 255] as const     // Red (hot)
    ] as any, // Type assertion for Deck.gl color range
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

