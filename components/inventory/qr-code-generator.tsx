
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Download, Print } from 'lucide-react'

interface QRCodeGeneratorProps {
  type: 'vehicle' | 'booking'
  id: string
  data: any
}

export default function QRCodeGenerator({ type, id, data }: QRCodeGeneratorProps) {
  const [qrCode, setQrCode] = useState<string>('')
  
  const generateQR = async () => {
    const qrData = {
      type,
      id,
      url: `${window.location.origin}/${type}/${id}`,
      timestamp: new Date().toISOString(),
      ...data
    }
    
    // Generate QR code using a library like qrcode
    // const qr = await QRCode.toDataURL(JSON.stringify(qrData))
    // setQrCode(qr)
  }
  
  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${type}-${id}-qr.png`
    link.click()
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Generate QR Code for {type}</Label>
          <Button onClick={generateQR} className="w-full">
            Generate QR Code
          </Button>
        </div>
        
        {qrCode && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img src={qrCode} alt="QR Code" className="border rounded" />
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadQR} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => window.print()} variant="outline" className="flex-1">
                <Print className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
