import { useState, useRef, useEffect } from 'react'
import Map from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import type { PickingInfo } from '@deck.gl/core'
import { createStationLayer } from './StationLayer'
import { createHeatmapLayer } from './HeatmapLayer'
import type { Station } from '../types/station'
import type { HeatmapDataPoint } from './HeatmapLayer'

// MapLibre style URL (dark theme)
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

interface SwipeMapProps {
  leftData: HeatmapDataPoint[]
  rightData: HeatmapDataPoint[]
  leftLabel: string
  rightLabel: string
  stations?: Station[]
  initialSwipePosition?: number // 0-100, percentage
}

/**
 * Swipe Map component for comparing two datasets side-by-side
 * Allows users to swipe left/right to reveal different visualizations
 */
export default function SwipeMap({
  leftData,
  rightData,
  leftLabel,
  rightLabel,
  stations = [],
  initialSwipePosition = 50
}: SwipeMapProps) {
  const [swipePosition, setSwipePosition] = useState(initialSwipePosition)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const viewState = {
    longitude: 2.3522, // Paris
    latitude: 48.8566,
    zoom: 10,
    pitch: 0,
    bearing: 0
  }

  // Create layers for left and right sides
  const leftLayers = [
    createHeatmapLayer({
      data: leftData,
      radiusPixels: 50,
      intensity: 1.5,
      visible: true,
      id: 'left-heatmap'
    }),
    createStationLayer({
      stations,
      selectedStationId: null,
      onStationClick: () => {},
      visible: true
    })
  ].filter(Boolean)

  const rightLayers = [
    createHeatmapLayer({
      data: rightData,
      radiusPixels: 50,
      intensity: 1.5,
      visible: true,
      id: 'right-heatmap'
    }),
    createStationLayer({
      stations,
      selectedStationId: null,
      onStationClick: () => {},
      visible: true
    })
  ].filter(Boolean)

  // Handle mouse/touch events for swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    updateSwipePosition(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateSwipePosition(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const updateSwipePosition = (clientX: number) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSwipePosition(percentage)
  }

  // Add global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        updateSwipePosition(e.clientX)
      }
      
      const handleGlobalMouseUp = () => {
        setIsDragging(false)
      }
      
      window.addEventListener('mousemove', handleGlobalMouseMove)
      window.addEventListener('mouseup', handleGlobalMouseUp)
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove)
        window.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Left Map (ERA5 or Before) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - swipePosition}% 0 0)`,
          zIndex: swipePosition > 50 ? 1 : 2
        }}
      >
        <DeckGL
          viewState={viewState}
          controller={true}
          layers={leftLayers}
        >
          <Map
            mapStyle={MAP_STYLE}
            reuseMaps
          />
        </DeckGL>
        
        {/* Left Label */}
        <div className="absolute top-4 left-4 bg-blue-600 bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
          <span className="text-white font-semibold">{leftLabel}</span>
        </div>
      </div>

      {/* Right Map (Prithvi or After) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 0 0 ${swipePosition}%)`,
          zIndex: swipePosition <= 50 ? 1 : 2
        }}
      >
        <DeckGL
          viewState={viewState}
          controller={true}
          layers={rightLayers}
        >
          <Map
            mapStyle={MAP_STYLE}
            reuseMaps
          />
        </DeckGL>
        
        {/* Right Label */}
        <div className="absolute top-4 right-4 bg-red-600 bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
          <span className="text-white font-semibold">{rightLabel}</span>
        </div>
      </div>

      {/* Swipe Divider */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-50"
        style={{ left: `${swipePosition}%` }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
        <p className="text-white text-sm">
          Drag the divider to compare {leftLabel} vs {rightLabel}
        </p>
      </div>
    </div>
  )
}

