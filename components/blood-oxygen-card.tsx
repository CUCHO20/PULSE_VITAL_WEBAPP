"use client"

import { useState, useMemo } from "react"
import { Droplets } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RealTimeChart } from "@/components/real-time-chart"
import { AlertBanner } from "@/components/alert-banner"
import { useSensorReadings } from "@/lib/use-sensor-readings"
import { getAlerts } from "@/lib/sensor-alerts"
import { useRouter } from 'next/navigation'

interface BloodOxygenCardProps {
  sensorName: string | null
}

export function BloodOxygenCard({ sensorName }: BloodOxygenCardProps) {
  const { readings } = useSensorReadings(sensorName, 1000)
  const router = useRouter()

  const { currentSpo2, chartData } = useMemo(() => {
    if (readings.length === 0) {
      return { currentSpo2: 0, chartData: [] }
    }

    const current = readings[0].spo2
    const data = readings.slice(0, 20).map(r => ({
      timestamp: r.timestamp,
      value: r.spo2
    }))

    return { currentSpo2: current, chartData: data }
  }, [readings])

  const alerts = useMemo(() => getAlerts(0, currentSpo2), [currentSpo2])
  const spo2Alerts = alerts.filter(a => a.type.includes("spo2") || a.type === "sensor_disconnected")

  return (
    <Card className="p-6 bg-white rounded-3xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Blood Oxygen</h3>
            <p className="text-sm text-slate-500">SpO2</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-slate-900">{currentSpo2}%</div>
          <p className="text-xs text-slate-500">saturation</p>
        </div>
      </div>

      {!sensorName ? (
        <p className="text-slate-500 text-sm text-center py-4">Link a sensor to see blood oxygen data</p>
      ) : chartData.length > 0 ? (
        <>
          <div className="mb-4 bg-slate-50 rounded-2xl p-4">
            <RealTimeChart data={chartData} color="#2563eb" height={200} />
          </div>

          <AlertBanner alerts={spo2Alerts} />

          <Button
            onClick={() => router.push("/dashboard/blood-oxygen-details")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
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
