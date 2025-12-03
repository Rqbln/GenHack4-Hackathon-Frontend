import type { Station } from '../types/station'

interface StationTooltipProps {
  station: Station | null
  x: number
  y: number
}

interface StationTooltipProps {
  station: Station | null
  x: number
  y: number
  onClose?: () => void
}

export default function StationTooltip({ station, x, y, onClose }: StationTooltipProps) {
  if (!station) {
    return null
  }

  return (
    <div
      className="absolute bg-bg-secondary text-text-primary p-3 rounded-lg shadow-xl border border-accent-green z-[100] max-w-xs pointer-events-auto"
      style={{
        left: `${x + 10}px`,
        top: `${y - 10}px`,
        transform: 'translateY(-100%)'
      }}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-text-secondary hover:text-text-primary font-bold text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
      )}
      <div className="font-bold text-sm mb-1 text-accent-green-dark">{station.staname}</div>
      <div className="text-xs text-text-secondary space-y-1">
        <div>
          <span className="font-semibold">Station ID:</span> {station.staid}
        </div>
        <div>
          <span className="font-semibold">Country:</span> {station.country}
        </div>
        <div>
          <span className="font-semibold">Coordinates:</span>{' '}
          {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
        </div>
        {station.elevation && (
          <div>
            <span className="font-semibold">Elevation:</span> {station.elevation} m
          </div>
        )}
      </div>
    </div>
  )
}

