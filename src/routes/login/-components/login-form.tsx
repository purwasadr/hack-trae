import { z } from 'zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { useAppForm } from '@/lib/form/app-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'

const formSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }).min(1, {
    message: 'Email is required.',
  }),
  password: z.string().min(8, {
    message: 'Password is required.',
  }),
})

export default function LoginForm({
  className,
}: React.ComponentProps<'form'>) {
  const navigate = useNavigate()

  const form = useAppForm({
    defaultValues: {
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
            const res = await authClient.signIn.email({
              email: value.email,
              password: value.password,
            })
            if (res.error) {
              throw res.error
            }
          },
          {
            loading: 'Logging in...',
            success: () => {
              navigate({ to: '/', replace: true })
              return 'Logged in successfully'
            },
            error: (error) => {
              return error.message || 'Failed to login'
            },
          },
        )
        .unwrap()
    },
  })

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card className="border-[#dbe7d4] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcf8_100%)]">
        <CardHeader>
          <CardTitle className="text-xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to return to your latest reflections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <FieldGroup className="">
              <form.AppField name="email">
                {(field) => <field.InputField label="Email" />}
              </form.AppField>
              <form.AppField name="password">
                {(field) => (
                  <field.InputField label="Password" type="password" />
                )}
              </form.AppField>
              <form.AppForm>
                <form.SubscribeButton label="Login" className="w-full" />
              </form.AppForm>
            </FieldGroup>
            <div className="mt-6 text-center text-sm text-[#6b7566]">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-[#3b8e20] underline underline-offset-4">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
