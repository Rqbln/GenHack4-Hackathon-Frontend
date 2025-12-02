import { Station } from '../types/station'

interface StationTooltipProps {
  station: Station | null
  x: number
  y: number
}

export default function StationTooltip({ station, x, y }: StationTooltipProps) {
  if (!station) {
    return null
  }

  return (
    <div
      className="absolute bg-gray-900 bg-opacity-95 text-white p-3 rounded-lg shadow-xl border border-gray-700 pointer-events-none z-50 max-w-xs"
      style={{
        left: `${x + 10}px`,
        top: `${y - 10}px`,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="font-bold text-sm mb-1">{station.staname}</div>
      <div className="text-xs text-gray-300 space-y-1">
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

