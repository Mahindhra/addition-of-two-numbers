"use client"

import { useState } from "react"
import { CheckCircle2, Copy, Loader2 } from "lucide-react"
import { CATEGORIES } from "@/lib/complaints"
import type { Complaint } from "@/lib/complaints"
import { Button } from "@/components/ui/button"

const fieldClass =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
const labelClass = "text-sm font-medium text-foreground"

const initialForm = {
  category: "",
  subject: "",
  description: "",
  name: "",
  phone: "",
  busNumber: "",
  route: "",
  depot: "",
}

export function ComplaintForm() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<Complaint | null>(null)
  const [copied, setCopied] = useState(false)

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.")
      }
      setCreated(data.complaint)
      setForm(initialForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  async function copyId() {
    if (!created) return
    await navigator.clipboard.writeText(created.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (created) {
    return (
      <div className="rounded-xl border border-success/40 bg-success/5 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-8 text-success" aria-hidden />
          <div>
            <h3 className="text-lg font-semibold">Complaint registered</h3>
            <p className="text-sm text-muted-foreground">
              Save your reference ID to track the status anytime.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Reference ID
            </p>
            <p className="font-mono text-2xl font-bold text-primary">
              {created.id}
            </p>
          </div>
          <Button variant="outline" onClick={copyId} className="gap-2">
            {copied ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? "Copied" : "Copy ID"}
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => setCreated(null)}>File another complaint</Button>
          <Button render={<a href="#track" />} nativeButton={false} variant="ghost">
            Track this complaint
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <span className={labelClass}>What is your complaint about?</span>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const selected = form.category === c.value
            return (
              <button
                type="button"
                key={c.value}
                onClick={() => update("category", c.value)}
                aria-pressed={selected}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="block text-sm font-medium">{c.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {c.description}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <label className={labelClass} htmlFor="subject">
          Subject
        </label>
        <input
          id="subject"
          className={fieldClass}
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          placeholder="Brief summary of the issue"
          required
          maxLength={120}
        />
      </div>

      <div className="grid gap-2">
        <label className={labelClass} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className={`${fieldClass} min-h-28 resize-y`}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Tell us what happened — date, time and any details that help us investigate."
          required
          maxLength={1500}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="busNumber">
            Bus number <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="busNumber"
            className={fieldClass}
            value={form.busNumber}
            onChange={(e) => update("busNumber", e.target.value)}
            placeholder="AP16 Z 4521"
          />
        </div>
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="route">
            Route <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="route"
            className={fieldClass}
            value={form.route}
            onChange={(e) => update("route", e.target.value)}
            placeholder="Vijayawada → Hyderabad"
          />
        </div>
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="depot">
            Depot <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="depot"
            className={fieldClass}
            value={form.depot}
            onChange={(e) => update("depot", e.target.value)}
            placeholder="Vijayawada Depot"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            className={fieldClass}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Full name"
            required
          />
        </div>
        <div className="grid gap-2">
          <label className={labelClass} htmlFor="phone">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            className={fieldClass}
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Mobile number for updates"
            required
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={submitting || !form.category}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit complaint"
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          You will receive a reference ID to track progress.
        </p>
      </div>
    </form>
  )
}
