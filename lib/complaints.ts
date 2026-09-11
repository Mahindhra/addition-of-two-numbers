export type ComplaintCategory =
  | "delay"
  | "staff"
  | "cleanliness"
  | "lost-found"
  | "ticketing"
  | "safety"

export type ComplaintStatus = "pending" | "in-progress" | "resolved" | "rejected"

export type ComplaintPriority = "low" | "medium" | "high"

export type ComplaintUpdate = {
  status: ComplaintStatus
  note: string
  at: string
}

export type Complaint = {
  id: string
  category: ComplaintCategory
  subject: string
  description: string
  name: string
  phone: string
  busNumber: string
  route: string
  depot: string
  status: ComplaintStatus
  priority: ComplaintPriority
  createdAt: string
  updates: ComplaintUpdate[]
}

export const CATEGORIES: {
  value: ComplaintCategory
  label: string
  description: string
}[] = [
  { value: "delay", label: "Delay / Timing", description: "Late buses, missed schedules, no-show services" },
  { value: "staff", label: "Driver / Conductor", description: "Rude behaviour, rash driving, overcharging" },
  { value: "cleanliness", label: "Cleanliness / Condition", description: "Dirty buses, broken seats, AC or fan issues" },
  { value: "lost-found", label: "Lost & Found", description: "Items left behind on a bus" },
  { value: "ticketing", label: "Ticketing / Fare", description: "Booking, refund and fare disputes" },
  { value: "safety", label: "Safety / Other", description: "Accidents, harassment and general concerns" },
]

export const STATUSES: { value: ComplaintStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
]

export const PRIORITIES: { value: ComplaintPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

export function categoryLabel(value: ComplaintCategory) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function statusLabel(value: ComplaintStatus) {
  return STATUSES.find((s) => s.value === value)?.label ?? value
}
