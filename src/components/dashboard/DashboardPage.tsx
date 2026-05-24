"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { Habit } from "@/types/Habit"
import { Session } from "@/types/Auth"
import HabitForm from "@/components/dashboard/HabitForm"

const DashboardPage = () => {
  const router = useRouter()

  const [habits, setHabits] = useState<Habit[]>([])
  const [currentUser, setCurrentUser] = useState<Session | null>(null)
  const [uiIsLoading, setUiIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // ── load session + habits ──
  useEffect(() => {
    const effectFunc = async () => {
      try {
        const rawSession = localStorage.getItem("habit-tracker-session")
        const rawHabits = localStorage.getItem("habit-tracker-habits")

        if (!rawSession) {
          router.replace("/login")
          return
        }

        const session = JSON.parse(rawSession) as Session
        const allHabits = (rawHabits ? JSON.parse(rawHabits) : []) as Habit[]
        const userHabits = allHabits.filter((h) => h.userId === session.userId)

        setCurrentUser(session)
        setHabits(userHabits)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
        router.replace("/login")
      } finally {
        setUiIsLoading(false)
      }
    }


    effectFunc()
  }, [router])

  // ── handlers ──
  function handleHabitSaved(habit: Habit) {
    setHabits((prev) => {
      const exists = prev.find((h) => h.id === habit.id)
      return exists
        ? prev.map((h) => (h.id === habit.id ? habit : h))
        : [...prev, habit]
    })
    setShowForm(false)
  }

  // ── loading ──
  if (uiIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-primary">
        <div className="loader" />
      </div>
    )
  }

  return (
    <main data-testid="dashboard-page" className="min-h-screen bg-bg-primary">

      {/* ── header ── */}
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4 sm:px-6">

          <div>
            <h1 className="text-lg font-semibold text-text-primary">My Habits</h1>
            <p className="text-xs text-text-muted mt-0.5">{currentUser?.email}</p>
          </div>

          <button
            data-testid="auth-logout-button"
            onClick={() => {
              localStorage.removeItem("habit-tracker-session")
              router.replace("/login")
            }}
            className="
              h-9 px-4 rounded-4xl border border-border
              text-sm font-medium text-text-secondary
              hover:bg-bg-secondary hover:text-text-primary
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
              transition-colors
            "
          >
            Log out
          </button>

        </div>
      </header>

      {/* ── body ── */}
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">

        <div className="mb-6 flex justify-end">
          <button
            data-testid="create-habit-button"
            onClick={() => setShowForm(true)}
            className="
              inline-flex items-center gap-2 h-10 px-4 rounded-4xl
              bg-primary text-white text-sm font-medium
              hover:opacity-90
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              transition-opacity
            "
          >
            <Plus className="size-4" />
            New Habit
          </button>
        </div>

        {/* ── empty state ── */}
        {habits.length === 0 ? (
          <div
            data-testid="empty-state"
            className="
              flex flex-col items-center justify-center
              rounded-2xl border border-dashed border-border
              py-20 text-center
            "
          >
            <p className="text-base font-medium text-text-primary">No habits yet</p>
            <p className="mt-1 text-sm text-text-muted">
              Create your first habit to get started.
            </p>
            <button
              data-testid="create-habit-button"
              onClick={() => setShowForm(true)}
              className="
                mt-6 inline-flex items-center gap-2 h-10 px-4 rounded-4xl
                bg-primary text-white text-sm font-medium
                hover:opacity-90
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                transition-opacity
              "
            >
              <Plus className="size-4" />
              New Habit
            </button>
          </div>

        ) : (
          <div className="flex flex-col gap-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
              >
                <p className="font-medium text-text-primary">{habit.name}</p>
                {habit.description && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {habit.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ── modal form ── */}
      {showForm && currentUser && (
        <HabitForm
          userId={currentUser.userId}
          onSave={handleHabitSaved}
          onCancel={() => setShowForm(false)}
        />
      )}

    </main>
  )
}

export default DashboardPage