
"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Signature, RotateCcw, Check, X } from "lucide-react"

interface DigitalSignatureProps {
  onSignatureComplete: (signatureData: string) => void
  customerName: string
  documentType?: string
}

export default function DigitalSignature({ onSignatureComplete, customerName, documentType = "Customer Agreement" }: DigitalSignatureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 200

    // Set drawing styles
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [isOpen])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setLastPoint({ x, y })
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    setLastPoint({ x, y })
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setLastPoint(null)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setSignature(null)
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const signatureData = canvas.toDataURL()
    setSignature(signatureData)
  }

  const confirmSignature = () => {
    if (signature) {
      onSignatureComplete(signature)
      setIsOpen(false)
    }
  }

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    setIsDrawing(true)
    setLastPoint({ x, y })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing || !lastPoint) return

    const touch = e.touches[0]
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    setLastPoint({ x, y })
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(false)
    setLastPoint(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Signature className="h-4 w-4 mr-2" />
          Sign Digitally
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Digital Signature</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Signature className="h-4 w-4" />
            <AlertDescription>
              <strong>{customerName}</strong> - Please sign below to agree to the {documentType}
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Signature Pad</CardTitle>
              <CardDescription>
                Draw your signature in the box below using your mouse or finger
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-300 rounded cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Sign above with your mouse or finger
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={clearSignature}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={saveSignature}>
                    Preview Signature
                  </Button>
                  <Button onClick={confirmSignature} disabled={!signature}>
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Signature
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {signature && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Signature Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img src={signature} alt="Signature preview" className="max-w-full h-auto" />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Signatory:</strong> {customerName}</p>
                  <p><strong>Document:</strong> {documentType}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
