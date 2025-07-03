
"use client"

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScanLine, Camera, X } from 'lucide-react'

export default function BarcodeScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }
  
  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    setIsScanning(false)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanLine className="h-5 w-5" />
          Barcode Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isScanning ? (
          <Button onClick={startScanning} className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Start Scanning
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg border"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-blue-500 w-48 h-48 rounded-lg opacity-50"></div>
              </div>
            </div>
            <Button onClick={stopScanning} variant="destructive" className="w-full">
              <X className="h-4 w-4 mr-2" />
              Stop Scanning
            </Button>
          </div>
        )}
        
        {scannedData && (
          <div className="space-y-2">
            <Badge variant="secondary">Scanned Data</Badge>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(scannedData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
