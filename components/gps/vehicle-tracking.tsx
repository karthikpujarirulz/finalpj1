
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, AlertTriangle, Battery } from 'lucide-react'

interface VehicleLocation {
  id: string
  plateNumber: string
  location: {
    lat: number
    lng: number
    address: string
  }
  speed: number
  status: 'moving' | 'parked' | 'maintenance' | 'emergency'
  lastUpdate: string
  batteryLevel?: number
}

export default function VehicleTracking() {
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  
  // Mock data - replace with real GPS tracking API
  useEffect(() => {
    const mockVehicles: VehicleLocation[] = [
      {
        id: '1',
        plateNumber: 'MH-04-AB-1234',
        location: {
          lat: 19.2183,
          lng: 72.9781,
          address: 'Thane West, Maharashtra'
        },
        speed: 45,
        status: 'moving',
        lastUpdate: new Date().toISOString(),
        batteryLevel: 85
      },
      {
        id: '2',
        plateNumber: 'MH-04-CD-5678',
        location: {
          lat: 19.0760,
          lng: 72.8777,
          address: 'Mumbai Central, Maharashtra'
        },
        speed: 0,
        status: 'parked',
        lastUpdate: new Date().toISOString(),
        batteryLevel: 92
      }
    ]
    setVehicles(mockVehicles)
  }, [])
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving': return 'bg-green-500'
      case 'parked': return 'bg-blue-500'
      case 'maintenance': return 'bg-yellow-500'
      case 'emergency': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Vehicle Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedVehicle === vehicle.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{vehicle.plateNumber}</span>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{vehicle.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    <span>{vehicle.speed} km/h</span>
                  </div>
                  {vehicle.batteryLevel && (
                    <div className="flex items-center gap-1">
                      <Battery className="h-3 w-3" />
                      <span>{vehicle.batteryLevel}%</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {vehicle.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {selectedVehicle && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map integration would go here</p>
              <p className="text-sm text-gray-400 ml-2">(Google Maps, Mapbox, etc.)</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
