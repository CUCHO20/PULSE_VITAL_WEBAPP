"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, X } from 'lucide-react'
import { linkSensor } from "@/lib/sensor-actions"
import { useRouter } from 'next/navigation'

interface SensorModalProps {
  sensor: {
    id: string
    name: string
    model: string
    manufacturer: string
    is_linked: boolean
  }
  userId: string
  onClose: () => void
}

export function SensorModal({ sensor, userId, onClose }: SensorModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLink = async () => {
    setIsLoading(true)
    setError("")
    const result = await linkSensor(sensor.id, userId)
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm p-6 bg-white rounded-3xl shadow-xl border-0">
        <div className="flex items-start justify-between mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-blue-600" />
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">{sensor.name}</h2>
        
        <div className="space-y-3 mb-6">
          <div>
            <p className="text-sm text-slate-500">Model</p>
            <p className="font-semibold text-slate-900">{sensor.model}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Manufacturer</p>
            <p className="font-semibold text-slate-900">{sensor.manufacturer}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {sensor.is_linked && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
            This sensor is already linked to another user
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-xl border-slate-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLink}
            disabled={isLoading || sensor.is_linked}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            {isLoading ? "Linking..." : "Link Sensor"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
