import Image from "next/image"
import Link from "next/link"
import {
  Bus,
  ClipboardList,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserRound,
} from "lucide-react"
import { CATEGORIES } from "@/lib/complaints"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { ComplaintForm } from "@/components/complaint-form"
import { TrackComplaint } from "@/components/track-complaint"

const categoryIcons: Record<string, typeof Bus> = {
  delay: Clock3,
  staff: UserRound,
  cleanliness: Sparkles,
  "lost-found": MapPin,
  ticketing: Ticket,
  safety: ShieldCheck,
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader active="home" />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <Bus className="size-3.5 text-primary" aria-hidden />
                Andhra Pradesh State Road Transport Corporation
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                Report a problem with your bus journey
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground text-pretty">
                Delays, staff conduct, cleanliness, lost items or safety — file
                a complaint in a minute and track it to resolution with a single
                reference ID.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  render={<Link href="#file" />}
                  nativeButton={false}
                  size="lg"
                >
                  <ClipboardList className="size-4" />
                  File a complaint
                </Button>
                <Button
                  render={<Link href="#track" />}
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                >
                  Track existing complaint
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
                <Image
                  src="/apsrtc-bus.png"
                  alt="An APSRTC intercity bus at a bus station"
                  width={900}
                  height={640}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            What can you report?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose the category that best fits your issue when filing a complaint.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => {
              const Icon = categoryIcons[c.value] ?? Bus
              return (
                <div
                  key={c.value}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-medium">{c.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* File a complaint */}
        <section
          id="file"
          className="scroll-mt-20 border-y border-border bg-secondary/40"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="text-2xl font-semibold tracking-tight">
                File a complaint
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Provide as much detail as you can. Your contact number is used
                only to share updates about this complaint.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
              <ComplaintForm />
            </div>
          </div>
        </section>

        {/* Track */}
        <section id="track" className="scroll-mt-20">
          <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Track your complaint
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the reference ID you received when filing your complaint.
            </p>
            <div className="mt-6">
              <TrackComplaint />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-2">
            <Bus className="size-4 text-primary" aria-hidden />
            <span>APSRTC Complaint Portal — a demonstration project</span>
          </div>
          <Link href="/admin" className="hover:text-foreground">
            Staff / Admin login
          </Link>
        </div>
      </footer>
    </div>
  )
}
