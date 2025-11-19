"use server"

import { createClient } from "@/lib/server"
import { revalidatePath } from "next/cache"

export async function linkSensor(sensorId: string, userId: string) {
  try {
    const supabase = await createClient()

    // Check if sensor is already linked
    const { data: sensor } = await supabase
      .from("sensors")
      .select("*")
      .eq("id", sensorId)
      .single()

    if (sensor?.is_linked && sensor?.linked_user_id !== userId) {
      return { error: "This sensor is already linked to another user" }
    }

    // Check if user already has a sensor
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (userProfile?.sensor_id) {
      return { error: "User already has a linked sensor" }
    }

    // Link the sensor
    const { error: updateSensorError } = await supabase
      .from("sensors")
      .update({
        is_linked: true,
        linked_user_id: userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sensorId)

    if (updateSensorError) throw updateSensorError

    // Update user profile
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        sensor_id: sensorId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateProfileError) throw updateProfileError

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error linking sensor:", error)
    return { error: "Failed to link sensor" }
  }
}

export async function unlinkSensor(userId: string) {
  try {
    const supabase = await createClient()

    // Get user's linked sensor
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("sensor_id")
      .eq("id", userId)
      .single()

    if (!userProfile?.sensor_id) {
      return { error: "User has no linked sensor" }
    }

    const sensorId = userProfile.sensor_id

    // Unlink the sensor
    const { error: updateSensorError } = await supabase
      .from("sensors")
      .update({
        is_linked: false,
        linked_user_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sensorId)

    if (updateSensorError) throw updateSensorError

    // Update user profile
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        sensor_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateProfileError) throw updateProfileError

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error unlinking sensor:", error)
    return { error: "Failed to unlink sensor" }
  }
}
