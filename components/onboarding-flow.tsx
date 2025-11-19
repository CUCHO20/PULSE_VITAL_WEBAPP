"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { createClient } from "@/lib/client"
import { SleepLevelStep } from "./onboarding-steps/sleep-level-step"
import { EmotionStep } from "./onboarding-steps/emotion-step"
import { EatingHabitsStep } from "./onboarding-steps/eating-habits-step"
import { MedicationsStep } from "./onboarding-steps/medications-step"
import { SymptomsStep } from "./onboarding-steps/symptoms-step"
import { HealthGoalStep } from "./onboarding-steps/health-goal-step"
import { GenderStep } from "./onboarding-steps/gender-step"
import { WeightStep } from "./onboarding-steps/weight-step"
import { AgeStep } from "./onboarding-steps/age-step"
import { BloodTypeStep } from "./onboarding-steps/blood-type-step"

interface OnboardingFlowProps {
  user: any
}

export function OnboardingFlow({ user }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [formData, setFormData] = useState({
    sleepLevel: 3,
    sleepHours: "5-8hr daily",
    emotion: "neutral",
    eatingHabits: [] as string[],
    medications: [] as string[],
    symptoms: [] as string[],
    healthGoals: [] as string[],
    gender: "",
    weight: 140,
    weightUnit: "lbs",
    age: 19,
    bloodType: "A+",
  })

  const totalSteps = 10

  const steps = [
    { component: SleepLevelStep, key: "sleepLevel" },
    { component: EmotionStep, key: "emotion" },
    { component: EatingHabitsStep, key: "eatingHabits" },
    { component: MedicationsStep, key: "medications" },
    { component: SymptomsStep, key: "symptoms" },
    { component: HealthGoalStep, key: "healthGoals" },
    { component: GenderStep, key: "gender" },
    { component: WeightStep, key: "weight" },
    { component: AgeStep, key: "age" },
    { component: BloodTypeStep, key: "bloodType" },
  ]

  const CurrentStepComponent = steps[currentStep].component

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsSubmitting(true)
      setError(null)
      try {
        const supabase = createClient()
        
        console.log("[v0] Starting onboarding completion for user:", user.id)
        
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
        
        console.log("[v0] Existing profile:", existingProfile, "Error:", fetchError)
        
        if (!existingProfile || existingProfile.length === 0) {
          console.log("[v0] Creating new profile for user:", user.id)
          const { error: createProfileError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              username: user.user_metadata?.username || "User",
              onboarding_completed: false,
            })
          
          if (createProfileError) {
            console.error("[v0] Error creating profile:", createProfileError)
            throw createProfileError
          }
        }
        
        console.log("[v0] Inserting health data")
        const { error: healthDataError } = await supabase.from("health_data").insert({
          user_id: user.id,
          sleep_level: formData.sleepLevel,
          sleep_hours: formData.sleepHours,
          emotion: formData.emotion,
          eating_habits: formData.eatingHabits,
          medications: formData.medications,
          symptoms: formData.symptoms,
          health_goals: formData.healthGoals,
          gender: formData.gender,
          weight: formData.weight,
          weight_unit: formData.weightUnit,
          age: formData.age,
          blood_type: formData.bloodType,
        })

        if (healthDataError) {
          console.error("[v0] Error saving health data:", healthDataError)
          throw healthDataError
        }

        console.log("[v0] Marking onboarding as completed")
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ onboarding_completed: true })
          .eq("id", user.id)

        if (profileError) {
          console.error("[v0] Error updating profile:", profileError)
          throw profileError
        }

        console.log("[v0] Onboarding completed successfully, redirecting to dashboard")
        router.push("/dashboard")
      } catch (error) {
        console.error("[v0] Error in onboarding:", error)
        setError(error instanceof Error ? error.message : "An error occurred while saving your data")
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 md:p-8 pb-4 max-w-2xl mx-auto w-full">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="w-10 h-10 rounded-xl border-2 border-gray-200 bg-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 mx-4">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-800 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleSkip}
          disabled={isSubmitting}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 md:px-8 pb-6 flex flex-col max-w-2xl mx-auto w-full">
        <CurrentStepComponent data={formData} updateData={updateFormData} />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Continue Button */}
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-base font-semibold mt-auto"
        >
          {isSubmitting ? "Saving..." : "Continue"}
          {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </div>
  )
}
