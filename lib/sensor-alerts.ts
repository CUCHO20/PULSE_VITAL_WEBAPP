export interface Alert {
  type: "heart_rate_low" | "heart_rate_high" | "spo2_low" | "sensor_disconnected"
  message: string
  severity: "warning" | "critical"
}

export function getAlerts(heartRate: number, spo2: number): Alert[] {
  const alerts: Alert[] = []

  if (heartRate === 0) {
    alerts.push({
      type: "sensor_disconnected",
      message: "Sensor not detecting heart rate. Please ensure sensor contact.",
      severity: "critical"
    })
  } else {
    if (heartRate < 60) {
      alerts.push({
        type: "heart_rate_low",
        message: `Low heart rate detected: ${heartRate} BPM`,
        severity: "warning"
      })
    }
    if (heartRate > 100) {
      alerts.push({
        type: "heart_rate_high",
        message: `High heart rate detected: ${heartRate} BPM`,
        severity: "critical"
      })
    }
  }

  if (spo2 === 0) {
    alerts.push({
      type: "sensor_disconnected",
      message: "Sensor not detecting blood oxygen. Please ensure sensor contact.",
      severity: "critical"
    })
  } else if (spo2 < 95) {
    alerts.push({
      type: "spo2_low",
      message: `Low blood oxygen detected: ${spo2}%`,
      severity: "critical"
    })
  }

  return alerts
}

export function getHeartRateRecommendations(heartRate: number): string[] {
  if (heartRate === 0) {
    return ["Ensure the sensor is properly placed on your wrist or finger", "Check sensor battery level"]
  }
  if (heartRate < 60) {
    return [
      "Your heart rate is lower than normal. Rest and relax.",
      "Stay hydrated and avoid strenuous activity.",
      "If this persists, consult a healthcare professional."
    ]
  }
  if (heartRate > 100) {
    return [
      "Your heart rate is elevated. Try to calm down and breathe deeply.",
      "Avoid stimulating activities or caffeine.",
      "Sit down and rest for a few minutes.",
      "If elevated heart rate persists, seek medical advice."
    ]
  }
  return [
    "Your heart rate is in a normal range.",
    "Continue maintaining healthy lifestyle habits.",
    "Regular exercise and stress management are beneficial."
  ]
}

export function getBloodOxygenRecommendations(spo2: number): string[] {
  if (spo2 === 0) {
    return ["Ensure the sensor is properly placed on your wrist or finger", "Check sensor battery level"]
  }
  if (spo2 < 95) {
    return [
      "Your blood oxygen level is lower than normal.",
      "Ensure proper ventilation and take deep breaths.",
      "Rest and avoid strenuous activities.",
      "Seek immediate medical attention if symptoms worsen."
    ]
  }
  return [
    "Your blood oxygen level is healthy.",
    "Maintain regular physical activity for optimal oxygen saturation.",
    "Continue monitoring your levels regularly."
  ]
}
