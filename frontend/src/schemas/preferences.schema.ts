import { z } from 'zod';

export const preferencesSchema = z.object({
  notifications: z.boolean(),
  fruit: z.enum(['apple', 'banana', 'orange', 'grape', 'melon', 'other'], { required_error: '好きな果物を選択してください' }),
  favoriteColor: z.string().min(1, 'Favorite color is required'),
  feedback: z.string().min(10, 'Please provide at least 10 characters'),
  satisfaction: z.enum(['very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied']),
  improvement: z.string().optional(),
});

export type PreferencesForm = z.infer<typeof preferencesSchema>;
