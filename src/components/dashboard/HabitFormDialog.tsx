"use client"

import React, { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

import { Habit } from "@/app/types/Habit"
import { validateHabitName } from "@/lib/validator"

export type HabitFormValues = {
  name: string
  description: string
}

type Props = {
  mode: "create" | "edit"
  initial?: Habit
  onCancel: () => void
  onSave: (values: HabitFormValues) => void
}

const HabitFormDialog: React.FC<Props> = ({ mode, initial, onCancel, onSave }) => {
  const [name, setName] = useState(initial?.name ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [error, setError] = useState<string | null>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstFieldRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onCancel])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = validateHabitName(name)
    if (!v.valid) {
      setError(v.error)
      return
    }
    onSave({ name: v.value, description: description.trim() })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-form-title"
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        className="w-full max-w-md rounded-t-xl sm:rounded-xl"
        style={{
          background: "var(--color-surface)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h2
            id="habit-form-title"
            className="text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {mode === "edit" ? "Edit habit" : "New habit"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-md p-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          data-testid="habit-form"
          onSubmit={handleSubmit}
          className="space-y-4 px-5 py-5"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="habit-name-input"
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Habit name
            </label>
            <input
              ref={firstFieldRef}
              id="habit-name-input"
              data-testid="habit-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError(null)
              }}
              placeholder="e.g. Drink water"
              aria-invalid={!!error}
              className="w-full rounded-md border px-3 py-2 text-base outline-none focus:ring-2"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                borderColor: error
                  ? "var(--color-error)"
                  : "var(--color-border)",
              }}
            />
            {error && (
              <p
                role="alert"
                className="text-xs"
                style={{ color: "var(--color-error)" }}
              >
                {error}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="habit-description-input"
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Description{" "}
              <span style={{ color: "var(--color-text-muted)" }}>
                (optional)
              </span>
            </label>
            <textarea
              id="habit-description-input"
              data-testid="habit-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this matter to you?"
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-base outline-none focus:ring-2"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                borderColor: "var(--color-border)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="habit-frequency-select"
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Frequency
            </label>
            <select
              id="habit-frequency-select"
              data-testid="habit-frequency-select"
              value="daily"
              onChange={() => {
                /* only daily is supported in this stage */
              }}
              className="w-full rounded-md border px-3 py-2 text-base outline-none focus:ring-2"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                borderColor: "var(--color-border)",
              }}
            >
              <option value="daily">Daily</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border px-4 py-2 text-sm font-medium"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                borderColor: "var(--color-border)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="habit-save-button"
              className="rounded-md px-4 py-2 text-sm font-semibold"
              style={{ background: "var(--color-primary)", color: "#fff" }}
            >
              {mode === "edit" ? "Save changes" : "Create habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HabitFormDialog
