import { z } from "zod";


export const AuthCredentialsValidator = z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
  });

  export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>;