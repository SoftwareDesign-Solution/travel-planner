import { z } from 'zod';

export const userSchema = z.object({
    id: z.number(),
    email: z.email(),
    firstname: z.string(),
    lastname: z.string(),
});

export const authenticatedSchema = z.object({
  user: userSchema,
  access_token: z.string().trim().min(1),
})

export const loginSchema = z.object({
  email: z
    .email("Bitte eine gültige E-Mail-Adresse eingeben"),

  password: z
    .string()
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein"),
});

export const registerSchema = loginSchema.extend({
  firstname: z
    .string()
    .trim()
    .min(2, "Bitte einen Vornamen eingeben"),

  lastname: z
    .string()
    .trim()
    .min(2, "Bitte einen Nachnamen eingeben"),

});

export const registerFormSchema = registerSchema.extend({
    passwordConfirmation: z.string(),
}).refine(
    (data) => data.password === data.passwordConfirmation,
    {
        message: "Die Passwörter stimmen nicht überein",
        path: ["passwordConfirmation"],
    },
);

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: userSchema,
});

export type User = z.infer<typeof userSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;

export type RegisterRequestData = Omit<
  RegisterData,
  "passwordConfirmation"
>;