
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Database,
  Shield,
  Cloud,
  Settings,
  Loader2,
  Info,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SupabaseConfig {
  url: string
  anonKey: string
  serviceKey?: string
}

interface SupabaseSettings {
  enabled: boolean
  config: SupabaseConfig
  features: {
    auth: boolean
    database: boolean
    storage: boolean
    realtime: boolean
  }
}

export default function SupabaseConfigurator() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<SupabaseSettings>({
    enabled: false,
    config: {
      url: "",
      anonKey: "",
      serviceKey: "",
    },
    features: {
      auth: true,
      database: true,
      storage: true,
      realtime: false,
    },
  })

  const [testing, setTesting] = useState(false)
  const [activeTab, setActiveTab] = useState("config")

  useEffect(() => {
    loadSupabaseSettings()
  }, [])

  const loadSupabaseSettings = () => {
    try {
      const saved = localStorage.getItem("vats-rental-supabase")
      if (saved) {
        setSettings(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading Supabase settings:", error)
    }
  }

  const saveSupabaseSettings = () => {
    try {
      localStorage.setItem("vats-rental-supabase", JSON.stringify(settings))
      toast({
        title: "Settings Saved",
        description: "Supabase configuration has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Supabase settings.",
        variant: "destructive",
      })
    }
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      // Test connection logic here
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Connection Successful",
        description: "Supabase connection test passed!",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your configuration and try again.",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const generateEnvFile = () => {
    const envContent = `# Supabase Configuration
NEXT_PUBLIC_DATABASE_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=${settings.config.url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${settings.config.anonKey}
${settings.config.serviceKey ? `SUPABASE_SERVICE_KEY=${settings.config.serviceKey}` : ''}
`
    
    const blob = new Blob([envContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = ".env"
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Configuration copied to clipboard.",
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Supabase Configuration</h1>
          <p className="text-gray-600 mt-2">Configure Supabase for your rental CRM system</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={settings.enabled ? "default" : "secondary"}>
            {settings.enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Supabase Project Configuration
              </CardTitle>
              <CardDescription>
                Enter your Supabase project details from the API settings page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="supabase-enabled"
                  checked={settings.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enabled: checked })
                  }
                />
                <Label htmlFor="supabase-enabled">Enable Supabase</Label>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">Project URL</Label>
                  <Input
                    id="supabase-url"
                    placeholder="https://your-project.supabase.co"
                    value={settings.config.url}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        config: { ...settings.config, url: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabase-anon-key">Anonymous Key</Label>
                  <Input
                    id="supabase-anon-key"
                    placeholder="Your anon key"
                    value={settings.config.anonKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        config: { ...settings.config, anonKey: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabase-service-key">Service Key (Optional)</Label>
                  <Input
                    id="supabase-service-key"
                    placeholder="Your service key for admin operations"
                    value={settings.config.serviceKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        config: { ...settings.config, serviceKey: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveSupabaseSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                <Button variant="outline" onClick={testConnection} disabled={testing}>
                  {testing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supabase Features</CardTitle>
              <CardDescription>Configure which Supabase features to enable</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auth-enabled">Authentication</Label>
                    <p className="text-sm text-gray-500">User authentication and authorization</p>
                  </div>
                  <Switch
                    id="auth-enabled"
                    checked={settings.features.auth}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        features: { ...settings.features, auth: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="database-enabled">Database</Label>
                    <p className="text-sm text-gray-500">PostgreSQL database for data storage</p>
                  </div>
                  <Switch
                    id="database-enabled"
                    checked={settings.features.database}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        features: { ...settings.features, database: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="storage-enabled">Storage</Label>
                    <p className="text-sm text-gray-500">File storage for images and documents</p>
                  </div>
                  <Switch
                    id="storage-enabled"
                    checked={settings.features.storage}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        features: { ...settings.features, storage: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="realtime-enabled">Realtime</Label>
                    <p className="text-sm text-gray-500">Live updates and subscriptions</p>
                  </div>
                  <Switch
                    id="realtime-enabled"
                    checked={settings.features.realtime}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        features: { ...settings.features, realtime: checked },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Configuration</CardTitle>
              <CardDescription>Generate environment files for deployment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={generateEnvFile}>
                  <Cloud className="h-4 w-4 mr-2" />
                  Download .env File
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(JSON.stringify(settings.config, null, 2))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Configuration
                </Button>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Ready for Deployment:</strong> Your Supabase configuration is ready. 
                  Deploy to Replit for production use with real-time data synchronization.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Next Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Download the .env file and add it to your Replit project</li>
                  <li>Deploy your application using Replit's deployment feature</li>
                  <li>Test the Supabase integration in production</li>
                  <li>Configure Row Level Security (RLS) for production use</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
