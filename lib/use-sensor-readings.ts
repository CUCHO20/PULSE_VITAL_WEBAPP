import { useState, useEffect } from "react"

interface SensorReading {
  timestamp: string
  ir_value: number
  red_value: number
  heart_rate: number
  spo2: number
  temperature: number | null
  device_id: string
  id: string
}

export function useSensorReadings(sensorName: string | null, limit: number = 1000) {
  const [readings, setReadings] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sensorName) {
      setReadings([])
      return
    }

    const fetchReadings = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://pulse-vital-api.onrender.com/sensor/readings/${sensorName}?limit=${limit}`
        )
        
        if (!response.ok) throw new Error("Failed to fetch sensor readings")
        
        const data = await response.json()
        const reversedData = Array.isArray(data) ? [...data].reverse() : []
        setReadings(reversedData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchReadings()
    const interval = setInterval(fetchReadings, 5000)

    return () => clearInterval(interval)
  }, [sensorName, limit])

  return { readings, loading, error }
}
