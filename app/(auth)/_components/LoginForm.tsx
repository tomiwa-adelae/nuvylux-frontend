"use client";

import React, { Suspense, useEffect, useState, useTransition } from "react";
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
import { LoginFormSchema, LoginFormSchemaType } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import {
  IconBrandApple,
  IconBrandGoogle,
  IconBrandTwitter,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { Loader } from "@/components/Loader";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();

  const setUser = useAuth((s) => s.setUser);
  const [pending, startTransition] = useTransition();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post("/auth/login", data);

        setUser(res?.data?.user);
        toast.success(res?.data?.message);

        const redirectUrl = new URLSearchParams(window.location.search).get(
          "redirect",
        );
        const loggedInUser = res?.data?.user;
        if (!loggedInUser?.onboardingCompleted) {
          router.push("/onboarding");
        } else if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          const role = loggedInUser?.role;
          if (role === "ADMINISTRATOR") {
            router.push("/admin");
          } else if (role === "PROFESSIONAL" || role === "BRAND") {
            router.push("/dashboard");
          } else {
            router.push("/explore");
          }
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Internal server error");
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    type={isVisible ? "text" : "password"}
                    placeholder="Enter your password"
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
            </FormItem>
          )}
        />
        <p className="text-sm font-medium text-primary hover:text-primary hover:underline">
          <Link href="/forgot-password">Forgotten password?</Link>
        </p>
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          type="submit"
          disabled={pending}
        >
          {pending ? <Loader text="Loading..." /> : "Login"}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            or
          </span>
        </div>
        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link className="text-primary hover:underline" href={"/register"}>
            Register
          </Link>
        </p>
        <div className="hidden space-y-2">
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
