'use client'

import { createClient } from '@/lib/supabase/client'
import { demoLogin } from '@/lib/demo-auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error)
  }

  return 'An unexpected error occurred'
}

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    if (!supabase) {
      const user = demoLogin(email, password)
      if (user) {
        router.replace('/dashboard')
      } else {
        setError('Invalid email or password')
      }
      setIsLoading(false)
      return
    }

    try {
      console.log('[v0] Login attempt:', { email })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        console.error('[v0] Auth error:', error)
        throw error
      }

      if (data.session) {
        console.log('[v0] Login successful:', data)
        router.replace('/dashboard')
      } else {
        setError('Please confirm your email before continuing.')
      }
    } catch (error: unknown) {
      console.error('[v0] Auth failed, using demo auth:', error)
      try {
        const user = demoLogin(email, password)
        if (user) {
          console.log('[v0] Demo login successful')
          router.replace('/dashboard')
        } else {
          setError(getErrorMessage(error) || 'Invalid email or password')
        }
      } catch (demoError) {
        setError(getErrorMessage(demoError))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="mb-2">
                <Link href="/" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  ← Back to home
                </Link>
              </div>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/auth/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
