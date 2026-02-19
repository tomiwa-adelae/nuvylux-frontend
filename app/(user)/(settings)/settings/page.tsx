"use client";
import { PageHeader } from "@/components/PageHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { BasicInformationForm } from "../_components/BasicInformationForm";
import { AppearanceSettings } from "../_components/AppearanceSettings";
import { PasswordForm } from "../_components/PasswordForm";
import { useAuth } from "@/store/useAuth";
import { BrandInformationForm } from "../_components/BrandInformationForm";
import { brandService } from "@/lib/brand";
import { Brand } from "@/types";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";

const page = () => {
  const { user } = useAuth();

  const [brand, setBrand] = useState<Brand | null>(null);

  const fetchBrandDetails = async () => {
    try {
      const brandDetails = await brandService.getBrandDetails();
      setBrand(brandDetails);
    } catch (err) {
      console.error("Failed to fetch brand:", err);
      toast.error("Could not load brand details.");
    }
  };

  useEffect(() => {
    // ONLY fetch if we have a user and that user is a brand
    if (user && user.role === "BRAND") {
      fetchBrandDetails();
    }
  }, [user]); // Now it only runs when user state is confirmed

  return (
    <div>
      <PageHeader title="Settings" back />
      <Tabs defaultValue="basic" className="mt-2">
        <ScrollArea className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            {user?.role === "BRAND" && (
              <TabsTrigger value="brand">Brand Information</TabsTrigger>
            )}
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="pt-4">
          <TabsContent value="basic">
            <BasicInformationForm />
          </TabsContent>{" "}
          {user?.role === "BRAND" && (
            <TabsContent value="brand">
              {brand ? (
                <BrandInformationForm brand={brand} />
              ) : (
                <div className="flex justify-center p-8">
                  <Loader text="Loading brand settings..." />
                </div>
              )}
            </TabsContent>
          )}
          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>
          <TabsContent value="password">
            <PasswordForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default page;
