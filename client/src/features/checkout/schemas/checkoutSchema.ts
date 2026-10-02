import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid 10-digit phone number')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid postal / PIN code is required'),
  country: z.string().default('India'),
  paymentMethod: z.enum(['COD', 'Card', 'UPI', 'NetBanking']).default('COD'),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
