
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, ExternalLink, Info, CheckCircle, AlertCircle, Settings } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SupabaseSetupGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const router = useRouter()

  const envVars = [
    {
      key: "NEXT_PUBLIC_DATABASE_PROVIDER",
      value: "supabase",
      description: "Set database provider to Supabase",
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_URL",
      value: "https://your-project.supabase.co",
      description: "Your Supabase project URL",
    },
    {
      key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      value: "your-anon-key-here",
      description: "Your Supabase anonymous key",
    },
  ]

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Supabase Setup Guide</h1>
        <p className="text-lg text-gray-600 mb-4">Complete Supabase configuration for Vats Rental CRM</p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="text-sm">
            🚀 Production Ready
          </Badge>
          <Badge variant="outline" className="text-sm">
            📱 PWA Enabled
          </Badge>
          <Badge variant="outline" className="text-sm">
            🔐 Secure Authentication
          </Badge>
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Current Status:</strong> Running with mock data for demonstration. Follow these steps to connect to
          Supabase for production deployment with real-time data synchronization and file storage.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Step 1: Create Supabase Project
            </CardTitle>
            <CardDescription>Set up your Supabase project and get configuration values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                1. Go to <a href="https://supabase.com" className="text-blue-600 hover:underline">supabase.com</a>
              </p>
              <p className="text-sm text-gray-600">2. Create a new project</p>
              <p className="text-sm text-gray-600">3. Go to Settings → API</p>
              <p className="text-sm text-gray-600">4. Copy your Project URL and anon key</p>
            </div>
            <Button onClick={() => window.open("https://supabase.com", "_blank")} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Supabase Console
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Step 2: Set Up Database Schema
            </CardTitle>
            <CardDescription>Create the required tables and storage bucket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Run this SQL in your Supabase SQL editor:</p>
              <div className="bg-gray-100 p-3 rounded-md text-sm font-mono overflow-x-auto">
                <pre>{`-- Create tables
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  license_plate TEXT NOT NULL,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES cars(id),
  customer_id UUID REFERENCES customers(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'confirmed',
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('rental-files', 'rental-files', true);`}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step 3: Environment Variables</CardTitle>
          <CardDescription>Add these environment variables to your .env file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {envVars.map((env, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{env.key}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`${env.key}=${env.value}`, index)}
                >
                  {copiedIndex === index ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="bg-gray-100 p-3 rounded-md">
                <code className="text-sm">{env.key}={env.value}</code>
              </div>
              <p className="text-xs text-gray-500">{env.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 4: Deploy to Replit</CardTitle>
          <CardDescription>Your app is ready for production deployment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Next Steps:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Add the environment variables to your Replit project</li>
              <li>Deploy your application using Replit's deployment feature</li>
              <li>Test the Supabase integration in production</li>
              <li>Configure Row Level Security (RLS) for production use</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
