"use client"

import { useState } from "react"
import { Utensils, Leaf, Wheat, Salad } from "lucide-react"

interface EatingHabitsStepProps {
  data: any
  updateData: (data: any) => void
}

export function EatingHabitsStep({ data, updateData }: EatingHabitsStepProps) {
  const [selected, setSelected] = useState<string[]>(data.eatingHabits || [])

  const habits = [
    { id: "balanced", label: "Balanced Diet", icon: Salad, color: "bg-gray-100" },
    { id: "vegetarian", label: "Mostly Vegetarian", icon: Leaf, color: "bg-red-500" },
    { id: "lowcarb", label: "Low Carb", icon: Utensils, color: "bg-gray-100" },
    { id: "glutenfree", label: "Gluten Free", icon: Wheat, color: "bg-gray-100" },
  ]

  const handleSelect = (habitId: string) => {
    const newSelected = selected.includes(habitId) ? selected.filter((id) => id !== habitId) : [...selected, habitId]
    setSelected(newSelected)
    updateData({ eatingHabits: newSelected })
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-balance">What is your usual eating habits?</h1>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {habits.map((habit) => {
          const Icon = habit.icon
          const isSelected = selected.includes(habit.id)

          return (
            <button
              key={habit.id}
              onClick={() => handleSelect(habit.id)}
              className={`rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all ${
                isSelected
                  ? "bg-red-500 text-white scale-105 shadow-lg"
                  : "bg-gray-100 text-slate-700 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-10 h-10" />
              <span className="text-sm font-semibold text-center leading-tight">{habit.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
