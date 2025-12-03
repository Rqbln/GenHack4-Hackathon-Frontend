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
        className="absolute bottom-20 right-4 bg-accent-green hover:bg-accent-green-dark text-white px-4 py-2 rounded-lg shadow-lg font-semibold z-50 pulse-glow hover-lift transition-smooth"
        title="Enable demo mode for video capture"
      >
        🎬 Demo Mode
      </button>
    )
  }

  return (
    <div className="absolute bottom-20 right-4 glass-dark p-4 rounded-lg shadow-xl border border-accent-green z-50 max-w-sm scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-text-primary">🎬 Demo Mode Active</h3>
        <button
          onClick={handleToggle}
          className="text-text-secondary hover:text-text-primary"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="text-accent-green">✓</span>
          <span>Interactive map with Deck.gl</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent-green">✓</span>
          <span>Weather stations visualization</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent-green">✓</span>
          <span>Time series charts</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent-green">✓</span>
          <span>Temporal navigation slider</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent-green">✓</span>
          <span>Backend API integration</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border-primary">
        <p className="text-xs text-text-secondary">
          💡 <strong>Tip:</strong> Use this mode to showcase all MVP features in your demo video.
        </p>
      </div>
    </div>
  )
}

