"use client"

import { useState } from "react"

interface SleepLevelStepProps {
  data: any
  updateData: (data: any) => void
}

export function SleepLevelStep({ data, updateData }: SleepLevelStepProps) {
  const [level, setLevel] = useState(data.sleepLevel || 3)

  const handleChange = (value: number) => {
    setLevel(value)
    const labels = ["Poor", "Fair", "Moderate", "Good", "Excellent"]
    const hours = ["<4hr", "4-5hr", "5-8hr", "8-9hr", "9+hr"]
    updateData({
      sleepLevel: value,
      sleepHours: `${hours[value - 1]} daily`,
    })
  }

  const getLabel = () => {
    const labels = ["Poor", "Fair", "Moderate", "Good", "Excellent"]
    return labels[level - 1]
  }

  const getHours = () => {
    const hours = ["<4hr", "4-5hr", "5-8hr", "8-9hr", "9+hr"]
    return hours[level - 1]
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-balance">What is your current sleep level?</h1>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Sleep Level Display */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" fill="currentColor" />
            </svg>
            <span className="text-sm font-medium text-slate-700">{getLabel()}</span>
          </div>
          <p className="text-sm text-slate-500">{getHours()} daily</p>
        </div>

        {/* Large Number */}
        <div className="text-[180px] font-bold text-slate-900 leading-none mb-8">{level}</div>

        {/* Slider */}
        <div className="w-full max-w-xs relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded-full" />

          <input
            type="range"
            min="1"
            max="5"
            value={level}
            onChange={(e) => handleChange(Number.parseInt(e.target.value))}
            className="relative w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-xl [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:rounded-xl [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white"
          />

          {/* Dots */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full flex justify-between px-1 pointer-events-none">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div key={dot} className={`w-3 h-3 rounded-full ${dot <= level ? "bg-blue-600" : "bg-blue-200"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
