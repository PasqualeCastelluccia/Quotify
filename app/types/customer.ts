// Export Customer types from Prisma-generated Zod schemas
// This ensures type safety and consistency with the database schema
export type { Customer } from '@/lib/generated/zod'

// Re-export the Zod schema for validation
import { CustomerSchema } from '@/lib/generated/zod'
export { CustomerSchema }

// Derived types for forms and operations
import type { Customer } from '@/lib/generated/zod'
export type CustomerFormData = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>
export type CustomerUpdateData = Partial<CustomerFormData>
