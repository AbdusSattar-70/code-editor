import { z } from "zod";
import { RoleEnum } from "@/lib/constants";

const dateTransform = z.number().transform((val) => new Date(val));

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().nullable().optional(),
  role: z.enum(RoleEnum).default(RoleEnum[2]),
  groupId: z.string().default(""),
  createdAt: dateTransform,
  updatedAt: dateTransform,
});
