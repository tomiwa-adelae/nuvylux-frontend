"use client";
import { PageHeader } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { AddProductForm } from "@/app/(user)/(brand)/(dashboard)/_components/AddProductForm";
import { brandService } from "@/lib/brand";
import { Brand } from "@/types";

const page = () => {
  const [brand, setBrand] = useState<Brand>();

  const fetchBrandDetails = async () => {
    console.log("ess");
    const brandDetails = await brandService.getBrandDetails();
    setBrand(brandDetails);
  };

  useEffect(() => {
    fetchBrandDetails();
  }, []);

  if (brand)
    return (
      <div>
        <PageHeader title="Create Product" back />
        <AddProductForm brandId={brand?.id} />
      </div>
    );
};

export default page;
