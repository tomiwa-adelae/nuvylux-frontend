"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle2,
  CreditCard,
  Calendar,
  Clock,
  Edit2,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import api from "@/lib/api";
import { getFiles } from "@/lib/fileStorage";
import { PageHeader } from "@/components/PageHeader";
import { IconCalendar, IconCreditCard, IconPencil } from "@tabler/icons-react";
import { formatDate } from "@/lib/utils";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { useAuth } from "@/store/useAuth";
import Image from "next/image";

const ReviewBookingPage = () => {
  const router = useRouter();
  const { slug } = useParams();
  const { user, _hasHydrated } = useAuth();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth guard — redirect to login if not logged in
  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user) {
      router.push(`/login?redirect=/services/${slug}/review`);
    }
  }, [user, _hasHydrated, slug, router]);

  useEffect(() => {
    if (!_hasHydrated || !user) return;
    const saved = localStorage.getItem("pending_booking");
    if (!saved) {
      toast.error("No booking data found. Please start over.");
      router.push(`/services/${slug}/book`);
      return;
    }
    setBookingData(JSON.parse(saved));
  }, [slug, router, user, _hasHydrated]);

  //   const handleConfirmAndPay = async () => {
  //     setIsSubmitting(true);
  //     try {
  //       // 1. Prepare FormData (since we have images/files)
  //       const formData = new FormData();
  //       formData.append("serviceId", bookingData.serviceId);
  //       formData.append("date", bookingData.date);
  //       formData.append("time", bookingData.time);
  //       formData.append("requirements", bookingData.requirements);

  //       // If you stored file objects or base64 in localstorage (note: localstorage has limits)
  //       // data.images.forEach((file: any) => formData.append("files", file));

  //       // 2. Call your Backend to create the booking
  //       const res = await api.post("/bookings/create", formData);
  //       const { bookingId, access_code } = res.data; // Example response

  //       // 3. Trigger Payment (e.g., Paystack Popup)
  //       // This is where you'd call the Paystack/Flutterwave SDK
  //       toast.success("Booking initiated! Redirecting to payment...");

  //       // On successful payment, move to success page
  //       localStorage.removeItem("pending_booking");
  //       router.push(`/bookings/${bookingId}/success`);
  //     } catch (error: any) {
  //       toast.error(error.response?.data?.message || "Something went wrong");
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  const handleConfirmAndPay = async () => {
    setIsSubmitting(true);
    try {
      // 1. Prepare FormData
      const formData = new FormData();
      formData.append("serviceId", bookingData.serviceId);

      if (bookingData.date) formData.append("date", bookingData.date);
      if (bookingData.time) formData.append("time", bookingData.time);

      formData.append("requirements", bookingData.requirements || "");

      // Load files from IndexedDB (File objects can't be stored in localStorage)
      const files = await getFiles(bookingData.serviceId);
      if (files.length > 0) {
        files.forEach((file: File) => {
          formData.append("images", file);
        });
      }

      // 2. CREATE the booking
      toast.loading("Creating your booking...", { id: "booking-process" });
      const createRes = await api.post("/bookings/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Based on the backend we wrote, the ID is inside the 'booking' object
      const bookingId = createRes.data.booking.id;

      // 3. INITIALIZE the payment
      toast.loading("Preparing payment gateway...", { id: "booking-process" });
      const payRes = await api.post(`/bookings/${bookingId}/pay`);

      const { data } = payRes.data; // Flutterwave returns { status, message, data: { link } }

      if (data?.link) {
        toast.success("Redirecting to Flutterwave...", {
          id: "booking-process",
        });

        // 4. Redirect to Flutterwave
        // We don't clear localStorage here yet, in case the user hits 'back' from the payment page
        window.location.href = data.link;
      } else {
        throw new Error("Could not retrieve payment link");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment",
        { id: "booking-process" },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingData) return <Loader />;

  const serviceFee = bookingData.price * 0.05; // Example 5% fee
  const total = Number(bookingData.price) + serviceFee;

  return (
    <div className="py-12 container">
      <PageHeader
        back
        query="navigated"
        title="Review your Booking"
        description={"Check your details before proceeding to payment"}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* LEFT: DETAILS SUMMARY */}
        <div className="md:col-span-2 space-y-4">
          <Card className="gap-1.5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                Service Details{" "}
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                  <IconPencil /> Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingData.date && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconCalendar className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Date & Time
                      </p>
                      <p className="font-medium">
                        {formatDate(bookingData.date)} at{" "}
                        {bookingData.time || "TBD"}
                      </p>
                    </div>
                  </div>
                )}

                {!bookingData.date && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Clock className="size-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Service Type
                      </p>
                      <p className="font-medium">Project / Deliverable</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Your Requirements
                  </p>
                  <p className="text-sm bg-muted p-4 rounded-lg text-accent-foreground italic">
                    {bookingData.requirements
                      ? `"${bookingData.requirements}"`
                      : "No specific requirements provided."}{" "}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg flex gap-3 border border-blue-100 dark:border-blue-900">
            <ShieldCheck className="text-blue-600 dark:text-blue-100 size-6 shrink-0" />
            <p className="text-xs text-blue-800 dark:text-blue-100 leading-relaxed">
              <strong>Nuvylux Protection:</strong> Your payment is held securely
              and only released to the provider after the service is marked as
              complete.
            </p>
          </div>
        </div>

        {/* RIGHT: ORDER TOTAL & PAYMENT */}
        <div className="md:col-span-1">
          <Card className="sticky gap-2 top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{bookingData.serviceName}</span>
                  <span className="text-black dark:text-white">
                    <CurrencyIcon currency="NGN" />
                    {Number(bookingData.price).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Fee (5%)</span>
                  <span className="text-black dark:text-white">
                    <CurrencyIcon currency="NGN" />
                    {serviceFee.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-muted-foreground">
                  <span>Total</span>
                  <span className="text-black dark:text-white">
                    <CurrencyIcon currency="NGN" />
                    {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full mt-8"
                onClick={handleConfirmAndPay}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader />
                ) : (
                  <>
                    <IconCreditCard /> Pay & Book Now
                  </>
                )}
              </Button>

              <div className="mt-6 flex items-center justify-center">
                <Image
                  src={"/assets/icons/flutterwave-light.svg"}
                  alt="Flutterwave icon"
                  width={1000}
                  height={1000}
                  className="h-4 w-full dark:hidden"
                />
                <Image
                  src={"/assets/icons/flutterwave-dark.svg"}
                  alt="Flutterwave icon"
                  width={1000}
                  height={1000}
                  className="h-4 w-full hidden dark:block"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReviewBookingPage;
