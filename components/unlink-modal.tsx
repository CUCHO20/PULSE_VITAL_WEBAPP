"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'
import { unlinkSensor } from "@/lib/sensor-actions"
import { useRouter } from 'next/navigation'

interface UnlinkModalProps {
  userId: string
  sensorName: string
  onClose: () => void
}

export function UnlinkModal({ userId, sensorName, onClose }: UnlinkModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleUnlink = async () => {
    setIsLoading(true)
    const result = await unlinkSensor(userId)
    
    if (result.success) {
      router.refresh()
      onClose()
    }
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm p-6 bg-white rounded-3xl shadow-xl border-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
          Unlink Sensor?
        </h2>
        <p className="text-slate-600 text-center mb-6">
          Are you sure you want to unlink <strong>{sensorName}</strong>? You can link it again later.
        </p>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isLoading}
            className="flex-1 rounded-xl border-slate-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUnlink}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            {isLoading ? "Unlinking..." : "Unlink"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
