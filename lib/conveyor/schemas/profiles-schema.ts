import { z } from 'zod'

// Company Profile schema
const companyProfileSchema = z.object({
  id: z.number(),
  profileName: z.string(),
  businessName: z.string(),
  vatNumber: z.string(),
  address: z.string().nullish(),
  zipCode: z.string().nullish(),
  city: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  smtpHost: z.string().nullish(),
  smtpPort: z.number().optional(),
  smtpSecure: z.boolean().optional(),
  smtpUser: z.string().nullish(),
  smtpPassword: z.string().nullish(),
  smtpFromEmail: z.string().nullish(),
  smtpFromName: z.string().nullish(),
  isDefault: z.boolean().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
})

// Response schemas
const successResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

const createResponseSchema = z.object({
  success: z.boolean(),
  id: z.number().optional(),
  error: z.string().optional(),
})

// IPC schemas for profiles
export const profilesIpcSchema = {
  'profiles:getAll': {
    args: z.tuple([]),
    return: z.array(companyProfileSchema),
  },
  'profiles:getById': {
    args: z.tuple([z.number()]),
    return: companyProfileSchema.nullable(),
  },
  'profiles:getDefault': {
    args: z.tuple([]),
    return: companyProfileSchema.nullable(),
  },
  'profiles:create': {
    args: z.tuple([companyProfileSchema.omit({ id: true, createdAt: true, updatedAt: true })]),
    return: createResponseSchema,
  },
  'profiles:update': {
    args: z.tuple([companyProfileSchema.omit({ createdAt: true, updatedAt: true }).partial().required({ id: true })]),
    return: successResponseSchema,
  },
  'profiles:delete': {
    args: z.tuple([z.number()]),
    return: successResponseSchema,
  },
  'profiles:setDefault': {
    args: z.tuple([z.number()]),
    return: successResponseSchema,
  },
}

export type CompanyProfile = z.infer<typeof companyProfileSchema>
export type CompanyProfileCreate = z.infer<typeof companyProfileSchema>
export type CompanyProfileUpdate = z.infer<typeof companyProfileSchema>
