import { ScatterplotLayer } from '@deck.gl/layers'
import { Station } from '../types/station'

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
      return d.staid === selectedStationId ? 200 : 100
    },
    getFillColor: (d: Station) => {
      // Color based on selection
      if (d.staid === selectedStationId) {
        return [255, 255, 0, 255] // Yellow for selected
      }
      return [255, 0, 0, 200] // Red for others
    },
    radiusMinPixels: 5,
    radiusMaxPixels: 20,
    radiusScale: 1,
    pickable: true,
    onClick: (info) => {
      if (info.object && onStationClick) {
        onStationClick(info.object as Station)
      }
    },
    onHover: (info) => {
      // Tooltip will be handled by parent component
    },
    updateTriggers: {
      getRadius: [selectedStationId],
      getFillColor: [selectedStationId]
    }
  })
}

