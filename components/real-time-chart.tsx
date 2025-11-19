"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ChartData {
  timestamp: string
  value: number
}

interface RealTimeChartProps {
  data: ChartData[]
  color: string
  height?: number
  strokeWidth?: number
}

export function RealTimeChart({ data, color, height = 300, strokeWidth = 2 }: RealTimeChartProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  const chartData = data.slice(-30).map(d => ({
    time: formatTime(d.timestamp),
    value: d.value
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="time" stroke="#999" style={{ fontSize: "12px" }} />
        <YAxis stroke="#999" style={{ fontSize: "12px" }} />
        <Tooltip 
          contentStyle={{ backgroundColor: "#fff", border: `2px solid ${color}` }}
          formatter={(value) => `${value}`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={strokeWidth}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
