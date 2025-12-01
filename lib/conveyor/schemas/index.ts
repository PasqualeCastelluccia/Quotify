import { z } from 'zod'
import { windowIpcSchema } from './window-schema'
import { appIpcSchema } from './app-schema'
import { customersIpcSchema } from './customers-schema'
import { quotesIpcSchema } from './quotes-schema'
import { productsIpcSchema } from './products-schema'
import { importIpcSchema } from './import-schema'
import { pdfIpcSchema } from './pdf-schema'
import { profilesIpcSchema } from './profiles-schema'
import { emailIpcSchema } from './email-schema'

export const ipcSchemas = {
  ...windowIpcSchema,
  ...appIpcSchema,
  ...customersIpcSchema,
  ...quotesIpcSchema,
  ...productsIpcSchema,
  ...importIpcSchema,
  ...pdfIpcSchema,
  ...profilesIpcSchema,
  ...emailIpcSchema,
} as const

// Extract types from Zod schemas
export type IPCChannels = {
  [K in keyof typeof ipcSchemas]: {
    args: z.infer<(typeof ipcSchemas)[K]['args']>
    return: z.infer<(typeof ipcSchemas)[K]['return']>
  }
}

export type ChannelName = keyof typeof ipcSchemas
export type ChannelArgs<T extends ChannelName> = IPCChannels[T]['args']
export type ChannelReturn<T extends ChannelName> = IPCChannels[T]['return']

// Runtime validation helpers
export const validateArgs = <T extends ChannelName>(channel: T, args: unknown[]): ChannelArgs<T> => {
  return ipcSchemas[channel].args.parse(args) as ChannelArgs<T>
}

export const validateReturn = <T extends ChannelName>(channel: T, data: unknown): ChannelReturn<T> => {
  return ipcSchemas[channel].return.parse(data) as ChannelReturn<T>
}
