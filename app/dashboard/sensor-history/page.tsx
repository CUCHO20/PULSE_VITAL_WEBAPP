"use client"

import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/client"
import { ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useSensorReadings } from "@/lib/use-sensor-readings"
import { useRouter } from 'next/navigation'
import { HistoryFilterTabs } from "@/components/history-filter-tabs"

type TimePeriod = "1day" | "7days" | "1month" | "1year" | "all"

export default function SensorHistoryPage() {
  const router = useRouter()
  const [linkedSensorName, setLinkedSensorName] = useState<string | null>(null)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1day")
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
    const interval = setInterval(fetchSensorName, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredReadings = useMemo(() => {
    const now = new Date()
    let cutoffDate = new Date()

    switch (timePeriod) {
      case "1day":
        cutoffDate.setDate(now.getDate() - 1)
        break
      case "7days":
        cutoffDate.setDate(now.getDate() - 7)
        break
      case "1month":
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case "1year":
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      case "all":
        cutoffDate = new Date(0)
        break
    }

    return readings.filter(r => new Date(r.timestamp) >= cutoffDate)
  }, [readings, timePeriod])

  const stats = useMemo(() => {
    if (filteredReadings.length === 0) {
      return { avgHR: 0, maxHR: 0, minHR: 0, avgSpo2: 0, maxSpo2: 0, minSpo2: 0 }
    }

    const validHR = filteredReadings.filter(r => r.heart_rate > 0).map(r => r.heart_rate)
    const validSpo2 = filteredReadings.filter(r => r.spo2 > 0).map(r => r.spo2)

    return {
      avgHR: validHR.length > 0 ? Math.round(validHR.reduce((a, b) => a + b) / validHR.length) : 0,
      maxHR: validHR.length > 0 ? Math.max(...validHR) : 0,
      minHR: validHR.length > 0 ? Math.min(...validHR) : 0,
      avgSpo2: validSpo2.length > 0 ? Math.round(validSpo2.reduce((a, b) => a + b) / validSpo2.length) : 0,
      maxSpo2: validSpo2.length > 0 ? Math.max(...validSpo2) : 0,
      minSpo2: validSpo2.length > 0 ? Math.min(...validSpo2) : 0,
    }
  }, [filteredReadings])

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
          <h1 className="text-3xl font-bold text-slate-900">Sensor History</h1>
        </div>

        {/* Filter Tabs */}
        <HistoryFilterTabs currentPeriod={timePeriod} onChange={setTimePeriod} />

        {/* Heart Rate Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Heart Rate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-white rounded-2xl">
              <p className="text-slate-600 text-sm mb-2">Average</p>
              <p className="text-4xl font-bold text-red-600">{stats.avgHR}</p>
              <p className="text-xs text-slate-500">BPM</p>
            </Card>
            <Card className="p-6 bg-white rounded-2xl">
              <p className="text-slate-600 text-sm mb-2">Maximum</p>
              <p className="text-4xl font-bold text-orange-600">{stats.maxHR}</p>
              <p className="text-xs text-slate-500">BPM</p>
            </Card>
            <Card className="p-6 bg-white rounded-2xl">
              <p className="text-slate-600 text-sm mb-2">Minimum</p>
              <p className="text-4xl font-bold text-blue-600">{stats.minHR}</p>
              <p className="text-xs text-slate-500">BPM</p>
            </Card>
          </div>
        </div>

        {/* Blood Oxygen Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Blood Oxygen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-white rounded-2xl">
              <p className="text-slate-600 text-sm mb-2">Average</p>
              <p className="text-4xl font-bold text-green-600">{stats.avgSpo2}%</p>
              <p className="text-xs text-slate-500">SpO2</p>
            </Card>
            <Card className="p-6 bg-white rounded-2xl">
              <p className="text-slate-600 text-sm mb-2">Maximum</p>
              <p className="text-4xl font-bold text-green-600">{stats.maxSpo2}%</p>
              <p className="text-xs text-slate-500">SpO2</p>
            </Card>
            <Card className="p-6 bg-white rounded-2xl">
              <p className="text-slate-600 text-sm mb-2">Minimum</p>
              <p className="text-4xl font-bold text-orange-600">{stats.minSpo2}%</p>
              <p className="text-xs text-slate-500">SpO2</p>
            </Card>
          </div>
        </div>

        {/* Recent Readings */}
        <Card className="p-6 bg-white rounded-3xl shadow-lg">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Readings ({filteredReadings.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredReadings.length > 0 ? (
              filteredReadings.slice(0, 50).map((reading, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">
                      {new Date(reading.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-red-600 font-semibold">{reading.heart_rate} BPM</span>
                    <span className="text-blue-600 font-semibold">{reading.spo2}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm text-center py-8">No readings for this period</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
