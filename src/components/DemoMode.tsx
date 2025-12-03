import { useState, useEffect } from 'react'

interface DemoModeProps {
  onToggle: (enabled: boolean) => void
  onStartTour?: () => void
}

/**
 * Demo Mode component for showcasing MVP features
 * Highlights key functionality for video capture
 */
export default function DemoMode({ onToggle, onStartTour }: DemoModeProps) {
  const [enabled, setEnabled] = useState(false)
  const [tourStep, setTourStep] = useState(0)

  const handleToggle = () => {
    const newState = !enabled
    setEnabled(newState)
    onToggle(newState)
    if (newState && onStartTour) {
      onStartTour()
      setTourStep(1)
    } else {
      setTourStep(0)
    }
  }

  // Auto-advance tour steps
  useEffect(() => {
    if (enabled && tourStep > 0 && tourStep < 5) {
      const timer = setTimeout(() => {
        setTourStep(prev => prev + 1)
      }, 3000) // 3 seconds per step
      return () => clearTimeout(timer)
    }
  }, [enabled, tourStep])

  const tourSteps = [
    { title: 'Interactive Map', desc: 'Explore the map with Deck.gl visualization' },
    { title: 'Weather Stations', desc: 'Click on stations to see detailed data' },
    { title: 'Time Series', desc: 'View temperature trends over time' },
    { title: 'Timeline Navigation', desc: 'Navigate through different dates' },
    { title: 'Heat Zones', desc: 'Visualize temperature heatmaps' }
  ]

  if (!enabled) {
    return (
      <button
        onClick={handleToggle}
        className="bg-accent-green hover:bg-accent-green-dark text-white px-4 py-2 rounded-lg shadow-lg font-semibold pulse-glow hover-lift transition-smooth border-2 border-white"
        style={{ 
          backgroundColor: '#10b981',
          color: '#ffffff',
          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}
        title="Enable demo mode for video capture"
      >
        🎬 Demo Mode
      </button>
    )
  }

  return (
    <div className="glass-dark p-4 rounded-lg shadow-xl border-2 border-accent-green max-w-sm scale-in" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-text-primary">🎬 Demo Mode Active</h3>
        <button
          onClick={handleToggle}
          className="text-text-secondary hover:text-text-primary font-bold text-xl leading-none px-2 py-1 rounded hover:bg-bg-tertiary transition-colors"
          aria-label="Close demo mode"
        >
          ✕
        </button>
      </div>
      
      {tourStep > 0 && tourStep <= tourSteps.length && (
        <div className="mb-3 p-3 bg-accent-green/10 rounded-lg border border-accent-green">
          <div className="text-xs text-accent-green-dark font-semibold mb-1">
            Step {tourStep}/{tourSteps.length}
          </div>
          <div className="text-sm font-bold text-text-primary">{tourSteps[tourStep - 1].title}</div>
          <div className="text-xs text-text-secondary">{tourSteps[tourStep - 1].desc}</div>
        </div>
      )}
      
      <div className="space-y-2 text-sm text-text-secondary">
        <div className={`flex items-center gap-2 ${tourStep === 1 ? 'bg-accent-green/20 p-2 rounded' : ''}`}>
          <span className="text-accent-green">✓</span>
          <span>Interactive map with Deck.gl</span>
        </div>
        <div className={`flex items-center gap-2 ${tourStep === 2 ? 'bg-accent-green/20 p-2 rounded' : ''}`}>
          <span className="text-accent-green">✓</span>
          <span>Weather stations visualization</span>
        </div>
        <div className={`flex items-center gap-2 ${tourStep === 3 ? 'bg-accent-green/20 p-2 rounded' : ''}`}>
          <span className="text-accent-green">✓</span>
          <span>Time series charts</span>
        </div>
        <div className={`flex items-center gap-2 ${tourStep === 4 ? 'bg-accent-green/20 p-2 rounded' : ''}`}>
          <span className="text-accent-green">✓</span>
          <span>Temporal navigation slider</span>
        </div>
        <div className={`flex items-center gap-2 ${tourStep === 5 ? 'bg-accent-green/20 p-2 rounded' : ''}`}>
          <span className="text-accent-green">✓</span>
          <span>Heat zones visualization</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border-primary">
        <p className="text-xs text-text-secondary">
          💡 <strong>Tip:</strong> The tour will automatically guide you through all features.
        </p>
      </div>
    </div>
  )
}
