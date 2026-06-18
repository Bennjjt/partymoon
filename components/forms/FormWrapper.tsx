'use client'

import {
  useForm,
  type UseFormReturn,
  type FieldValues,
  type DefaultValues,
  type SubmitHandler,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { ZodType } from 'zod'

interface FormWrapperProps<T extends FieldValues> {
  schema: ZodType<T>
  onSubmit: SubmitHandler<T>
  defaultValues?: DefaultValues<T>
  className?: string
  children: (methods: UseFormReturn<T>) => React.ReactNode
}

export function FormWrapper<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  className,
  children,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues,
  })

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className={className} noValidate>
      {children(methods)}
    </form>
  )
}
