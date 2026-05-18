'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/shared/Logo'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    const delay = Math.floor(Math.random() * 401) + 800 // 800-1200ms
    const timer = setTimeout(() => {
      const session = localStorage.getItem('habit-tracker-session')

      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main data-testid="splash-screen" className="flex flex-col items-center justify-center min-h-screen gap-y-4">
      <Logo size={64} />
      <h1 className="text-4xl font-bold text-primary">Habit Tracker</h1>
      <div className="loader"/>
    </main>
  )
}

export default Home