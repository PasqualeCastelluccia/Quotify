import { QuoteItem } from "@/lib/generated/zod"
export type { QuoteItem } from '@/lib/generated/zod'
export type QuoteItemUI = Omit<QuoteItem, 'createdAt' | 'updatedAt' | 'quoteId' | 'ordering' | 'vatRate' | 'vatAmount'>