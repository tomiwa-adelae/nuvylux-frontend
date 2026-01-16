"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  IconMinus,
  IconPlus,
  IconTrash,
  IconArrowRight,
  IconTicket,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NairaIcon } from "@/components/NairaIcon";
import { formatMoneyInput } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/store/useCart";
import Link from "next/link";
import { Dot } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/store/useAuth";
import api from "@/lib/api";
import { DeleteProductFromCart } from "../_components/DeleteProductFromCart";

const CartPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    (typeof items)[number] | null
  >(null);

  const { items, updateQuantity, syncWithDatabase } = useCart();
  const { user } = useAuth();

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = subtotal * 0.2;
  const total = subtotal - discount + 15;
  const deliveryFee = 15;

  // ✅ ADD THIS: Sync cart with database on mount
  useEffect(() => {
    if (!user) return;

    const loadCartFromDB = async () => {
      try {
        const response = await api.get("/cart");
        syncWithDatabase(response.data);
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    };

    loadCartFromDB();
  }, [user, syncWithDatabase]);

  if (items.length === 0) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Button asChild className="mt-4">
          <Link href="/products">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-8">
        Your Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-4">
            {items.map((item) => (
              <Card className="p-0" key={item.id}>
                <CardContent className="flex gap-2.5 p-1.5 items-center">
                  <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={1000}
                      height={1000}
                      className="object-cover size-full rounded-xl"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/${item.slug}`}
                          className="font-semibold hover:underline line-clamp-2 hover:text-primary text-base md:text-lg"
                        >
                          {item.name}
                        </Link>

                        <div className="flex flex-wrap items-center gap-y-1">
                          {item.size && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              Size:
                              <span className="text-black dark:text-white font-medium uppercase">
                                {item.size}
                              </span>
                            </p>
                          )}
                          <Dot />
                          {item.color && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              Color:
                              <span className="text-black dark:text-white font-medium">
                                {item.color}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedItem(item);
                          setOpenModal(true);
                        }}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive/90"
                      >
                        <IconTrash />
                      </Button>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <p className="font-bold text-lg md:text-xl">
                        <NairaIcon /> {formatMoneyInput(item.price)}
                      </p>
                      <InputGroup className="h-9 w-fit">
                        <InputGroupAddon>
                          <InputGroupButton
                            variant="ghost"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <IconMinus />
                          </InputGroupButton>
                        </InputGroupAddon>

                        {/* Quantity */}
                        <InputGroupInput
                          value={item.quantity}
                          readOnly
                          className="w-8 px-0 text-center font-bold bg-transparent"
                          aria-label="Quantity"
                        />

                        {/* Plus */}
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            variant="ghost"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <IconPlus />
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT: Order Summary (2 Columns) */}
        <div className="lg:col-span-2">
          <Card className="gap-2.5 sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <IconTicket
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  placeholder="Coupon Code"
                  className="pl-10 h-12 rounded-xl bg-gray-50 border-none"
                />
                <Button className="absolute right-1 top-1 h-10 rounded-lg bg-zinc-900 px-6">
                  Apply
                </Button>
              </div>

              <div className="space-y-3 pt-2 font-medium text-muted-foreground text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-black dark:text-white font-semibold">
                    <NairaIcon /> {formatMoneyInput(subtotal)}
                  </span>
                </div>
                {/* <div className="flex justify-between ">
                  <span>Discount (-20%)</span>
                  <span className="text-red-500 font-semibold">
                    - <NairaIcon /> {formatMoneyInput(discount)}
                  </span>
                </div> */}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-black dark:text-white font-semibold">
                    <NairaIcon /> {formatMoneyInput(deliveryFee)}
                  </span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-black dark:text-white">
                    <NairaIcon /> {formatMoneyInput(total)}
                  </span>
                </div>
              </div>

              <Button asChild className="w-full mt-2">
                <Link href={`/checkout`}>Go to Checkout</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {selectedItem && (
        <DeleteProductFromCart
          open={openModal}
          closeModal={() => setOpenModal(false)}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default CartPage;
