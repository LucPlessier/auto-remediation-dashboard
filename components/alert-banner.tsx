"use client"

import { useEffect, useState } from "react"
import { AlertService, Alert } from "@/lib/services/alert.service"
import { AlertTriangle, X, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const alertService = new AlertService()

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const fetchedAlerts = await alertService.getAlerts()
        if (!fetchedAlerts) {
          throw new Error("No alerts data received")
        }
        setAlerts(fetchedAlerts.filter(alert => !alert.acknowledged))
        setError(null)
      } catch (error) {
        console.error("Error fetching alerts:", error)
        setError("Failed to load alerts")
        setAlerts([]) // Reset to empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()

    // Subscribe to real-time alerts
    const unsubscribe = alertService.subscribeToAlerts((newAlert) => {
      setAlerts(prev => [newAlert, ...prev.filter(a => !a.acknowledged)])
    })

    return () => unsubscribe()
  }, [])

  const handleDismiss = async (alertId: string) => {
    try {
      const success = await alertService.dismissAlert(alertId)
      if (!success) {
        throw new Error("Failed to dismiss alert")
      }
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    } catch (error) {
      console.error("Error dismissing alert:", error)
      setError("Failed to dismiss alert")
    }
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  if (isLoading || alerts.length === 0) return null

  return (
    <div className="space-y-2 p-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center justify-between px-4 py-3 rounded-lg border ${getAlertStyles(alert.type)}`}
        >
          <div className="flex items-center space-x-3">
            {getAlertIcon(alert.type)}
            <div>
              <p className="font-medium">{alert.title}</p>
              <p className="text-sm opacity-90">{alert.message}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDismiss(alert.id)}
            className="hover:bg-transparent"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      ))}
    </div>
  )
}
