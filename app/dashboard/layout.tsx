'use client'

import { demoGetUser } from '@/lib/demo-auth'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import Sidebar from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      try {
        const { data } = await supabase.auth.getUser()
        const user = data?.user
        const demoUser = demoGetUser()
        if (!user && !demoUser) {
          router.push('/auth/login')
        }
      } catch (e) {
        const demoUser = demoGetUser()
        if (!demoUser) router.push('/auth/login')
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
