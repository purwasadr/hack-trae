import { Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import { authClient } from '@/lib/auth-client'
import { useAppForm } from '@/lib/form/app-form'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().trim().min(2, {
    message: 'Name is required.',
  }).max(60),
  email: z.string().email({
    message: 'Invalid email address.',
  }).min(1, {
    message: 'Email is required.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
})

export default function RegisterForm({
  className,
}: React.ComponentProps<'form'>) {
  const navigate = useNavigate()

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    } as z.infer<typeof formSchema>,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await toast
        .promise(
          async () => {
            const res = await authClient.signUp.email({
              name: value.name,
              email: value.email,
              password: value.password,
              rememberMe: true,
            })

            if (res.error) {
              throw res.error
            }
          },
          {
            loading: 'Creating your account...',
            success: () => {
              navigate({ to: '/onboarding', replace: true })
              return 'Account created successfully'
            },
            error: (error) => {
              return error.message || 'Failed to create account'
            },
          },
        )
        .unwrap()
    },
  })

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Start your self-reflection coach with a simple email and password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.AppField name="name">
                {(field) => <field.InputField label="Name" />}
              </form.AppField>
              <form.AppField name="email">
                {(field) => <field.InputField label="Email" />}
              </form.AppField>
              <form.AppField name="password">
                {(field) => (
                  <field.InputField label="Password" type="password" />
                )}
              </form.AppField>
              <form.AppForm>
                <form.SubscribeButton label="Create account" className="w-full" />
              </form.AppForm>
            </FieldGroup>
            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
