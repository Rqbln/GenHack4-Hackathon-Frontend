import { useState } from 'react'
import Map from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import { ScatterplotLayer } from '@deck.gl/layers'

// MapLibre style URL (dark theme)
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

const INITIAL_VIEW_STATE = {
  longitude: 2.3522, // Paris
  latitude: 48.8566,
  zoom: 10,
  pitch: 0,
  bearing: 0
}

export default function MapView() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)

  // Example scatterplot layer (will be replaced with real data)
  const layers = [
    new ScatterplotLayer({
      id: 'stations',
      data: [
        { position: [2.3522, 48.8566], radius: 100, color: [255, 0, 0] }
      ],
      getPosition: d => d.position,
      getRadius: d => d.radius,
      getFillColor: d => d.color,
      radiusMinPixels: 5,
      radiusMaxPixels: 20,
      pickable: true
    })
  ]

  return (
    <div className="relative w-full h-full">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
      >
        <Map
          mapStyle={MAP_STYLE}
          reuseMaps
        />
      </DeckGL>
      
      {/* Info overlay */}
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-2">GenHack 2025 - Climate Heat Dashboard</h1>
        <p className="text-sm text-gray-300">Map initialized with Deck.gl + MapLibre</p>
      </div>
    </div>
  )
}

