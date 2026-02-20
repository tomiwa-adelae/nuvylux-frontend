"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  IconCircleCheckFilled,
  IconCalendarEvent,
  IconMessage2,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWindowSize } from "react-use";
import { Confetti } from "@/components/Confetti";
import { PageHeader } from "@/components/PageHeader";
import api from "@/lib/api";
import { toast } from "sonner";

const BookingSuccessPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [isVerifying, setIsVerifying] = useState(false);
  const [txRef, setTxRef] = useState<any>();

  useEffect(() => {
    // 1. Clear the local storage draft
    localStorage.removeItem("pending_booking");

    // 2. You could also trigger a background sync to verify the payment
    // with your backend here if you haven't set up Webhooks yet.
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const status = query.get("status");
    const txRef = query.get("tx_ref");
    const transactionId = query.get("transaction_id");

    setTxRef(txRef);

    if (status === "successful" && transactionId) {
      verifyPaymentOnBackend(txRef, transactionId);
    }
  }, []);

  async function verifyPaymentOnBackend(
    txRef: string | null,
    transactionId: string | null,
  ) {
    if (!txRef || !transactionId) return;

    if (isVerifying) return; // Prevent duplicate calls

    setIsVerifying(true);

    try {
      const res = await api.get(
        `/bookings/verify-payment?tx_ref=${txRef}&transaction_id=${transactionId}`,
      );

      toast.success("Payment verified successfully!");
      //   router.replace(`/orders/${txRef}`);
    } catch (error) {
      console.error("Verification failed", error);
      toast.error("Could not verify payment. Please contact support.");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="flex items-center justify-center w-full relative overflow-hidden">
      <Confetti />

      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex justify-center mb-4"
        >
          <IconCircleCheckFilled className="size-24 text-green-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PageHeader
            title="Booking Confirmed!"
            description={
              "Your payment was successful and your request has been sent to the professional."
            }
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 space-y-3"
        >
          <Card className="border-dashed bg-muted/30">
            <CardContent className="text-left space-y-3">
              <div className="flex items-center gap-3">
                <IconCalendarEvent className="size-5 text-primary" />
                <span className="text-sm font-medium">
                  Added to your schedule
                </span>
              </div>
              <div className="flex items-center gap-3">
                <IconMessage2 className="size-5 text-primary" />
                <span className="text-sm font-medium">
                  Provider has been notified
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-2 pt-4">
            <Button
              className="w-full"
              onClick={() => router.push(`/bookings/${txRef}`)}
            >
              View Booking Details <IconArrowRight />
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/services")}
            >
              Explore More Services
            </Button>
          </div>
        </motion.div>

        <p className="text-xs text-muted-foreground mt-8">
          A confirmation email with the receipt and booking details has been
          sent to your inbox.
        </p>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
