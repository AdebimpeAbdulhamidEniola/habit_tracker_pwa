"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Habit } from "@/types/Habit"

// ───────────────── schema ─────────────────
const formSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(60, "Habit name must be 60 characters or fewer")
    .transform((v) => v.trim()),
  description: z.string().transform((v) => v.trim()),
  frequency: z.literal("daily"),
})

type FormValues = z.infer<typeof formSchema>

// ───────────────── props ─────────────────
interface HabitFormProps {
  userId: string
  existingHabit?: Habit
  onSave: (habit: Habit) => void
  onCancel: () => void
}

// ───────────────── component ─────────────────
const HabitForm = ({ userId, existingHabit, onSave, onCancel }: HabitFormProps) => {
  const isEditing = !!existingHabit

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingHabit?.name ?? "",
      description: existingHabit?.description ?? "",
      frequency: "daily",
    },
  })

  function onSubmit(data: FormValues) {
    const allHabits: Habit[] = JSON.parse(
      localStorage.getItem("habit-tracker-habits") ?? "[]"
    )

    if (isEditing && existingHabit) {
      const updated: Habit = {
        ...existingHabit,
        name: data.name,
        description: data.description,
        frequency: data.frequency,
      }
      const newList = allHabits.map((h) =>
        h.id === existingHabit.id ? updated : h
      )
      localStorage.setItem("habit-tracker-habits", JSON.stringify(newList))
      onSave(updated)
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId,
        name: data.name,
        description: data.description,
        frequency: data.frequency,
        createdAt: new Date().toISOString(),
        completions: [],
      }
      localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([...allHabits, newHabit])
      )
      onSave(newHabit)
    }
  }

  return (
    // ── backdrop ──
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? "Edit habit" : "Create habit"}
    >
      <div className="w-full max-w-md">

        {/* ── sheet ── */}
        <div className="rounded-t-2xl rounded-b-none sm:rounded-2xl bg-surface border border-border shadow-lg sm:shadow-xl">

          {/* header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-border-subtle sm:px-6 sm:pt-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {isEditing ? "Edit Habit" : "New Habit"}
              </h2>
              <p className="mt-0.5 text-sm text-text-muted">
                {isEditing
                  ? "Update the details of your habit."
                  : "Add a habit you want to build consistently."}
              </p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              aria-label="Close form"
              className="
                ml-4 flex h-8 w-8 items-center justify-center rounded-full
                text-text-secondary hover:bg-bg-tertiary
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                transition-colors
              "
            >
              <X className="size-4" />
            </button>
          </div>

          {/* body */}
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <form
              data-testid="habit-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* ── Name ── */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="habit-name"
                      className="text-sm font-medium text-text-primary"
                    >
                      Habit Name{" "}
                      <span aria-hidden="true" className="text-error">*</span>
                    </label>

                    <Input
                      {...field}
                      id="habit-name"
                      type="text"
                      placeholder="e.g. Drink Water"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      data-testid="habit-name-input"
                      className="h-12 text-base bg-bg-secondary border-border text-text-primary placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-primary/20"
                    />

                    {fieldState.error?.message && (
                      <p role="alert" className="text-sm text-error">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* ── Description ── */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="habit-description"
                      className="text-sm font-medium text-text-primary"
                    >
                      Description{" "}
                      <span className="font-normal text-text-muted">(optional)</span>
                    </label>

                    <Input
                      {...field}
                      id="habit-description"
                      type="text"
                      placeholder="e.g. 8 glasses a day"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      data-testid="habit-description-input"
                      className="h-12 text-base bg-bg-secondary border-border text-text-primary placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-primary/20"
                    />

                    {fieldState.error?.message && (
                      <p role="alert" className="text-sm text-error">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* ── Frequency ── */}
              <Controller
                name="frequency"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="habit-frequency"
                      className="text-sm font-medium text-text-primary"
                    >
                      Frequency
                    </label>

                    <select
                      {...field}
                      id="habit-frequency"
                      data-testid="habit-frequency-select"
                      className="
                        h-12 w-full rounded-3xl px-3 text-base cursor-pointer
                        bg-bg-secondary border border-border text-text-primary
                        focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20
                        transition-colors
                      "
                    >
                      <option value="daily">Daily</option>
                    </select>
                  </div>
                )}
              />

              {/* ── Actions ── */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="
                    h-12 flex-1 rounded-4xl border border-border
                    text-base font-medium text-text-secondary
                    hover:bg-bg-secondary hover:text-text-primary
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                    transition-colors
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  data-testid="habit-save-button"
                  className="
                    h-12 flex-1 rounded-4xl
                    bg-primary text-white text-base font-medium
                    hover:opacity-90
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                    transition-opacity
                  "
                >
                  {isEditing ? "Save Changes" : "Create Habit"}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default HabitForm