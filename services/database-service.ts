// Database abstraction layer - makes it easy to switch between Firebase, Supabase, etc.
export interface DatabaseProvider {
  // Car operations
  addCar(car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>
  updateCar(id: string, updates: Partial<Car>): Promise<void>
  deleteCar(id: string): Promise<void>
  getCars(): Promise<Car[]>
  getAvailableCars(): Promise<Car[]>

  // Customer operations
  addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>
  updateCustomer(id: string, updates: Partial<Customer>): Promise<void>
  getCustomers(): Promise<Customer[]>
  generateCustomerId(): Promise<string>

  // Booking operations
  addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>
  updateBooking(id: string, updates: Partial<Booking>): Promise<void>
  getBookings(): Promise<Booking[]>
  getActiveBookings(): Promise<Booking[]>
  generateBookingId(): Promise<string>
  checkConflict(carId: string, startDate: string, endDate: string, excludeBookingId?: string): Promise<boolean>

  // File operations
  uploadFile(file: File, path: string): Promise<string>
  deleteFile(url: string): Promise<void>
}

// Supabase implementation
export class SupabaseProvider implements DatabaseProvider {
  private supabase: any

  constructor() {
    const { createClient } = require('@supabase/supabase-js')
    this.supabase = createClient(
      databaseConfig.supabase.url,
      databaseConfig.supabase.anonKey
    )
  }

  async addCar(car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const { data, error } = await this.supabase
      .from('cars')
      .insert([{
        ...car,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data[0].id
  }

  async updateCar(id: string, updates: Partial<Car>): Promise<void> {
    const { error } = await this.supabase
      .from('cars')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  }

  async deleteCar(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('cars')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async getCars(): Promise<Car[]> {
    const { data, error } = await this.supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getAvailableCars(): Promise<Car[]> {
    const { data, error } = await this.supabase
      .from('cars')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const { data, error } = await this.supabase
      .from('customers')
      .insert([{
        ...customer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data[0].id
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
    const { error } = await this.supabase
      .from('customers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  }

  async getCustomers(): Promise<Customer[]> {
    const { data, error } = await this.supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async generateCustomerId(): Promise<string> {
    return `CU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  async addBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const { data, error } = await this.supabase
      .from('bookings')
      .insert([{
        ...booking,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data[0].id
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<void> {
    const { error } = await this.supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  }

  async getBookings(): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getActiveBookings(): Promise<Booking[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .in('status', ['confirmed', 'active'])
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async generateBookingId(): Promise<string> {
    return `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  async checkConflict(carId: string, startDate: string, endDate: string, excludeBookingId?: string): Promise<boolean> {
    let query = this.supabase
      .from('bookings')
      .select('id')
      .eq('car_id', carId)
      .in('status', ['confirmed', 'active'])
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`)

    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId)
    }

    const { data, error } = await query

    if (error) throw error
    return data && data.length > 0
  }

  async uploadFile(file: File, path: string): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `${path}/${fileName}`

    const { data, error } = await this.supabase.storage
      .from('rental-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: urlData } = this.supabase.storage
      .from('rental-files')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  }

  async deleteFile(url: string): Promise<void> {
    // Extract file path from URL
    const filePath = url.split('/').pop()
    if (!filePath) return

    const { error } = await this.supabase.storage
      .from('rental-files')
      .remove([filePath])

    if (error) throw error
  }
}

// MongoDB implementation
export class MongoDBProvider implements DatabaseProvider {
  private client: any

  constructor() {
    // Initialize MongoDB client
  }

  async addCar(car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const result = await this.client.db('rental').collection('cars').insertOne({
      ...car,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return result.insertedId.toString()
  }

  // ... implement other methods
}

// Factory to create database provider
export function createDatabaseProvider(type: 'firebase' | 'supabase' | 'mongodb'): DatabaseProvider {
  switch (type) {
    case 'firebase':
      return new FirebaseProvider() // Your existing Firebase service
    case 'supabase':
      return new SupabaseProvider()
    case 'mongodb':
      return new MongoDBProvider()
    default:
      throw new Error(`Unsupported database type: ${type}`)
  }
}

// Configuration
export const databaseConfig = {
  provider: process.env.NEXT_PUBLIC_DATABASE_PROVIDER || 'firebase',
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  },
  mongodb: {
    uri: process.env.MONGODB_URI || ''
  }
}

export const db = createDatabaseProvider(databaseConfig.provider as any)
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Enhanced database service with Supabase integration (Firebase removed)
export class DatabaseService {
  // Car management with Supabase
  async addCar(carData: any) {
    const { data, error } = await supabase
      .from('cars')
      .insert([{
        ...carData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data[0]
  }

  async updateCar(id: string, updates: any) {
    const { data, error } = await supabase
      .from('cars')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  }

  async deleteCar(id: string) {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async getCars() {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getAvailableCars() {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('status', 'Available')
      .order('make', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Customer management with Supabase
  async addCustomer(customerData: any) {
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        ...customerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data[0]
  }

  async updateCustomer(id: string, updates: any) {
    const { data, error } = await supabase
      .from('customers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  }

  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async generateCustomerId() {
    const customers = await this.getCustomers()
    const count = customers.length + 1
    return `VATS-CUST-${count.toString().padStart(3, '0')}`
  }

  // Booking management with Supabase
  async addBooking(bookingData: any) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    return data[0]
  }

  async updateBooking(id: string, updates: any) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  }

  async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getActiveBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'Active')
      .order('start_date', { ascending: true })

    if (error) throw error
    return data || []
  }

  async generateBookingId() {
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
    const bookings = await this.getBookings()
    const todayBookings = bookings.filter((b: any) => 
      b.booking_id?.includes(dateStr)
    )
    const count = todayBookings.length + 1
    return `VAT-${dateStr}-${count.toString().padStart(3, '0')}`
  }

  async checkBookingConflict(carId: string, startDate: string, endDate: string, excludeBookingId?: string) {
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('car_id', carId)
      .eq('status', 'Active')

    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId)
    }

    const { data, error } = await query

    if (error) throw error

    return (data || []).some((booking: any) => {
      return (
        (startDate >= booking.start_date && startDate <= booking.end_date) ||
        (endDate >= booking.start_date && endDate <= booking.end_date) ||
        (startDate <= booking.start_date && endDate >= booking.end_date)
      )
    })
  }

  // File storage with Supabase Storage
  async uploadFile(file: File, bucket: string, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  }

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }

  // Advanced analytics with Supabase
  async getDashboardStats() {
    const [cars, customers, bookings] = await Promise.all([
      this.getCars(),
      this.getCustomers(),
      this.getBookings()
    ])

    const activeBookings = bookings.filter((b: any) => b.status === 'Active')
    const availableCars = cars.filter((c: any) => c.status === 'Available')

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyBookings = bookings.filter((b: any) => {
      const bookingDate = new Date(b.created_at)
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
    })

    return {
      totalCars: cars.length,
      totalCustomers: customers.length,
      activeBookings: activeBookings.length,
      availableCars: availableCars.length,
      monthlyBookings: monthlyBookings.length,
      monthlyRevenue: monthlyBookings.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0)
    }
  }

  // Sync functionality for offline support
  async syncOfflineData(offlineData: any) {
    const results = {
      success: [],
      errors: []
    }

    try {
      // Sync cars
      if (offlineData.cars) {
        for (const car of offlineData.cars) {
          try {
            if (car.id) {
              await this.updateCar(car.id, car)
            } else {
              await this.addCar(car)
            }
            results.success.push({ type: 'car', data: car })
          } catch (error) {
            results.errors.push({ type: 'car', data: car, error })
          }
        }
      }

      // Sync customers
      if (offlineData.customers) {
        for (const customer of offlineData.customers) {
          try {
            if (customer.id) {
              await this.updateCustomer(customer.id, customer)
            } else {
              await this.addCustomer(customer)
            }
            results.success.push({ type: 'customer', data: customer })
          } catch (error) {
            results.errors.push({ type: 'customer', data: customer, error })
          }
        }
      }

      // Sync bookings
      if (offlineData.bookings) {
        for (const booking of offlineData.bookings) {
          try {
            if (booking.id) {
              await this.updateBooking(booking.id, booking)
            } else {
              await this.addBooking(booking)
            }
            results.success.push({ type: 'booking', data: booking })
          } catch (error) {
            results.errors.push({ type: 'booking', data: booking, error })
          }
        }
      }

    } catch (error) {
      console.error('Sync error:', error)
      throw error
    }

    return results
  }
}