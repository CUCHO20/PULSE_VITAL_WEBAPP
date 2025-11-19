"use client"

import { Button } from "@/components/ui/button"

type TimePeriod = "1day" | "7days" | "1month" | "1year" | "all"

interface HistoryFilterTabsProps {
  currentPeriod: TimePeriod
  onChange: (period: TimePeriod) => void
}

export function HistoryFilterTabs({ currentPeriod, onChange }: HistoryFilterTabsProps) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: "1day", label: "1 Day" },
    { value: "7days", label: "7 Days" },
    { value: "1month", label: "1 Month" },
    { value: "1year", label: "1 Year" },
    { value: "all", label: "All Time" },
  ]

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
      {periods.map((period) => (
        <Button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`rounded-xl whitespace-nowrap ${
            currentPeriod === period.value
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-slate-900 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {period.label}
        </Button>
      ))}
    </div>
  )
}
