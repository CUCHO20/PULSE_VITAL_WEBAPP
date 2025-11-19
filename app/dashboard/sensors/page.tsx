"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/client"
import { SensorCard } from "@/components/sensor-card"
import { SensorModal } from "@/components/sensor-modal"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'

export default function SensorsPage() {
  const [sensors, setSensors] = useState<any[]>([])
  const [selectedSensor, setSelectedSensor] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: sensorsData } = await supabase
        .from("sensors")
        .select("*")

      setSensors(sensorsData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-4 flex items-center justify-center">
        <div className="text-slate-600">Loading sensors...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Available Sensors</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              onSelect={setSelectedSensor}
            />
          ))}
        </div>

        {selectedSensor && user && (
          <SensorModal
            sensor={selectedSensor}
            userId={user.id}
            onClose={() => setSelectedSensor(null)}
          />
        )}
      </div>
    </div>
  )
}
