import type { ZodError } from 'zod'

export function formatZodError(error: ZodError): Array<Record<string, string>> {
  return error.errors.map((e) => {
    // You can customize the error message format here
    // return `${e.path.join('.')} - ${e.message}`
    const field = e.path.join('.')
    return { field, message: e.message }
  })
}
