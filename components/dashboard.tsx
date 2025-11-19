"use client"

import { useState, useEffect } from "react"
import { Heart, Droplets, Moon } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/client"
import { useRouter } from 'next/navigation'
import { SensorLinkCard } from "@/components/sensor-link-card"
import { SensorLinkedCard } from "@/components/sensor-linked-card"
import { HeartRateCard } from "@/components/heart-rate-card"
import { BloodOxygenCard } from "@/components/blood-oxygen-card"

interface DashboardProps {
  user: any
  profile: any
}

export function Dashboard({ user, profile }: DashboardProps) {
  const [username, setUsername] = useState("")
  const [linkedSensor, setLinkedSensor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setUsername(profile?.username || user?.email || "User")
  }, [profile, user])

  useEffect(() => {
    const fetchLinkedSensor = async () => {
      const supabase = createClient()
      
      try {
        const { data: updatedProfile } = await supabase
          .from("profiles")
          .select("sensor_id")
          .eq("id", user.id)
          .single()
        
        if (updatedProfile?.sensor_id) {
          const { data: sensor } = await supabase
            .from("sensors")
            .select("*")
            .eq("id", updatedProfile.sensor_id)
            .single()
          
          setLinkedSensor(sensor)
        } else {
          setLinkedSensor(null)
        }
      } catch (err) {
        console.error("Error fetching linked sensor:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLinkedSensor()
    const interval = setInterval(fetchLinkedSensor, 5000)

    return () => clearInterval(interval)
  }, [user.id])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 pb-20">
      <div className="max-w-2xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Hi, {username}! 👋</h1>
            <p className="text-slate-600">Track your vitals and stay healthy.</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="rounded-xl"
          >
            Logout
          </Button>
        </div>

        {/* Sensor Section */}
        <div className="mb-8">
          {!loading && (
            linkedSensor ? (
              <SensorLinkedCard sensor={linkedSensor} userId={user.id} />
            ) : (
              <SensorLinkCard />
            )
          )}
        </div>

        {/* Vital Signs Cards */}
        <div className="space-y-4 mb-8">
          <HeartRateCard sensorName={linkedSensor?.name} />

          <BloodOxygenCard sensorName={linkedSensor?.name} />

          <Card className="p-6 bg-white rounded-3xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Moon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Sleep Quality</h3>
                  <p className="text-sm text-slate-500">Recent</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-slate-900">--</div>
            </div>
          </Card>

          {linkedSensor && (
            <Button
              onClick={() => router.push('/dashboard/sensor-history')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
            >
              View Sensor History
            </Button>
          )}
        </div>

        {/* User Info Summary */}
        <Card className="p-6 bg-white rounded-3xl shadow-lg">
          <h3 className="font-semibold text-slate-900 mb-4">Your Profile</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Username</p>
              <p className="font-semibold text-slate-900">{username}</p>
            </div>
            <div>
              <p className="text-slate-500">Email</p>
              <p className="font-semibold text-slate-900 text-xs">{user?.email}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
