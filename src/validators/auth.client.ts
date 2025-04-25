// src/validators/auth.client.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(1, "Nom requis"),
    confirm: z.string().min(1, "Confirmation requise"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirm"],
  });
