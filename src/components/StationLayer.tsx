import { ScatterplotLayer } from '@deck.gl/layers'
import type { Station } from '../types/station'

export interface StationLayerProps {
  stations: Station[]
  selectedStationId?: number
  onStationClick?: (station: Station) => void
  visible?: boolean
}

/**
 * Create a Deck.gl ScatterplotLayer for ECA&D weather stations
 */
export function createStationLayer(props: StationLayerProps): ScatterplotLayer | null {
  const { stations, selectedStationId, onStationClick, visible = true } = props

  if (!visible || stations.length === 0) {
    return null
  }

  return new ScatterplotLayer({
    id: 'stations',
    data: stations,
    getPosition: (d: Station) => [d.longitude, d.latitude],
    getRadius: (d: Station) => {
      // Highlight selected station
      return d.staid === selectedStationId ? 300 : 150
    },
    getFillColor: (d: Station) => {
      // Color based on selection - using green theme
      if (d.staid === selectedStationId) {
        return [16, 185, 129, 255] // Green accent for selected
      }
      return [16, 185, 129, 200] // Light green for others
    },
    getStrokeColor: (d: Station) => {
      if (d.staid === selectedStationId) {
        return [255, 255, 255, 255] // White border for selected
      }
      return [255, 255, 255, 150] // Light white border
    },
    radiusMinPixels: 8,
    radiusMaxPixels: 25,
    stroked: true,
    lineWidthMinPixels: 2,
    radiusScale: 1,
    pickable: true,
    onClick: (info) => {
      if (info.object && onStationClick) {
        onStationClick(info.object as Station)
      }
    },
    onHover: (_info) => {
      // Tooltip will be handled by parent component
    },
    updateTriggers: {
      getRadius: [selectedStationId],
      getFillColor: [selectedStationId]
    }
  })
}

