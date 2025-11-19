"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface AgeStepProps {
  data: any
  updateData: (data: any) => void
}

export function AgeStep({ data, updateData }: AgeStepProps) {
  const [age, setAge] = useState(data.age || 19)

  const handleIncrement = () => {
    const newAge = Math.min(age + 1, 120)
    setAge(newAge)
    updateData({ age: newAge })
  }

  const handleDecrement = () => {
    const newAge = Math.max(age - 1, 1)
    setAge(newAge)
    updateData({ age: newAge })
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-12 text-balance">What is your age?</h1>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Age Picker */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleIncrement}
            className="w-16 h-16 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronUp className="w-8 h-8 text-slate-700" />
          </button>

          {/* Age Display */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-slate-400 text-6xl font-bold opacity-30">{age - 1}</div>
            <div className="w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl">
              <span className="text-7xl font-bold text-white">{age}</span>
            </div>
            <div className="text-slate-400 text-6xl font-bold opacity-30">{age + 1}</div>
          </div>

          <button
            onClick={handleDecrement}
            className="w-16 h-16 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronDown className="w-8 h-8 text-slate-700" />
          </button>
        </div>
      </div>
    </div>
  )
}
