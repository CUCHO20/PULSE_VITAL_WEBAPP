"use client"

import { useState } from "react"

interface SymptomsStepProps {
  data: any
  updateData: (data: any) => void
}

const symptomsList = [
  "Headache",
  "Muscle Fatigue",
  "Fever",
  "Cough",
  "Nausea",
  "Dizziness",
  "Insomnia",
  "Anxiety",
  "Back Pain",
  "Chest Pain",
]

export function SymptomsStep({ data, updateData }: SymptomsStepProps) {
  const [selected, setSelected] = useState<string[]>(data.symptoms || [])

  const handleToggle = (symptom: string) => {
    const newSelected = selected.includes(symptom) ? selected.filter((s) => s !== symptom) : [...selected, symptom]
    setSelected(newSelected)
    updateData({ symptoms: newSelected })
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-balance">Do you have any symptoms/allergy?</h1>

      {/* Illustration */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Bacteria/virus illustrations */}
            <circle cx="100" cy="100" r="30" fill="#3B82F6" opacity="0.2" />
            <circle cx="60" cy="80" r="20" fill="#60A5FA" opacity="0.3" />
            <circle cx="140" cy="90" r="25" fill="#2563EB" opacity="0.25" />
            <circle cx="80" cy="140" r="18" fill="#3B82F6" opacity="0.3" />
            <circle cx="130" cy="130" r="22" fill="#60A5FA" opacity="0.25" />
          </svg>
        </div>
      </div>

      {/* Symptoms Selection */}
      <div className="flex-1 mb-4">
        <div className="border-2 border-blue-200 rounded-2xl p-4 min-h-[120px]">
          <div className="flex flex-wrap gap-2">
            {symptomsList.slice(0, 6).map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleToggle(symptom)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selected.includes(symptom) ? "bg-blue-600 text-white" : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
        <p className="text-right text-sm text-slate-500 mt-2">{selected.length}/10</p>
      </div>
    </div>
  )
}
