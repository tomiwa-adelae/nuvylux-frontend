"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  IconCheck,
  IconPackage,
  IconArrowRight,
  IconShoppingBag,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NairaIcon } from "@/components/NairaIcon";
import { formatMoneyInput } from "@/lib/utils";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Testimonials } from "@/app/(auth)/_components/Testimonials";
import { PageGradient } from "@/components/PageGradient";
import { OrderItemsSlider } from "@/app/(root)/_components/OrderItemsSlider";

const page = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Order not found");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin size-10 text-primary" />
        <p className="mt-4 text-muted-foreground">
          Confirming your order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Button asChild className="mt-4">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <OrderItemsSlider items={order.items} />{" "}
      <div className="flex relative container min-h-[80vh] items-center justify-center">
        <PageGradient />
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="bg-green-500 inline-block rounded-full p-8 text-white">
              <IconCheck className="size-10" />
            </div>
          </div>
          <h1 className="font-semibold mt-4 text-3xl lg:text-3xl">
            Order has been confirmed
          </h1>
          <p className="text-muted-foreground text-sm mt-2.5">
            A confirmation email has been sent to your registered email address.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button asChild className="flex-1" variant="outline">
              <Link href="/account/orders">View My Orders</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/explore">
                Continue Shopping <IconArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
