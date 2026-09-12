import type {
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from "@/lib/complaints"

// In-memory store. Persisted on globalThis so it survives Next.js HMR reloads
// during development. This is a prototype store — connect a database (e.g. Neon)
// to make complaints persist permanently across restarts.
type Store = { complaints: Complaint[] }

const globalForStore = globalThis as unknown as { __apsrtcStore?: Store }

function seed(): Complaint[] {
  const now = Date.now()
  const iso = (offsetMinutes: number) =>
    new Date(now - offsetMinutes * 60_000).toISOString()

  return [
    {
      id: "APS-7F3K9Q",
      category: "delay",
      subject: "Vijayawada express delayed by 90 minutes",
      description:
        "The 6:30 AM Super Luxury from Vijayawada to Hyderabad did not arrive until 8:00 AM with no announcement at the bus station.",
      name: "Ravi Teja",
      phone: "98490 11223",
      busNumber: "AP16 Z 4521",
      route: "Vijayawada → Hyderabad",
      depot: "Vijayawada Depot",
      status: "in-progress",
      priority: "high",
      createdAt: iso(60 * 22),
      updates: [
        {
          status: "in-progress",
          note: "Forwarded to Vijayawada depot manager for scheduling review.",
          at: iso(60 * 10),
        },
      ],
    },
    {
      id: "APS-2M8L4X",
      category: "cleanliness",
      subject: "AC not working on Garuda Plus",
      description:
        "The air conditioning was switched off for the entire journey and two windows would not close properly.",
      name: "Sneha Reddy",
      phone: "99590 44556",
      busNumber: "AP28 B 7788",
      route: "Tirupati → Bengaluru",
      depot: "Tirupati Depot",
      status: "pending",
      priority: "medium",
      createdAt: iso(60 * 5),
      updates: [],
    },
    {
      id: "APS-9K1P6R",
      category: "lost-found",
      subject: "Left a black backpack on the bus",
      description:
        "Forgot a black backpack containing documents near seat 14. Please check with the conductor.",
      name: "Imran Khan",
      phone: "90000 78900",
      busNumber: "AP07 T 1290",
      route: "Kakinada → Visakhapatnam",
      depot: "Kakinada Depot",
      status: "resolved",
      priority: "medium",
      createdAt: iso(60 * 50),
      updates: [
        {
          status: "in-progress",
          note: "Conductor located the backpack, held at Visakhapatnam counter.",
          at: iso(60 * 40),
        },
        {
          status: "resolved",
          note: "Item collected by passenger. Complaint closed.",
          at: iso(60 * 30),
        },
      ],
    },
    {
      id: "APS-5D2H7W",
      category: "staff",
      subject: "Conductor refused to give change",
      description:
        "Conductor did not return the balance of 15 rupees and was dismissive when asked.",
      name: "Lakshmi Prasad",
      phone: "98851 22110",
      busNumber: "AP09 M 3345",
      route: "Guntur → Ongole",
      depot: "Guntur Depot",
      status: "pending",
      priority: "low",
      createdAt: iso(60 * 2),
      updates: [],
    },
  ]
}

function getStore(): Store {
  if (!globalForStore.__apsrtcStore) {
    globalForStore.__apsrtcStore = { complaints: seed() }
  }
  return globalForStore.__apsrtcStore
}

function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `APS-${code}`
}

export function listComplaints(): Complaint[] {
  return [...getStore().complaints].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function getComplaint(id: string): Complaint | undefined {
  return getStore().complaints.find(
    (c) => c.id.toLowerCase() === id.toLowerCase(),
  )
}

export type NewComplaintInput = {
  category: ComplaintCategory
  subject: string
  description: string
  name: string
  phone: string
  busNumber: string
  route: string
  depot: string
}

export function createComplaint(input: NewComplaintInput): Complaint {
  const priority: ComplaintPriority =
    input.category === "safety" ? "high" : "medium"

  const complaint: Complaint = {
    id: generateId(),
    category: input.category,
    subject: input.subject.trim(),
    description: input.description.trim(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    busNumber: input.busNumber.trim(),
    route: input.route.trim(),
    depot: input.depot.trim(),
    status: "pending",
    priority,
    createdAt: new Date().toISOString(),
    updates: [],
  }

  getStore().complaints.push(complaint)
  return complaint
}

export function updateComplaint(
  id: string,
  changes: { status?: ComplaintStatus; priority?: ComplaintPriority; note?: string },
): Complaint | undefined {
  const complaint = getComplaint(id)
  if (!complaint) return undefined

  if (changes.priority) {
    complaint.priority = changes.priority
  }

  if (changes.status && changes.status !== complaint.status) {
    complaint.status = changes.status
    complaint.updates.push({
      status: changes.status,
      note: changes.note?.trim() || `Status changed to ${changes.status}.`,
      at: new Date().toISOString(),
    })
  } else if (changes.note?.trim()) {
    complaint.updates.push({
      status: complaint.status,
      note: changes.note.trim(),
      at: new Date().toISOString(),
    })
  }

  return complaint
}

export function stats() {
  const all = getStore().complaints
  return {
    total: all.length,
    pending: all.filter((c) => c.status === "pending").length,
    inProgress: all.filter((c) => c.status === "in-progress").length,
    resolved: all.filter((c) => c.status === "resolved").length,
  }
}
