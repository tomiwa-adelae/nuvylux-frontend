"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VerifyCodeSchema, VerifyCodeSchemaType } from "@/lib/zodSchemas";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Loader } from "@/components/Loader";
import { cn, formatTime, maskEmail } from "@/lib/utils";
import { IconRefreshDot } from "@tabler/icons-react";
import { OTPInput, SlotProps } from "input-otp";

interface Props {
  email: string;
}

export function VerifyCodeForm({ email }: Props) {
  const [pending, startTransition] = useTransition();
  const [resendPending, startResendTransition] = useTransition();

  const [timeLeft, setTimeLeft] = useState(20); // 3 minutes = 180 seconds
  const [isCounting, setIsCounting] = useState(true);

  // Start the countdown
  useEffect(() => {
    if (!isCounting) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCounting]);

  const form = useForm<VerifyCodeSchemaType>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });

  const handleResendCode = () => {
    // startResendTransition(async () => {
    //   try {
    //     const res = await api.post("/auth/forgot-password", { email });
    //     // setUser(res.data.user);
    //     toast.success(res.data.message);
    //     setTimeLeft(180);
    //     setIsCounting(true);
    //   } catch (error: any) {
    //     toast.error(error.response.data.message);
    //   }
    // });
  };

  function onSubmit(data: VerifyCodeSchemaType) {}

  return (
    <div className="">
      <div className="text-center mb-4">
        <h1 className="text-3xl lg:text-4xl mb-4 font-medium text-center">
          Verify code
        </h1>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit verification code to{" "}
          <span className="font-medium">{maskEmail(email)}</span>
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center w-full block">
                  Enter code
                </FormLabel>
                <FormControl>
                  <OTPInput
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);

                      // Automatically submit when length === 6
                      if (value.length === 6) {
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    containerClassName="flex items-center justify-center gap-3 has-disabled:opacity-50"
                    maxLength={6}
                    render={({ slots }) => (
                      <div className="flex gap-2">
                        {slots.map((slot, idx) => (
                          <Slot key={idx} {...slot} />
                        ))}
                      </div>
                    )}
                  />
                </FormControl>
                <FormMessage className="w-full block text-center text-xs" />
              </FormItem>
            )}
          />
          <Button disabled={pending} className="w-full" type="submit">
            {pending ? <Loader text="Verifying..." /> : "Verify Code"}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              Or
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm text-center">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              onClick={handleResendCode}
              className="w-full"
              variant={"outline"}
              disabled={resendPending || pending || isCounting}
            >
              {resendPending ? (
                <Loader text="Resending..." />
              ) : (
                <>
                  <IconRefreshDot />
                  Resend code
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Available in {formatTime(timeLeft)}
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-muted text-foreground flex size-14 items-center justify-center rounded-md border font-medium shadow-xs transition-[color,box-shadow]",
        { "border-ring ring-ring/50 z-10 ring-[1px]": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
