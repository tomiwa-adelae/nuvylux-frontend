"use client";
import { PageHeader } from "@/components/PageHeader";
import { AddProductForm } from "../../_components/AddProductForm";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/store/useAuth";

const page = () => {
  const [brand, setBrand] = useState();
  const fetchBrandDetails = async () => {
    const res = await api.get(`/brand/details`);

    setBrand(res.data);
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
