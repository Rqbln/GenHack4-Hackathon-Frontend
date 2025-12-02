import { useState } from 'react'

interface DemoModeProps {
  onToggle: (enabled: boolean) => void
}

/**
 * Demo Mode component for showcasing MVP features
 * Highlights key functionality for video capture
 */
export default function DemoMode({ onToggle }: DemoModeProps) {
  const [enabled, setEnabled] = useState(false)

  const handleToggle = () => {
    const newState = !enabled
    setEnabled(newState)
    onToggle(newState)
  }

  if (!enabled) {
    return (
      <button
        onClick={handleToggle}
        className="absolute bottom-20 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg font-semibold z-50 animate-pulse-glow"
        title="Enable demo mode for video capture"
      >
        🎬 Demo Mode
      </button>
    )
  }

  return (
    <div className="absolute bottom-20 right-4 bg-gray-900 bg-opacity-95 p-4 rounded-lg shadow-xl border border-blue-500 z-50 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">🎬 Demo Mode Active</h3>
        <button
          onClick={handleToggle}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>Interactive map with Deck.gl</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>Weather stations visualization</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>Time series charts</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>Temporal navigation slider</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>Backend API integration</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          💡 <strong>Tip:</strong> Use this mode to showcase all MVP features in your demo video.
        </p>
      </div>
    </div>
  )
}

