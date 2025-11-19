"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone } from 'lucide-react'

interface SensorCardProps {
  sensor: {
    id: string
    name: string
    model: string
    manufacturer: string
    is_linked: boolean
  }
  onSelect: (sensor: any) => void
}

export function SensorCard({ sensor, onSelect }: SensorCardProps) {
  return (
    <Card className="p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border-0" onClick={() => onSelect(sensor)}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{sensor.name}</h3>
          <p className="text-sm text-slate-500 mb-2">Model: {sensor.model}</p>
          <p className="text-xs text-slate-400">by {sensor.manufacturer}</p>
          {sensor.is_linked && (
            <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg">
              Already linked
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
