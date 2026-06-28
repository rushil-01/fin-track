'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { demoGetUser } from '@/lib/demo-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const highlights = [
  {
    title: 'Track every expense',
    description: 'See where your money goes with a clean, organized view of your spending.',
  },
  {
    title: 'Plan for goals',
    description: 'Create savings targets and stay focused on what matters most.',
  },
  {
    title: 'Stay on top of debt',
    description: 'Monitor loans and payments without losing sight of the bigger picture.',
  },
]

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (demoGetUser()) {
      router.replace('/dashboard')
    }
  }, [router])

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center sm:px-8 lg:px-12">
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
          Personal finance, simplified
        </Badge>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Take control of your money with a dashboard that works for real life.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          FinTrack helps you organize income, spending, savings, and loans in one place so you can make smarter choices every day.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Create account</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 sm:px-8 lg:grid-cols-3 lg:px-12">
        {highlights.map((item) => (
          <Card key={item.title} className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A clear view of your progress helps you build confidence and stay consistent.
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}
