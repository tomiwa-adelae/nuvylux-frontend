import { contactFormSubjects } from "@/constants";
import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  phoneNumber: z
    .string()
    .regex(/^(\+?\d{10,15})$/, { message: "Enter a valid phone number." }),
  subject: z.string().min(2, { message: "Please select a subject" }),
  message: z.string().min(2, { message: "Message is required" }),
});
export type ContactFormSchemaType = z.infer<typeof contactFormSchema>;
