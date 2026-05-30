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
    <main className={cn('min-h-screen bg-background', className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-8">
        <header className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            {eyebrow ? (
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {title}
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                {description}
              </p>
            </div>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </header>
        {children}
      </div>
    </main>
  )
}
