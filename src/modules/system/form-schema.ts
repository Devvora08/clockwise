import { z } from 'zod'

export const createSystemSchema = z.object({
  name: z.string().min(1, "System name is required"),
  passkey: z.number().int().min(1000).max(9999),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
   address: z.string().min(1, "Address is required"), // Add the address field
})

export type createSystemSchemaType = z.infer<typeof createSystemSchema>
