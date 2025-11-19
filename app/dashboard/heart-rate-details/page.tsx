"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/client"
import { ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RealTimeChart } from "@/components/real-time-chart"
import { AlertBanner } from "@/components/alert-banner"
import { useSensorReadings } from "@/lib/use-sensor-readings"
import { getAlerts, getHeartRateRecommendations } from "@/lib/sensor-alerts"
import { useRouter } from 'next/navigation'

export default function HeartRateDetailsPage() {
  const router = useRouter()
  const [linkedSensorName, setLinkedSensorName] = useState<string | null>(null)
  const { readings } = useSensorReadings(linkedSensorName, 100)

  useEffect(() => {
    const fetchSensorName = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("sensor_id")
          .eq("id", user.id)
          .single()
        
        if (profile?.sensor_id) {
          const { data: sensor } = await supabase
            .from("sensors")
            .select("name")
            .eq("id", profile.sensor_id)
            .single()
          
          setLinkedSensorName(sensor?.name || null)
        }
      }
    }

    fetchSensorName()
  }, [])

  const { currentHeartRate, chartData, avgHeartRate, maxHeartRate } = useMemo(() => {
    if (readings.length === 0) {
      return { currentHeartRate: 0, chartData: [], avgHeartRate: 0, maxHeartRate: 0 }
    }

    const current = readings[0].heart_rate
    const data = readings.map(r => ({
      timestamp: r.timestamp,
      value: r.heart_rate
    }))
    
    const validReadings = readings.filter(r => r.heart_rate > 0).map(r => r.heart_rate)
    const avg = validReadings.length > 0 ? Math.round(validReadings.reduce((a, b) => a + b) / validReadings.length) : 0
    const max = validReadings.length > 0 ? Math.max(...validReadings) : 0

    return { currentHeartRate: current, chartData: data, avgHeartRate: avg, maxHeartRate: max }
  }, [readings])

  const alerts = useMemo(() => getAlerts(currentHeartRate, 0), [currentHeartRate])
  const recommendations = useMemo(() => getHeartRateRecommendations(currentHeartRate), [currentHeartRate])
  const heartRateAlerts = alerts.filter(a => a.type.includes("heart_rate") || a.type === "sensor_disconnected")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-4 lg:p-8 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
            className="rounded-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Heart Rate Details</h1>
        </div>

        {/* Alerts */}
        <AlertBanner alerts={heartRateAlerts} />

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white rounded-2xl">
            <p className="text-slate-600 text-sm mb-2">Current</p>
            <p className="text-4xl font-bold text-red-600">{currentHeartRate}</p>
            <p className="text-xs text-slate-500">BPM</p>
          </Card>
          <Card className="p-6 bg-white rounded-2xl">
            <p className="text-slate-600 text-sm mb-2">Average</p>
            <p className="text-4xl font-bold text-blue-600">{avgHeartRate}</p>
            <p className="text-xs text-slate-500">BPM</p>
          </Card>
          <Card className="p-6 bg-white rounded-2xl">
            <p className="text-slate-600 text-sm mb-2">Maximum</p>
            <p className="text-4xl font-bold text-orange-600">{maxHeartRate}</p>
            <p className="text-xs text-slate-500">BPM</p>
          </Card>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card className="p-6 bg-white rounded-3xl shadow-lg mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Heart Rate Trend</h3>
            <div className="bg-slate-50 rounded-2xl p-4">
              <RealTimeChart data={chartData} color="#dc2626" height={300} />
            </div>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="p-6 bg-white rounded-3xl shadow-lg">
          <h3 className="font-semibold text-slate-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-sm text-blue-600 font-semibold">
                  {idx + 1}
                </div>
                <p className="text-slate-700 text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
