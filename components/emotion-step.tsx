"use client"

import { useState } from "react"

interface EmotionStepProps {
  data: any
  updateData: (data: any) => void
}

export function EmotionStep({ data, updateData }: EmotionStepProps) {
  const [selected, setSelected] = useState(data.emotion || "neutral")

  const emotions = [
    { id: "sad", label: "Sad", icon: "😢" },
    { id: "neutral", label: "Neutral", icon: "😐" },
    { id: "happy", label: "Happy", icon: "😊" },
  ]

  const handleSelect = (emotionId: string) => {
    setSelected(emotionId)
    updateData({ emotion: emotionId })
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-12 text-balance">What is your current emotion right now?</h1>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex gap-4 mb-8">
          {emotions.map((emotion) => (
            <button
              key={emotion.id}
              onClick={() => handleSelect(emotion.id)}
              className={`w-28 h-28 rounded-3xl flex items-center justify-center text-6xl transition-all ${
                selected === emotion.id ? "bg-blue-600 scale-110 shadow-xl" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {emotion.icon}
            </button>
          ))}
        </div>

        <p className="text-base text-slate-700 font-medium">
          I'm feeling {emotions.find((e) => e.id === selected)?.label.toLowerCase()}.
        </p>
      </div>
    </div>
  )
}
