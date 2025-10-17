'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card'
import { Button } from '@/components/components/ui/button'
import { Input } from '@/components/components/ui/input'
import { Label } from '@/components/components/ui/label'
import { Separator } from '@/components/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/components/ui/tabs'
import { Switch } from '@/components/components/ui/switch'
import { User, Bell, Key, CreditCard, AlertTriangle, LogOut } from 'lucide-react'

interface Profile {
  id: string
  full_name?: string | null
  timezone?: string | null
  credits?: number
}

/**
 * Settings Page - User preferences and account management
 *
 * Features:
 * - Profile settings
 * - Notification preferences
 * - API keys (future)
 * - Billing information
 * - Account deletion
 * - Sign out
 */

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      setProfile(profileData)
      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut({ scope: 'local' })
    router.push('/')
    router.refresh()
  }

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="h-64 animate-pulse rounded bg-gray-200"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email || ''} disabled />
                <p className="text-muted-foreground text-xs">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" placeholder="Your name" defaultValue={profile?.full_name || ''} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" placeholder="UTC" defaultValue={profile?.timezone || 'UTC'} />
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                  {(user.email || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Upload Avatar
                  </Button>
                  <p className="text-muted-foreground mt-1 text-xs">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Processing Complete</Label>
                  <p className="text-muted-foreground text-sm">
                    Notify when video processing is finished
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Credits Low</Label>
                  <p className="text-muted-foreground text-sm">Alert when credits fall below 100</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive product updates and promotions
                  </p>
                </div>
                <Switch />
              </div>

              <Button>Save Preferences</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Enable browser push notifications for real-time updates
              </p>
              <Button variant="outline">Enable Push Notifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                API access is available for Pro users. Generate API keys to integrate ReelVan into
                your applications.
              </p>
              <Button variant="outline" disabled>
                Generate API Key
                <span className="bg-muted ml-2 rounded-full px-2 py-0.5 text-xs">Pro Only</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Learn how to integrate ReelVan API into your workflow
              </p>
              <Button variant="outline" asChild>
                <a href="/docs/api" target="_blank" rel="noopener noreferrer">
                  View Documentation
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sign Out</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Sign out from your ReelVan account on this device.
              </p>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Export Data</h4>
                <p className="text-muted-foreground mb-3 text-sm">
                  Download all your videos and transaction data
                </p>
                <Button variant="outline">Request Data Export</Button>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 font-semibold">Delete Account</h4>
                <p className="text-muted-foreground mb-3 text-sm">
                  Permanently delete your account and all associated data. This action cannot be
                  undone.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
