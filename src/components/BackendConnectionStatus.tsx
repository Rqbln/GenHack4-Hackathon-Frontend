import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

interface BackendConnectionStatusProps {
  onConnectionChange?: (connected: boolean) => void
}

export default function BackendConnectionStatus({ 
  onConnectionChange 
}: BackendConnectionStatusProps) {
  const [connected, setConnected] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      setChecking(true)
      try {
        const isHealthy = await apiService.healthCheck()
        setConnected(isHealthy)
        onConnectionChange?.(isHealthy)
      } catch (error) {
        setConnected(false)
        onConnectionChange?.(false)
      } finally {
        setChecking(false)
      }
    }

    checkConnection()
    
    // Check periodically
    const interval = setInterval(checkConnection, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [onConnectionChange])

  if (checking) {
    return (
      <div className="absolute top-4 right-4 glass-dark px-3 py-2 rounded-lg text-xs text-text-secondary">
        🔄 Checking backend...
      </div>
    )
  }

  return (
    <div
      className={`absolute top-4 right-4 glass-dark px-3 py-2 rounded-lg text-xs font-semibold fade-in hover-lift ${
        connected
          ? 'bg-accent-green-light text-accent-green-dark border border-accent-green'
          : 'bg-red-100 text-red-700 border border-red-300'
      }`}
      title={connected ? 'Backend connected' : 'Backend disconnected'}
    >
      {connected ? '✅ Backend Connected' : '❌ Backend Offline'}
    </div>
  )
}

