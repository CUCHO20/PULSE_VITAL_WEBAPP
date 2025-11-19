"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/client"
import { ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RealTimeChart } from "@/components/real-time-chart"
import { AlertBanner } from "@/components/alert-banner"
import { useSensorReadings } from "@/lib/use-sensor-readings"
import { getAlerts, getBloodOxygenRecommendations } from "@/lib/sensor-alerts"
import { useRouter } from 'next/navigation'

export default function BloodOxygenDetailsPage() {
  const router = useRouter()
  const [linkedSensorName, setLinkedSensorName] = useState<string | null>(null)
  const { readings } = useSensorReadings(linkedSensorName, 1000)

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

  const { currentSpo2, chartData, avgSpo2, minSpo2 } = useMemo(() => {
    if (readings.length === 0) {
      return { currentSpo2: 0, chartData: [], avgSpo2: 0, minSpo2: 0 }
    }

    const current = readings[0].spo2
    const data = readings.map(r => ({
      timestamp: r.timestamp,
      value: r.spo2
    }))
    
    const validReadings = readings.filter(r => r.spo2 > 0).map(r => r.spo2)
    const avg = validReadings.length > 0 ? Math.round(validReadings.reduce((a, b) => a + b) / validReadings.length) : 0
    const min = validReadings.length > 0 ? Math.min(...validReadings) : 0

    return { currentSpo2: current, chartData: data, avgSpo2: avg, minSpo2: min }
  }, [readings])

  const alerts = useMemo(() => getAlerts(0, currentSpo2), [currentSpo2])
  const recommendations = useMemo(() => getBloodOxygenRecommendations(currentSpo2), [currentSpo2])
  const spo2Alerts = alerts.filter(a => a.type.includes("spo2") || a.type === "sensor_disconnected")

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
          <h1 className="text-3xl font-bold text-slate-900">Blood Oxygen Details</h1>
        </div>

        {/* Alerts */}
        <AlertBanner alerts={spo2Alerts} />

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white rounded-2xl">
            <p className="text-slate-600 text-sm mb-2">Current</p>
            <p className="text-4xl font-bold text-blue-600">{currentSpo2}%</p>
            <p className="text-xs text-slate-500">SpO2</p>
          </Card>
          <Card className="p-6 bg-white rounded-2xl">
            <p className="text-slate-600 text-sm mb-2">Average</p>
            <p className="text-4xl font-bold text-green-600">{avgSpo2}%</p>
            <p className="text-xs text-slate-500">SpO2</p>
          </Card>
          <Card className="p-6 bg-white rounded-2xl">
            <p className="text-slate-600 text-sm mb-2">Minimum</p>
            <p className="text-4xl font-bold text-orange-600">{minSpo2}%</p>
            <p className="text-xs text-slate-500">SpO2</p>
          </Card>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card className="p-6 bg-white rounded-3xl shadow-lg mb-8">
            <h3 className="font-semibold text-slate-900 mb-4">Blood Oxygen Trend</h3>
            <div className="bg-slate-50 rounded-2xl p-4">
              <RealTimeChart data={chartData} color="#2563eb" height={300} />
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
