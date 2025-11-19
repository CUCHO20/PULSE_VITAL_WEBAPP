"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface HealthGoalStepProps {
  data: any
  updateData: (data: any) => void
}

export function HealthGoalStep({ data, updateData }: HealthGoalStepProps) {
  const [selected, setSelected] = useState<string>(data.healthGoal || "")

  const goals = [
    { id: "healthy", label: "I wanna get healthy", icon: "💪" },
    { id: "weight", label: "I wanna lose weight", icon: "⚖️" },
    { id: "chatbot", label: "I wanna try AI Chatbot", icon: "🤖" },
    { id: "meds", label: "I wanna manage meds", icon: "💊" },
    { id: "trying", label: "Just trying out the app", icon: "👀" },
  ]

  const handleSelect = (goalId: string) => {
    setSelected(goalId)
    updateData({ healthGoal: goalId })
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-balance">What is your health goal for the app?</h1>

      <div className="flex-1 space-y-3">
        {goals.map((goal) => {
          const isSelected = selected === goal.id

          return (
            <button
              key={goal.id}
              onClick={() => handleSelect(goal.id)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                isSelected ? "bg-blue-600 text-white shadow-lg" : "bg-gray-50 text-slate-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-2xl">{goal.icon}</span>
              <span className="flex-1 text-left font-medium">{goal.label}</span>
              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                  isSelected ? "border-white bg-white" : "border-gray-300"
                }`}
              >
                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
