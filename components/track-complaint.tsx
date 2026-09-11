"use client"

import { useState } from "react"
import { Loader2, Search } from "lucide-react"
import type { Complaint } from "@/lib/complaints"
import { categoryLabel, statusLabel } from "@/lib/complaints"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function TrackComplaint() {
  const [id, setId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Complaint | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(id.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "Complaint not found.")
      }
      setResult(data.complaint)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Complaint not found.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter reference ID, e.g. APS-7F3K9Q"
            aria-label="Complaint reference ID"
            className="w-full rounded-md border border-input bg-card py-2 pl-9 pr-3 font-mono text-sm uppercase text-foreground shadow-xs outline-none placeholder:font-sans placeholder:normal-case placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
        <Button type="submit" disabled={loading || !id.trim()}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Track"}
        </Button>
      </form>

      {error ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-sm text-primary">{result.id}</p>
              <h3 className="mt-1 text-lg font-semibold text-balance">
                {result.subject}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {categoryLabel(result.category)} · Filed {formatDate(result.createdAt)}
              </p>
            </div>
            <StatusBadge status={result.status} />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground/90">
            {result.description}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm sm:grid-cols-3">
            {result.busNumber ? (
              <div>
                <dt className="text-xs text-muted-foreground">Bus number</dt>
                <dd className="font-medium">{result.busNumber}</dd>
              </div>
            ) : null}
            {result.route ? (
              <div>
                <dt className="text-xs text-muted-foreground">Route</dt>
                <dd className="font-medium">{result.route}</dd>
              </div>
            ) : null}
            {result.depot ? (
              <div>
                <dt className="text-xs text-muted-foreground">Depot</dt>
                <dd className="font-medium">{result.depot}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-6">
            <h4 className="text-sm font-semibold">Progress timeline</h4>
            <ol className="mt-3 space-y-4">
              <li className="flex gap-3">
                <span className="mt-1 size-2.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <div>
                  <p className="text-sm font-medium">Complaint received</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(result.createdAt)}
                  </p>
                </div>
              </li>
              {result.updates.map((u, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="mt-1 size-2.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {statusLabel(u.status)}
                    </p>
                    <p className="text-sm text-foreground/80">{u.note}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(u.at)}
                    </p>
                  </div>
                </li>
              ))}
              {result.status === "pending" && result.updates.length === 0 ? (
                <li className="flex gap-3">
                  <span className="mt-1 size-2.5 shrink-0 rounded-full border border-muted-foreground/40" aria-hidden />
                  <p className="text-sm text-muted-foreground">
                    Awaiting review by the depot team.
                  </p>
                </li>
              ) : null}
            </ol>
          </div>
        </div>
      ) : null}
    </div>
  )
}
