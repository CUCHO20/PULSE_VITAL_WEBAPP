"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SensorLinkCard() {
  const router = useRouter()

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-lg border-2 border-dashed border-slate-300">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">Link to a Sensor</h3>
        <p className="text-sm text-slate-600 mb-4">
          Connect your device to start tracking your health metrics
        </p>
        <Button
          onClick={() => router.push("/dashboard/sensors")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          Browse Sensors
        </Button>
      </div>
    </Card>
  )
}
