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

export const LoginFormSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export const RegisterFormSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email().min(2, {
      message: "Email must be at least 2 characters.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number.",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      message: "You must accept the Terms of Service and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 attach the error to confirmPassword
  });

export const forgotPasswordFormSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
});

export const resetPasswordFormSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter.",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number.",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must contain at least one special character.",
    }),
  token: z.string().min(2, {
    message: "Token must be at least 2 characters.",
  }),
});

export const VerifyCodeSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  otp: z
    .string()
    .min(6, {
      message: "Code must be 6 characters.",
    })
    .max(6, { message: "Code must be 6 characters" }),
});

export const NewPasswordSchema = z
  .object({
    otp: z
      .string()
      .min(6, {
        message: "Code must be 6 characters.",
      })
      .max(6, { message: "Code must be 6 characters" }),
    email: z.string().email().min(2, {
      message: "Email must be at least 2 characters.",
    }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number.",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(2, { message: "Enter your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 attach the error to confirmPassword
  });

export const OnboardingProfileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be selected" }),
  country: z.string().min(2, { message: "Country must be selected" }),
  image: z.string().optional(),
  dob: z.any().optional(),
  gender: z.string().optional(),
  phoneNumber: z
    .string()
    .min(7, "Phone number required")
    .optional()
    .or(z.literal("")), // allow blank but treat as invalid
});

export const BrandOnboardingFormSchema = z.object({
  brandName: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  brandType: z.string().min(2, {
    message: "Brand type must be selected.",
  }),
  description: z.string().optional(),
  brandLogo: z.string().optional(),
  brandColor: z.string().min(4).max(9).default("#2D7EF1"),
  website: z.string().url().optional().or(z.literal("")),
  socialLinks: z
    .array(
      z.object({
        url: z.string().url({ message: "Please enter a valid URL" }),
      })
    )
    .optional(), // makes the whole field optional
});

export const AddProductFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),

  // Pricing
  price: z.string().min(1, "Price is required"),
  compareAtPrice: z.string().optional(), // For "Sale" price display

  // Inventory
  sku: z.string().min(1, "SKU is required"),
  stock: z.string().min(1, "Stock quantity is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),

  // Content
  shortDescription: z.string().max(160, "Keep it short for SEO"),
  description: z.string().min(10, "Description is required"),

  // Media
  thumbnail: z.string().min(1, "Thumbnail is required"),

  // Variants
  availableColors: z.array(z.any()).optional(),
  sizes: z.array(z.string()).optional(),

  // Meta
  // isFeatured: z.boolean().default(false),
  images: z
    .array(z.string())
    .min(1, "At least one gallery image is required")
    .max(5, "You can only upload up to 5 images"),
});

// export const AddProductFormSchema = z.object({
//   name: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),
//   category: z.string().min(2, {
//     message: "Category must be selected.",
//   }),
//   shortDescription: z.string().optional(),
//   description: z.string().min(2, {
//     message: "Description is required.",
//   }),
//   brandId: z.string().min(2, { message: "Brand is required" }),
//   price: z
//     .string()
//     .min(2, {
//       message: "Price must be at least 1000 naira.",
//     })
//     .regex(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/, "Invalid price format"),
//   currency: z.enum(["NGN", "USD", "EUR", "GBP"]).default("NGN"),
//   stock: z.string().optional(),
//   images: z.any().optional(),
//   thumbnail: z.any(),
//   availableColors: z.any(),
//   sizes: z.array(z.string()).min(1, {
//     message: "Please select at least one size.",
//   }),
// });

export type AddProductFormSchemaType = z.infer<typeof AddProductFormSchema>;
export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
export type RegisterFormSchemaType = z.infer<typeof RegisterFormSchema>;
export type ContactFormSchemaType = z.infer<typeof contactFormSchema>;
export type ForgotPasswordFormSchemaType = z.infer<
  typeof forgotPasswordFormSchema
>;
export type ResetPasswordFormSchemaType = z.infer<
  typeof resetPasswordFormSchema
>;
export type VerifyCodeSchemaType = z.infer<typeof VerifyCodeSchema>;
export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
export type OnboardingProfileFormSchemaType = z.infer<
  typeof OnboardingProfileFormSchema
>;
export type BrandOnboardingFormSchemaType = z.infer<
  typeof BrandOnboardingFormSchema
>;
