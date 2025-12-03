import { useState, useMemo, useCallback, useEffect } from 'react'
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
import { useStations } from '../hooks/useStations'
import { waitForWebGL } from '../utils/webglCheck'
import type { Station, StationData } from '../types/station'

// MapLibre style URL (light theme)
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

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
  
  // Fetch stations from API
  const { stations: apiStations, loading: stationsLoading } = useStations()
  
  // Use API stations if available, otherwise fallback to mock
  // Memoize to prevent unnecessary re-renders
  const stations = useMemo(() => {
    return apiStations.length > 0 ? apiStations : MOCK_STATIONS
  }, [apiStations])

  // Timeline dates
  const startDate = new Date('2020-01-01')
  const endDate = new Date('2021-12-31')

  // Mock time series data (will be replaced with real ECA&D data)
  const loadStationData = useCallback((station: Station) => {
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
  }, [])

  // Memoize stations array to prevent unnecessary re-renders
  const stationsKey = useMemo(() => {
    return stations.map(s => s.staid).join(',')
  }, [stations])

  // Create station layer with async loading for performance
  const createStationLayerAsync = useCallback(() => {
    if (!stations || stations.length === 0) {
      return null
    }
    return createStationLayer({
      stations: stations,
      selectedStationId: selectedStation?.staid,
      onStationClick: (station) => {
        setSelectedStation(station)
        loadStationData(station)
        console.log('Station selected:', station)
      },
      visible: true
    })
  }, [selectedStation?.staid, stationsKey, loadStationData])

  const [stationLayer, _stationLoading, _stationError] = useAsyncLayer(
    createStationLayerAsync,
    [selectedStation?.staid, stationsKey],
    {
      enabled: stations.length > 0,
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

  // Check WebGL support before rendering DeckGL
  const [webglReady, setWebglReady] = useState(false)
  const [webglError, setWebglError] = useState<string | null>(null)
  
  useEffect(() => {
    let mounted = true
    
    const initWebGL = async () => {
      // Wait a bit for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (!mounted) return
      
      const result = await waitForWebGL(2000)
      
      if (!mounted) return
      
      if (result.supported) {
        setWebglReady(true)
      } else {
        setWebglError(result.error || 'WebGL not available')
      }
    }
    
    initWebGL()
    
    return () => {
      mounted = false
    }
  }, [])

  if (webglError) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-bg-primary">
        <div className="text-center p-8 glass-dark rounded-lg">
          <h2 className="text-xl font-bold text-text-primary mb-2">WebGL Error</h2>
          <p className="text-text-secondary mb-4">{webglError}</p>
          <p className="text-sm text-text-secondary">Please refresh the page or use a browser that supports WebGL.</p>
        </div>
      </div>
    )
  }

  if (!webglReady) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-bg-primary">
        <div className="text-center p-8 glass-dark rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green mx-auto mb-4"></div>
          <p className="text-text-secondary">Initializing WebGL...</p>
        </div>
      </div>
    )
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
        onError={(error) => {
          console.error('DeckGL error:', error)
          const errorMsg = error?.message || error?.toString() || ''
          if (errorMsg.includes('WebGL') || errorMsg.includes('maxTextureDimension2D') || errorMsg.includes('texture')) {
            // Don't show error immediately, try to recover
            console.warn('WebGL error detected, attempting recovery...')
            // Only set error if it persists
            setTimeout(() => {
              setWebglError('WebGL context error. Please refresh the page.')
            }, 2000)
          }
        }}
        glOptions={{
          preserveDrawingBuffer: false,
          antialias: false,
          depth: false,
          stencil: false
        }}
      >
        <Map
          mapStyle={MAP_STYLE}
          reuseMaps
          onError={(error) => {
            console.error('Map error:', error)
          }}
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
      <DemoMode 
        onToggle={setDemoMode}
        onStartTour={() => {
          // Tour functionality can be added here
          console.log('Starting demo tour...')
        }}
      />

      {/* Info overlay with glassmorphism */}
      <div className="absolute top-4 left-4 glass-dark p-4 rounded-lg shadow-lg max-w-sm fade-in">
        <h1 className="text-xl font-bold mb-2 text-text-primary">GenHack 2025 - Climate Heat Dashboard</h1>
        <p className="text-sm text-text-secondary mb-2">
          {stationsLoading ? 'Loading stations...' : `${stations.length} weather stations loaded`}
          {apiStations.length > 0 && <span className="text-accent-green ml-2">(from API)</span>}
        </p>
        {selectedStation && (
          <div className="mt-2 pt-2 border-t border-border-primary">
            <p className="text-xs text-accent-green-dark mb-2">
              Selected: {selectedStation.staname}
            </p>
          </div>
        )}
      </div>

      {/* Timeline Slider with glassmorphism */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 slide-in-bottom z-50">
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
      </div>

      {/* Time Series Chart Panel with glassmorphism */}
      {selectedStation && stationData.length > 0 && (
        <div className="absolute bottom-24 left-4 right-4 glass-dark p-4 rounded-lg shadow-xl max-w-4xl scale-in z-40">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-text-primary">{selectedStation.staname} - Time Series</h3>
            <button
              onClick={() => {
                setSelectedStation(null)
                setStationData([])
              }}
              className="text-text-secondary hover:text-text-primary font-bold text-xl leading-none px-2 py-1 rounded hover:bg-bg-tertiary transition-colors"
              aria-label="Close chart"
            >
              ×
            </button>
          </div>
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

