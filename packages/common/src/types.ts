import { z } from "zod";

export const signupSchema = z.object({
  email: z.email().min(5).max(100),
  password: z.string().min(6).max(100),
  name: z.string().min(3).max(50),
});

export type SignUpInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const roomSchema = z.object({
  slug: z.string().min(3).max(50),
  userId: z.string(),
});

export type RoomSchema = z.infer<typeof roomSchema>;

export const chatInputSchema = z.object({
  message: z.string().max(100),
});

export type ChatInput = z.infer<typeof chatInputSchema>;
