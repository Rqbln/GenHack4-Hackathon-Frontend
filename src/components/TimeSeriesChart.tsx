import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { StationData } from '../types/station'

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
      <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded-lg">
        <p className="text-gray-400">No data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-64 bg-gray-800 rounded-lg p-4">
      {stationName && (
        <h3 className="text-lg font-semibold mb-2 text-white">{stationName}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          onClick={handleClick}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="date"
            stroke="#999"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { fill: '#999' } }}
            stroke="#999"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#fff'
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ff4444"
            strokeWidth={2}
            dot={{ r: 3, fill: '#ff4444' }}
            activeDot={{ r: 6 }}
            name="Temperature (°C)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

