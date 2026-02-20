import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

export const listTaskQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["completed", "pending"]).optional(),
  search: z.string().optional(),
});
