"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface MedicationsStepProps {
  data: any
  updateData: (data: any) => void
}

const medicationsList = [
  "Abilify",
  "Abilify Maintena",
  "Abraterone",
  "Acetaminophen",
  "Actemra",
  "Axpelliamus",
  "Aspirin",
  "Ibuprofen",
  "Lisinopril",
  "Metformin",
  "Amoxicillin",
  "Azithromycin",
  "Benadryl",
  "Ciprofloxacin",
  "Clonazepam",
  "Doxycycline",
  "Xanax",
  "Zyrtec",
]

export function MedicationsStep({ data, updateData }: MedicationsStepProps) {
  const [selected, setSelected] = useState<string[]>(data.medications || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeLetters, setActiveLetters] = useState<string[]>([])

  const filteredMedications = medicationsList.filter((med) => {
    const matchesSearch = searchTerm === "" || med.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLetters = activeLetters.length === 0 || activeLetters.some((letter) => med.startsWith(letter))
    return matchesSearch && matchesLetters
  })

  const handleToggle = (medication: string) => {
    const newSelected = selected.includes(medication)
      ? selected.filter((m) => m !== medication)
      : [...selected, medication]
    setSelected(newSelected)
    updateData({ medications: newSelected })
  }

  const handleRemove = (medication: string) => {
    const newSelected = selected.filter((m) => m !== medication)
    setSelected(newSelected)
    updateData({ medications: newSelected })
  }

  const handleLetterToggle = (letter: string) => {
    setActiveLetters((prev) => (prev.includes(letter) ? prev.filter((l) => l !== letter) : [...prev, letter]))
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-3xl font-bold text-slate-900 mb-6 text-balance">What medications do you take?</h1>

      {/* Letter Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["A", "B", "C", "D", "X", "Y", "Z"].map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterToggle(letter)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
              activeLetters.includes(letter) ? "bg-blue-600 text-white" : "bg-gray-100 text-slate-700 hover:bg-gray-200"
            }`}
          >
            {letter}
          </button>
        ))}
        <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search medications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Medications List */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((medication) => (
            <button
              key={medication}
              onClick={() => handleToggle(medication)}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                selected.includes(medication) ? "bg-blue-600 text-white" : "bg-gray-50 text-slate-700 hover:bg-gray-100"
              }`}
            >
              {medication}
            </button>
          ))
        ) : (
          <p className="text-center text-slate-500 py-8">No medications found</p>
        )}
      </div>

      {/* Selected Medications */}
      {selected.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">Selected:</p>
          <div className="flex flex-wrap gap-2">
            {selected.map((medication) => (
              <Badge key={medication} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 pr-1">
                {medication}
                <button onClick={() => handleRemove(medication)} className="ml-2 hover:bg-blue-300 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
