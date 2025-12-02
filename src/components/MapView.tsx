import { useState, useMemo, useCallback } from 'react'
import Map from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import type { PickingInfo } from '@deck.gl/core'
import { createStationLayer } from './StationLayer'
import StationTooltip from './StationTooltip'
import TimeSeriesChart from './TimeSeriesChart'
import TimelineSlider from './TimelineSlider'
import BackendConnectionStatus from './BackendConnectionStatus'
import DemoMode from './DemoMode'
import { createHeatmapLayer } from './HeatmapLayer'
import { useAsyncLayer } from '../hooks/useAsyncLayer'
import { useHeatmapData } from '../hooks/useHeatmapData'
import type { Station, StationData } from '../types/station'

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
  const [currentDate, setCurrentDate] = useState(new Date('2020-01-01'))
  const [_demoMode, setDemoMode] = useState(false)

  // Timeline dates
  const startDate = new Date('2020-01-01')
  const endDate = new Date('2021-12-31')

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

  // Create station layer with async loading for performance
  const createStationLayerAsync = useCallback(() => {
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

  const [stationLayer, _stationLoading, _stationError] = useAsyncLayer(
    createStationLayerAsync,
    [selectedStation],
    {
      enabled: true,
      onError: (error) => {
        console.error('Failed to load station layer:', error)
      }
    }
  )

  // Heatmap data
  const { data: heatmapData, loading: heatmapLoading } = useHeatmapData({
    date: currentDate,
    variable: 'temperature',
    enabled: true
  })

  // Create heatmap layer
  const heatmapLayer = useMemo(() => {
    return createHeatmapLayer({
      data: heatmapData,
      radiusPixels: 50,
      intensity: 1.5,
      visible: !heatmapLoading && heatmapData.length > 0
    })
  }, [heatmapData, heatmapLoading])

  const layers = useMemo(() => {
    return [stationLayer, heatmapLayer].filter(Boolean)
  }, [stationLayer, heatmapLayer])

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
        onViewStateChange={(evt: any) => {
          if (evt.viewState && typeof evt.viewState === 'object') {
            setViewState(evt.viewState as typeof viewState)
          }
        }}
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
      
      {/* Backend Connection Status */}
      <BackendConnectionStatus />

      {/* Demo Mode */}
      <DemoMode onToggle={setDemoMode} />

      {/* Info overlay with glassmorphism */}
      <div className="absolute top-4 left-4 glass-dark p-4 rounded-lg shadow-lg max-w-sm fade-in">
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

      {/* Timeline Slider with glassmorphism */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 slide-in-bottom">
        <div className="glass-dark rounded-lg p-4">
          <TimelineSlider
          startDate={startDate}
          endDate={endDate}
          currentDate={currentDate}
          onDateChange={(date) => {
            setCurrentDate(date)
            console.log('Date changed to:', date)
            // Update layers based on date
          }}
          step="month"
        />
      </div>

      {/* Time Series Chart Panel with glassmorphism */}
      {selectedStation && stationData.length > 0 && (
        <div className="absolute bottom-24 left-4 right-4 glass-dark p-4 rounded-lg shadow-xl max-w-4xl scale-in">
          <TimeSeriesChart
            data={stationData}
            stationName={selectedStation.staname}
            onPointClick={(data) => {
              console.log('Point clicked:', data)
              // Update timeline to this date
              setCurrentDate(new Date(data.date))
            }}
          />
        </div>
      )}
    </div>
  )
}

