// Export Customer types from Prisma-generated Zod schemas
// This ensures type safety and consistency with the database schema
export type { Quote } from '@/lib/generated/zod'

import { QuoteSchema } from '@/lib/generated/zod'
export { QuoteSchema }
