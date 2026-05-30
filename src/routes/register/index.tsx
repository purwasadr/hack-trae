import { createFileRoute } from '@tanstack/react-router'
import { Leaf, Sparkles } from 'lucide-react'

import { redirectAuthenticatedUser } from '@/features/coach/route-helpers'

import RegisterForm from './-components/register-form'

export const Route = createFileRoute('/register/')({
  beforeLoad: async () => {
    await redirectAuthenticatedUser()
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfcf8_0%,#f4f8ef_100%)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1280px] gap-8 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="relative overflow-hidden rounded-[32px] border border-[#e3e8dc] bg-white p-8 shadow-[0_14px_40px_rgba(17,24,39,0.05)] md:p-10">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[280px] md:block">
            <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-[#eef7df] blur-3xl" />
            <div className="absolute bottom-4 right-4 h-36 w-44 rounded-t-[999px] bg-[#f4f8eb]" />
          </div>
          <div className="relative space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
              <Leaf className="size-5" />
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#4ea72e]">
                Begin gently
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[2.45rem]">
                Create your reflection coach account
              </h1>
              <p className="max-w-xl text-sm leading-6 text-[#687264] md:text-base">
                Set up your account, choose a working style, and start building a calmer
                productivity rhythm one reflection at a time.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[22px] border border-[#e4e8df] bg-[#fcfdf9] p-5">
                <Sparkles className="mb-3 size-5 text-[#4ea72e]" />
                <h2 className="font-semibold text-slate-900">Guided onboarding</h2>
                <p className="mt-2 text-sm leading-6 text-[#6b7566]">
                  Answer a few simple questions so the coach can tailor your first steps.
                </p>
              </div>
              <div className="rounded-[22px] border border-[#e4e8df] bg-[#fcfdf9] p-5">
                <Leaf className="mb-3 size-5 text-[#4ea72e]" />
                <h2 className="font-semibold text-slate-900">Practical reflection</h2>
                <p className="mt-2 text-sm leading-6 text-[#6b7566]">
                  Turn each workday into a short check-in with kinder, clearer next actions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full max-w-md justify-self-center">
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
