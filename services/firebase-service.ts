// Mock service - Firebase functionality removed
export interface Car {
  id?: string
  make: string
  model: string
  year: number
  fuelType: string
  transmission: string
  plateNumber: string
  status: "Available" | "Rented" | "Under Maintenance"
  photoUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id?: string
  name: string
  phone: string
  address: string
  customerId: string
  aadharUrl?: string
  dlUrl?: string
  photoUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id?: string
  bookingId: string
  customerId: string
  customerName: string
  carId: string
  carDetails: string
  startDate: string
  endDate: string
  duration: number
  advanceAmount: number
  totalAmount?: number
  paymentMode: string
  status: "Active" | "Returned" | "Pending" | "Cancelled"
  notes?: string
  agreementUrl?: string
  createdAt: Date
  updatedAt: Date
}

// Mock implementations - replace with Supabase
export const carService = {
  async addCar(car: Omit<Car, "id" | "createdAt" | "updatedAt">) {
    console.log("Mock car service - add car:", car)
    return { id: "mock-id" }
  },
  async updateCar(id: string, updates: Partial<Car>) {
    console.log("Mock car service - update car:", id, updates)
  },
  async deleteCar(id: string) {
    console.log("Mock car service - delete car:", id)
  },
  async getCars() {
    return []
  },
  async getAvailableCars() {
    return []
  }
}

export const customerService = {
  async addCustomer(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) {
    console.log("Mock customer service - add customer:", customer)
    return { id: "mock-id" }
  },
  async updateCustomer(id: string, updates: Partial<Customer>) {
    console.log("Mock customer service - update customer:", id, updates)
  },
  async getCustomers() {
    return []
  },
  async generateCustomerId() {
    return "VATS-CUST-001"
  }
}

export const bookingService = {
  async addBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) {
    console.log("Mock booking service - add booking:", booking)
    return { id: "mock-id" }
  },
  async updateBooking(id: string, updates: Partial<Booking>) {
    console.log("Mock booking service - update booking:", id, updates)
  },
  async getBookings() {
    return []
  },
  async getActiveBookings() {
    return []
  },
  async generateBookingId() {
    const today = new Date()
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "")
    return `VAT-${dateStr}-001`
  },
  async checkConflict(carId: string, startDate: string, endDate: string, excludeBookingId?: string) {
    return false
  }
}

export const uploadService = {
  async uploadFile(file: File, path: string): Promise<string> {
    console.log("Mock upload service - upload file:", file.name, path)
    return "mock-url"
  },
  async deleteFile(url: string) {
    console.log("Mock upload service - delete file:", url)
  }
}