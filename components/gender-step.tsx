"use client"

import { useState } from "react"

interface GenderStepProps {
  data: any
  updateData: (data: any) => void
}

export function GenderStep({ data, updateData }: GenderStepProps) {
  const [selected, setSelected] = useState(data.gender || "")

  const genders = [
    { id: "female", label: "Female", color: "from-pink-400 to-red-400", icon: "♀" },
    { id: "male", label: "I Am Male", color: "from-blue-500 to-blue-600", icon: "♂" },
    { id: "other", label: "Other", color: "from-purple-500 to-purple-600", icon: "⚧" },
  ]

  const handleSelect = (genderId: string) => {
    setSelected(genderId)
    updateData({ gender: genderId })
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-4 text-balance">What is your Gender?</h1>
      <p className="text-sm text-slate-600 mb-8">
        Please select your gender for better personalized health experience.
      </p>

      <div className="flex-1 flex items-center justify-center gap-4">
        {genders.map((gender) => (
          <button
            key={gender.id}
            onClick={() => handleSelect(gender.id)}
            className={`relative w-32 h-44 rounded-3xl bg-gradient-to-br ${gender.color} flex flex-col items-center justify-center text-white transition-all ${
              selected === gender.id ? "scale-110 shadow-2xl ring-4 ring-blue-600" : "opacity-60 hover:opacity-80"
            }`}
          >
            <div className="text-6xl mb-2">{gender.icon}</div>
            <span className="text-sm font-semibold">{gender.label}</span>
            {selected === gender.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <button className="text-sm text-blue-600 font-medium py-3 hover:text-blue-700">Prefer to skip this →</button>
      )}
    </div>
  )
}
