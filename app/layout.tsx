import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Vats Rental CRM - Complete Vehicle Rental Management',
  description: 'Advanced vehicle rental management system with booking, analytics, and fleet management features',
  keywords: 'vehicle rental, car rental, fleet management, booking system, CRM',
  authors: [{ name: 'Vats Rental' }],
  viewport: 'width=device-width, initial-scale=1',
  manifest: '/manifest.json',
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}