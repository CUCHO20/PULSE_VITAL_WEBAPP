"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"

interface WeightStepProps {
  data: any
  updateData: (data: any) => void
}

export function WeightStep({ data, updateData }: WeightStepProps) {
  const [weight, setWeight] = useState(data.weight || 140)
  const [unit, setUnit] = useState(data.weightUnit || "lbs")

  const handleWeightChange = (value: number) => {
    const minWeight = unit === "lbs" ? 80 : 40
    const maxWeight = unit === "lbs" ? 300 : 150
    const validWeight = Math.max(minWeight, Math.min(maxWeight, value))

    setWeight(validWeight)
    updateData({ weight: validWeight, weightUnit: unit })
  }

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit)
    updateData({ weight, weightUnit: newUnit })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setWeight(0)
      return
    }
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue)) {
      handleWeightChange(numValue)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-12 text-balance">What is your weight?</h1>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Unit Toggle */}
        <div className="flex gap-2 mb-8 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => handleUnitChange("lbs")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              unit === "lbs" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            lbs
          </button>
          <button
            onClick={() => handleUnitChange("kg")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              unit === "kg" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            kg
          </button>
        </div>

        <div className="flex items-baseline gap-2 mb-12">
          <Input
            type="number"
            value={weight}
            onChange={handleInputChange}
            className="text-8xl font-bold text-slate-900 border-none text-center w-auto max-w-xs p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min={unit === "lbs" ? 80 : 40}
            max={unit === "lbs" ? 300 : 150}
          />
          <div className="text-2xl text-slate-500">{unit}</div>
        </div>

        {/* Slider */}
        <div className="w-full max-w-xs relative h-48">
          <input
            type="range"
            min={unit === "lbs" ? 80 : 40}
            max={unit === "lbs" ? 300 : 150}
            value={weight}
            onChange={(e) => handleWeightChange(Number.parseInt(e.target.value))}
            orient="vertical"
            className="absolute left-1/2 -translate-x-1/2 h-full w-2 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 rounded-full appearance-none cursor-pointer [writing-mode:bt-lr] [-webkit-appearance:slider-vertical] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-xl [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white"
          />

          {/* Scale Markers */}
          <div className="absolute left-1/2 -translate-x-1/2 h-full flex flex-col justify-between py-2 pointer-events-none">
            <span className="text-xs text-slate-400">{unit === "lbs" ? "300" : "150"}</span>
            <span className="text-xs text-slate-400">{unit === "lbs" ? "190" : "95"}</span>
            <span className="text-xs text-slate-400">{unit === "lbs" ? "80" : "40"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
