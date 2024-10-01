import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .required();

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();
