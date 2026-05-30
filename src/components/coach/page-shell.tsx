import { Link } from '@tanstack/react-router'
import { History, Home, Leaf, Plus, Settings, SunMedium } from 'lucide-react'

import { cn } from '@/lib/utils'

type PageShellProps = {
  title: string
  description: string
  eyebrow?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function PageShell({
  title,
  description,
  eyebrow,
  actions,
  children,
  className,
}: PageShellProps) {
  return (
    <main className={cn('min-h-screen bg-[linear-gradient(180deg,#fbfcf8_0%,#f4f8ef_100%)]', className)}>
      <div className="mx-auto flex w-full max-w-[1380px] gap-6 px-4 py-6 lg:px-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[78px] shrink-0 rounded-[28px] border border-[#e5eadf] bg-white p-3 shadow-[0_12px_34px_rgba(17,24,39,0.06)] lg:flex lg:flex-col lg:items-center lg:justify-between">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
              <Leaf className="size-5" />
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7e8779] transition hover:bg-[#f6f8f3] hover:text-[#3b8e20]"
                aria-label="Home"
              >
                <Home className="size-4" />
              </Link>
              <Link
                to="/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7e8779] transition hover:bg-[#f6f8f3] hover:text-[#3b8e20]"
                aria-label="Dashboard"
              >
                <Leaf className="size-4" />
              </Link>
              <Link
                to="/history"
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7e8779] transition hover:bg-[#f6f8f3] hover:text-[#3b8e20]"
                aria-label="History"
              >
                <History className="size-4" />
              </Link>
              <Link
                to="/reflection/new"
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7e8779] transition hover:bg-[#f6f8f3] hover:text-[#3b8e20]"
                aria-label="New reflection"
              >
                <Plus className="size-4" />
              </Link>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7e8779]">
            <Settings className="size-4" />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="relative overflow-hidden rounded-[32px] border border-[#e3e8dc] bg-white px-6 py-7 shadow-[0_14px_40px_rgba(17,24,39,0.05)] md:px-8">
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[320px] md:block">
              <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-[#eef7df] blur-3xl" />
              <div className="absolute bottom-2 right-4 h-32 w-52 rounded-t-[999px] bg-[#f4f8eb]" />
              <div className="absolute bottom-10 right-28 h-20 w-20 rounded-full bg-[#f9e7b3]/55 blur-2xl" />
              <SunMedium className="absolute right-20 top-12 size-9 text-[#f0c568]" />
            </div>
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl space-y-3">
                {eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#4ea72e]">
                    {eyebrow}
                  </p>
                ) : null}
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[2.45rem]">
                    {title}
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-[#687264] md:text-base">
                    {description}
                  </p>
                </div>
              </div>
              {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </header>

          <div className="mt-6 grid gap-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
