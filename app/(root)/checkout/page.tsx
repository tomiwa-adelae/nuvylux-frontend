"use client";

import React, { useEffect, useTransition } from "react";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/store/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn, formatMoneyInput } from "@/lib/utils";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { IconCreditCard, IconLock, IconTruck } from "@tabler/icons-react";
import { Loader } from "@/components/Loader";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/PageHeader";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/PhoneNumberInput";
import * as RPNInput from "react-phone-number-input";
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
import { CheckoutFormSchema, CheckoutFormSchemaType } from "@/lib/zodSchemas";
import { CurrencyIcon } from "@/components/CurrencyIcon";

const PAYMENT_METHODS = [
  {
    value: "online",
    label: "Pay Online",
    description: "Card, bank transfer & more",
    icon: IconCreditCard,
  },
  {
    value: "pay_on_delivery",
    label: "Pay on Delivery",
    description: "Cash when it arrives",
    icon: IconTruck,
  },
] as const;

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // 1. Initialize Form
  const form = useForm<CheckoutFormSchemaType>({
    // @ts-ignore
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phoneNumber || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      customerNote: "",
      paymentMethod: "online",
    },
  });

  // 2. Update form if user data loads late
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phoneNumber,
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        paymentMethod: "online",
      });
    }
  }, [user, form]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const deliveryFee = 15;
  const total = subtotal + deliveryFee;

  // 3. Handle Submit
  async function onSubmit(values: CheckoutFormSchemaType) {
    if (!user) {
      toast.error("Please login to complete purchase");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          ...values,
          customerNote: values.customerNote,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
          totalAmount: total,
        };

        const { data } = await api.post("/orders", payload);
        clearCart();
        toast.success("Order placed successfully");
        router.push(`/orders/success/${data.order.orderNumber}`);
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? "Checkout failed");
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <PageHeader back title={"Checkout"} />

      {/* Main Form Wrapper */}
      <Form {...form}>
        <form
          // @ts-ignore
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2"
        >
          {/* LEFT: Shipping Details */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-none">
              <CardHeader className="p-0">
                <CardTitle className="uppercase">
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    // @ts-ignore
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    // @ts-ignore
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  // @ts-ignore
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone</FormLabel>
                      <FormControl>
                        <RPNInput.default
                          className="flex rounded-md shadow-xs"
                          international
                          flagComponent={FlagComponent}
                          countrySelectComponent={CountrySelect}
                          inputComponent={PhoneInput}
                          placeholder="+2348012345679"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  // @ts-ignore
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="House number and street name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    // @ts-ignore
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Lagos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    // @ts-ignore
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Lagos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  // @ts-ignore
                  control={form.control}
                  name="customerNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Note (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special instructions?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card className="border-none shadow-none gap-2">
              <CardHeader className="p-0">
                <CardTitle className="uppercase">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <FormField
                  // @ts-ignore
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {PAYMENT_METHODS.map((method) => {
                            const Icon = method.icon;
                            const selected = field.value === method.value;
                            return (
                              <button
                                key={method.value}
                                type="button"
                                onClick={() => field.onChange(method.value)}
                                className={cn(
                                  "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                                  selected
                                    ? "border-primary bg-primary/5"
                                    : "border-input hover:border-primary/40",
                                )}
                              >
                                <div
                                  className={cn(
                                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                                    selected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground",
                                  )}
                                >
                                  <Icon className="size-4" />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">
                                    {method.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {method.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Card>
              <CardHeader>
                <CardTitle className="uppercase">Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right font-semibold text-sm">
                      <CurrencyIcon currency="NGN" />{" "}
                      {formatMoneyInput(item.price * item.quantity)}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      <CurrencyIcon currency="NGN" />{" "}
                      {formatMoneyInput(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      <CurrencyIcon currency="NGN" />{" "}
                      {formatMoneyInput(deliveryFee)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    <CurrencyIcon currency="NGN" /> {formatMoneyInput(total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? (
                <Loader text="Processing..." />
              ) : (
                <>
                  <IconLock /> Place Order
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutPage;
