import { createFileRoute } from '@tanstack/react-router'

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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}
