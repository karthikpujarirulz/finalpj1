
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, Sync, AlertCircle } from 'lucide-react'

interface SyncStatus {
  isOnline: boolean
  lastSync: string
  pendingChanges: number
  syncProgress: number
  errors: string[]
}

export default function SyncManager() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: new Date().toISOString(),
    pendingChanges: 0,
    syncProgress: 0,
    errors: []
  })
  
  useEffect(() => {
    const handleOnline = () => setSyncStatus(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setSyncStatus(prev => ({ ...prev, isOnline: false }))
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  const handleSync = async () => {
    setSyncStatus(prev => ({ ...prev, syncProgress: 0 }))
    
    // Simulate sync progress
    for (let i = 0; i <= 100; i += 10) {
      setSyncStatus(prev => ({ ...prev, syncProgress: i }))
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setSyncStatus(prev => ({
      ...prev,
      lastSync: new Date().toISOString(),
      pendingChanges: 0,
      syncProgress: 100
    }))
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {syncStatus.isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          Sync Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Connection Status</span>
          <Badge variant={syncStatus.isOnline ? "default" : "destructive"}>
            {syncStatus.isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Pending Changes</span>
          <Badge variant="outline">{syncStatus.pendingChanges}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Last Sync</span>
          <span className="text-sm text-gray-500">
            {new Date(syncStatus.lastSync).toLocaleString()}
          </span>
        </div>
        
        {syncStatus.syncProgress > 0 && syncStatus.syncProgress < 100 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Syncing...</span>
              <span className="text-sm">{syncStatus.syncProgress}%</span>
            </div>
            <Progress value={syncStatus.syncProgress} />
          </div>
        )}
        
        <Button 
          onClick={handleSync} 
          disabled={!syncStatus.isOnline || syncStatus.syncProgress > 0}
          className="w-full"
        >
          <Sync className="h-4 w-4 mr-2" />
          Sync Now
        </Button>
        
        {syncStatus.errors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Sync Errors</span>
            </div>
            <ul className="text-sm space-y-1">
              {syncStatus.errors.map((error, index) => (
                <li key={index} className="text-red-600">• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
