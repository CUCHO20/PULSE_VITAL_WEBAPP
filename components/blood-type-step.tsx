"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

interface BloodTypeStepProps {
  data: any
  updateData: (data: any) => void
}

export function BloodTypeStep({ data, updateData }: BloodTypeStepProps) {
  const [bloodType, setBloodType] = useState(data.bloodType || "A+")

  const types = ["A", "B", "AB", "O"]
  const [selectedType, setSelectedType] = useState(bloodType.replace("+", "").replace("-", ""))
  const [selectedRh, setSelectedRh] = useState(bloodType.includes("+") ? "+" : "-")

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    const newBloodType = `${type}${selectedRh}`
    setBloodType(newBloodType)
    updateData({ bloodType: newBloodType })
  }

  const handleRhToggle = (rh: string) => {
    setSelectedRh(rh)
    const newBloodType = `${selectedType}${rh}`
    setBloodType(newBloodType)
    updateData({ bloodType: newBloodType })
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-12 text-balance">What's your official blood type?</h1>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Blood Type Buttons */}
        <div className="flex gap-3 mb-8">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className={`w-16 h-16 rounded-2xl text-xl font-bold transition-all ${
                selectedType === type
                  ? "bg-slate-900 text-white scale-110"
                  : "bg-gray-100 text-slate-700 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Large Blood Type Display */}
        <div className="text-[140px] font-bold text-slate-900 leading-none mb-8 flex items-start">
          {selectedType}
          <span className="text-red-500">{selectedRh}</span>
        </div>

        {/* Rh Factor Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleRhToggle("+")}
            className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all ${
              selectedRh === "+"
                ? "bg-blue-600 text-white shadow-xl scale-110"
                : "bg-gray-100 text-slate-700 hover:bg-gray-200"
            }`}
          >
            <Plus className="w-12 h-12" strokeWidth={3} />
          </button>
          <button
            onClick={() => handleRhToggle("-")}
            className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all ${
              selectedRh === "-"
                ? "bg-blue-600 text-white shadow-xl scale-110"
                : "bg-gray-100 text-slate-700 hover:bg-gray-200"
            }`}
          >
            <Minus className="w-12 h-12" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  )
}
