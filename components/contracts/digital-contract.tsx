
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Signature, Download, Send, Eye } from "lucide-react"

interface DigitalContractProps {
  bookingId: string
  customerName: string
  customerEmail: string
  onContractSigned?: (signatureData: string) => void
}

export default function DigitalContract({ 
  bookingId, 
  customerName, 
  customerEmail, 
  onContractSigned 
}: DigitalContractProps) {
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false)
  const [signature, setSignature] = useState("")
  const [contractStatus, setContractStatus] = useState<"draft" | "sent" | "signed" | "completed">("draft")
  const [signatureCanvas, setSignatureCanvas] = useState<HTMLCanvasElement | null>(null)

  const handleSignature = () => {
    if (signatureCanvas) {
      const signatureData = signatureCanvas.toDataURL()
      setSignature(signatureData)
      setContractStatus("signed")
      onContractSigned?.(signatureData)
      setIsSignatureDialogOpen(false)
    }
  }

  const clearSignature = () => {
    if (signatureCanvas) {
      const ctx = signatureCanvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height)
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return
    const canvas = e.currentTarget
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      ctx.stroke()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "signed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Digital Contract
            </CardTitle>
            <CardDescription>
              Rental Agreement for Booking #{bookingId}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(contractStatus)}>
            {contractStatus.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Customer Name</Label>
            <Input value={customerName} readOnly />
          </div>
          <div>
            <Label>Customer Email</Label>
            <Input value={customerEmail} readOnly />
          </div>
        </div>

        <div>
          <Label>Contract Terms</Label>
          <Textarea
            placeholder="Enter rental terms and conditions..."
            className="min-h-[100px]"
            defaultValue="By signing this digital contract, I acknowledge that I have read and agree to the terms and conditions of this vehicle rental agreement..."
          />
        </div>

        {signature && (
          <div className="border rounded-lg p-4">
            <Label>Customer Signature</Label>
            <div className="mt-2 border rounded bg-gray-50 p-2">
              <img src={signature} alt="Customer Signature" className="max-h-20" />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Signed on {new Date().toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send for Signature
          </Button>

          <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" disabled={contractStatus === "signed"}>
                <Signature className="h-4 w-4 mr-2" />
                {contractStatus === "signed" ? "Signed" : "Sign Contract"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Digital Signature</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Draw your signature below:</Label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <canvas
                      ref={setSignatureCanvas}
                      width={500}
                      height={200}
                      className="border bg-white cursor-crosshair w-full"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={clearSignature}>
                    Clear
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsSignatureDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSignature}>
                      Apply Signature
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
