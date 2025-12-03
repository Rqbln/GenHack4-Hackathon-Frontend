import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { StationData } from '../types/station'

interface TimeSeriesChartProps {
  data: StationData[]
  stationName?: string
  onPointClick?: (data: StationData) => void
}

export default function TimeSeriesChart({ data, stationName, onPointClick }: TimeSeriesChartProps) {
  // Transform data for Recharts
  const chartData = data.map(d => ({
    date: new Date(d.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    fullDate: d.date,
    temperature: d.temperature,
    quality: d.quality
  }))

  const handleClick = (data: any) => {
    if (onPointClick && data && data.activePayload) {
      const payload = data.activePayload[0].payload
      const originalData = data.find((d: StationData) => d.date === payload.fullDate)
      if (originalData) {
        onPointClick(originalData)
      }
    }
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-bg-secondary rounded-lg border border-border-primary">
        <p className="text-text-secondary">No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-64 bg-bg-secondary rounded-lg p-4 border border-border-primary">
      {stationName && (
        <h3 className="text-lg font-semibold mb-2 text-text-primary">{stationName}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          onClick={handleClick}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
          <XAxis
            dataKey="date"
            stroke="#4a5568"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { fill: '#4a5568' } }}
            stroke="#4a5568"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #10b981',
              borderRadius: '4px',
              color: '#1a1a1a'
            }}
            labelStyle={{ color: '#1a1a1a' }}
          />
          <Legend wrapperStyle={{ color: '#1a1a1a' }} />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3, fill: '#10b981' }}
            activeDot={{ r: 6 }}
            name="Temperature (°C)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

