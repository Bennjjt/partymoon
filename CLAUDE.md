@AGENTS.md

## BEARA — standard tools and services

### Email provider
All BEARA projects use **Loops** (https://loops.so) for audience and transactional email.

- Store the API key as `LOOPS_API_KEY` in `.env.local` (never commit)
- Add subscribers via `POST https://app.loops.so/api/v1/contacts/create` with `Authorization: Bearer $LOOPS_API_KEY`
- Payload is always the source of truth; Loops receives a non-blocking fire-and-forget sync
- If `LOOPS_API_KEY` is absent, skip the Loops call silently — do not error
- See `app/actions/joinWaitlist.ts` in this project for the reference implementation

---

### Forms

All forms in BEARA projects use **React Hook Form** (v7) with **Zod** (v4) validation via `@hookform/resolvers`.

**Standard pattern — use `FormWrapper` for all new forms:**

```tsx
import { FormWrapper } from '@/components/forms/FormWrapper'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  name: z.string().min(1, 'Name is required'),
})

type Values = z.infer<typeof schema>

<FormWrapper<Values> schema={schema} onSubmit={handleSubmit} className="space-y-4">
  {({ register, formState: { errors, isSubmitting } }) => (
    <>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <button type="submit" disabled={isSubmitting}>Submit</button>
    </>
  )}
</FormWrapper>
```

**Rules:**
- `FormWrapper` renders the `<form>`, calls `zodResolver`, and exposes the full `UseFormReturn` via render prop — do not add a second `<form>` tag inside
- Use shadcn `Input` and `Label` components (`components/ui/`) for all field markup
- Validation errors: display inline below the relevant field, never in a separate error summary
- Server errors (API failures): hold in local `useState`, display above the submit button, clear on next submit attempt
- Loading state: disable the submit button and swap its text via `formState.isSubmitting` — use Framer Motion `AnimatePresence` for the text swap
- See `app/(payload)/admin/login/page.tsx` for a complete reference implementation of this pattern
