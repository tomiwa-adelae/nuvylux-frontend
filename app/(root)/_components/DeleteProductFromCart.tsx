"use client";

import Image from "next/image";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { CartItem, useCart } from "@/store/useCart";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import React, { useState } from "react";
import { NairaIcon } from "@/components/NairaIcon";
import { formatMoneyInput } from "@/lib/utils";
import { Loader } from "@/components/Loader";

type Props = {
  open: boolean;
  closeModal: () => void;
  item: CartItem;
};

export const DeleteProductFromCart = ({ open, closeModal, item }: Props) => {
  const { removeItem } = useCart();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    try {
      if (user) {
        // Use the composite ID (productId-size-color) if dbId is not available
        // The backend will parse this correctly
        const deleteId = item.dbId || item.id;

        const res = await api.delete(`/cart/${deleteId}`);
      }

      // Remove from local store using the composite ID
      removeItem(item.id);
      toast.success("Item removed from cart");
      closeModal();
    } catch (error: any) {
      toast.error("Failed to remove item");
      console.error("Delete error:", error.response?.data || error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove from cart?</AlertDialogTitle>
        </AlertDialogHeader>

        {/* Product Preview */}
        <div className="flex items-center gap-2">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold leading-tight">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              <NairaIcon /> {formatMoneyInput(item.price)}
            </p>
            {item.size && (
              <p className="text-xs text-muted-foreground">
                Size: <span className="font-medium">{item.size}</span>
              </p>
            )}
            {item.color && (
              <p className="text-xs text-muted-foreground">
                Color: <span className="font-medium">{item.color}</span>
              </p>
            )}
          </div>
        </div>

        <AlertDialogDescription>
          This item will be permanently removed from your cart.
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader text="Removing..." /> : "Remove Item"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
