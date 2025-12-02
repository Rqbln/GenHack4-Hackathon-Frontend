import { useState, useMemo } from 'react'
import Map from 'react-map-gl/maplibre'
import DeckGL, { PickingInfo } from '@deck.gl/react'
import { createStationLayer } from './StationLayer'
import StationTooltip from './StationTooltip'
import TimeSeriesChart from './TimeSeriesChart'
import { Station, StationData } from '../types/station'

// MapLibre style URL (dark theme)
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

const INITIAL_VIEW_STATE = {
  longitude: 2.3522, // Paris
  latitude: 48.8566,
  zoom: 10,
  pitch: 0,
  bearing: 0
}

// Mock stations data (will be replaced with real ECA&D data)
const MOCK_STATIONS: Station[] = [
  {
    staid: 1,
    staname: 'Paris Montsouris',
    country: 'FRA',
    latitude: 48.8222,
    longitude: 2.3364,
    elevation: 75
  },
  {
    staid: 2,
    staname: 'Paris Orly',
    country: 'FRA',
    latitude: 48.7233,
    longitude: 2.3794,
    elevation: 89
  },
  {
    staid: 3,
    staname: 'Paris Le Bourget',
    country: 'FRA',
    latitude: 48.9694,
    longitude: 2.4414,
    elevation: 66
  }
]

export default function MapView() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null)
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [stationData, setStationData] = useState<StationData[]>([])

  // Mock time series data (will be replaced with real ECA&D data)
  const loadStationData = (station: Station) => {
    // Generate mock time series data
    const mockData: StationData[] = []
    const startDate = new Date('2020-01-01')
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      mockData.push({
        station,
        date: date.toISOString().split('T')[0],
        temperature: 15 + 10 * Math.sin((i / 365) * 2 * Math.PI) + Math.random() * 5,
        quality: 0
      })
    }
    setStationData(mockData)
  }

  // Create station layer
  const stationLayer = useMemo(() => {
    return createStationLayer({
      stations: MOCK_STATIONS,
      selectedStationId: selectedStation?.staid,
      onStationClick: (station) => {
        setSelectedStation(station)
        loadStationData(station)
        console.log('Station selected:', station)
      },
      visible: true
    })
  }, [selectedStation])

  const layers = [stationLayer].filter(Boolean)

  // Handle hover for tooltip
  const handleHover = (info: PickingInfo) => {
    if (info.object) {
      setHoveredStation(info.object as Station)
      setHoveredPosition({ x: info.x, y: info.y })
    } else {
      setHoveredStation(null)
      setHoveredPosition(null)
    }
  }

  return (
    <div className="relative w-full h-full">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
        onHover={handleHover}
      >
        <Map
          mapStyle={MAP_STYLE}
          reuseMaps
        />
      </DeckGL>
      
      {/* Station Tooltip */}
      {hoveredStation && hoveredPosition && (
        <StationTooltip
          station={hoveredStation}
          x={hoveredPosition.x}
          y={hoveredPosition.y}
        />
      )}
      
      {/* Info overlay */}
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg max-w-sm">
        <h1 className="text-xl font-bold mb-2">GenHack 2025 - Climate Heat Dashboard</h1>
        <p className="text-sm text-gray-300 mb-2">
          {MOCK_STATIONS.length} weather stations loaded
        </p>
        {selectedStation && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <p className="text-xs text-yellow-400 mb-2">
              Selected: {selectedStation.staname}
            </p>
          </div>
        )}
      </div>

      {/* Time Series Chart Panel */}
      {selectedStation && stationData.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-gray-800 bg-opacity-95 p-4 rounded-lg shadow-xl max-w-4xl">
          <TimeSeriesChart
            data={stationData}
            stationName={selectedStation.staname}
            onPointClick={(data) => {
              console.log('Point clicked:', data)
              // Could update map view to this date
            }}
          />
        </div>
      )}
    </div>
  )
}

