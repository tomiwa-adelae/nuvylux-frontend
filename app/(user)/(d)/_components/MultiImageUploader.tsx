"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { IconPhotoPlus, IconX, IconLoader2 } from "@tabler/icons-react";
import Image from "next/image";
import { toast } from "sonner";

interface MultiImageUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
}

export function MultiImageUploader({
  value = [],
  onChange,
  maxImages = 5,
}: MultiImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files exceeds the limit
    if (value.length + files.length > maxImages) {
      toast.error(`You can only have a total of ${maxImages} images.`);
      return;
    }

    setIsProcessing(true);

    try {
      // Create a promise for each file to read it as Base64
      const readFilesPromises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          if (!file.type.startsWith("image/")) {
            reject(new Error(`${file.name} is not an image.`));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });
      });

      // Wait for ALL files to be processed
      const newImages = await Promise.all(readFilesPromises);

      // PERFORM A SINGLE UPDATE: Combine existing value with all new images
      onChange([...value, ...newImages]);
    } catch (error: any) {
      toast.error(error.message || "An error occurred during upload.");
    } finally {
      setIsProcessing(false);
      // Clear the input so the user can select the same files again if they want
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {/* Existing Images */}
        {value.map((src, index) => (
          <div
            key={index}
            className="relative group aspect-square rounded-lg overflow-hidden border bg-muted shadow-sm"
          >
            <Image
              src={src}
              alt={`Product gallery ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1.5 right-1.5 bg-destructive text-white p-1 rounded-full shadow-lg hover:bg-destructive/90 transition-colors"
            >
              <IconX size={14} />
            </button>
          </div>
        ))}

        {/* Upload Trigger */}
        {value.length < maxImages && (
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <IconLoader2 size={28} className="animate-spin text-primary" />
            ) : (
              <>
                <IconPhotoPlus size={28} className="text-muted-foreground" />
                <span className="text-[10px] mt-2 font-bold uppercase tracking-wider text-muted-foreground">
                  Add {filesLeft(value.length, maxImages)}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        multiple // Enables multiple selection in the file picker
        className="hidden"
      />
    </div>
  );
}

// Helper to show "5 more" or "1 more"
const filesLeft = (current: number, max: number) => {
  const diff = max - current;
  return `${diff} More`;
};
