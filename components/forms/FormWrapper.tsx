'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  type DefaultValues,
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  useForm,
  type UseFormReturn,
} from 'react-hook-form'
import type { ZodSchema } from 'zod'

interface FormWrapperProps<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodSchema<T, any>
  defaultValues?: DefaultValues<T>
  onSubmit: SubmitHandler<T>
  children: (methods: UseFormReturn<T>) => React.ReactNode
  className?: string
}

export function FormWrapper<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues,
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className} noValidate>
        {children(methods)}
      </form>
    </FormProvider>
  )
}
