"use client";

import React, {
  Suspense,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterFormSchema, RegisterFormSchemaType } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import {
  IconBrandApple,
  IconBrandGoogle,
  IconBrandTwitter,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconX,
} from "@tabler/icons-react";
import { Loader } from "@/components/Loader";
import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export const RegisterForm = () => {
  const [pending, startTransition] = useTransition();

  const form = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      acceptTerms: false as any,
    },
  });

  const password = form.watch("password");
  const acceptTerms = form.watch("acceptTerms");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setConfirmIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const toggleConfirmVisibility = () =>
    setConfirmIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: "At least 1 special character",
      },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  function onSubmit(data: RegisterFormSchemaType) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="pe-9"
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                    {...field}
                  />
                  <Button
                    className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                    variant={"ghost"}
                    size="icon"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls="password"
                  >
                    {isVisible ? (
                      <IconEyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <IconEye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
              <div
                className={cn(
                  password.length !== 0 ? "block mt-2 space-y-3" : "hidden"
                )}
              >
                <Progress
                  value={(strengthScore / 5) * 100}
                  className={cn("h-1")}
                />
                {/* Password strength description */}
                <p className="text-foreground mb-2 text-sm font-medium">
                  {getStrengthText(strengthScore)}. Must contain:
                </p>

                {/* Password requirements list */}
                <ul className="space-y-1.5" aria-label="Password requirements">
                  {strength.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {req.met ? (
                        <IconCheck
                          size={16}
                          className="text-emerald-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <IconX
                          size={16}
                          className="text-muted-foreground/80"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`text-xs ${
                          req.met ? "text-emerald-600" : "text-muted-foreground"
                        }`}
                      >
                        {req.text}
                        <span className="sr-only">
                          {req.met
                            ? " - Requirement met"
                            : " - Requirement not met"}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={isConfirmVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                  />
                  <Button
                    className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                    variant={"ghost"}
                    size="icon"
                    type="button"
                    onClick={toggleConfirmVisibility}
                    // FIX: Use isConfirmVisible for accessibility label
                    aria-label={
                      isConfirmVisible ? "Hide password" : "Show password"
                    }
                    aria-pressed={isConfirmVisible}
                    aria-controls="password"
                  >
                    {isConfirmVisible ? ( // FIX: Use isConfirmVisible for icon
                      <IconEyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <IconEye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-0 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <label htmlFor="terms" className="text-sm leading-relaxed">
                  I confirm that I have read and agree to the{" "}
                  <Link
                    href="/terms-of-service"
                    className="text-primary hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          type="submit"
          disabled={pending}
        >
          {pending ? <Loader text="Loading..." /> : "Register"}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            or
          </span>
        </div>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link className="text-primary hover:underline" href={"/login"}>
            Login
          </Link>
        </p>
        <div className="space-y-2">
          <Button className="w-full" type="button" variant={"outline"}>
            <Image
              src="/assets/icons/google.svg"
              alt="Google icon"
              width={20}
              height={20}
            />
            Continue with Google
          </Button>
          <Button className="w-full" type="button" variant={"outline"}>
            <IconBrandApple className="size-6" />
            Continue with Apple
          </Button>
          <Button className="w-full" type="button" variant={"outline"}>
            <IconBrandTwitter className="size-5" />
            Continue with Twitter
          </Button>
        </div>
      </form>
    </Form>
  );
};
