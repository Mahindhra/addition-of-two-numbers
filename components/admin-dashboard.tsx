"use client"

import { useState } from "react"
import useSWR from "swr"
import { Loader2, RefreshCw } from "lucide-react"
import type {
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
} from "@/lib/complaints"
import { CATEGORIES, STATUSES, categoryLabel } from "@/lib/complaints"
import { Button } from "@/components/ui/button"
import { PriorityBadge, StatusBadge } from "@/components/status-badge"

type ApiResponse = {
  complaints: Complaint[]
  stats: { total: number; pending: number; inProgress: number; resolved: number }
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const statusFilters: { value: ComplaintStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...STATUSES.map((s) => ({ value: s.value, label: s.label })),
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function AdminDashboard() {
  const { data, isLoading, mutate } = useSWR<ApiResponse>(
    "/api/complaints",
    fetcher,
    { refreshInterval: 8000 },
  )
  const [filter, setFilter] = useState<ComplaintStatus | "all">("all")
  const [selected, setSelected] = useState<Complaint | null>(null)

  const complaints = data?.complaints ?? []
  const filtered =
    filter === "all"
      ? complaints
      : complaints.filter((c) => c.status === filter)

  const stats = data?.stats

  const statCards = [
    { label: "Total", value: stats?.total ?? 0, tone: "text-foreground" },
    { label: "Pending", value: stats?.pending ?? 0, tone: "text-warning-foreground" },
    { label: "In progress", value: stats?.inProgress ?? 0, tone: "text-info" },
    { label: "Resolved", value: stats?.resolved ?? 0, tone: "text-success" },
  ]

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Complaints dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Triage, prioritise and resolve passenger complaints.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => mutate()} className="gap-2">
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className={`mt-1 text-3xl font-bold ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && !data ? (
        <div className="flex items-center justify-center rounded-xl border border-border bg-card py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
          No complaints in this view.
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="grid gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 sm:grid-cols-[auto_1fr_auto] sm:items-center"
            >
              <span className="font-mono text-sm text-primary">{c.id}</span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{c.subject}</span>
                <span className="block text-xs text-muted-foreground">
                  {categoryLabel(c.category)} · {c.name} · {formatDate(c.createdAt)}
                </span>
              </span>
              <span className="flex items-center gap-3 justify-self-start sm:justify-self-end">
                <PriorityBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </span>
            </button>
          ))}
        </div>
      )}

      {selected ? (
        <ComplaintDrawer
          complaint={selected}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => {
            setSelected(updated)
            mutate()
          }}
        />
      ) : null}
    </div>
  )
}

function ComplaintDrawer({
  complaint,
  onClose,
  onUpdated,
}: {
  complaint: Complaint
  onClose: () => void
  onUpdated: (c: Complaint) => void
}) {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status)
  const [priority, setPriority] = useState<ComplaintPriority>(complaint.priority)
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  const selectClass =
    "w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, priority, note }),
      })
      const data = await res.json()
      if (res.ok) {
        onUpdated(data.complaint)
        setNote("")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-foreground/40"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-border bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <p className="font-mono text-sm text-primary">{complaint.id}</p>
            <h2 className="mt-1 text-lg font-semibold text-balance">
              {complaint.subject}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid gap-5 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>

          <p className="text-sm leading-relaxed text-foreground/90">
            {complaint.description}
          </p>

          <dl className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-4 text-sm">
            <Detail label="Category" value={categoryLabel(complaint.category)} />
            <Detail label="Filed" value={formatDate(complaint.createdAt)} />
            <Detail label="Passenger" value={complaint.name} />
            <Detail label="Phone" value={complaint.phone} />
            {complaint.busNumber ? (
              <Detail label="Bus number" value={complaint.busNumber} />
            ) : null}
            {complaint.route ? (
              <Detail label="Route" value={complaint.route} />
            ) : null}
            {complaint.depot ? (
              <Detail label="Depot" value={complaint.depot} />
            ) : null}
          </dl>

          {complaint.updates.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold">History</h3>
              <ol className="mt-3 space-y-3 border-l border-border pl-4">
                {complaint.updates.map((u, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                    <p className="text-sm font-medium capitalize">{u.status}</p>
                    <p className="text-sm text-foreground/80">{u.note}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(u.at)}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="grid gap-4 rounded-lg border border-border bg-secondary/40 p-4">
            <h3 className="text-sm font-semibold">Update complaint</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
                Status
                <select
                  className={selectClass}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
                Priority
                <select
                  className={selectClass}
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as ComplaintPriority)
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>
            <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
              Note to passenger
              <textarea
                className={`${selectClass} min-h-20 resize-y`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note explaining the action taken (optional)."
              />
            </label>
            <Button onClick={save} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              Save update
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
