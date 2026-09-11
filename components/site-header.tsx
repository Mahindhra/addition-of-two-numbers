import Link from "next/link"
import { Bus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader({ active }: { active?: "home" | "admin" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bus className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight">APSRTC</span>
            <span className="text-xs text-muted-foreground">Complaint Portal</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Button
            render={<Link href="/#file" />}
            nativeButton={false}
            variant={active === "home" ? "secondary" : "ghost"}
            size="sm"
          >
            File a complaint
          </Button>
          <Button
            render={<Link href="/#track" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Track status
          </Button>
          <Button
            render={<Link href="/admin" />}
            nativeButton={false}
            variant={active === "admin" ? "default" : "outline"}
            size="sm"
          >
            Admin
          </Button>
        </nav>
      </div>
    </header>
  )
}
