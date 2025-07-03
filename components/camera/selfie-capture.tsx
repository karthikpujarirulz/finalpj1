"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, RotateCcw, Download, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SelfieCaptureProps {
  onCapture?: (imageData: string) => void
  onClose?: () => void
}

export default function SelfieCapture({ onCapture, onClose }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (isActive) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isActive])

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Ensure video plays
        videoRef.current.play().catch(console.error)
      }
      setStream(stream)
      setError(null)
    } catch (err) {
      setError("Unable to access camera. Please check permissions and ensure you're using HTTPS.")
      console.error("Camera error:", err)
    }
  }

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = canvas.toDataURL("image/jpeg", 0.9)
        setCapturedImage(imageData)
        stopCamera()

        if (onCapture) {
          onCapture(imageData)
        }

        toast({
          title: "Photo Captured",
          description: "Selfie captured successfully!",
        })
      }
    }
  }, [stopCamera, onCapture, toast])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  const downloadPhoto = useCallback(() => {
    if (capturedImage) {
      const link = document.createElement("a")
      link.href = capturedImage
      link.download = `selfie-${Date.now()}.jpg`
      link.click()

      toast({
        title: "Photo Downloaded",
        description: "Selfie saved to your downloads folder.",
      })
    }
  }, [capturedImage, toast])

  const handleClose = useCallback(() => {
    stopCamera()
    setCapturedImage(null)
    setError(null)
    if (onClose) {
      onClose()
    }
  }, [stopCamera, onClose])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Selfie Capture
            </CardTitle>
            <CardDescription>Take a photo for verification</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startCamera}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="relative">
          {!capturedImage ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md mx-auto rounded-lg border bg-gray-100"
                style={{ minHeight: "360px" }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(console.error)
                  }
                }}
              />
              {!isStreaming && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click "Start Camera" to begin</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured selfie"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="hidden"
            width="640"
            height="480"
          />
        </div>

        <div className="flex gap-2">
          {!isStreaming && !capturedImage && !error && (
            <Button onClick={startCamera} className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          )}

          {isStreaming && (
            <Button onClick={capturePhoto} className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              Capture Photo
            </Button>
          )}

          {capturedImage && (
            <>
              <Button onClick={retakePhoto} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button onClick={downloadPhoto} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>

        {isStreaming && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Position your face in the camera and click "Capture Photo" when ready
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}