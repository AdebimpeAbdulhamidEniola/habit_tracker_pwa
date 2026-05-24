"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Flame,
  Check,
  Pencil,
  Trash2,
  LogOut,
  Calendar,
  X,
} from "lucide-react"

import { Habit } from "@/app/types/Habit"
import { Session } from "@/app/types/Auth"
import { getHabitSlug } from "@/lib/slug"
import { calculateCurrentStreak } from "@/lib/streak"
import { toggleHabitCompletion } from "@/lib/habit"
import HabitFormDialog, {HabitFormValues} from "@/components/dashboard/HabitFormDialog"
import { effect } from "zod/v3"

const HABITS_KEY = "habit-tracker-habits"
const SESSION_KEY = "habit-tracker-session"

const todayISO = () => new Date().toISOString().slice(0, 10)

type DialogState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit"; habit: Habit }

const DashboardPage = () => {
  const router = useRouter()

  const [allHabits, setAllHabits] = useState<Habit[]>([])
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState<DialogState>({ open: false })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Load from localStorage
  useEffect(() => {
    const effectFunc = async () => {
       try {
      const rawSession = localStorage.getItem(SESSION_KEY)
      const rawHabits = localStorage.getItem(HABITS_KEY)
      if (!rawSession) {
        router.push("/login")
        return
      }
      setSession(JSON.parse(rawSession) as Session)
      setAllHabits(rawHabits ? (JSON.parse(rawHabits) as Habit[]) : [])
    } catch (err) {
      console.error("Failed to load dashboard state", err)
    } finally {
      setLoading(false)
    }
  }
  
  effectFunc()
 } , [router])

  const userHabits = useMemo(
    () => (session ? allHabits.filter((h) => h.userId === session.userId) : []),
    [allHabits, session]
  )

  const today = todayISO()

  const completedToday = useMemo(
    () => userHabits.filter((h) => h.completions.includes(today)).length,
    [userHabits, today]
  )

  const longestStreak = useMemo(
    () =>
      userHabits.reduce(
        (max, h) => Math.max(max, calculateCurrentStreak(h.completions)),
        0
      ),
    [userHabits]
  )

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    []
  )

  // Persist helper — writes the FULL habits array back, then updates state.
  const persist = (nextAll: Habit[]) => {
    localStorage.setItem(HABITS_KEY, JSON.stringify(nextAll))
    setAllHabits(nextAll)
  }

  const handleSave = (values: HabitFormValues) => {
    if (!session) return
    if (dialog.open && dialog.mode === "edit") {
      const next = allHabits.map((h) =>
        h.id === dialog.habit.id
          ? {
              ...h,
              name: values.name,
              description: values.description,
              // immutable: id, userId, createdAt, completions, frequency
            }
          : h
      )
      persist(next)
    } else {
      const newHabit: Habit = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        userId: session.userId,
        name: values.name,
        description: values.description,
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      }
      persist([...allHabits, newHabit])
    }
    setDialog({ open: false })
  }

  const handleToggleComplete = (habit: Habit) => {
    const updated = toggleHabitCompletion(habit, today)
    persist(allHabits.map((h) => (h.id === habit.id ? updated : h)))
  }

  const handleDelete = (id: string) => {
    persist(allHabits.filter((h) => h.id !== id))
    setDeletingId(null)
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY)
    router.push("/login")
  }

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <div className="loader" />
      </div>
    )
  }

  return (
    <main
      data-testid="dashboard-page"
      className="min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b backdrop-blur"
        style={{
          background: "color-mix(in oklab, var(--color-surface) 85%, transparent)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0">
            <h1
              className="truncate text-xl font-bold sm:text-2xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Hi, {session?.email.split("@")[0]} 👋
            </h1>
            <p
              className="mt-0.5 flex items-center gap-1.5 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Calendar className="h-3.5 w-3.5" />
              {todayLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="create-habit-button"
              onClick={() => setDialog({ open: true, mode: "create" })}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: "var(--color-primary)",
                color: "#fff",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "var(--color-primary-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--color-primary)")
              }
            >
              <Plus className="h-4 w-4" />
              New habit
            </button>

            <button
              type="button"
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                borderColor: "var(--color-border)",
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Summary strip */}
        {userHabits.length > 0 && (
          <section className="mb-6 grid grid-cols-3 gap-3">
            <SummaryStat label="Habits" value={userHabits.length} />
            <SummaryStat
              label="Done today"
              value={`${completedToday}/${userHabits.length}`}
              accent="success"
            />
            <SummaryStat
              label="Top streak"
              value={longestStreak}
              accent="streak"
            />
          </section>
        )}

        {userHabits.length === 0 ? (
          <EmptyState onCreate={() => setDialog({ open: true, mode: "create" })} />
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userHabits.map((habit) => {
              const slug = getHabitSlug(habit.name)
              const streak = calculateCurrentStreak(habit.completions)
              const done = habit.completions.includes(today)
              const isConfirming = deletingId === habit.id

              return (
                <article
                  key={habit.id}
                  data-testid={`habit-card-${slug}`}
                  className="group flex flex-col gap-4 rounded-lg border p-5 transition-shadow"
                  style={{
                    background: done
                      ? "var(--color-success-subtle)"
                      : "var(--color-surface)",
                    borderColor: done
                      ? "var(--color-success)"
                      : "var(--color-border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = "var(--shadow-md)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "var(--shadow-sm)")
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2
                        className="truncate text-lg font-semibold"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {habit.name}
                      </h2>
                      {habit.description && (
                        <p
                          className="mt-1 text-sm"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {habit.description}
                        </p>
                      )}
                    </div>

                    <span
                      data-testid={`habit-streak-${slug}`}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        background: "var(--color-streak-subtle)",
                        color: "var(--color-streak)",
                      }}
                      aria-label={`Current streak: ${streak} days`}
                    >
                      <Flame className="h-3.5 w-3.5" />
                      {streak}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                      style={{
                        background: "var(--color-primary-subtle)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {habit.frequency}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        data-testid={`habit-edit-${slug}`}
                        onClick={() =>
                          setDialog({ open: true, mode: "edit", habit })
                        }
                        aria-label={`Edit ${habit.name}`}
                        className="rounded-md p-2 transition-colors"
                        style={{ color: "var(--color-text-secondary)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--color-bg-tertiary)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {isConfirming ? (
                        <>
                          <button
                            type="button"
                            data-testid="confirm-delete-button"
                            onClick={() => handleDelete(habit.id)}
                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold"
                            style={{
                              background: "var(--color-error)",
                              color: "#fff",
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(null)}
                            aria-label="Cancel delete"
                            className="rounded-md p-2"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          data-testid={`habit-delete-${slug}`}
                          onClick={() => setDeletingId(habit.id)}
                          aria-label={`Delete ${habit.name}`}
                          className="rounded-md p-2 transition-colors"
                          style={{ color: "var(--color-text-secondary)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "var(--color-error-subtle)"
                            e.currentTarget.style.color = "var(--color-error)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent"
                            e.currentTarget.style.color =
                              "var(--color-text-secondary)"
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    data-testid={`habit-complete-${slug}`}
                    onClick={() => handleToggleComplete(habit)}
                    aria-pressed={done}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-semibold transition-colors"
                    style={
                      done
                        ? {
                            background: "var(--color-success)",
                            color: "#fff",
                            borderColor: "var(--color-success)",
                          }
                        : {
                            background: "var(--color-surface)",
                            color: "var(--color-text-primary)",
                            borderColor: "var(--color-border)",
                          }
                    }
                  >
                    <Check className="h-4 w-4" />
                    {done ? "Completed today" : "Mark complete"}
                  </button>
                </article>
              )
            })}
          </section>
        )}
      </div>

      {dialog.open && (
        <HabitFormDialog
          mode={dialog.mode}
          initial={dialog.mode === "edit" ? dialog.habit : undefined}
          onCancel={() => setDialog({ open: false })}
          onSave={handleSave}
        />
      )}
    </main>
  )
}

function SummaryStat({
  label,
  value,
  accent,
}: {
  label: string
  value: number | string
  accent?: "success" | "streak"
}) {
  const valueColor =
    accent === "success"
      ? "var(--color-success)"
      : accent === "streak"
      ? "var(--color-streak)"
      : "var(--color-text-primary)"

  return (
    <div
      className="rounded-lg border p-3 sm:p-4"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-xl font-bold sm:text-2xl"
        style={{ color: valueColor }}
      >
        {value}
      </p>
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div
      data-testid="empty-state"
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed px-6 py-16 text-center"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          background: "var(--color-primary-subtle)",
          color: "var(--color-primary)",
        }}
      >
        <Flame className="h-7 w-7" />
      </div>
      <div>
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          No habits yet
        </h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Start small. Pick one thing you want to do every day.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold"
        style={{ background: "var(--color-primary)", color: "#fff" }}
      >
        <Plus className="h-4 w-4" />
        Create your first habit
      </button>
    </div>
  )
}

export default DashboardPage
