"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone } from 'lucide-react'
import { UnlinkModal } from "./unlink-modal"

interface SensorLinkedCardProps {
  sensor: {
    id: string
    name: string
    model: string
    manufacturer: string
  }
  userId: string
}

export function SensorLinkedCard({ sensor, userId }: SensorLinkedCardProps) {
  const [showUnlinkModal, setShowUnlinkModal] = useState(false)

  return (
    <>
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg border-0">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{sensor.name}</h3>
            <p className="text-sm text-slate-600">Model: {sensor.model}</p>
            <p className="text-xs text-slate-500">by {sensor.manufacturer}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-white text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-200"
            onClick={() => setShowUnlinkModal(true)}
          >
            Unlink Sensor
          </Button>
        </div>
      </Card>

      {showUnlinkModal && (
        <UnlinkModal
          userId={userId}
          sensorName={sensor.name}
          onClose={() => setShowUnlinkModal(false)}
        />
      )}
    </>
  )
}
