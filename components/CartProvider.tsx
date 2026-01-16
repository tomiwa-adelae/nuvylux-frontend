// components/CartProvider.tsx
"use client";
import { useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useCart } from "@/store/useCart";
import api from "@/lib/api";

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const setItems = useCart((state) => state.setItems);

  useEffect(() => {
    // Only fetch if user is logged in
    if (user) {
      const fetchCart = async () => {
        try {
          const res = await api.get("/cart");

          const formatted = res.data.map((item: any) => ({
            // Construct the same ID format used in your Product Page
            id: `${item.productId}-${item.size || ""}-${item.color || ""}`,
            dbId: item.id, // Keep the DB UUID handy for deletions if needed
            name: item.product.name,
            slug: item.product.slug,
            price: Number(item.product.price),
            image: item.product.thumbnail,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          }));

          setItems(formatted);
        } catch (error) {
          console.error("Failed to sync cart:", error);
        }
      };

      fetchCart();
    }
  }, [user, setItems]);

  return <>{children}</>;
}
