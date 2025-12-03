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
    radiusPixels = 50,
    intensity = 1.5,
    threshold = 0.03,
    colorRange = [
      [59, 76, 192, 0] as const,      // Dark blue (cold) - Viridis
      [68, 104, 142, 100] as const,   // Blue
      [53, 183, 121, 150] as const,   // Green
      [110, 206, 88, 200] as const,   // Yellow-green
      [253, 231, 37, 255] as const,   // Yellow (hot)
      [255, 100, 50, 255] as const    // Orange-red (very hot)
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

