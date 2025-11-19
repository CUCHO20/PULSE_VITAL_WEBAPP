"use client"

import { useState, useMemo } from "react"
import { Heart } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RealTimeChart } from "@/components/real-time-chart"
import { AlertBanner } from "@/components/alert-banner"
import { useSensorReadings } from "@/lib/use-sensor-readings"
import { getAlerts } from "@/lib/sensor-alerts"
import { useRouter } from 'next/navigation'

interface HeartRateCardProps {
  sensorName: string | null
}

export function HeartRateCard({ sensorName }: HeartRateCardProps) {
  const { readings } = useSensorReadings(sensorName, 1000)
  const router = useRouter()

  const { currentHeartRate, chartData } = useMemo(() => {
    if (readings.length === 0) {
      return { currentHeartRate: 0, chartData: [] }
    }

    const current = readings[0].heart_rate
    const data = readings.slice(0, 20).map(r => ({
      timestamp: r.timestamp,
      value: r.heart_rate
    }))

    return { currentHeartRate: current, chartData: data }
  }, [readings])

  const alerts = useMemo(() => getAlerts(currentHeartRate, 0), [currentHeartRate])
  const heartRateAlerts = alerts.filter(a => a.type.includes("heart_rate") || a.type === "sensor_disconnected")

  return (
    <Card className="p-6 bg-white rounded-3xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Heart Rate</h3>
            <p className="text-sm text-slate-500">BPM</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-slate-900">{currentHeartRate}</div>
          <p className="text-xs text-slate-500">beats/min</p>
        </div>
      </div>

      {!sensorName ? (
        <p className="text-slate-500 text-sm text-center py-4">Link a sensor to see heart rate data</p>
      ) : chartData.length > 0 ? (
        <>
          <div className="mb-4 bg-slate-50 rounded-2xl p-4">
            <RealTimeChart data={chartData} color="#dc2626" height={200} />
          </div>

          <AlertBanner alerts={heartRateAlerts} />

          <Button
            onClick={() => router.push("/dashboard/heart-rate-details")}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            See More
          </Button>
        </>
      ) : (
        <p className="text-slate-500 text-sm text-center py-4">Waiting for sensor data...</p>
      )}
    </Card>
  )
}
