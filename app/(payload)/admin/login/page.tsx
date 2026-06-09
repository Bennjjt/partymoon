'use client'

import { FormWrapper } from '@/components/forms/FormWrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const [serverError, setServerError] = useState('')

  const handleLogin = async (data: LoginValues) => {
    setServerError('')

    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password }),
    })

    if (res.ok) {
      window.location.href = '/admin'
    } else {
      const json = await res.json().catch(() => ({}))
      setServerError(
        json.errors?.[0]?.message ?? 'Invalid credentials. Please try again.',
      )
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: 'var(--pm-midnight)' }}
    >
      <motion.div
        className="w-full max-w-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MoonIcon />
            <span
              className="font-heading text-2xl font-normal tracking-[0.15em]"
              style={{ color: 'var(--pm-moon)' }}
            >
              Partymoon
            </span>
          </div>
          <p
            className="text-[0.6rem] tracking-[0.3em] uppercase"
            style={{ color: 'var(--pm-purple-light)' }}
          >
            Admin access
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-[2px] p-8 border"
          style={{
            background: 'var(--pm-deep)',
            borderColor: 'var(--pm-glass-border)',
          }}
        >
          <FormWrapper<LoginValues>
            schema={loginSchema}
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {({ register, formState: { errors, isSubmitting } }) => (
              <>
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[0.6rem] tracking-[0.2em] uppercase font-normal"
                    style={{ color: 'var(--pm-purple-light)' }}
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@example.com"
                    aria-invalid={!!errors.email}
                    className="h-11 rounded-[2px] text-[0.85rem] text-white placeholder:text-white/30 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{
                      background: 'var(--pm-navy)',
                      outline: 'none',
                      boxShadow: 'none',
                      border: `1px solid ${errors.email ? '#f09595' : 'var(--pm-glass-border)'}`,
                    }}
                    {...register('email')}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[0.65rem]"
                        style={{ color: '#f09595' }}
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[0.6rem] tracking-[0.2em] uppercase font-normal"
                    style={{ color: 'var(--pm-purple-light)' }}
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    className="h-11 rounded-[2px] text-[0.85rem] text-white placeholder:text-white/30 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{
                      background: 'var(--pm-navy)',
                      outline: 'none',
                      boxShadow: 'none',
                      border: `1px solid ${errors.password ? '#f09595' : 'var(--pm-glass-border)'}`,
                    }}
                    {...register('password')}
                  />
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[0.65rem]"
                        style={{ color: '#f09595' }}
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Server error */}
                <AnimatePresence>
                  {serverError && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[0.7rem] leading-relaxed"
                      style={{ color: '#f09595' }}
                    >
                      {serverError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-[2px] text-[0.65rem] tracking-[0.2em] uppercase text-white font-medium transition-opacity disabled:opacity-60"
                  style={{ background: 'var(--pm-purple)' }}
                  whileHover={{ opacity: 0.88 }}
                  transition={{ duration: 0.15 }}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.span
                        key="loading"
                        className="flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Spinner />
                        Signing in…
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        Sign in
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </>
            )}
          </FormWrapper>
        </div>
      </motion.div>
    </div>
  )
}

function MoonIcon() {
  return (
    <div
      className="relative size-6 rounded-full overflow-hidden flex-shrink-0"
      style={{ background: 'var(--pm-moon)' }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: '18px',
          height: '18px',
          background: 'var(--pm-midnight)',
          top: '2px',
          left: '7px',
        }}
      />
    </div>
  )
}

function Spinner() {
  return (
    <motion.span
      className="inline-block size-3 rounded-full"
      style={{ border: '1.5px solid rgba(255,255,255,0.35)', borderTopColor: 'transparent' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
    />
  )
}
