'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, LockKeyhole } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    })

    if (!result?.ok) {
      setError('Invalid login credentials')
      return
    }

    router.replace(searchParams.get('callbackUrl') || '/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-cyan-900/10 bg-white p-6 shadow-[0_24px_90px_rgba(8,145,178,0.16)]">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
        <LockKeyhole size={22} aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-3xl font-semibold text-slate-950">Admin Login</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Sign in to manage SEO blogs for Marcos Water Solutions.</p>

      <label className="mt-6 block">
        <span className="text-sm font-semibold text-slate-800">Email</span>
        <input {...register('email')} type="email" autoComplete="email" className="form-field mt-2" />
        {errors.email?.message ? <span className="mt-2 block text-sm text-red-700">{errors.email.message}</span> : null}
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-slate-800">Password</span>
        <input {...register('password')} type="password" autoComplete="current-password" className="form-field mt-2" />
        {errors.password?.message ? <span className="mt-2 block text-sm text-red-700">{errors.password.message}</span> : null}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : null}
        {isSubmitting ? 'Signing in...' : 'Login'}
      </button>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}
