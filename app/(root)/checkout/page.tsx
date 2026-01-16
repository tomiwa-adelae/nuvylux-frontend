// "use client";

// import React, { useState, useTransition } from "react";
// import { useCart } from "@/store/useCart";
// import { useAuth } from "@/store/useAuth";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { NairaIcon } from "@/components/NairaIcon";
// import { formatMoneyInput } from "@/lib/utils";
// import api from "@/lib/api";
// import { useRouter } from "next/navigation";
// import { IconCheck, IconArrowLeft, IconLock } from "@tabler/icons-react";
// import { Loader } from "@/components/Loader";
// import Image from "next/image";
// import { Separator } from "@/components/ui/separator";
// import { PageHeader } from "@/components/PageHeader";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { CheckoutFormSchema, CheckoutFormSchemaType } from "@/lib/zodSchemas";
// const CheckoutPage = () => {
//   const { items, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();

//    const [pending, startTransition] = useTransition();

//     const form = useForm<CheckoutFormSchemaType>({
//       resolver: zodResolver(CheckoutFormSchema),
//       defaultValues: {
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//         acceptTerms: false as any,
//       },
//     });

//   const subtotal = items.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );
//   const deliveryFee = 15;
//   const discount = 0; // Add coupon logic later
//   const total = subtotal + deliveryFee - discount;

//     function onSubmit(data: CheckoutFormSchemaType) {
//        if (!user) {
//       toast.error("Please login to complete purchase");
//       return;
//     }

//     startTransition(async () => {
//       try {
//         const formData = new FormData(e.currentTarget);

//         const payload = {
//           firstName: formData.get("firstName") as string,
//           lastName: formData.get("lastName") as string,
//           phone: formData.get("phone") as string,
//           address: formData.get("address") as string,
//           city: formData.get("city") as string,
//           state: formData.get("state") as string,
//           customerNote: (formData.get("customerNote") as string) || undefined,
//           items: items.map((item) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price,
//             size: item.size,
//             color: item.color,
//           })),
//           totalAmount: total,
//         };

//         const { data } = await api.post("/orders", payload);

//         clearCart();
//         toast.success("Order placed successfully");
//         router.push(`/orders/success/${data.order.id}`);
//       } catch (err: any) {
//         toast.error(err?.response?.data?.message ?? "Checkout failed");
//       }
//     });
//     }

//   if (items.length === 0) {
//     return (
//       <div className="container py-32 text-center">
//         <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
//         <Button onClick={() => router.push("/products")}>
//           Continue Shopping
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-12 max-w-7xl">
//       <PageHeader back title={"Checkout"} />

//       <form
//         onSubmit={handleCheckout}
//         className="grid grid-cols-1 lg:grid-cols-3 gap-8"
//       >
//         {/* LEFT: Shipping Details */}
//         <div className="lg:col-span-2 space-y-6 mt-4">
//           <Card className="border-none shadow-none p-0">
//             <CardHeader className="p-0">
//               <CardTitle className="uppercase">Shipping Information</CardTitle>
//             </CardHeader>
//             <CardContent className="p-0 space-y-6">
//                <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                         <FormField
//                           control={form.control}
//                           name="firstName"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>First name</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="John" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         /></div></form></Form>
//               {/* Name */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium uppercase tracking-wide">
//                     First Name *
//                   </label>
//                   <Input
//                     name="firstName"
//                     defaultValue={user?.firstName}
//
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium uppercase tracking-wide">
//                     Last Name *
//                   </label>
//                   <Input
//                     name="lastName"
//                     defaultValue={user?.lastName}
//
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Phone */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium uppercase tracking-wide">
//                   Phone Number *
//                 </label>
//                 <Input
//                   name="phone"
//                   type="tel"
//                   placeholder="080..."
//                   defaultValue={user?.phoneNumber}
//
//                   required
//                 />
//               </div>

//               {/* Address */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium uppercase tracking-wide">
//                   Street Address *
//                 </label>
//                 <Input
//                   name="address"
//                   placeholder="House number and street name"
//                   defaultValue={user?.address || ""}
//
//                   required
//                 />
//               </div>

//               {/* City & State */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium uppercase tracking-wide">
//                     City *
//                   </label>
//                   <Input
//                     name="city"
//                     placeholder="e.g., Lagos"
//                     defaultValue={user?.city || ""}
//
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium uppercase tracking-wide">
//                     State *
//                   </label>
//                   <Input
//                     name="state"
//                     placeholder="e.g., Lagos"
//                     defaultValue={user?.state || ""}
//
//                     required
//                   />
//                 </div>
//               </div>

//               {/* CustomerNote */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium uppercase tracking-wide">
//                   Order CustomerNote{" "}
//                   <span className="text-neutral-400 normal-case">
//                     (Optional)
//                   </span>
//                 </label>
//                 <Textarea
//                   name="customerNote"
//                   placeholder="Any special instructions for delivery?"
//                   className="rounded-xl resize-none"
//                   rows={3}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* RIGHT: Order Summary */}
//         <div className="space-y-6">
//           {/* Order Items */}
//           <Card className="border-neutral-200">
//             <CardHeader>
//               <CardTitle className="text-xl font-light tracking-wider uppercase">
//                 Your Order
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {items.map((item) => (
//                 <div key={item.id} className="flex gap-3">
//                   <div className="relative w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
//                     <Image
//                       src={item.image}
//                       alt={item.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-sm truncate">{item.name}</p>
//                     <p className="text-xs text-neutral-500">
//                       {item.size && `Size: ${item.size}`}
//                       {item.size && item.color && " • "}
//                       {item.color && `Color: ${item.color}`}
//                     </p>
//                     <p className="text-xs text-neutral-500">
//                       Qty: {item.quantity}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold text-sm">
//                       <NairaIcon />{" "}
//                       {formatMoneyInput(item.price * item.quantity)}
//                     </p>
//                   </div>
//                 </div>
//               ))}

//               <Separator />

//               {/* Totals */}
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-neutral-600">Subtotal</span>
//                   <span className="font-medium">
//                     <NairaIcon /> {formatMoneyInput(subtotal)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-neutral-600">Delivery Fee</span>
//                   <span className="font-medium">
//                     <NairaIcon /> {formatMoneyInput(deliveryFee)}
//                   </span>
//                 </div>
//                 {discount > 0 && (
//                   <div className="flex justify-between text-red-600">
//                     <span>Discount</span>
//                     <span className="font-medium">
//                       - <NairaIcon /> {formatMoneyInput(discount)}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <Separator />

//               <div className="flex justify-between text-lg font-bold">
//                 <span>Total</span>
//                 <span>
//                   <NairaIcon /> {formatMoneyInput(total)}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Submit Button */}
//           <Button
//             type="submit"
//             disabled={pending}
//             className="w-full h-14 text-base font-light tracking-[0.2em] uppercase rounded-full bg-black hover:bg-black/90"
//           >
//             {pending ? (
//               <Loader text="Processing..." />
//             ) : (
//               <>
//                 <IconLock size={18} className="mr-2" />
//                 Place Order
//               </>
//             )}
//           </Button>

//           {/* Security Badge */}
//           <p className="text-xs text-center text-neutral-500 flex items-center justify-center gap-2">
//             <IconLock size={14} />
//             Secure checkout powered by NUVYLUX
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CheckoutPage;

"use client";

import React, { useEffect, useTransition } from "react";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/store/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NairaIcon } from "@/components/NairaIcon";
import { formatMoneyInput } from "@/lib/utils";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { IconLock } from "@tabler/icons-react";
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

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // 1. Initialize Form
  const form = useForm<CheckoutFormSchemaType>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phoneNumber || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      customerNote: "",
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
      });
    }
  }, [user, form]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
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
        router.push(`/orders/success/${data.order.id}`);
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
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2"
        >
          {/* LEFT: Shipping Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-none">
              <CardHeader className="p-0">
                <CardTitle className="uppercase">
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
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
                  control={form.control}
                  name="customerNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order CustomerNote (Optional)</FormLabel>
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
                      <NairaIcon />{" "}
                      {formatMoneyInput(item.price * item.quantity)}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      <NairaIcon /> {formatMoneyInput(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      <NairaIcon /> {formatMoneyInput(deliveryFee)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    <NairaIcon /> {formatMoneyInput(total)}
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
