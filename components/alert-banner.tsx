"use client"

import { AlertTriangle, AlertCircle, X } from 'lucide-react'
import { useState } from "react"
import type { Alert } from "@/lib/sensor-alerts"

interface AlertBannerProps {
  alerts: Alert[]
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<string[]>([])

  if (alerts.length === 0) return null

  const visibleAlerts = alerts.filter((_, idx) => !dismissed.includes(`${idx}`))

  if (visibleAlerts.length === 0) return null

  return (
    <div className="space-y-2 mb-4">
      {visibleAlerts.map((alert, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl flex items-start gap-3 ${
            alert.severity === "critical"
              ? "bg-red-50 border border-red-200"
              : "bg-yellow-50 border border-yellow-200"
          }`}
        >
          {alert.severity === "critical" ? (
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                alert.severity === "critical" ? "text-red-900" : "text-yellow-900"
              }`}
            >
              {alert.message}
            </p>
          </div>
          <button
            onClick={() => setDismissed([...dismissed, `${idx}`])}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
