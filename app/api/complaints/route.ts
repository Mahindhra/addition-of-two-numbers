import { NextResponse } from "next/server"
import { CATEGORIES } from "@/lib/complaints"
import { createComplaint, listComplaints, stats } from "@/lib/complaints-store"

export async function GET() {
  return NextResponse.json({ complaints: listComplaints(), stats: stats() })
}

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const required = ["category", "subject", "description", "name", "phone"] as const
  for (const field of required) {
    if (typeof body[field] !== "string" || !(body[field] as string).trim()) {
      return NextResponse.json(
        { error: `Missing required field: ${field}.` },
        { status: 400 },
      )
    }
  }

  const category = String(body.category)
  if (!CATEGORIES.some((c) => c.value === category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 })
  }

  const complaint = createComplaint({
    category: category as (typeof CATEGORIES)[number]["value"],
    subject: String(body.subject),
    description: String(body.description),
    name: String(body.name),
    phone: String(body.phone),
    busNumber: typeof body.busNumber === "string" ? body.busNumber : "",
    route: typeof body.route === "string" ? body.route : "",
    depot: typeof body.depot === "string" ? body.depot : "",
  })

  return NextResponse.json({ complaint }, { status: 201 })
}
