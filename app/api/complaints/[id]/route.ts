import { NextResponse } from "next/server"
import { PRIORITIES, STATUSES } from "@/lib/complaints"
import { getComplaint, updateComplaint } from "@/lib/complaints-store"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const complaint = getComplaint(id)
  if (!complaint) {
    return NextResponse.json({ error: "Complaint not found." }, { status: 404 })
  }
  return NextResponse.json({ complaint })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (body.status && !STATUSES.some((s) => s.value === body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 })
  }
  if (body.priority && !PRIORITIES.some((p) => p.value === body.priority)) {
    return NextResponse.json({ error: "Invalid priority." }, { status: 400 })
  }

  const complaint = updateComplaint(id, {
    status: body.status as never,
    priority: body.priority as never,
    note: typeof body.note === "string" ? body.note : undefined,
  })

  if (!complaint) {
    return NextResponse.json({ error: "Complaint not found." }, { status: 404 })
  }

  return NextResponse.json({ complaint })
}
