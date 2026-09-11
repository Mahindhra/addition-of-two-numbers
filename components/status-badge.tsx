import type { ComplaintPriority, ComplaintStatus } from "@/lib/complaints"
import { statusLabel } from "@/lib/complaints"
import { cn } from "@/lib/utils"

const statusStyles: Record<ComplaintStatus, string> = {
  pending: "bg-warning/15 text-warning-foreground ring-warning/30",
  "in-progress": "bg-info/15 text-info ring-info/30",
  resolved: "bg-success/15 text-success ring-success/30",
  rejected: "bg-destructive/10 text-destructive ring-destructive/30",
}

export function StatusBadge({
  status,
  className,
}: {
  status: ComplaintStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        statusStyles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {statusLabel(status)}
    </span>
  )
}

const priorityStyles: Record<ComplaintPriority, string> = {
  low: "text-muted-foreground",
  medium: "text-warning-foreground",
  high: "text-destructive",
}

export function PriorityBadge({ priority }: { priority: ComplaintPriority }) {
  return (
    <span
      className={cn(
        "text-xs font-medium capitalize",
        priorityStyles[priority],
      )}
    >
      {priority} priority
    </span>
  )
}
