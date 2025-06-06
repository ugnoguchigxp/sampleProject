import { z } from 'zod';

export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  fruit: z.string().optional(), // 追加
});

export type PersonalInfoForm = z.infer<typeof personalInfoSchema>;
