
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Phone, MapPin, Calendar, Car, FileText, Edit, X, Clock, CheckCircle, AlertCircle, Download, Eye, CreditCard, IndianRupee } from "lucide-react"
import type { Customer } from "@/lib/mock-data"

interface BookingRecord {
  id: string
  bookingId: string
  carDetails: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  duration: number
  dailyRate?: number
  totalAmount: number
  advanceAmount: number
  depositAmount?: number
  totalRentReceived?: number
  paymentMode?: string
  status: "Active" | "Completed" | "Cancelled" | "Pending" | "Returned"
  createdAt: string
  returnedAt?: string
  depositRefunded?: boolean
  notes?: string
}

interface CustomerDetailsProps {
  customer: Customer | null
  isOpen: boolean
  onClose: () => void
}

export default function CustomerDetails({ customer, isOpen, onClose }: CustomerDetailsProps) {
  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{ type: string; url: string; name: string } | null>(null)

  useEffect(() => {
    if (customer && isOpen) {
      loadBookingHistory()
    }
  }, [customer, isOpen])

  const loadBookingHistory = async () => {
    if (!customer) return

    setLoading(true)
    try {
      // Simulate API call - in real app, fetch from backend
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock booking data for this customer with enhanced details
      const mockBookings: BookingRecord[] = [
        {
          id: "1",
          bookingId: "VAT-20241212-001",
          carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
          startDate: "2024-12-12",
          endDate: "2024-12-15",
          startTime: "10:00",
          endTime: "18:00",
          duration: 3,
          dailyRate: 1500,
          totalAmount: 4500,
          advanceAmount: 2000,
          depositAmount: 5000,
          totalRentReceived: 4500,
          paymentMode: "UPI",
          status: "Active",
          createdAt: "2024-12-12",
          notes: "Customer requested GPS navigation",
          depositRefunded: false,
        },
        {
          id: "2",
          bookingId: "VAT-20241201-002",
          carDetails: "Hyundai Creta 2023 (MH-04-CD-5678)",
          startDate: "2024-12-01",
          endDate: "2024-12-03",
          startTime: "09:00",
          endTime: "19:00",
          duration: 2,
          dailyRate: 2500,
          totalAmount: 5000,
          advanceAmount: 2000,
          depositAmount: 8000,
          totalRentReceived: 5000,
          paymentMode: "Cash",
          status: "Returned",
          createdAt: "2024-12-01",
          returnedAt: "2024-12-03",
          depositRefunded: true,
        },
        {
          id: "3",
          bookingId: "VAT-20241115-003",
          carDetails: "Tata Nexon 2021 (MH-04-EF-9012)",
          startDate: "2024-11-15",
          endDate: "2024-11-18",
          startTime: "11:00",
          endTime: "17:00",
          duration: 3,
          dailyRate: 2000,
          totalAmount: 6000,
          advanceAmount: 3000,
          depositAmount: 7000,
          totalRentReceived: 6000,
          paymentMode: "Bank Transfer",
          status: "Returned",
          createdAt: "2024-11-15",
          returnedAt: "2024-11-18",
          depositRefunded: true,
        },
        {
          id: "4",
          bookingId: "VAT-20241010-004",
          carDetails: "Maruti Swift 2022 (MH-04-AB-1234)",
          startDate: "2024-10-10",
          endDate: "2024-10-12",
          startTime: "08:00",
          endTime: "20:00",
          duration: 2,
          dailyRate: 1500,
          totalAmount: 3000,
          advanceAmount: 1500,
          depositAmount: 5000,
          totalRentReceived: 1500,
          paymentMode: "Card",
          status: "Cancelled",
          createdAt: "2024-10-10",
          notes: "Cancelled due to emergency",
          depositRefunded: true,
        },
      ]

      setBookingHistory(mockBookings)
    } catch (error) {
      console.error("Error loading booking history:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Returned":
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Clock className="h-4 w-4" />
      case "Returned":
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "Pending":
        return <AlertCircle className="h-4 w-4" />
      case "Cancelled":
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const viewDocument = (type: string, url: string, fileName?: string) => {
    if (url) {
      setSelectedDocument({ 
        type, 
        url, 
        name: fileName || `${customer?.name}_${type}` 
      })
    }
  }

  const downloadDocument = (url: string, fileName: string) => {
    if (url) {
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const totalBookings = bookingHistory.length
  const completedBookings = bookingHistory.filter((b) => b.status === "Returned" || b.status === "Completed").length
  const totalRevenue = bookingHistory.filter((b) => b.status === "Returned" || b.status === "Completed").reduce((sum, b) => sum + (b.totalRentReceived || 0), 0)
  const averageBookingValue = completedBookings > 0 ? totalRevenue / completedBookings : 0
  const totalPendingAmount = bookingHistory.filter((b) => b.status === "Active").reduce((sum, b) => sum + ((b.totalAmount || 0) - (b.totalRentReceived || 0)), 0)

  if (!customer) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Complete Customer Profile & Booking History
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Info Card with Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Basic Info */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                          {customer.photoUrl ? (
                            <img 
                              src={customer.photoUrl} 
                              alt={customer.name}
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => viewDocument("Customer Photo", customer.photoUrl!, customer.name)}
                            />
                          ) : (
                            <User className="h-10 w-10 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{customer.name}</CardTitle>
                          <CardDescription className="text-base">{customer.customerId}</CardDescription>
                          <p className="text-sm text-muted-foreground mt-1">
                            Customer since {new Date(customer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Customer
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">{customer.email}</span>
                          </div>
                        )}
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span className="text-sm">{customer.address}</span>
                        </div>
                        {customer.city && (
                          <div className="text-sm text-gray-600">
                            {customer.city}, {customer.state} - {customer.pincode}
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {customer.dateOfBirth && (
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">DOB: {new Date(customer.dateOfBirth).toLocaleDateString()}</span>
                          </div>
                        )}
                        {customer.licenseNumber && (
                          <div className="text-sm">
                            <span className="font-medium">DL:</span> {customer.licenseNumber}
                            {customer.licenseExpiry && (
                              <span className="text-gray-600"> (Exp: {new Date(customer.licenseExpiry).toLocaleDateString()})</span>
                            )}
                          </div>
                        )}
                        {customer.aadharNumber && (
                          <div className="text-sm">
                            <span className="font-medium">Aadhar:</span> {customer.aadharNumber}
                          </div>
                        )}
                        {customer.emergencyContact && (
                          <div className="text-sm">
                            <span className="font-medium">Emergency:</span> {customer.emergencyContact} ({customer.emergencyPhone})
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Documents Section */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Documents</CardTitle>
                    <CardDescription>Customer verification documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Aadhar Card */}
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Aadhar Card</span>
                        <div className={`w-3 h-3 rounded-full ${customer.aadharUrl ? "bg-green-500" : "bg-red-300"}`} />
                      </div>
                      {customer.aadharUrl ? (
                        <div className="space-y-2">
                          <div className="text-xs text-green-600">✓ Uploaded & Verified</div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewDocument("Aadhar Card", customer.aadharUrl!, customer.aadharFileName)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadDocument(customer.aadharUrl!, customer.aadharFileName || `${customer.name}_aadhar`)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-red-600">✗ Not uploaded</div>
                      )}
                    </div>

                    {/* Driving License */}
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Driving License</span>
                        <div className={`w-3 h-3 rounded-full ${customer.dlUrl ? "bg-green-500" : "bg-red-300"}`} />
                      </div>
                      {customer.dlUrl ? (
                        <div className="space-y-2">
                          <div className="text-xs text-green-600">✓ Uploaded & Verified</div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewDocument("Driving License", customer.dlUrl!, customer.dlFileName)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadDocument(customer.dlUrl!, customer.dlFileName || `${customer.name}_dl`)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-red-600">✗ Not uploaded</div>
                      )}
                    </div>

                    {/* Customer Photo */}
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Customer Photo</span>
                        <div className={`w-3 h-3 rounded-full ${customer.photoUrl ? "bg-green-500" : "bg-red-300"}`} />
                      </div>
                      {customer.photoUrl ? (
                        <div className="space-y-2">
                          <div className="text-xs text-green-600">✓ Captured & Stored</div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewDocument("Customer Photo", customer.photoUrl!, `${customer.name}_photo`)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadDocument(customer.photoUrl!, `${customer.name}_photo.jpg`)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-red-600">✗ Not captured</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Booking Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBookings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completedBookings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">₹{totalRevenue.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    ₹{Math.round(averageBookingValue).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">₹{totalPendingAmount.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Booking History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Complete Booking History
                </CardTitle>
                <CardDescription>Detailed booking history with financial information for {customer.name}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : bookingHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-600">This customer hasn't made any bookings yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking Details</TableHead>
                          <TableHead>Vehicle & Period</TableHead>
                          <TableHead>Financial Details</TableHead>
                          <TableHead>Payment Info</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookingHistory.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">{booking.bookingId}</div>
                                <div className="text-xs text-gray-500">
                                  Created: {new Date(booking.createdAt).toLocaleDateString()}
                                </div>
                                {booking.returnedAt && (
                                  <div className="text-xs text-gray-500">
                                    Returned: {new Date(booking.returnedAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm font-medium">{booking.carDetails}</div>
                                <div className="text-xs text-gray-600">
                                  {new Date(booking.startDate).toLocaleDateString()} {booking.startTime} - 
                                  {new Date(booking.endDate).toLocaleDateString()} {booking.endTime}
                                </div>
                                <Badge variant="outline" className="text-xs">{booking.duration} days</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-xs">
                                {booking.dailyRate && (
                                  <div className="flex justify-between">
                                    <span>Daily Rate:</span>
                                    <span>₹{booking.dailyRate.toLocaleString()}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-medium">
                                  <span>Total Amount:</span>
                                  <span>₹{booking.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Deposit:</span>
                                  <span>₹{booking.depositAmount?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                  <span>Rent Received:</span>
                                  <span>₹{booking.totalRentReceived?.toLocaleString() || 0}</span>
                                </div>
                                {booking.totalAmount > (booking.totalRentReceived || 0) && (
                                  <div className="flex justify-between text-red-600">
                                    <span>Pending:</span>
                                    <span>₹{(booking.totalAmount - (booking.totalRentReceived || 0)).toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-3 w-3" />
                                  <span>{booking.paymentMode}</span>
                                </div>
                                {booking.status === "Returned" && (
                                  <div className={`text-xs ${booking.depositRefunded ? "text-green-600" : "text-orange-600"}`}>
                                    Deposit: {booking.depositRefunded ? "✓ Refunded" : "⏳ Pending"}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(booking.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(booking.status)}
                                  {booking.status}
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button variant="outline" size="sm">
                                  <FileText className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes Section */}
            {bookingHistory.some((b) => b.notes) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Notes & Special Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookingHistory
                      .filter((b) => b.notes)
                      .map((booking) => (
                        <div key={booking.id} className="border-l-4 border-blue-200 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{booking.bookingId}</p>
                              <p className="text-sm text-gray-600">{booking.notes}</p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedDocument.type} - {customer?.name}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img 
                src={selectedDocument.url} 
                alt={selectedDocument.type}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => downloadDocument(selectedDocument.url, selectedDocument.name)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setSelectedDocument(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
