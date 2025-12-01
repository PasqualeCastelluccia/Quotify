import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['Serializable']);

export const CustomerScalarFieldEnumSchema = z.enum(['id','businessName','email','vatNumber','address','zipCode','city','createdAt','updatedAt']);

export const ProductScalarFieldEnumSchema = z.enum(['id','code','description','measure','price','createdAt','updatedAt']);

export const CompanyProfileScalarFieldEnumSchema = z.enum(['id','profileName','businessName','vatNumber','address','zipCode','city','phone','email','smtpHost','smtpPort','smtpSecure','smtpUser','smtpPassword','smtpFromEmail','smtpFromName','isDefault','createdAt','updatedAt']);

export const QuoteScalarFieldEnumSchema = z.enum(['id','number','revision','date','customerId','customerBusinessName','customerEmail','customerVatNumber','customerAddress','customerZipCode','customerCity','subtotal','totalVat','total','notes','metadata','status','companyProfileId','createdAt','updatedAt']);

export const QuoteItemScalarFieldEnumSchema = z.enum(['id','quoteId','ordering','productId','code','measure','description','unit','quantity','unitPrice','lineTotal','discount1','discount2','discount3','netUnitPrice','netLineTotal','vatRate','vatAmount','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CUSTOMER SCHEMA
/////////////////////////////////////////

export const CustomerSchema = z.object({
  id: z.number().int(),
  businessName: z.string(),
  email: z.string(),
  vatNumber: z.string(),
  address: z.string().nullable(),
  zipCode: z.string().nullable(),
  city: z.string().nullable(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
})

export type Customer = z.infer<typeof CustomerSchema>

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  id: z.number().int(),
  code: z.string(),
  description: z.string().nullable(),
  measure: z.string().nullable(),
  price: z.number(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
})

export type Product = z.infer<typeof ProductSchema>

/////////////////////////////////////////
// COMPANY PROFILE SCHEMA
/////////////////////////////////////////

export const CompanyProfileSchema = z.object({
  id: z.number().int(),
  profileName: z.string(),
  businessName: z.string(),
  vatNumber: z.string(),
  address: z.string().nullable(),
  zipCode: z.string().nullable(),
  city: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  smtpHost: z.string().nullable(),
  smtpPort: z.number().int().nullable(),
  smtpSecure: z.number().int().nullable(),
  smtpUser: z.string().nullable(),
  smtpPassword: z.string().nullable(),
  smtpFromEmail: z.string().nullable(),
  smtpFromName: z.string().nullable(),
  isDefault: z.number().int(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
})

export type CompanyProfile = z.infer<typeof CompanyProfileSchema>

/////////////////////////////////////////
// QUOTE SCHEMA
/////////////////////////////////////////

export const QuoteSchema = z.object({
  id: z.number().int(),
  number: z.number().int(),
  revision: z.number().int(),
  date: z.string(),
  customerId: z.number().int().nullable(),
  customerBusinessName: z.string(),
  customerEmail: z.string().nullable(),
  customerVatNumber: z.string().nullable(),
  customerAddress: z.string().nullable(),
  customerZipCode: z.string().nullable(),
  customerCity: z.string().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().nullable(),
  metadata: z.string().nullable(),
  status: z.string(),
  companyProfileId: z.number().int().nullable(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
})

export type Quote = z.infer<typeof QuoteSchema>

/////////////////////////////////////////
// QUOTE ITEM SCHEMA
/////////////////////////////////////////

export const QuoteItemSchema = z.object({
  id: z.number().int(),
  quoteId: z.number().int(),
  ordering: z.number().int(),
  productId: z.number().int().nullable(),
  code: z.string(),
  measure: z.string().nullable(),
  description: z.string().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number(),
  discount2: z.number(),
  discount3: z.number(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().int().nullable(),
  updatedAt: z.number().int().nullable(),
})

export type QuoteItem = z.infer<typeof QuoteItemSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// CUSTOMER
//------------------------------------------------------

export const CustomerIncludeSchema: z.ZodType<Prisma.CustomerInclude> = z.object({
  quotes: z.union([z.boolean(),z.lazy(() => QuoteFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CustomerCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const CustomerArgsSchema: z.ZodType<Prisma.CustomerDefaultArgs> = z.object({
  select: z.lazy(() => CustomerSelectSchema).optional(),
  include: z.lazy(() => CustomerIncludeSchema).optional(),
}).strict();

export const CustomerCountOutputTypeArgsSchema: z.ZodType<Prisma.CustomerCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CustomerCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CustomerCountOutputTypeSelectSchema: z.ZodType<Prisma.CustomerCountOutputTypeSelect> = z.object({
  quotes: z.boolean().optional(),
}).strict();

export const CustomerSelectSchema: z.ZodType<Prisma.CustomerSelect> = z.object({
  id: z.boolean().optional(),
  businessName: z.boolean().optional(),
  email: z.boolean().optional(),
  vatNumber: z.boolean().optional(),
  address: z.boolean().optional(),
  zipCode: z.boolean().optional(),
  city: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  quotes: z.union([z.boolean(),z.lazy(() => QuoteFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CustomerCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PRODUCT
//------------------------------------------------------

export const ProductIncludeSchema: z.ZodType<Prisma.ProductInclude> = z.object({
  quoteItems: z.union([z.boolean(),z.lazy(() => QuoteItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ProductArgsSchema: z.ZodType<Prisma.ProductDefaultArgs> = z.object({
  select: z.lazy(() => ProductSelectSchema).optional(),
  include: z.lazy(() => ProductIncludeSchema).optional(),
}).strict();

export const ProductCountOutputTypeArgsSchema: z.ZodType<Prisma.ProductCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProductCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProductCountOutputTypeSelectSchema: z.ZodType<Prisma.ProductCountOutputTypeSelect> = z.object({
  quoteItems: z.boolean().optional(),
}).strict();

export const ProductSelectSchema: z.ZodType<Prisma.ProductSelect> = z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  description: z.boolean().optional(),
  measure: z.boolean().optional(),
  price: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  quoteItems: z.union([z.boolean(),z.lazy(() => QuoteItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COMPANY PROFILE
//------------------------------------------------------

export const CompanyProfileIncludeSchema: z.ZodType<Prisma.CompanyProfileInclude> = z.object({
  quotes: z.union([z.boolean(),z.lazy(() => QuoteFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CompanyProfileCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const CompanyProfileArgsSchema: z.ZodType<Prisma.CompanyProfileDefaultArgs> = z.object({
  select: z.lazy(() => CompanyProfileSelectSchema).optional(),
  include: z.lazy(() => CompanyProfileIncludeSchema).optional(),
}).strict();

export const CompanyProfileCountOutputTypeArgsSchema: z.ZodType<Prisma.CompanyProfileCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CompanyProfileCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CompanyProfileCountOutputTypeSelectSchema: z.ZodType<Prisma.CompanyProfileCountOutputTypeSelect> = z.object({
  quotes: z.boolean().optional(),
}).strict();

export const CompanyProfileSelectSchema: z.ZodType<Prisma.CompanyProfileSelect> = z.object({
  id: z.boolean().optional(),
  profileName: z.boolean().optional(),
  businessName: z.boolean().optional(),
  vatNumber: z.boolean().optional(),
  address: z.boolean().optional(),
  zipCode: z.boolean().optional(),
  city: z.boolean().optional(),
  phone: z.boolean().optional(),
  email: z.boolean().optional(),
  smtpHost: z.boolean().optional(),
  smtpPort: z.boolean().optional(),
  smtpSecure: z.boolean().optional(),
  smtpUser: z.boolean().optional(),
  smtpPassword: z.boolean().optional(),
  smtpFromEmail: z.boolean().optional(),
  smtpFromName: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  quotes: z.union([z.boolean(),z.lazy(() => QuoteFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CompanyProfileCountOutputTypeArgsSchema)]).optional(),
}).strict()

// QUOTE
//------------------------------------------------------

export const QuoteIncludeSchema: z.ZodType<Prisma.QuoteInclude> = z.object({
  customer: z.union([z.boolean(),z.lazy(() => CustomerArgsSchema)]).optional(),
  companyProfile: z.union([z.boolean(),z.lazy(() => CompanyProfileArgsSchema)]).optional(),
  items: z.union([z.boolean(),z.lazy(() => QuoteItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => QuoteCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const QuoteArgsSchema: z.ZodType<Prisma.QuoteDefaultArgs> = z.object({
  select: z.lazy(() => QuoteSelectSchema).optional(),
  include: z.lazy(() => QuoteIncludeSchema).optional(),
}).strict();

export const QuoteCountOutputTypeArgsSchema: z.ZodType<Prisma.QuoteCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => QuoteCountOutputTypeSelectSchema).nullish(),
}).strict();

export const QuoteCountOutputTypeSelectSchema: z.ZodType<Prisma.QuoteCountOutputTypeSelect> = z.object({
  items: z.boolean().optional(),
}).strict();

export const QuoteSelectSchema: z.ZodType<Prisma.QuoteSelect> = z.object({
  id: z.boolean().optional(),
  number: z.boolean().optional(),
  revision: z.boolean().optional(),
  date: z.boolean().optional(),
  customerId: z.boolean().optional(),
  customerBusinessName: z.boolean().optional(),
  customerEmail: z.boolean().optional(),
  customerVatNumber: z.boolean().optional(),
  customerAddress: z.boolean().optional(),
  customerZipCode: z.boolean().optional(),
  customerCity: z.boolean().optional(),
  subtotal: z.boolean().optional(),
  totalVat: z.boolean().optional(),
  total: z.boolean().optional(),
  notes: z.boolean().optional(),
  metadata: z.boolean().optional(),
  status: z.boolean().optional(),
  companyProfileId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  customer: z.union([z.boolean(),z.lazy(() => CustomerArgsSchema)]).optional(),
  companyProfile: z.union([z.boolean(),z.lazy(() => CompanyProfileArgsSchema)]).optional(),
  items: z.union([z.boolean(),z.lazy(() => QuoteItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => QuoteCountOutputTypeArgsSchema)]).optional(),
}).strict()

// QUOTE ITEM
//------------------------------------------------------

export const QuoteItemIncludeSchema: z.ZodType<Prisma.QuoteItemInclude> = z.object({
  quote: z.union([z.boolean(),z.lazy(() => QuoteArgsSchema)]).optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
}).strict();

export const QuoteItemArgsSchema: z.ZodType<Prisma.QuoteItemDefaultArgs> = z.object({
  select: z.lazy(() => QuoteItemSelectSchema).optional(),
  include: z.lazy(() => QuoteItemIncludeSchema).optional(),
}).strict();

export const QuoteItemSelectSchema: z.ZodType<Prisma.QuoteItemSelect> = z.object({
  id: z.boolean().optional(),
  quoteId: z.boolean().optional(),
  ordering: z.boolean().optional(),
  productId: z.boolean().optional(),
  code: z.boolean().optional(),
  measure: z.boolean().optional(),
  description: z.boolean().optional(),
  unit: z.boolean().optional(),
  quantity: z.boolean().optional(),
  unitPrice: z.boolean().optional(),
  lineTotal: z.boolean().optional(),
  discount1: z.boolean().optional(),
  discount2: z.boolean().optional(),
  discount3: z.boolean().optional(),
  netUnitPrice: z.boolean().optional(),
  netLineTotal: z.boolean().optional(),
  vatRate: z.boolean().optional(),
  vatAmount: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  quote: z.union([z.boolean(),z.lazy(() => QuoteArgsSchema)]).optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const CustomerWhereInputSchema: z.ZodType<Prisma.CustomerWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CustomerWhereInputSchema), z.lazy(() => CustomerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CustomerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CustomerWhereInputSchema), z.lazy(() => CustomerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  businessName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  vatNumber: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  quotes: z.lazy(() => QuoteListRelationFilterSchema).optional(),
});

export const CustomerOrderByWithRelationInputSchema: z.ZodType<Prisma.CustomerOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  businessName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  vatNumber: z.lazy(() => SortOrderSchema).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  zipCode: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  quotes: z.lazy(() => QuoteOrderByRelationAggregateInputSchema).optional(),
});

export const CustomerWhereUniqueInputSchema: z.ZodType<Prisma.CustomerWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => CustomerWhereInputSchema), z.lazy(() => CustomerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CustomerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CustomerWhereInputSchema), z.lazy(() => CustomerWhereInputSchema).array() ]).optional(),
  businessName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  vatNumber: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  quotes: z.lazy(() => QuoteListRelationFilterSchema).optional(),
}));

export const CustomerOrderByWithAggregationInputSchema: z.ZodType<Prisma.CustomerOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  businessName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  vatNumber: z.lazy(() => SortOrderSchema).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  zipCode: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CustomerCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CustomerAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CustomerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CustomerMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CustomerSumOrderByAggregateInputSchema).optional(),
});

export const CustomerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CustomerScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CustomerScalarWhereWithAggregatesInputSchema), z.lazy(() => CustomerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CustomerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CustomerScalarWhereWithAggregatesInputSchema), z.lazy(() => CustomerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  businessName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  vatNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const ProductWhereInputSchema: z.ZodType<Prisma.ProductWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  code: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  measure: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  quoteItems: z.lazy(() => QuoteItemListRelationFilterSchema).optional(),
});

export const ProductOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  measure: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  quoteItems: z.lazy(() => QuoteItemOrderByRelationAggregateInputSchema).optional(),
});

export const ProductWhereUniqueInputSchema: z.ZodType<Prisma.ProductWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  code: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  measure: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  quoteItems: z.lazy(() => QuoteItemListRelationFilterSchema).optional(),
}));

export const ProductOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  measure: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProductCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductSumOrderByAggregateInputSchema).optional(),
});

export const ProductScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema), z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema), z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  code: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  measure: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const CompanyProfileWhereInputSchema: z.ZodType<Prisma.CompanyProfileWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CompanyProfileWhereInputSchema), z.lazy(() => CompanyProfileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompanyProfileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompanyProfileWhereInputSchema), z.lazy(() => CompanyProfileWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  profileName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  businessName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  vatNumber: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  smtpHost: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  smtpPort: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  smtpSecure: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  smtpUser: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  smtpPassword: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  smtpFromEmail: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  smtpFromName: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  isDefault: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  quotes: z.lazy(() => QuoteListRelationFilterSchema).optional(),
});

export const CompanyProfileOrderByWithRelationInputSchema: z.ZodType<Prisma.CompanyProfileOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  profileName: z.lazy(() => SortOrderSchema).optional(),
  businessName: z.lazy(() => SortOrderSchema).optional(),
  vatNumber: z.lazy(() => SortOrderSchema).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  zipCode: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpHost: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpPort: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpSecure: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpUser: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpPassword: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpFromEmail: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpFromName: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  quotes: z.lazy(() => QuoteOrderByRelationAggregateInputSchema).optional(),
});

export const CompanyProfileWhereUniqueInputSchema: z.ZodType<Prisma.CompanyProfileWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    profileName: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    profileName: z.string(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  profileName: z.string().optional(),
  AND: z.union([ z.lazy(() => CompanyProfileWhereInputSchema), z.lazy(() => CompanyProfileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompanyProfileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompanyProfileWhereInputSchema), z.lazy(() => CompanyProfileWhereInputSchema).array() ]).optional(),
  businessName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  vatNumber: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  smtpHost: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  smtpPort: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  smtpSecure: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  smtpUser: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  smtpPassword: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  smtpFromEmail: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  smtpFromName: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  isDefault: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  quotes: z.lazy(() => QuoteListRelationFilterSchema).optional(),
}));

export const CompanyProfileOrderByWithAggregationInputSchema: z.ZodType<Prisma.CompanyProfileOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  profileName: z.lazy(() => SortOrderSchema).optional(),
  businessName: z.lazy(() => SortOrderSchema).optional(),
  vatNumber: z.lazy(() => SortOrderSchema).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  zipCode: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpHost: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpPort: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpSecure: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpUser: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpPassword: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpFromEmail: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  smtpFromName: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CompanyProfileCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CompanyProfileAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CompanyProfileMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CompanyProfileMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CompanyProfileSumOrderByAggregateInputSchema).optional(),
});

export const CompanyProfileScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CompanyProfileScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CompanyProfileScalarWhereWithAggregatesInputSchema), z.lazy(() => CompanyProfileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CompanyProfileScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CompanyProfileScalarWhereWithAggregatesInputSchema), z.lazy(() => CompanyProfileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  profileName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  businessName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  vatNumber: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  zipCode: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  smtpHost: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  smtpPort: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  smtpSecure: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  smtpUser: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  smtpPassword: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  smtpFromEmail: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  smtpFromName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  isDefault: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const QuoteWhereInputSchema: z.ZodType<Prisma.QuoteWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => QuoteWhereInputSchema), z.lazy(() => QuoteWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuoteWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuoteWhereInputSchema), z.lazy(() => QuoteWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  number: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  revision: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  date: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  customerBusinessName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  customerEmail: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerVatNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerAddress: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerZipCode: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerCity: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  subtotal: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  totalVat: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  companyProfileId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  customer: z.union([ z.lazy(() => CustomerNullableScalarRelationFilterSchema), z.lazy(() => CustomerWhereInputSchema) ]).optional().nullable(),
  companyProfile: z.union([ z.lazy(() => CompanyProfileNullableScalarRelationFilterSchema), z.lazy(() => CompanyProfileWhereInputSchema) ]).optional().nullable(),
  items: z.lazy(() => QuoteItemListRelationFilterSchema).optional(),
});

export const QuoteOrderByWithRelationInputSchema: z.ZodType<Prisma.QuoteOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  revision: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerBusinessName: z.lazy(() => SortOrderSchema).optional(),
  customerEmail: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerVatNumber: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerAddress: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerZipCode: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerCity: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  totalVat: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  companyProfileId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  customer: z.lazy(() => CustomerOrderByWithRelationInputSchema).optional(),
  companyProfile: z.lazy(() => CompanyProfileOrderByWithRelationInputSchema).optional(),
  items: z.lazy(() => QuoteItemOrderByRelationAggregateInputSchema).optional(),
});

export const QuoteWhereUniqueInputSchema: z.ZodType<Prisma.QuoteWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    number_revision: z.lazy(() => QuoteNumberRevisionCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    number_revision: z.lazy(() => QuoteNumberRevisionCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  number_revision: z.lazy(() => QuoteNumberRevisionCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => QuoteWhereInputSchema), z.lazy(() => QuoteWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuoteWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuoteWhereInputSchema), z.lazy(() => QuoteWhereInputSchema).array() ]).optional(),
  number: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  revision: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  date: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  customerBusinessName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  customerEmail: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerVatNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerAddress: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerZipCode: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerCity: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  subtotal: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  totalVat: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  companyProfileId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  customer: z.union([ z.lazy(() => CustomerNullableScalarRelationFilterSchema), z.lazy(() => CustomerWhereInputSchema) ]).optional().nullable(),
  companyProfile: z.union([ z.lazy(() => CompanyProfileNullableScalarRelationFilterSchema), z.lazy(() => CompanyProfileWhereInputSchema) ]).optional().nullable(),
  items: z.lazy(() => QuoteItemListRelationFilterSchema).optional(),
}));

export const QuoteOrderByWithAggregationInputSchema: z.ZodType<Prisma.QuoteOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  revision: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerBusinessName: z.lazy(() => SortOrderSchema).optional(),
  customerEmail: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerVatNumber: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerAddress: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerZipCode: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  customerCity: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  totalVat: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  companyProfileId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => QuoteCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => QuoteAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => QuoteMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => QuoteMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => QuoteSumOrderByAggregateInputSchema).optional(),
});

export const QuoteScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.QuoteScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => QuoteScalarWhereWithAggregatesInputSchema), z.lazy(() => QuoteScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuoteScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuoteScalarWhereWithAggregatesInputSchema), z.lazy(() => QuoteScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  number: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  revision: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  date: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  customerBusinessName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  customerEmail: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  customerVatNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  customerAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  customerZipCode: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  customerCity: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  subtotal: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  totalVat: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  companyProfileId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const QuoteItemWhereInputSchema: z.ZodType<Prisma.QuoteItemWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => QuoteItemWhereInputSchema), z.lazy(() => QuoteItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuoteItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuoteItemWhereInputSchema), z.lazy(() => QuoteItemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  quoteId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  ordering: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  productId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  code: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  measure: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  unit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  unitPrice: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  lineTotal: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  discount1: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  discount2: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  discount3: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  netUnitPrice: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  netLineTotal: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  vatRate: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  vatAmount: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  quote: z.union([ z.lazy(() => QuoteScalarRelationFilterSchema), z.lazy(() => QuoteWhereInputSchema) ]).optional(),
  product: z.union([ z.lazy(() => ProductNullableScalarRelationFilterSchema), z.lazy(() => ProductWhereInputSchema) ]).optional().nullable(),
});

export const QuoteItemOrderByWithRelationInputSchema: z.ZodType<Prisma.QuoteItemOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quoteId: z.lazy(() => SortOrderSchema).optional(),
  ordering: z.lazy(() => SortOrderSchema).optional(),
  productId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  measure: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  lineTotal: z.lazy(() => SortOrderSchema).optional(),
  discount1: z.lazy(() => SortOrderSchema).optional(),
  discount2: z.lazy(() => SortOrderSchema).optional(),
  discount3: z.lazy(() => SortOrderSchema).optional(),
  netUnitPrice: z.lazy(() => SortOrderSchema).optional(),
  netLineTotal: z.lazy(() => SortOrderSchema).optional(),
  vatRate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  vatAmount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  quote: z.lazy(() => QuoteOrderByWithRelationInputSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputSchema).optional(),
});

export const QuoteItemWhereUniqueInputSchema: z.ZodType<Prisma.QuoteItemWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => QuoteItemWhereInputSchema), z.lazy(() => QuoteItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuoteItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuoteItemWhereInputSchema), z.lazy(() => QuoteItemWhereInputSchema).array() ]).optional(),
  quoteId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  ordering: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  productId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  code: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  measure: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  unit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  unitPrice: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  lineTotal: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  discount1: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  discount2: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  discount3: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  netUnitPrice: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  netLineTotal: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  vatRate: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  vatAmount: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  quote: z.union([ z.lazy(() => QuoteScalarRelationFilterSchema), z.lazy(() => QuoteWhereInputSchema) ]).optional(),
  product: z.union([ z.lazy(() => ProductNullableScalarRelationFilterSchema), z.lazy(() => ProductWhereInputSchema) ]).optional().nullable(),
}));

export const QuoteItemOrderByWithAggregationInputSchema: z.ZodType<Prisma.QuoteItemOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quoteId: z.lazy(() => SortOrderSchema).optional(),
  ordering: z.lazy(() => SortOrderSchema).optional(),
  productId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  measure: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  lineTotal: z.lazy(() => SortOrderSchema).optional(),
  discount1: z.lazy(() => SortOrderSchema).optional(),
  discount2: z.lazy(() => SortOrderSchema).optional(),
  discount3: z.lazy(() => SortOrderSchema).optional(),
  netUnitPrice: z.lazy(() => SortOrderSchema).optional(),
  netLineTotal: z.lazy(() => SortOrderSchema).optional(),
  vatRate: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  vatAmount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => QuoteItemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => QuoteItemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => QuoteItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => QuoteItemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => QuoteItemSumOrderByAggregateInputSchema).optional(),
});

export const QuoteItemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.QuoteItemScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => QuoteItemScalarWhereWithAggregatesInputSchema), z.lazy(() => QuoteItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuoteItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuoteItemScalarWhereWithAggregatesInputSchema), z.lazy(() => QuoteItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  quoteId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  ordering: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  productId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  code: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  measure: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  unit: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  unitPrice: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  lineTotal: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  discount1: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  discount2: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  discount3: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  netUnitPrice: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  netLineTotal: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  vatRate: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  vatAmount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
});

export const CustomerCreateInputSchema: z.ZodType<Prisma.CustomerCreateInput> = z.strictObject({
  businessName: z.string(),
  email: z.string(),
  vatNumber: z.string(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  quotes: z.lazy(() => QuoteCreateNestedManyWithoutCustomerInputSchema).optional(),
});

export const CustomerUncheckedCreateInputSchema: z.ZodType<Prisma.CustomerUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  businessName: z.string(),
  email: z.string(),
  vatNumber: z.string(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  quotes: z.lazy(() => QuoteUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
});

export const CustomerUpdateInputSchema: z.ZodType<Prisma.CustomerUpdateInput> = z.strictObject({
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quotes: z.lazy(() => QuoteUpdateManyWithoutCustomerNestedInputSchema).optional(),
});

export const CustomerUncheckedUpdateInputSchema: z.ZodType<Prisma.CustomerUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quotes: z.lazy(() => QuoteUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
});

export const CustomerCreateManyInputSchema: z.ZodType<Prisma.CustomerCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  businessName: z.string(),
  email: z.string(),
  vatNumber: z.string(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const CustomerUpdateManyMutationInputSchema: z.ZodType<Prisma.CustomerUpdateManyMutationInput> = z.strictObject({
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CustomerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CustomerUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProductCreateInputSchema: z.ZodType<Prisma.ProductCreateInput> = z.strictObject({
  code: z.string(),
  description: z.string().optional().nullable(),
  measure: z.string().optional().nullable(),
  price: z.number(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  quoteItems: z.lazy(() => QuoteItemCreateNestedManyWithoutProductInputSchema).optional(),
});

export const ProductUncheckedCreateInputSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  code: z.string(),
  description: z.string().optional().nullable(),
  measure: z.string().optional().nullable(),
  price: z.number(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  quoteItems: z.lazy(() => QuoteItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
});

export const ProductUpdateInputSchema: z.ZodType<Prisma.ProductUpdateInput> = z.strictObject({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quoteItems: z.lazy(() => QuoteItemUpdateManyWithoutProductNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quoteItems: z.lazy(() => QuoteItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
});

export const ProductCreateManyInputSchema: z.ZodType<Prisma.ProductCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  code: z.string(),
  description: z.string().optional().nullable(),
  measure: z.string().optional().nullable(),
  price: z.number(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const ProductUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductUpdateManyMutationInput> = z.strictObject({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProductUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CompanyProfileCreateInputSchema: z.ZodType<Prisma.CompanyProfileCreateInput> = z.strictObject({
  profileName: z.string(),
  businessName: z.string(),
  vatNumber: z.string(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  smtpHost: z.string().optional().nullable(),
  smtpPort: z.number().int().optional().nullable(),
  smtpSecure: z.number().int().optional().nullable(),
  smtpUser: z.string().optional().nullable(),
  smtpPassword: z.string().optional().nullable(),
  smtpFromEmail: z.string().optional().nullable(),
  smtpFromName: z.string().optional().nullable(),
  isDefault: z.number().int().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  quotes: z.lazy(() => QuoteCreateNestedManyWithoutCompanyProfileInputSchema).optional(),
});

export const CompanyProfileUncheckedCreateInputSchema: z.ZodType<Prisma.CompanyProfileUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  profileName: z.string(),
  businessName: z.string(),
  vatNumber: z.string(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  smtpHost: z.string().optional().nullable(),
  smtpPort: z.number().int().optional().nullable(),
  smtpSecure: z.number().int().optional().nullable(),
  smtpUser: z.string().optional().nullable(),
  smtpPassword: z.string().optional().nullable(),
  smtpFromEmail: z.string().optional().nullable(),
  smtpFromName: z.string().optional().nullable(),
  isDefault: z.number().int().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  quotes: z.lazy(() => QuoteUncheckedCreateNestedManyWithoutCompanyProfileInputSchema).optional(),
});

export const CompanyProfileUpdateInputSchema: z.ZodType<Prisma.CompanyProfileUpdateInput> = z.strictObject({
  profileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpHost: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPort: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpSecure: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPassword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDefault: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quotes: z.lazy(() => QuoteUpdateManyWithoutCompanyProfileNestedInputSchema).optional(),
});

export const CompanyProfileUncheckedUpdateInputSchema: z.ZodType<Prisma.CompanyProfileUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  profileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpHost: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPort: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpSecure: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPassword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDefault: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quotes: z.lazy(() => QuoteUncheckedUpdateManyWithoutCompanyProfileNestedInputSchema).optional(),
});

export const CompanyProfileCreateManyInputSchema: z.ZodType<Prisma.CompanyProfileCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  profileName: z.string(),
  businessName: z.string(),
  vatNumber: z.string(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  smtpHost: z.string().optional().nullable(),
  smtpPort: z.number().int().optional().nullable(),
  smtpSecure: z.number().int().optional().nullable(),
  smtpUser: z.string().optional().nullable(),
  smtpPassword: z.string().optional().nullable(),
  smtpFromEmail: z.string().optional().nullable(),
  smtpFromName: z.string().optional().nullable(),
  isDefault: z.number().int().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const CompanyProfileUpdateManyMutationInputSchema: z.ZodType<Prisma.CompanyProfileUpdateManyMutationInput> = z.strictObject({
  profileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpHost: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPort: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpSecure: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPassword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDefault: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CompanyProfileUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CompanyProfileUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  profileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpHost: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPort: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpSecure: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPassword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDefault: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const QuoteCreateInputSchema: z.ZodType<Prisma.QuoteCreateInput> = z.strictObject({
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutQuotesInputSchema).optional(),
  companyProfile: z.lazy(() => CompanyProfileCreateNestedOneWithoutQuotesInputSchema).optional(),
  items: z.lazy(() => QuoteItemCreateNestedManyWithoutQuoteInputSchema).optional(),
});

export const QuoteUncheckedCreateInputSchema: z.ZodType<Prisma.QuoteUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerId: z.number().int().optional().nullable(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  companyProfileId: z.number().int().optional().nullable(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  items: z.lazy(() => QuoteItemUncheckedCreateNestedManyWithoutQuoteInputSchema).optional(),
});

export const QuoteUpdateInputSchema: z.ZodType<Prisma.QuoteUpdateInput> = z.strictObject({
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => CustomerUpdateOneWithoutQuotesNestedInputSchema).optional(),
  companyProfile: z.lazy(() => CompanyProfileUpdateOneWithoutQuotesNestedInputSchema).optional(),
  items: z.lazy(() => QuoteItemUpdateManyWithoutQuoteNestedInputSchema).optional(),
});

export const QuoteUncheckedUpdateInputSchema: z.ZodType<Prisma.QuoteUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyProfileId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => QuoteItemUncheckedUpdateManyWithoutQuoteNestedInputSchema).optional(),
});

export const QuoteCreateManyInputSchema: z.ZodType<Prisma.QuoteCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerId: z.number().int().optional().nullable(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  companyProfileId: z.number().int().optional().nullable(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const QuoteUpdateManyMutationInputSchema: z.ZodType<Prisma.QuoteUpdateManyMutationInput> = z.strictObject({
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const QuoteUncheckedUpdateManyInputSchema: z.ZodType<Prisma.QuoteUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyProfileId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const QuoteItemCreateInputSchema: z.ZodType<Prisma.QuoteItemCreateInput> = z.strictObject({
  ordering: z.number().int().optional(),
  code: z.string(),
  measure: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number().optional(),
  discount2: z.number().optional(),
  discount3: z.number().optional(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().optional().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().int().optional().nullable(),
  updatedAt: z.number().int().optional().nullable(),
  quote: z.lazy(() => QuoteCreateNestedOneWithoutItemsInputSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutQuoteItemsInputSchema).optional(),
});

export const QuoteItemUncheckedCreateInputSchema: z.ZodType<Prisma.QuoteItemUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  quoteId: z.number().int(),
  ordering: z.number().int().optional(),
  productId: z.number().int().optional().nullable(),
  code: z.string(),
  measure: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number().optional(),
  discount2: z.number().optional(),
  discount3: z.number().optional(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().optional().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().int().optional().nullable(),
  updatedAt: z.number().int().optional().nullable(),
});

export const QuoteItemUpdateInputSchema: z.ZodType<Prisma.QuoteItemUpdateInput> = z.strictObject({
  ordering: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  lineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount1: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount2: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount3: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netUnitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netLineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  vatRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vatAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quote: z.lazy(() => QuoteUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  product: z.lazy(() => ProductUpdateOneWithoutQuoteItemsNestedInputSchema).optional(),
});

export const QuoteItemUncheckedUpdateInputSchema: z.ZodType<Prisma.QuoteItemUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quoteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ordering: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  lineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount1: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount2: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount3: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netUnitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netLineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  vatRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vatAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const QuoteItemCreateManyInputSchema: z.ZodType<Prisma.QuoteItemCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  quoteId: z.number().int(),
  ordering: z.number().int().optional(),
  productId: z.number().int().optional().nullable(),
  code: z.string(),
  measure: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number().optional(),
  discount2: z.number().optional(),
  discount3: z.number().optional(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().optional().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().int().optional().nullable(),
  updatedAt: z.number().int().optional().nullable(),
});

export const QuoteItemUpdateManyMutationInputSchema: z.ZodType<Prisma.QuoteItemUpdateManyMutationInput> = z.strictObject({
  ordering: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  lineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount1: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount2: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount3: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netUnitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netLineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  vatRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vatAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const QuoteItemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.QuoteItemUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quoteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ordering: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  lineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount1: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount2: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount3: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netUnitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netLineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  vatRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vatAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const QuoteListRelationFilterSchema: z.ZodType<Prisma.QuoteListRelationFilter> = z.strictObject({
  every: z.lazy(() => QuoteWhereInputSchema).optional(),
  some: z.lazy(() => QuoteWhereInputSchema).optional(),
  none: z.lazy(() => QuoteWhereInputSchema).optional(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const QuoteOrderByRelationAggregateInputSchema: z.ZodType<Prisma.QuoteOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const CustomerCountOrderByAggregateInputSchema: z.ZodType<Prisma.CustomerCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  businessName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  vatNumber: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CustomerAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CustomerAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CustomerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CustomerMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  businessName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  vatNumber: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CustomerMinOrderByAggregateInputSchema: z.ZodType<Prisma.CustomerMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  businessName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  vatNumber: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CustomerSumOrderByAggregateInputSchema: z.ZodType<Prisma.CustomerSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const QuoteItemListRelationFilterSchema: z.ZodType<Prisma.QuoteItemListRelationFilter> = z.strictObject({
  every: z.lazy(() => QuoteItemWhereInputSchema).optional(),
  some: z.lazy(() => QuoteItemWhereInputSchema).optional(),
  none: z.lazy(() => QuoteItemWhereInputSchema).optional(),
});

export const QuoteItemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.QuoteItemOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  measure: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  measure: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  measure: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
});

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const CompanyProfileCountOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyProfileCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  profileName: z.lazy(() => SortOrderSchema).optional(),
  businessName: z.lazy(() => SortOrderSchema).optional(),
  vatNumber: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  smtpHost: z.lazy(() => SortOrderSchema).optional(),
  smtpPort: z.lazy(() => SortOrderSchema).optional(),
  smtpSecure: z.lazy(() => SortOrderSchema).optional(),
  smtpUser: z.lazy(() => SortOrderSchema).optional(),
  smtpPassword: z.lazy(() => SortOrderSchema).optional(),
  smtpFromEmail: z.lazy(() => SortOrderSchema).optional(),
  smtpFromName: z.lazy(() => SortOrderSchema).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CompanyProfileAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyProfileAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  smtpPort: z.lazy(() => SortOrderSchema).optional(),
  smtpSecure: z.lazy(() => SortOrderSchema).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CompanyProfileMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyProfileMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  profileName: z.lazy(() => SortOrderSchema).optional(),
  businessName: z.lazy(() => SortOrderSchema).optional(),
  vatNumber: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  smtpHost: z.lazy(() => SortOrderSchema).optional(),
  smtpPort: z.lazy(() => SortOrderSchema).optional(),
  smtpSecure: z.lazy(() => SortOrderSchema).optional(),
  smtpUser: z.lazy(() => SortOrderSchema).optional(),
  smtpPassword: z.lazy(() => SortOrderSchema).optional(),
  smtpFromEmail: z.lazy(() => SortOrderSchema).optional(),
  smtpFromName: z.lazy(() => SortOrderSchema).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CompanyProfileMinOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyProfileMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  profileName: z.lazy(() => SortOrderSchema).optional(),
  businessName: z.lazy(() => SortOrderSchema).optional(),
  vatNumber: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  zipCode: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  smtpHost: z.lazy(() => SortOrderSchema).optional(),
  smtpPort: z.lazy(() => SortOrderSchema).optional(),
  smtpSecure: z.lazy(() => SortOrderSchema).optional(),
  smtpUser: z.lazy(() => SortOrderSchema).optional(),
  smtpPassword: z.lazy(() => SortOrderSchema).optional(),
  smtpFromEmail: z.lazy(() => SortOrderSchema).optional(),
  smtpFromName: z.lazy(() => SortOrderSchema).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CompanyProfileSumOrderByAggregateInputSchema: z.ZodType<Prisma.CompanyProfileSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  smtpPort: z.lazy(() => SortOrderSchema).optional(),
  smtpSecure: z.lazy(() => SortOrderSchema).optional(),
  isDefault: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const CustomerNullableScalarRelationFilterSchema: z.ZodType<Prisma.CustomerNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => CustomerWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CustomerWhereInputSchema).optional().nullable(),
});

export const CompanyProfileNullableScalarRelationFilterSchema: z.ZodType<Prisma.CompanyProfileNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => CompanyProfileWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CompanyProfileWhereInputSchema).optional().nullable(),
});

export const QuoteNumberRevisionCompoundUniqueInputSchema: z.ZodType<Prisma.QuoteNumberRevisionCompoundUniqueInput> = z.strictObject({
  number: z.number(),
  revision: z.number(),
});

export const QuoteCountOrderByAggregateInputSchema: z.ZodType<Prisma.QuoteCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  revision: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  customerBusinessName: z.lazy(() => SortOrderSchema).optional(),
  customerEmail: z.lazy(() => SortOrderSchema).optional(),
  customerVatNumber: z.lazy(() => SortOrderSchema).optional(),
  customerAddress: z.lazy(() => SortOrderSchema).optional(),
  customerZipCode: z.lazy(() => SortOrderSchema).optional(),
  customerCity: z.lazy(() => SortOrderSchema).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  totalVat: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  companyProfileId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const QuoteAvgOrderByAggregateInputSchema: z.ZodType<Prisma.QuoteAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  revision: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  totalVat: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  companyProfileId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const QuoteMaxOrderByAggregateInputSchema: z.ZodType<Prisma.QuoteMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  revision: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  customerBusinessName: z.lazy(() => SortOrderSchema).optional(),
  customerEmail: z.lazy(() => SortOrderSchema).optional(),
  customerVatNumber: z.lazy(() => SortOrderSchema).optional(),
  customerAddress: z.lazy(() => SortOrderSchema).optional(),
  customerZipCode: z.lazy(() => SortOrderSchema).optional(),
  customerCity: z.lazy(() => SortOrderSchema).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  totalVat: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  companyProfileId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const QuoteMinOrderByAggregateInputSchema: z.ZodType<Prisma.QuoteMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  revision: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  customerBusinessName: z.lazy(() => SortOrderSchema).optional(),
  customerEmail: z.lazy(() => SortOrderSchema).optional(),
  customerVatNumber: z.lazy(() => SortOrderSchema).optional(),
  customerAddress: z.lazy(() => SortOrderSchema).optional(),
  customerZipCode: z.lazy(() => SortOrderSchema).optional(),
  customerCity: z.lazy(() => SortOrderSchema).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  totalVat: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  metadata: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  companyProfileId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const QuoteSumOrderByAggregateInputSchema: z.ZodType<Prisma.QuoteSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  revision: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  subtotal: z.lazy(() => SortOrderSchema).optional(),
  totalVat: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  companyProfileId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const QuoteScalarRelationFilterSchema: z.ZodType<Prisma.QuoteScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => QuoteWhereInputSchema).optional(),
  isNot: z.lazy(() => QuoteWhereInputSchema).optional(),
});

export const ProductNullableScalarRelationFilterSchema: z.ZodType<Prisma.ProductNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ProductWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProductWhereInputSchema).optional().nullable(),
});

export const QuoteItemCountOrderByAggregateInputSchema: z.ZodType<Prisma.QuoteItemCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quoteId: z.lazy(() => SortOrderSchema).optional(),
  ordering: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  measure: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  lineTotal: z.lazy(() => SortOrderSchema).optional(),
  discount1: z.lazy(() => SortOrderSchema).optional(),
  discount2: z.lazy(() => SortOrderSchema).optional(),
  discount3: z.lazy(() => SortOrderSchema).optional(),
  netUnitPrice: z.lazy(() => SortOrderSchema).optional(),
  netLineTotal: z.lazy(() => SortOrderSchema).optional(),
  vatRate: z.lazy(() => SortOrderSchema).optional(),
  vatAmount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const QuoteItemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.QuoteItemAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quoteId: z.lazy(() => SortOrderSchema).optional(),
  ordering: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  lineTotal: z.lazy(() => SortOrderSchema).optional(),
  discount1: z.lazy(() => SortOrderSchema).optional(),
  discount2: z.lazy(() => SortOrderSchema).optional(),
  discount3: z.lazy(() => SortOrderSchema).optional(),
  netUnitPrice: z.lazy(() => SortOrderSchema).optional(),
  netLineTotal: z.lazy(() => SortOrderSchema).optional(),
  vatRate: z.lazy(() => SortOrderSchema).optional(),
  vatAmount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const QuoteItemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.QuoteItemMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quoteId: z.lazy(() => SortOrderSchema).optional(),
  ordering: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  measure: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  lineTotal: z.lazy(() => SortOrderSchema).optional(),
  discount1: z.lazy(() => SortOrderSchema).optional(),
  discount2: z.lazy(() => SortOrderSchema).optional(),
  discount3: z.lazy(() => SortOrderSchema).optional(),
  netUnitPrice: z.lazy(() => SortOrderSchema).optional(),
  netLineTotal: z.lazy(() => SortOrderSchema).optional(),
  vatRate: z.lazy(() => SortOrderSchema).optional(),
  vatAmount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const QuoteItemMinOrderByAggregateInputSchema: z.ZodType<Prisma.QuoteItemMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quoteId: z.lazy(() => SortOrderSchema).optional(),
  ordering: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  measure: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  lineTotal: z.lazy(() => SortOrderSchema).optional(),
  discount1: z.lazy(() => SortOrderSchema).optional(),
  discount2: z.lazy(() => SortOrderSchema).optional(),
  discount3: z.lazy(() => SortOrderSchema).optional(),
  netUnitPrice: z.lazy(() => SortOrderSchema).optional(),
  netLineTotal: z.lazy(() => SortOrderSchema).optional(),
  vatRate: z.lazy(() => SortOrderSchema).optional(),
  vatAmount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const QuoteItemSumOrderByAggregateInputSchema: z.ZodType<Prisma.QuoteItemSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quoteId: z.lazy(() => SortOrderSchema).optional(),
  ordering: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  lineTotal: z.lazy(() => SortOrderSchema).optional(),
  discount1: z.lazy(() => SortOrderSchema).optional(),
  discount2: z.lazy(() => SortOrderSchema).optional(),
  discount3: z.lazy(() => SortOrderSchema).optional(),
  netUnitPrice: z.lazy(() => SortOrderSchema).optional(),
  netLineTotal: z.lazy(() => SortOrderSchema).optional(),
  vatRate: z.lazy(() => SortOrderSchema).optional(),
  vatAmount: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const QuoteCreateNestedManyWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteCreateNestedManyWithoutCustomerInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteCreateWithoutCustomerInputSchema), z.lazy(() => QuoteCreateWithoutCustomerInputSchema).array(), z.lazy(() => QuoteUncheckedCreateWithoutCustomerInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteCreateOrConnectWithoutCustomerInputSchema), z.lazy(() => QuoteCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteCreateManyCustomerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
});

export const QuoteUncheckedCreateNestedManyWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteUncheckedCreateNestedManyWithoutCustomerInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteCreateWithoutCustomerInputSchema), z.lazy(() => QuoteCreateWithoutCustomerInputSchema).array(), z.lazy(() => QuoteUncheckedCreateWithoutCustomerInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteCreateOrConnectWithoutCustomerInputSchema), z.lazy(() => QuoteCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteCreateManyCustomerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const QuoteUpdateManyWithoutCustomerNestedInputSchema: z.ZodType<Prisma.QuoteUpdateManyWithoutCustomerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteCreateWithoutCustomerInputSchema), z.lazy(() => QuoteCreateWithoutCustomerInputSchema).array(), z.lazy(() => QuoteUncheckedCreateWithoutCustomerInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteCreateOrConnectWithoutCustomerInputSchema), z.lazy(() => QuoteCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuoteUpsertWithWhereUniqueWithoutCustomerInputSchema), z.lazy(() => QuoteUpsertWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteCreateManyCustomerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuoteUpdateWithWhereUniqueWithoutCustomerInputSchema), z.lazy(() => QuoteUpdateWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuoteUpdateManyWithWhereWithoutCustomerInputSchema), z.lazy(() => QuoteUpdateManyWithWhereWithoutCustomerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuoteScalarWhereInputSchema), z.lazy(() => QuoteScalarWhereInputSchema).array() ]).optional(),
});

export const QuoteUncheckedUpdateManyWithoutCustomerNestedInputSchema: z.ZodType<Prisma.QuoteUncheckedUpdateManyWithoutCustomerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteCreateWithoutCustomerInputSchema), z.lazy(() => QuoteCreateWithoutCustomerInputSchema).array(), z.lazy(() => QuoteUncheckedCreateWithoutCustomerInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteCreateOrConnectWithoutCustomerInputSchema), z.lazy(() => QuoteCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuoteUpsertWithWhereUniqueWithoutCustomerInputSchema), z.lazy(() => QuoteUpsertWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteCreateManyCustomerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuoteUpdateWithWhereUniqueWithoutCustomerInputSchema), z.lazy(() => QuoteUpdateWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuoteUpdateManyWithWhereWithoutCustomerInputSchema), z.lazy(() => QuoteUpdateManyWithWhereWithoutCustomerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuoteScalarWhereInputSchema), z.lazy(() => QuoteScalarWhereInputSchema).array() ]).optional(),
});

export const QuoteItemCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemCreateNestedManyWithoutProductInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutProductInputSchema), z.lazy(() => QuoteItemCreateWithoutProductInputSchema).array(), z.lazy(() => QuoteItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => QuoteItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteItemCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
});

export const QuoteItemUncheckedCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemUncheckedCreateNestedManyWithoutProductInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutProductInputSchema), z.lazy(() => QuoteItemCreateWithoutProductInputSchema).array(), z.lazy(() => QuoteItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => QuoteItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteItemCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
});

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const QuoteItemUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.QuoteItemUpdateManyWithoutProductNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutProductInputSchema), z.lazy(() => QuoteItemCreateWithoutProductInputSchema).array(), z.lazy(() => QuoteItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => QuoteItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuoteItemUpsertWithWhereUniqueWithoutProductInputSchema), z.lazy(() => QuoteItemUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteItemCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuoteItemUpdateWithWhereUniqueWithoutProductInputSchema), z.lazy(() => QuoteItemUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuoteItemUpdateManyWithWhereWithoutProductInputSchema), z.lazy(() => QuoteItemUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuoteItemScalarWhereInputSchema), z.lazy(() => QuoteItemScalarWhereInputSchema).array() ]).optional(),
});

export const QuoteItemUncheckedUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.QuoteItemUncheckedUpdateManyWithoutProductNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutProductInputSchema), z.lazy(() => QuoteItemCreateWithoutProductInputSchema).array(), z.lazy(() => QuoteItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => QuoteItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuoteItemUpsertWithWhereUniqueWithoutProductInputSchema), z.lazy(() => QuoteItemUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteItemCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuoteItemUpdateWithWhereUniqueWithoutProductInputSchema), z.lazy(() => QuoteItemUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuoteItemUpdateManyWithWhereWithoutProductInputSchema), z.lazy(() => QuoteItemUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuoteItemScalarWhereInputSchema), z.lazy(() => QuoteItemScalarWhereInputSchema).array() ]).optional(),
});

export const QuoteCreateNestedManyWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteCreateNestedManyWithoutCompanyProfileInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteCreateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteCreateWithoutCompanyProfileInputSchema).array(), z.lazy(() => QuoteUncheckedCreateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCompanyProfileInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteCreateOrConnectWithoutCompanyProfileInputSchema), z.lazy(() => QuoteCreateOrConnectWithoutCompanyProfileInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteCreateManyCompanyProfileInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
});

export const QuoteUncheckedCreateNestedManyWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteUncheckedCreateNestedManyWithoutCompanyProfileInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteCreateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteCreateWithoutCompanyProfileInputSchema).array(), z.lazy(() => QuoteUncheckedCreateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCompanyProfileInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteCreateOrConnectWithoutCompanyProfileInputSchema), z.lazy(() => QuoteCreateOrConnectWithoutCompanyProfileInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteCreateManyCompanyProfileInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
});

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const QuoteUpdateManyWithoutCompanyProfileNestedInputSchema: z.ZodType<Prisma.QuoteUpdateManyWithoutCompanyProfileNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteCreateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteCreateWithoutCompanyProfileInputSchema).array(), z.lazy(() => QuoteUncheckedCreateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCompanyProfileInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteCreateOrConnectWithoutCompanyProfileInputSchema), z.lazy(() => QuoteCreateOrConnectWithoutCompanyProfileInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuoteUpsertWithWhereUniqueWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUpsertWithWhereUniqueWithoutCompanyProfileInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteCreateManyCompanyProfileInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuoteUpdateWithWhereUniqueWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUpdateWithWhereUniqueWithoutCompanyProfileInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuoteUpdateManyWithWhereWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUpdateManyWithWhereWithoutCompanyProfileInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuoteScalarWhereInputSchema), z.lazy(() => QuoteScalarWhereInputSchema).array() ]).optional(),
});

export const QuoteUncheckedUpdateManyWithoutCompanyProfileNestedInputSchema: z.ZodType<Prisma.QuoteUncheckedUpdateManyWithoutCompanyProfileNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteCreateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteCreateWithoutCompanyProfileInputSchema).array(), z.lazy(() => QuoteUncheckedCreateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCompanyProfileInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteCreateOrConnectWithoutCompanyProfileInputSchema), z.lazy(() => QuoteCreateOrConnectWithoutCompanyProfileInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuoteUpsertWithWhereUniqueWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUpsertWithWhereUniqueWithoutCompanyProfileInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteCreateManyCompanyProfileInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuoteWhereUniqueInputSchema), z.lazy(() => QuoteWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuoteUpdateWithWhereUniqueWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUpdateWithWhereUniqueWithoutCompanyProfileInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuoteUpdateManyWithWhereWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUpdateManyWithWhereWithoutCompanyProfileInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuoteScalarWhereInputSchema), z.lazy(() => QuoteScalarWhereInputSchema).array() ]).optional(),
});

export const CustomerCreateNestedOneWithoutQuotesInputSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutQuotesInput> = z.strictObject({
  create: z.union([ z.lazy(() => CustomerCreateWithoutQuotesInputSchema), z.lazy(() => CustomerUncheckedCreateWithoutQuotesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutQuotesInputSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional(),
});

export const CompanyProfileCreateNestedOneWithoutQuotesInputSchema: z.ZodType<Prisma.CompanyProfileCreateNestedOneWithoutQuotesInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompanyProfileCreateWithoutQuotesInputSchema), z.lazy(() => CompanyProfileUncheckedCreateWithoutQuotesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyProfileCreateOrConnectWithoutQuotesInputSchema).optional(),
  connect: z.lazy(() => CompanyProfileWhereUniqueInputSchema).optional(),
});

export const QuoteItemCreateNestedManyWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemCreateNestedManyWithoutQuoteInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutQuoteInputSchema), z.lazy(() => QuoteItemCreateWithoutQuoteInputSchema).array(), z.lazy(() => QuoteItemUncheckedCreateWithoutQuoteInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutQuoteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteItemCreateOrConnectWithoutQuoteInputSchema), z.lazy(() => QuoteItemCreateOrConnectWithoutQuoteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteItemCreateManyQuoteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
});

export const QuoteItemUncheckedCreateNestedManyWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemUncheckedCreateNestedManyWithoutQuoteInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutQuoteInputSchema), z.lazy(() => QuoteItemCreateWithoutQuoteInputSchema).array(), z.lazy(() => QuoteItemUncheckedCreateWithoutQuoteInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutQuoteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteItemCreateOrConnectWithoutQuoteInputSchema), z.lazy(() => QuoteItemCreateOrConnectWithoutQuoteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteItemCreateManyQuoteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
});

export const CustomerUpdateOneWithoutQuotesNestedInputSchema: z.ZodType<Prisma.CustomerUpdateOneWithoutQuotesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CustomerCreateWithoutQuotesInputSchema), z.lazy(() => CustomerUncheckedCreateWithoutQuotesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutQuotesInputSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutQuotesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CustomerUpdateToOneWithWhereWithoutQuotesInputSchema), z.lazy(() => CustomerUpdateWithoutQuotesInputSchema), z.lazy(() => CustomerUncheckedUpdateWithoutQuotesInputSchema) ]).optional(),
});

export const CompanyProfileUpdateOneWithoutQuotesNestedInputSchema: z.ZodType<Prisma.CompanyProfileUpdateOneWithoutQuotesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CompanyProfileCreateWithoutQuotesInputSchema), z.lazy(() => CompanyProfileUncheckedCreateWithoutQuotesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CompanyProfileCreateOrConnectWithoutQuotesInputSchema).optional(),
  upsert: z.lazy(() => CompanyProfileUpsertWithoutQuotesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CompanyProfileWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CompanyProfileWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CompanyProfileWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CompanyProfileUpdateToOneWithWhereWithoutQuotesInputSchema), z.lazy(() => CompanyProfileUpdateWithoutQuotesInputSchema), z.lazy(() => CompanyProfileUncheckedUpdateWithoutQuotesInputSchema) ]).optional(),
});

export const QuoteItemUpdateManyWithoutQuoteNestedInputSchema: z.ZodType<Prisma.QuoteItemUpdateManyWithoutQuoteNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutQuoteInputSchema), z.lazy(() => QuoteItemCreateWithoutQuoteInputSchema).array(), z.lazy(() => QuoteItemUncheckedCreateWithoutQuoteInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutQuoteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteItemCreateOrConnectWithoutQuoteInputSchema), z.lazy(() => QuoteItemCreateOrConnectWithoutQuoteInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuoteItemUpsertWithWhereUniqueWithoutQuoteInputSchema), z.lazy(() => QuoteItemUpsertWithWhereUniqueWithoutQuoteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteItemCreateManyQuoteInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuoteItemUpdateWithWhereUniqueWithoutQuoteInputSchema), z.lazy(() => QuoteItemUpdateWithWhereUniqueWithoutQuoteInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuoteItemUpdateManyWithWhereWithoutQuoteInputSchema), z.lazy(() => QuoteItemUpdateManyWithWhereWithoutQuoteInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuoteItemScalarWhereInputSchema), z.lazy(() => QuoteItemScalarWhereInputSchema).array() ]).optional(),
});

export const QuoteItemUncheckedUpdateManyWithoutQuoteNestedInputSchema: z.ZodType<Prisma.QuoteItemUncheckedUpdateManyWithoutQuoteNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutQuoteInputSchema), z.lazy(() => QuoteItemCreateWithoutQuoteInputSchema).array(), z.lazy(() => QuoteItemUncheckedCreateWithoutQuoteInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutQuoteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => QuoteItemCreateOrConnectWithoutQuoteInputSchema), z.lazy(() => QuoteItemCreateOrConnectWithoutQuoteInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => QuoteItemUpsertWithWhereUniqueWithoutQuoteInputSchema), z.lazy(() => QuoteItemUpsertWithWhereUniqueWithoutQuoteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => QuoteItemCreateManyQuoteInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => QuoteItemWhereUniqueInputSchema), z.lazy(() => QuoteItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => QuoteItemUpdateWithWhereUniqueWithoutQuoteInputSchema), z.lazy(() => QuoteItemUpdateWithWhereUniqueWithoutQuoteInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => QuoteItemUpdateManyWithWhereWithoutQuoteInputSchema), z.lazy(() => QuoteItemUpdateManyWithWhereWithoutQuoteInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => QuoteItemScalarWhereInputSchema), z.lazy(() => QuoteItemScalarWhereInputSchema).array() ]).optional(),
});

export const QuoteCreateNestedOneWithoutItemsInputSchema: z.ZodType<Prisma.QuoteCreateNestedOneWithoutItemsInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteCreateWithoutItemsInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QuoteCreateOrConnectWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => QuoteWhereUniqueInputSchema).optional(),
});

export const ProductCreateNestedOneWithoutQuoteItemsInputSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutQuoteItemsInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutQuoteItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutQuoteItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutQuoteItemsInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
});

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const QuoteUpdateOneRequiredWithoutItemsNestedInputSchema: z.ZodType<Prisma.QuoteUpdateOneRequiredWithoutItemsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => QuoteCreateWithoutItemsInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => QuoteCreateOrConnectWithoutItemsInputSchema).optional(),
  upsert: z.lazy(() => QuoteUpsertWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => QuoteWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => QuoteUpdateToOneWithWhereWithoutItemsInputSchema), z.lazy(() => QuoteUpdateWithoutItemsInputSchema), z.lazy(() => QuoteUncheckedUpdateWithoutItemsInputSchema) ]).optional(),
});

export const ProductUpdateOneWithoutQuoteItemsNestedInputSchema: z.ZodType<Prisma.ProductUpdateOneWithoutQuoteItemsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutQuoteItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutQuoteItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutQuoteItemsInputSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutQuoteItemsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProductWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProductWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProductUpdateToOneWithWhereWithoutQuoteItemsInputSchema), z.lazy(() => ProductUpdateWithoutQuoteItemsInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutQuoteItemsInputSchema) ]).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional(),
});

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const QuoteCreateWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteCreateWithoutCustomerInput> = z.strictObject({
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  companyProfile: z.lazy(() => CompanyProfileCreateNestedOneWithoutQuotesInputSchema).optional(),
  items: z.lazy(() => QuoteItemCreateNestedManyWithoutQuoteInputSchema).optional(),
});

export const QuoteUncheckedCreateWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteUncheckedCreateWithoutCustomerInput> = z.strictObject({
  id: z.number().int().optional(),
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  companyProfileId: z.number().int().optional().nullable(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  items: z.lazy(() => QuoteItemUncheckedCreateNestedManyWithoutQuoteInputSchema).optional(),
});

export const QuoteCreateOrConnectWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteCreateOrConnectWithoutCustomerInput> = z.strictObject({
  where: z.lazy(() => QuoteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuoteCreateWithoutCustomerInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCustomerInputSchema) ]),
});

export const QuoteCreateManyCustomerInputEnvelopeSchema: z.ZodType<Prisma.QuoteCreateManyCustomerInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => QuoteCreateManyCustomerInputSchema), z.lazy(() => QuoteCreateManyCustomerInputSchema).array() ]),
});

export const QuoteUpsertWithWhereUniqueWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteUpsertWithWhereUniqueWithoutCustomerInput> = z.strictObject({
  where: z.lazy(() => QuoteWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => QuoteUpdateWithoutCustomerInputSchema), z.lazy(() => QuoteUncheckedUpdateWithoutCustomerInputSchema) ]),
  create: z.union([ z.lazy(() => QuoteCreateWithoutCustomerInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCustomerInputSchema) ]),
});

export const QuoteUpdateWithWhereUniqueWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteUpdateWithWhereUniqueWithoutCustomerInput> = z.strictObject({
  where: z.lazy(() => QuoteWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => QuoteUpdateWithoutCustomerInputSchema), z.lazy(() => QuoteUncheckedUpdateWithoutCustomerInputSchema) ]),
});

export const QuoteUpdateManyWithWhereWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteUpdateManyWithWhereWithoutCustomerInput> = z.strictObject({
  where: z.lazy(() => QuoteScalarWhereInputSchema),
  data: z.union([ z.lazy(() => QuoteUpdateManyMutationInputSchema), z.lazy(() => QuoteUncheckedUpdateManyWithoutCustomerInputSchema) ]),
});

export const QuoteScalarWhereInputSchema: z.ZodType<Prisma.QuoteScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => QuoteScalarWhereInputSchema), z.lazy(() => QuoteScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuoteScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuoteScalarWhereInputSchema), z.lazy(() => QuoteScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  number: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  revision: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  date: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  customerBusinessName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  customerEmail: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerVatNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerAddress: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerZipCode: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  customerCity: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  subtotal: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  totalVat: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  metadata: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  companyProfileId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
});

export const QuoteItemCreateWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemCreateWithoutProductInput> = z.strictObject({
  ordering: z.number().int().optional(),
  code: z.string(),
  measure: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number().optional(),
  discount2: z.number().optional(),
  discount3: z.number().optional(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().optional().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().int().optional().nullable(),
  updatedAt: z.number().int().optional().nullable(),
  quote: z.lazy(() => QuoteCreateNestedOneWithoutItemsInputSchema),
});

export const QuoteItemUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemUncheckedCreateWithoutProductInput> = z.strictObject({
  id: z.number().int().optional(),
  quoteId: z.number().int(),
  ordering: z.number().int().optional(),
  code: z.string(),
  measure: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number().optional(),
  discount2: z.number().optional(),
  discount3: z.number().optional(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().optional().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().int().optional().nullable(),
  updatedAt: z.number().int().optional().nullable(),
});

export const QuoteItemCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemCreateOrConnectWithoutProductInput> = z.strictObject({
  where: z.lazy(() => QuoteItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutProductInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutProductInputSchema) ]),
});

export const QuoteItemCreateManyProductInputEnvelopeSchema: z.ZodType<Prisma.QuoteItemCreateManyProductInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => QuoteItemCreateManyProductInputSchema), z.lazy(() => QuoteItemCreateManyProductInputSchema).array() ]),
});

export const QuoteItemUpsertWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemUpsertWithWhereUniqueWithoutProductInput> = z.strictObject({
  where: z.lazy(() => QuoteItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => QuoteItemUpdateWithoutProductInputSchema), z.lazy(() => QuoteItemUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutProductInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutProductInputSchema) ]),
});

export const QuoteItemUpdateWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemUpdateWithWhereUniqueWithoutProductInput> = z.strictObject({
  where: z.lazy(() => QuoteItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => QuoteItemUpdateWithoutProductInputSchema), z.lazy(() => QuoteItemUncheckedUpdateWithoutProductInputSchema) ]),
});

export const QuoteItemUpdateManyWithWhereWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemUpdateManyWithWhereWithoutProductInput> = z.strictObject({
  where: z.lazy(() => QuoteItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => QuoteItemUpdateManyMutationInputSchema), z.lazy(() => QuoteItemUncheckedUpdateManyWithoutProductInputSchema) ]),
});

export const QuoteItemScalarWhereInputSchema: z.ZodType<Prisma.QuoteItemScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => QuoteItemScalarWhereInputSchema), z.lazy(() => QuoteItemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => QuoteItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => QuoteItemScalarWhereInputSchema), z.lazy(() => QuoteItemScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  quoteId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  ordering: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  productId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  code: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  measure: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  unit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  unitPrice: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  lineTotal: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  discount1: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  discount2: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  discount3: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  netUnitPrice: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  netLineTotal: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  vatRate: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  vatAmount: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
});

export const QuoteCreateWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteCreateWithoutCompanyProfileInput> = z.strictObject({
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutQuotesInputSchema).optional(),
  items: z.lazy(() => QuoteItemCreateNestedManyWithoutQuoteInputSchema).optional(),
});

export const QuoteUncheckedCreateWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteUncheckedCreateWithoutCompanyProfileInput> = z.strictObject({
  id: z.number().int().optional(),
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerId: z.number().int().optional().nullable(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  items: z.lazy(() => QuoteItemUncheckedCreateNestedManyWithoutQuoteInputSchema).optional(),
});

export const QuoteCreateOrConnectWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteCreateOrConnectWithoutCompanyProfileInput> = z.strictObject({
  where: z.lazy(() => QuoteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuoteCreateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCompanyProfileInputSchema) ]),
});

export const QuoteCreateManyCompanyProfileInputEnvelopeSchema: z.ZodType<Prisma.QuoteCreateManyCompanyProfileInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => QuoteCreateManyCompanyProfileInputSchema), z.lazy(() => QuoteCreateManyCompanyProfileInputSchema).array() ]),
});

export const QuoteUpsertWithWhereUniqueWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteUpsertWithWhereUniqueWithoutCompanyProfileInput> = z.strictObject({
  where: z.lazy(() => QuoteWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => QuoteUpdateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUncheckedUpdateWithoutCompanyProfileInputSchema) ]),
  create: z.union([ z.lazy(() => QuoteCreateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutCompanyProfileInputSchema) ]),
});

export const QuoteUpdateWithWhereUniqueWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteUpdateWithWhereUniqueWithoutCompanyProfileInput> = z.strictObject({
  where: z.lazy(() => QuoteWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => QuoteUpdateWithoutCompanyProfileInputSchema), z.lazy(() => QuoteUncheckedUpdateWithoutCompanyProfileInputSchema) ]),
});

export const QuoteUpdateManyWithWhereWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteUpdateManyWithWhereWithoutCompanyProfileInput> = z.strictObject({
  where: z.lazy(() => QuoteScalarWhereInputSchema),
  data: z.union([ z.lazy(() => QuoteUpdateManyMutationInputSchema), z.lazy(() => QuoteUncheckedUpdateManyWithoutCompanyProfileInputSchema) ]),
});

export const CustomerCreateWithoutQuotesInputSchema: z.ZodType<Prisma.CustomerCreateWithoutQuotesInput> = z.strictObject({
  businessName: z.string(),
  email: z.string(),
  vatNumber: z.string(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const CustomerUncheckedCreateWithoutQuotesInputSchema: z.ZodType<Prisma.CustomerUncheckedCreateWithoutQuotesInput> = z.strictObject({
  id: z.number().int().optional(),
  businessName: z.string(),
  email: z.string(),
  vatNumber: z.string(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const CustomerCreateOrConnectWithoutQuotesInputSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutQuotesInput> = z.strictObject({
  where: z.lazy(() => CustomerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CustomerCreateWithoutQuotesInputSchema), z.lazy(() => CustomerUncheckedCreateWithoutQuotesInputSchema) ]),
});

export const CompanyProfileCreateWithoutQuotesInputSchema: z.ZodType<Prisma.CompanyProfileCreateWithoutQuotesInput> = z.strictObject({
  profileName: z.string(),
  businessName: z.string(),
  vatNumber: z.string(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  smtpHost: z.string().optional().nullable(),
  smtpPort: z.number().int().optional().nullable(),
  smtpSecure: z.number().int().optional().nullable(),
  smtpUser: z.string().optional().nullable(),
  smtpPassword: z.string().optional().nullable(),
  smtpFromEmail: z.string().optional().nullable(),
  smtpFromName: z.string().optional().nullable(),
  isDefault: z.number().int().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const CompanyProfileUncheckedCreateWithoutQuotesInputSchema: z.ZodType<Prisma.CompanyProfileUncheckedCreateWithoutQuotesInput> = z.strictObject({
  id: z.number().int().optional(),
  profileName: z.string(),
  businessName: z.string(),
  vatNumber: z.string(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  smtpHost: z.string().optional().nullable(),
  smtpPort: z.number().int().optional().nullable(),
  smtpSecure: z.number().int().optional().nullable(),
  smtpUser: z.string().optional().nullable(),
  smtpPassword: z.string().optional().nullable(),
  smtpFromEmail: z.string().optional().nullable(),
  smtpFromName: z.string().optional().nullable(),
  isDefault: z.number().int().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const CompanyProfileCreateOrConnectWithoutQuotesInputSchema: z.ZodType<Prisma.CompanyProfileCreateOrConnectWithoutQuotesInput> = z.strictObject({
  where: z.lazy(() => CompanyProfileWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CompanyProfileCreateWithoutQuotesInputSchema), z.lazy(() => CompanyProfileUncheckedCreateWithoutQuotesInputSchema) ]),
});

export const QuoteItemCreateWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemCreateWithoutQuoteInput> = z.strictObject({
  ordering: z.number().int().optional(),
  code: z.string(),
  measure: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number().optional(),
  discount2: z.number().optional(),
  discount3: z.number().optional(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().optional().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().int().optional().nullable(),
  updatedAt: z.number().int().optional().nullable(),
  product: z.lazy(() => ProductCreateNestedOneWithoutQuoteItemsInputSchema).optional(),
});

export const QuoteItemUncheckedCreateWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemUncheckedCreateWithoutQuoteInput> = z.strictObject({
  id: z.number().int().optional(),
  ordering: z.number().int().optional(),
  productId: z.number().int().optional().nullable(),
  code: z.string(),
  measure: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number().optional(),
  discount2: z.number().optional(),
  discount3: z.number().optional(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().optional().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().int().optional().nullable(),
  updatedAt: z.number().int().optional().nullable(),
});

export const QuoteItemCreateOrConnectWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemCreateOrConnectWithoutQuoteInput> = z.strictObject({
  where: z.lazy(() => QuoteItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutQuoteInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutQuoteInputSchema) ]),
});

export const QuoteItemCreateManyQuoteInputEnvelopeSchema: z.ZodType<Prisma.QuoteItemCreateManyQuoteInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => QuoteItemCreateManyQuoteInputSchema), z.lazy(() => QuoteItemCreateManyQuoteInputSchema).array() ]),
});

export const CustomerUpsertWithoutQuotesInputSchema: z.ZodType<Prisma.CustomerUpsertWithoutQuotesInput> = z.strictObject({
  update: z.union([ z.lazy(() => CustomerUpdateWithoutQuotesInputSchema), z.lazy(() => CustomerUncheckedUpdateWithoutQuotesInputSchema) ]),
  create: z.union([ z.lazy(() => CustomerCreateWithoutQuotesInputSchema), z.lazy(() => CustomerUncheckedCreateWithoutQuotesInputSchema) ]),
  where: z.lazy(() => CustomerWhereInputSchema).optional(),
});

export const CustomerUpdateToOneWithWhereWithoutQuotesInputSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutQuotesInput> = z.strictObject({
  where: z.lazy(() => CustomerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CustomerUpdateWithoutQuotesInputSchema), z.lazy(() => CustomerUncheckedUpdateWithoutQuotesInputSchema) ]),
});

export const CustomerUpdateWithoutQuotesInputSchema: z.ZodType<Prisma.CustomerUpdateWithoutQuotesInput> = z.strictObject({
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CustomerUncheckedUpdateWithoutQuotesInputSchema: z.ZodType<Prisma.CustomerUncheckedUpdateWithoutQuotesInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CompanyProfileUpsertWithoutQuotesInputSchema: z.ZodType<Prisma.CompanyProfileUpsertWithoutQuotesInput> = z.strictObject({
  update: z.union([ z.lazy(() => CompanyProfileUpdateWithoutQuotesInputSchema), z.lazy(() => CompanyProfileUncheckedUpdateWithoutQuotesInputSchema) ]),
  create: z.union([ z.lazy(() => CompanyProfileCreateWithoutQuotesInputSchema), z.lazy(() => CompanyProfileUncheckedCreateWithoutQuotesInputSchema) ]),
  where: z.lazy(() => CompanyProfileWhereInputSchema).optional(),
});

export const CompanyProfileUpdateToOneWithWhereWithoutQuotesInputSchema: z.ZodType<Prisma.CompanyProfileUpdateToOneWithWhereWithoutQuotesInput> = z.strictObject({
  where: z.lazy(() => CompanyProfileWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CompanyProfileUpdateWithoutQuotesInputSchema), z.lazy(() => CompanyProfileUncheckedUpdateWithoutQuotesInputSchema) ]),
});

export const CompanyProfileUpdateWithoutQuotesInputSchema: z.ZodType<Prisma.CompanyProfileUpdateWithoutQuotesInput> = z.strictObject({
  profileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpHost: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPort: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpSecure: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPassword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDefault: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CompanyProfileUncheckedUpdateWithoutQuotesInputSchema: z.ZodType<Prisma.CompanyProfileUncheckedUpdateWithoutQuotesInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  profileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  businessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vatNumber: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  zipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpHost: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPort: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpSecure: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpPassword: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  smtpFromName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isDefault: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const QuoteItemUpsertWithWhereUniqueWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemUpsertWithWhereUniqueWithoutQuoteInput> = z.strictObject({
  where: z.lazy(() => QuoteItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => QuoteItemUpdateWithoutQuoteInputSchema), z.lazy(() => QuoteItemUncheckedUpdateWithoutQuoteInputSchema) ]),
  create: z.union([ z.lazy(() => QuoteItemCreateWithoutQuoteInputSchema), z.lazy(() => QuoteItemUncheckedCreateWithoutQuoteInputSchema) ]),
});

export const QuoteItemUpdateWithWhereUniqueWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemUpdateWithWhereUniqueWithoutQuoteInput> = z.strictObject({
  where: z.lazy(() => QuoteItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => QuoteItemUpdateWithoutQuoteInputSchema), z.lazy(() => QuoteItemUncheckedUpdateWithoutQuoteInputSchema) ]),
});

export const QuoteItemUpdateManyWithWhereWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemUpdateManyWithWhereWithoutQuoteInput> = z.strictObject({
  where: z.lazy(() => QuoteItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => QuoteItemUpdateManyMutationInputSchema), z.lazy(() => QuoteItemUncheckedUpdateManyWithoutQuoteInputSchema) ]),
});

export const QuoteCreateWithoutItemsInputSchema: z.ZodType<Prisma.QuoteCreateWithoutItemsInput> = z.strictObject({
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutQuotesInputSchema).optional(),
  companyProfile: z.lazy(() => CompanyProfileCreateNestedOneWithoutQuotesInputSchema).optional(),
});

export const QuoteUncheckedCreateWithoutItemsInputSchema: z.ZodType<Prisma.QuoteUncheckedCreateWithoutItemsInput> = z.strictObject({
  id: z.number().int().optional(),
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerId: z.number().int().optional().nullable(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  companyProfileId: z.number().int().optional().nullable(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const QuoteCreateOrConnectWithoutItemsInputSchema: z.ZodType<Prisma.QuoteCreateOrConnectWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => QuoteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => QuoteCreateWithoutItemsInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutItemsInputSchema) ]),
});

export const ProductCreateWithoutQuoteItemsInputSchema: z.ZodType<Prisma.ProductCreateWithoutQuoteItemsInput> = z.strictObject({
  code: z.string(),
  description: z.string().optional().nullable(),
  measure: z.string().optional().nullable(),
  price: z.number(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const ProductUncheckedCreateWithoutQuoteItemsInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutQuoteItemsInput> = z.strictObject({
  id: z.number().int().optional(),
  code: z.string(),
  description: z.string().optional().nullable(),
  measure: z.string().optional().nullable(),
  price: z.number(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const ProductCreateOrConnectWithoutQuoteItemsInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutQuoteItemsInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutQuoteItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutQuoteItemsInputSchema) ]),
});

export const QuoteUpsertWithoutItemsInputSchema: z.ZodType<Prisma.QuoteUpsertWithoutItemsInput> = z.strictObject({
  update: z.union([ z.lazy(() => QuoteUpdateWithoutItemsInputSchema), z.lazy(() => QuoteUncheckedUpdateWithoutItemsInputSchema) ]),
  create: z.union([ z.lazy(() => QuoteCreateWithoutItemsInputSchema), z.lazy(() => QuoteUncheckedCreateWithoutItemsInputSchema) ]),
  where: z.lazy(() => QuoteWhereInputSchema).optional(),
});

export const QuoteUpdateToOneWithWhereWithoutItemsInputSchema: z.ZodType<Prisma.QuoteUpdateToOneWithWhereWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => QuoteWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => QuoteUpdateWithoutItemsInputSchema), z.lazy(() => QuoteUncheckedUpdateWithoutItemsInputSchema) ]),
});

export const QuoteUpdateWithoutItemsInputSchema: z.ZodType<Prisma.QuoteUpdateWithoutItemsInput> = z.strictObject({
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => CustomerUpdateOneWithoutQuotesNestedInputSchema).optional(),
  companyProfile: z.lazy(() => CompanyProfileUpdateOneWithoutQuotesNestedInputSchema).optional(),
});

export const QuoteUncheckedUpdateWithoutItemsInputSchema: z.ZodType<Prisma.QuoteUncheckedUpdateWithoutItemsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyProfileId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProductUpsertWithoutQuoteItemsInputSchema: z.ZodType<Prisma.ProductUpsertWithoutQuoteItemsInput> = z.strictObject({
  update: z.union([ z.lazy(() => ProductUpdateWithoutQuoteItemsInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutQuoteItemsInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutQuoteItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutQuoteItemsInputSchema) ]),
  where: z.lazy(() => ProductWhereInputSchema).optional(),
});

export const ProductUpdateToOneWithWhereWithoutQuoteItemsInputSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutQuoteItemsInput> = z.strictObject({
  where: z.lazy(() => ProductWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProductUpdateWithoutQuoteItemsInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutQuoteItemsInputSchema) ]),
});

export const ProductUpdateWithoutQuoteItemsInputSchema: z.ZodType<Prisma.ProductUpdateWithoutQuoteItemsInput> = z.strictObject({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProductUncheckedUpdateWithoutQuoteItemsInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutQuoteItemsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const QuoteCreateManyCustomerInputSchema: z.ZodType<Prisma.QuoteCreateManyCustomerInput> = z.strictObject({
  id: z.number().int().optional(),
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  companyProfileId: z.number().int().optional().nullable(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const QuoteUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteUpdateWithoutCustomerInput> = z.strictObject({
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  companyProfile: z.lazy(() => CompanyProfileUpdateOneWithoutQuotesNestedInputSchema).optional(),
  items: z.lazy(() => QuoteItemUpdateManyWithoutQuoteNestedInputSchema).optional(),
});

export const QuoteUncheckedUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteUncheckedUpdateWithoutCustomerInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyProfileId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => QuoteItemUncheckedUpdateManyWithoutQuoteNestedInputSchema).optional(),
});

export const QuoteUncheckedUpdateManyWithoutCustomerInputSchema: z.ZodType<Prisma.QuoteUncheckedUpdateManyWithoutCustomerInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  companyProfileId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const QuoteItemCreateManyProductInputSchema: z.ZodType<Prisma.QuoteItemCreateManyProductInput> = z.strictObject({
  id: z.number().int().optional(),
  quoteId: z.number().int(),
  ordering: z.number().int().optional(),
  code: z.string(),
  measure: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number().optional(),
  discount2: z.number().optional(),
  discount3: z.number().optional(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().optional().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().int().optional().nullable(),
  updatedAt: z.number().int().optional().nullable(),
});

export const QuoteItemUpdateWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemUpdateWithoutProductInput> = z.strictObject({
  ordering: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  lineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount1: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount2: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount3: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netUnitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netLineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  vatRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vatAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  quote: z.lazy(() => QuoteUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const QuoteItemUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemUncheckedUpdateWithoutProductInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quoteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ordering: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  lineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount1: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount2: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount3: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netUnitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netLineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  vatRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vatAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const QuoteItemUncheckedUpdateManyWithoutProductInputSchema: z.ZodType<Prisma.QuoteItemUncheckedUpdateManyWithoutProductInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quoteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ordering: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  lineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount1: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount2: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount3: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netUnitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netLineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  vatRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vatAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const QuoteCreateManyCompanyProfileInputSchema: z.ZodType<Prisma.QuoteCreateManyCompanyProfileInput> = z.strictObject({
  id: z.number().int().optional(),
  number: z.number().int(),
  revision: z.number().int().optional(),
  date: z.string(),
  customerId: z.number().int().optional().nullable(),
  customerBusinessName: z.string(),
  customerEmail: z.string().optional().nullable(),
  customerVatNumber: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  customerZipCode: z.string().optional().nullable(),
  customerCity: z.string().optional().nullable(),
  subtotal: z.number(),
  totalVat: z.number(),
  total: z.number(),
  notes: z.string().optional().nullable(),
  metadata: z.string().optional().nullable(),
  status: z.string().optional(),
  createdAt: z.number().int().optional(),
  updatedAt: z.number().int().optional(),
});

export const QuoteUpdateWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteUpdateWithoutCompanyProfileInput> = z.strictObject({
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => CustomerUpdateOneWithoutQuotesNestedInputSchema).optional(),
  items: z.lazy(() => QuoteItemUpdateManyWithoutQuoteNestedInputSchema).optional(),
});

export const QuoteUncheckedUpdateWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteUncheckedUpdateWithoutCompanyProfileInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => QuoteItemUncheckedUpdateManyWithoutQuoteNestedInputSchema).optional(),
});

export const QuoteUncheckedUpdateManyWithoutCompanyProfileInputSchema: z.ZodType<Prisma.QuoteUncheckedUpdateManyWithoutCompanyProfileInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  revision: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerBusinessName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerEmail: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerVatNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerZipCode: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  customerCity: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subtotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalVat: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  metadata: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const QuoteItemCreateManyQuoteInputSchema: z.ZodType<Prisma.QuoteItemCreateManyQuoteInput> = z.strictObject({
  id: z.number().int().optional(),
  ordering: z.number().int().optional(),
  productId: z.number().int().optional().nullable(),
  code: z.string(),
  measure: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  unit: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  lineTotal: z.number(),
  discount1: z.number().optional(),
  discount2: z.number().optional(),
  discount3: z.number().optional(),
  netUnitPrice: z.number(),
  netLineTotal: z.number(),
  vatRate: z.number().optional().nullable(),
  vatAmount: z.number(),
  createdAt: z.number().int().optional().nullable(),
  updatedAt: z.number().int().optional().nullable(),
});

export const QuoteItemUpdateWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemUpdateWithoutQuoteInput> = z.strictObject({
  ordering: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  lineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount1: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount2: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount3: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netUnitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netLineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  vatRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vatAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  product: z.lazy(() => ProductUpdateOneWithoutQuoteItemsNestedInputSchema).optional(),
});

export const QuoteItemUncheckedUpdateWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemUncheckedUpdateWithoutQuoteInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ordering: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  lineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount1: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount2: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount3: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netUnitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netLineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  vatRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vatAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const QuoteItemUncheckedUpdateManyWithoutQuoteInputSchema: z.ZodType<Prisma.QuoteItemUncheckedUpdateManyWithoutQuoteInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ordering: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  measure: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unit: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  unitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  lineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount1: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount2: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount3: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netUnitPrice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  netLineTotal: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  vatRate: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  vatAmount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const CustomerFindFirstArgsSchema: z.ZodType<Prisma.CustomerFindFirstArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereInputSchema.optional(), 
  orderBy: z.union([ CustomerOrderByWithRelationInputSchema.array(), CustomerOrderByWithRelationInputSchema ]).optional(),
  cursor: CustomerWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CustomerScalarFieldEnumSchema, CustomerScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CustomerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CustomerFindFirstOrThrowArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereInputSchema.optional(), 
  orderBy: z.union([ CustomerOrderByWithRelationInputSchema.array(), CustomerOrderByWithRelationInputSchema ]).optional(),
  cursor: CustomerWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CustomerScalarFieldEnumSchema, CustomerScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CustomerFindManyArgsSchema: z.ZodType<Prisma.CustomerFindManyArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereInputSchema.optional(), 
  orderBy: z.union([ CustomerOrderByWithRelationInputSchema.array(), CustomerOrderByWithRelationInputSchema ]).optional(),
  cursor: CustomerWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CustomerScalarFieldEnumSchema, CustomerScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CustomerAggregateArgsSchema: z.ZodType<Prisma.CustomerAggregateArgs> = z.object({
  where: CustomerWhereInputSchema.optional(), 
  orderBy: z.union([ CustomerOrderByWithRelationInputSchema.array(), CustomerOrderByWithRelationInputSchema ]).optional(),
  cursor: CustomerWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CustomerGroupByArgsSchema: z.ZodType<Prisma.CustomerGroupByArgs> = z.object({
  where: CustomerWhereInputSchema.optional(), 
  orderBy: z.union([ CustomerOrderByWithAggregationInputSchema.array(), CustomerOrderByWithAggregationInputSchema ]).optional(),
  by: CustomerScalarFieldEnumSchema.array(), 
  having: CustomerScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CustomerFindUniqueArgsSchema: z.ZodType<Prisma.CustomerFindUniqueArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereUniqueInputSchema, 
}).strict();

export const CustomerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CustomerFindUniqueOrThrowArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereUniqueInputSchema, 
}).strict();

export const ProductFindFirstArgsSchema: z.ZodType<Prisma.ProductFindFirstArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProductFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProductFindFirstOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProductFindManyArgsSchema: z.ZodType<Prisma.ProductFindManyArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProductAggregateArgsSchema: z.ZodType<Prisma.ProductAggregateArgs> = z.object({
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ProductGroupByArgsSchema: z.ZodType<Prisma.ProductGroupByArgs> = z.object({
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithAggregationInputSchema.array(), ProductOrderByWithAggregationInputSchema ]).optional(),
  by: ProductScalarFieldEnumSchema.array(), 
  having: ProductScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ProductFindUniqueArgsSchema: z.ZodType<Prisma.ProductFindUniqueArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const ProductFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProductFindUniqueOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const CompanyProfileFindFirstArgsSchema: z.ZodType<Prisma.CompanyProfileFindFirstArgs> = z.object({
  select: CompanyProfileSelectSchema.optional(),
  include: CompanyProfileIncludeSchema.optional(),
  where: CompanyProfileWhereInputSchema.optional(), 
  orderBy: z.union([ CompanyProfileOrderByWithRelationInputSchema.array(), CompanyProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyProfileWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CompanyProfileScalarFieldEnumSchema, CompanyProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CompanyProfileFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CompanyProfileFindFirstOrThrowArgs> = z.object({
  select: CompanyProfileSelectSchema.optional(),
  include: CompanyProfileIncludeSchema.optional(),
  where: CompanyProfileWhereInputSchema.optional(), 
  orderBy: z.union([ CompanyProfileOrderByWithRelationInputSchema.array(), CompanyProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyProfileWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CompanyProfileScalarFieldEnumSchema, CompanyProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CompanyProfileFindManyArgsSchema: z.ZodType<Prisma.CompanyProfileFindManyArgs> = z.object({
  select: CompanyProfileSelectSchema.optional(),
  include: CompanyProfileIncludeSchema.optional(),
  where: CompanyProfileWhereInputSchema.optional(), 
  orderBy: z.union([ CompanyProfileOrderByWithRelationInputSchema.array(), CompanyProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyProfileWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CompanyProfileScalarFieldEnumSchema, CompanyProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CompanyProfileAggregateArgsSchema: z.ZodType<Prisma.CompanyProfileAggregateArgs> = z.object({
  where: CompanyProfileWhereInputSchema.optional(), 
  orderBy: z.union([ CompanyProfileOrderByWithRelationInputSchema.array(), CompanyProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: CompanyProfileWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CompanyProfileGroupByArgsSchema: z.ZodType<Prisma.CompanyProfileGroupByArgs> = z.object({
  where: CompanyProfileWhereInputSchema.optional(), 
  orderBy: z.union([ CompanyProfileOrderByWithAggregationInputSchema.array(), CompanyProfileOrderByWithAggregationInputSchema ]).optional(),
  by: CompanyProfileScalarFieldEnumSchema.array(), 
  having: CompanyProfileScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CompanyProfileFindUniqueArgsSchema: z.ZodType<Prisma.CompanyProfileFindUniqueArgs> = z.object({
  select: CompanyProfileSelectSchema.optional(),
  include: CompanyProfileIncludeSchema.optional(),
  where: CompanyProfileWhereUniqueInputSchema, 
}).strict();

export const CompanyProfileFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CompanyProfileFindUniqueOrThrowArgs> = z.object({
  select: CompanyProfileSelectSchema.optional(),
  include: CompanyProfileIncludeSchema.optional(),
  where: CompanyProfileWhereUniqueInputSchema, 
}).strict();

export const QuoteFindFirstArgsSchema: z.ZodType<Prisma.QuoteFindFirstArgs> = z.object({
  select: QuoteSelectSchema.optional(),
  include: QuoteIncludeSchema.optional(),
  where: QuoteWhereInputSchema.optional(), 
  orderBy: z.union([ QuoteOrderByWithRelationInputSchema.array(), QuoteOrderByWithRelationInputSchema ]).optional(),
  cursor: QuoteWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuoteScalarFieldEnumSchema, QuoteScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const QuoteFindFirstOrThrowArgsSchema: z.ZodType<Prisma.QuoteFindFirstOrThrowArgs> = z.object({
  select: QuoteSelectSchema.optional(),
  include: QuoteIncludeSchema.optional(),
  where: QuoteWhereInputSchema.optional(), 
  orderBy: z.union([ QuoteOrderByWithRelationInputSchema.array(), QuoteOrderByWithRelationInputSchema ]).optional(),
  cursor: QuoteWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuoteScalarFieldEnumSchema, QuoteScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const QuoteFindManyArgsSchema: z.ZodType<Prisma.QuoteFindManyArgs> = z.object({
  select: QuoteSelectSchema.optional(),
  include: QuoteIncludeSchema.optional(),
  where: QuoteWhereInputSchema.optional(), 
  orderBy: z.union([ QuoteOrderByWithRelationInputSchema.array(), QuoteOrderByWithRelationInputSchema ]).optional(),
  cursor: QuoteWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuoteScalarFieldEnumSchema, QuoteScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const QuoteAggregateArgsSchema: z.ZodType<Prisma.QuoteAggregateArgs> = z.object({
  where: QuoteWhereInputSchema.optional(), 
  orderBy: z.union([ QuoteOrderByWithRelationInputSchema.array(), QuoteOrderByWithRelationInputSchema ]).optional(),
  cursor: QuoteWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const QuoteGroupByArgsSchema: z.ZodType<Prisma.QuoteGroupByArgs> = z.object({
  where: QuoteWhereInputSchema.optional(), 
  orderBy: z.union([ QuoteOrderByWithAggregationInputSchema.array(), QuoteOrderByWithAggregationInputSchema ]).optional(),
  by: QuoteScalarFieldEnumSchema.array(), 
  having: QuoteScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const QuoteFindUniqueArgsSchema: z.ZodType<Prisma.QuoteFindUniqueArgs> = z.object({
  select: QuoteSelectSchema.optional(),
  include: QuoteIncludeSchema.optional(),
  where: QuoteWhereUniqueInputSchema, 
}).strict();

export const QuoteFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.QuoteFindUniqueOrThrowArgs> = z.object({
  select: QuoteSelectSchema.optional(),
  include: QuoteIncludeSchema.optional(),
  where: QuoteWhereUniqueInputSchema, 
}).strict();

export const QuoteItemFindFirstArgsSchema: z.ZodType<Prisma.QuoteItemFindFirstArgs> = z.object({
  select: QuoteItemSelectSchema.optional(),
  include: QuoteItemIncludeSchema.optional(),
  where: QuoteItemWhereInputSchema.optional(), 
  orderBy: z.union([ QuoteItemOrderByWithRelationInputSchema.array(), QuoteItemOrderByWithRelationInputSchema ]).optional(),
  cursor: QuoteItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuoteItemScalarFieldEnumSchema, QuoteItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const QuoteItemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.QuoteItemFindFirstOrThrowArgs> = z.object({
  select: QuoteItemSelectSchema.optional(),
  include: QuoteItemIncludeSchema.optional(),
  where: QuoteItemWhereInputSchema.optional(), 
  orderBy: z.union([ QuoteItemOrderByWithRelationInputSchema.array(), QuoteItemOrderByWithRelationInputSchema ]).optional(),
  cursor: QuoteItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuoteItemScalarFieldEnumSchema, QuoteItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const QuoteItemFindManyArgsSchema: z.ZodType<Prisma.QuoteItemFindManyArgs> = z.object({
  select: QuoteItemSelectSchema.optional(),
  include: QuoteItemIncludeSchema.optional(),
  where: QuoteItemWhereInputSchema.optional(), 
  orderBy: z.union([ QuoteItemOrderByWithRelationInputSchema.array(), QuoteItemOrderByWithRelationInputSchema ]).optional(),
  cursor: QuoteItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ QuoteItemScalarFieldEnumSchema, QuoteItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const QuoteItemAggregateArgsSchema: z.ZodType<Prisma.QuoteItemAggregateArgs> = z.object({
  where: QuoteItemWhereInputSchema.optional(), 
  orderBy: z.union([ QuoteItemOrderByWithRelationInputSchema.array(), QuoteItemOrderByWithRelationInputSchema ]).optional(),
  cursor: QuoteItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const QuoteItemGroupByArgsSchema: z.ZodType<Prisma.QuoteItemGroupByArgs> = z.object({
  where: QuoteItemWhereInputSchema.optional(), 
  orderBy: z.union([ QuoteItemOrderByWithAggregationInputSchema.array(), QuoteItemOrderByWithAggregationInputSchema ]).optional(),
  by: QuoteItemScalarFieldEnumSchema.array(), 
  having: QuoteItemScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const QuoteItemFindUniqueArgsSchema: z.ZodType<Prisma.QuoteItemFindUniqueArgs> = z.object({
  select: QuoteItemSelectSchema.optional(),
  include: QuoteItemIncludeSchema.optional(),
  where: QuoteItemWhereUniqueInputSchema, 
}).strict();

export const QuoteItemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.QuoteItemFindUniqueOrThrowArgs> = z.object({
  select: QuoteItemSelectSchema.optional(),
  include: QuoteItemIncludeSchema.optional(),
  where: QuoteItemWhereUniqueInputSchema, 
}).strict();

export const CustomerCreateArgsSchema: z.ZodType<Prisma.CustomerCreateArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  data: z.union([ CustomerCreateInputSchema, CustomerUncheckedCreateInputSchema ]),
}).strict();

export const CustomerUpsertArgsSchema: z.ZodType<Prisma.CustomerUpsertArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereUniqueInputSchema, 
  create: z.union([ CustomerCreateInputSchema, CustomerUncheckedCreateInputSchema ]),
  update: z.union([ CustomerUpdateInputSchema, CustomerUncheckedUpdateInputSchema ]),
}).strict();

export const CustomerCreateManyArgsSchema: z.ZodType<Prisma.CustomerCreateManyArgs> = z.object({
  data: z.union([ CustomerCreateManyInputSchema, CustomerCreateManyInputSchema.array() ]),
}).strict();

export const CustomerCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CustomerCreateManyAndReturnArgs> = z.object({
  data: z.union([ CustomerCreateManyInputSchema, CustomerCreateManyInputSchema.array() ]),
}).strict();

export const CustomerDeleteArgsSchema: z.ZodType<Prisma.CustomerDeleteArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereUniqueInputSchema, 
}).strict();

export const CustomerUpdateArgsSchema: z.ZodType<Prisma.CustomerUpdateArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  data: z.union([ CustomerUpdateInputSchema, CustomerUncheckedUpdateInputSchema ]),
  where: CustomerWhereUniqueInputSchema, 
}).strict();

export const CustomerUpdateManyArgsSchema: z.ZodType<Prisma.CustomerUpdateManyArgs> = z.object({
  data: z.union([ CustomerUpdateManyMutationInputSchema, CustomerUncheckedUpdateManyInputSchema ]),
  where: CustomerWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CustomerUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CustomerUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CustomerUpdateManyMutationInputSchema, CustomerUncheckedUpdateManyInputSchema ]),
  where: CustomerWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CustomerDeleteManyArgsSchema: z.ZodType<Prisma.CustomerDeleteManyArgs> = z.object({
  where: CustomerWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProductCreateArgsSchema: z.ZodType<Prisma.ProductCreateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductCreateInputSchema, ProductUncheckedCreateInputSchema ]),
}).strict();

export const ProductUpsertArgsSchema: z.ZodType<Prisma.ProductUpsertArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema, 
  create: z.union([ ProductCreateInputSchema, ProductUncheckedCreateInputSchema ]),
  update: z.union([ ProductUpdateInputSchema, ProductUncheckedUpdateInputSchema ]),
}).strict();

export const ProductCreateManyArgsSchema: z.ZodType<Prisma.ProductCreateManyArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema, ProductCreateManyInputSchema.array() ]),
}).strict();

export const ProductCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema, ProductCreateManyInputSchema.array() ]),
}).strict();

export const ProductDeleteArgsSchema: z.ZodType<Prisma.ProductDeleteArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const ProductUpdateArgsSchema: z.ZodType<Prisma.ProductUpdateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductUpdateInputSchema, ProductUncheckedUpdateInputSchema ]),
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const ProductUpdateManyArgsSchema: z.ZodType<Prisma.ProductUpdateManyArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema, ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProductUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema, ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProductDeleteManyArgsSchema: z.ZodType<Prisma.ProductDeleteManyArgs> = z.object({
  where: ProductWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CompanyProfileCreateArgsSchema: z.ZodType<Prisma.CompanyProfileCreateArgs> = z.object({
  select: CompanyProfileSelectSchema.optional(),
  include: CompanyProfileIncludeSchema.optional(),
  data: z.union([ CompanyProfileCreateInputSchema, CompanyProfileUncheckedCreateInputSchema ]),
}).strict();

export const CompanyProfileUpsertArgsSchema: z.ZodType<Prisma.CompanyProfileUpsertArgs> = z.object({
  select: CompanyProfileSelectSchema.optional(),
  include: CompanyProfileIncludeSchema.optional(),
  where: CompanyProfileWhereUniqueInputSchema, 
  create: z.union([ CompanyProfileCreateInputSchema, CompanyProfileUncheckedCreateInputSchema ]),
  update: z.union([ CompanyProfileUpdateInputSchema, CompanyProfileUncheckedUpdateInputSchema ]),
}).strict();

export const CompanyProfileCreateManyArgsSchema: z.ZodType<Prisma.CompanyProfileCreateManyArgs> = z.object({
  data: z.union([ CompanyProfileCreateManyInputSchema, CompanyProfileCreateManyInputSchema.array() ]),
}).strict();

export const CompanyProfileCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CompanyProfileCreateManyAndReturnArgs> = z.object({
  data: z.union([ CompanyProfileCreateManyInputSchema, CompanyProfileCreateManyInputSchema.array() ]),
}).strict();

export const CompanyProfileDeleteArgsSchema: z.ZodType<Prisma.CompanyProfileDeleteArgs> = z.object({
  select: CompanyProfileSelectSchema.optional(),
  include: CompanyProfileIncludeSchema.optional(),
  where: CompanyProfileWhereUniqueInputSchema, 
}).strict();

export const CompanyProfileUpdateArgsSchema: z.ZodType<Prisma.CompanyProfileUpdateArgs> = z.object({
  select: CompanyProfileSelectSchema.optional(),
  include: CompanyProfileIncludeSchema.optional(),
  data: z.union([ CompanyProfileUpdateInputSchema, CompanyProfileUncheckedUpdateInputSchema ]),
  where: CompanyProfileWhereUniqueInputSchema, 
}).strict();

export const CompanyProfileUpdateManyArgsSchema: z.ZodType<Prisma.CompanyProfileUpdateManyArgs> = z.object({
  data: z.union([ CompanyProfileUpdateManyMutationInputSchema, CompanyProfileUncheckedUpdateManyInputSchema ]),
  where: CompanyProfileWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CompanyProfileUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CompanyProfileUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CompanyProfileUpdateManyMutationInputSchema, CompanyProfileUncheckedUpdateManyInputSchema ]),
  where: CompanyProfileWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CompanyProfileDeleteManyArgsSchema: z.ZodType<Prisma.CompanyProfileDeleteManyArgs> = z.object({
  where: CompanyProfileWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const QuoteCreateArgsSchema: z.ZodType<Prisma.QuoteCreateArgs> = z.object({
  select: QuoteSelectSchema.optional(),
  include: QuoteIncludeSchema.optional(),
  data: z.union([ QuoteCreateInputSchema, QuoteUncheckedCreateInputSchema ]),
}).strict();

export const QuoteUpsertArgsSchema: z.ZodType<Prisma.QuoteUpsertArgs> = z.object({
  select: QuoteSelectSchema.optional(),
  include: QuoteIncludeSchema.optional(),
  where: QuoteWhereUniqueInputSchema, 
  create: z.union([ QuoteCreateInputSchema, QuoteUncheckedCreateInputSchema ]),
  update: z.union([ QuoteUpdateInputSchema, QuoteUncheckedUpdateInputSchema ]),
}).strict();

export const QuoteCreateManyArgsSchema: z.ZodType<Prisma.QuoteCreateManyArgs> = z.object({
  data: z.union([ QuoteCreateManyInputSchema, QuoteCreateManyInputSchema.array() ]),
}).strict();

export const QuoteCreateManyAndReturnArgsSchema: z.ZodType<Prisma.QuoteCreateManyAndReturnArgs> = z.object({
  data: z.union([ QuoteCreateManyInputSchema, QuoteCreateManyInputSchema.array() ]),
}).strict();

export const QuoteDeleteArgsSchema: z.ZodType<Prisma.QuoteDeleteArgs> = z.object({
  select: QuoteSelectSchema.optional(),
  include: QuoteIncludeSchema.optional(),
  where: QuoteWhereUniqueInputSchema, 
}).strict();

export const QuoteUpdateArgsSchema: z.ZodType<Prisma.QuoteUpdateArgs> = z.object({
  select: QuoteSelectSchema.optional(),
  include: QuoteIncludeSchema.optional(),
  data: z.union([ QuoteUpdateInputSchema, QuoteUncheckedUpdateInputSchema ]),
  where: QuoteWhereUniqueInputSchema, 
}).strict();

export const QuoteUpdateManyArgsSchema: z.ZodType<Prisma.QuoteUpdateManyArgs> = z.object({
  data: z.union([ QuoteUpdateManyMutationInputSchema, QuoteUncheckedUpdateManyInputSchema ]),
  where: QuoteWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const QuoteUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.QuoteUpdateManyAndReturnArgs> = z.object({
  data: z.union([ QuoteUpdateManyMutationInputSchema, QuoteUncheckedUpdateManyInputSchema ]),
  where: QuoteWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const QuoteDeleteManyArgsSchema: z.ZodType<Prisma.QuoteDeleteManyArgs> = z.object({
  where: QuoteWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const QuoteItemCreateArgsSchema: z.ZodType<Prisma.QuoteItemCreateArgs> = z.object({
  select: QuoteItemSelectSchema.optional(),
  include: QuoteItemIncludeSchema.optional(),
  data: z.union([ QuoteItemCreateInputSchema, QuoteItemUncheckedCreateInputSchema ]),
}).strict();

export const QuoteItemUpsertArgsSchema: z.ZodType<Prisma.QuoteItemUpsertArgs> = z.object({
  select: QuoteItemSelectSchema.optional(),
  include: QuoteItemIncludeSchema.optional(),
  where: QuoteItemWhereUniqueInputSchema, 
  create: z.union([ QuoteItemCreateInputSchema, QuoteItemUncheckedCreateInputSchema ]),
  update: z.union([ QuoteItemUpdateInputSchema, QuoteItemUncheckedUpdateInputSchema ]),
}).strict();

export const QuoteItemCreateManyArgsSchema: z.ZodType<Prisma.QuoteItemCreateManyArgs> = z.object({
  data: z.union([ QuoteItemCreateManyInputSchema, QuoteItemCreateManyInputSchema.array() ]),
}).strict();

export const QuoteItemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.QuoteItemCreateManyAndReturnArgs> = z.object({
  data: z.union([ QuoteItemCreateManyInputSchema, QuoteItemCreateManyInputSchema.array() ]),
}).strict();

export const QuoteItemDeleteArgsSchema: z.ZodType<Prisma.QuoteItemDeleteArgs> = z.object({
  select: QuoteItemSelectSchema.optional(),
  include: QuoteItemIncludeSchema.optional(),
  where: QuoteItemWhereUniqueInputSchema, 
}).strict();

export const QuoteItemUpdateArgsSchema: z.ZodType<Prisma.QuoteItemUpdateArgs> = z.object({
  select: QuoteItemSelectSchema.optional(),
  include: QuoteItemIncludeSchema.optional(),
  data: z.union([ QuoteItemUpdateInputSchema, QuoteItemUncheckedUpdateInputSchema ]),
  where: QuoteItemWhereUniqueInputSchema, 
}).strict();

export const QuoteItemUpdateManyArgsSchema: z.ZodType<Prisma.QuoteItemUpdateManyArgs> = z.object({
  data: z.union([ QuoteItemUpdateManyMutationInputSchema, QuoteItemUncheckedUpdateManyInputSchema ]),
  where: QuoteItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const QuoteItemUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.QuoteItemUpdateManyAndReturnArgs> = z.object({
  data: z.union([ QuoteItemUpdateManyMutationInputSchema, QuoteItemUncheckedUpdateManyInputSchema ]),
  where: QuoteItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const QuoteItemDeleteManyArgsSchema: z.ZodType<Prisma.QuoteItemDeleteManyArgs> = z.object({
  where: QuoteItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();