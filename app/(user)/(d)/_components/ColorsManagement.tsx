// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { X, Plus, Check } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import React, { useState, useEffect } from "react";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/ui/form";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// // Define types and interfaces
// export interface ColorsOption {
//   name: string;
//   colorCode: string;
// }

// interface ColorsSelectorProps {
//   initialColors?: ColorsOption[];
//   onColorsChange?: (colors: ColorsOption[]) => void;
//   commonColors?: ColorsOption[];
// }

// const formSchema = z.object({
//   colorName: z.string().min(2, { message: "Color name is required" }),
//   colorCode: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
//     message: "Valid hex color code is required",
//   }),
// });

// type FormValues = z.infer<typeof formSchema>;

// // Common shoe colors with their hex values
// const DEFAULT_COLORS: ColorsOption[] = [
//   { name: "Black", colorCode: "#000000" },
//   { name: "White", colorCode: "#FFFFFF" },
//   { name: "Red", colorCode: "#FF0000" },
//   { name: "Blue", colorCode: "#0000FF" },
//   { name: "Green", colorCode: "#008000" },
//   { name: "Yellow", colorCode: "#FFFF00" },
//   { name: "Brown", colorCode: "#A52A2A" },
//   { name: "Grey", colorCode: "#808080" },
//   { name: "Navy", colorCode: "#000080" },
//   { name: "Beige", colorCode: "#F5F5DC" },
//   { name: "Pink", colorCode: "#FFC0CB" },
//   { name: "Purple", colorCode: "#800080" },
//   { name: "Orange", colorCode: "#FFA500" },
//   { name: "Silver", colorCode: "#C0C0C0" },
//   { name: "Gold", colorCode: "#FFD700" },
//   { name: "Tan", colorCode: "#D2B48C" },
//   { name: "Teal", colorCode: "#008080" },
//   { name: "Olive", colorCode: "#808000" },
//   { name: "Burgundy", colorCode: "#800020" },
//   { name: "Khaki", colorCode: "#F0E68C" },
// ];

// export function ColorsSelector({
//   initialColors = [],
//   onColorsChange,
//   commonColors = DEFAULT_COLORS,
// }: ColorsSelectorProps) {
//   const [selectedColors, setSelectedColors] =
//     useState<ColorsOption[]>(initialColors);
//   const [dialogOpen, setDialogOpen] = useState(false);

//   // Initialize react-hook-form
//   const form = useForm<FormValues>({
//     defaultValues: {
//       colorName: "",
//       colorCode: "#000000",
//     },
//     resolver: async (data) => {
//       try {
//         await formSchema.parseAsync(data);
//         return { values: data, errors: {} };
//       } catch (error: any) {
//         return {
//           values: {},
//           errors: error.formErrors?.fieldErrors || {},
//         };
//       }
//     },
//   });

//   // Notify parent component when colors change
//   useEffect(() => {
//     if (onColorsChange) {
//       onColorsChange(selectedColors);
//     }
//   }, [selectedColors, onColorsChange]);

//   const addColor = (color: ColorsOption) => {
//     // Check if color is already selected to avoid duplicates
//     if (!selectedColors.some((c) => c.colorCode === color.colorCode)) {
//       setSelectedColors([...selectedColors, color]);
//     }
//   };

//   const removeColor = (colorToRemove: ColorsOption) => {
//     setSelectedColors(
//       selectedColors.filter(
//         (color) => color.colorCode !== colorToRemove.colorCode
//       )
//     );
//   };

//   const handleAddCustomColor = (values: FormValues) => {
//     addColor({ name: values.colorName, colorCode: values.colorCode });
//     form.reset({ colorName: "", colorCode: "#000000" });
//     setDialogOpen(false);
//   };

//   // Function to determine if text should be white or black based on background color
//   const getTextColor = (hexColor: string): string => {
//     // Convert hex to RGB
//     const r = parseInt(hexColor.slice(1, 3), 16);
//     const g = parseInt(hexColor.slice(3, 5), 16);
//     const b = parseInt(hexColor.slice(5, 7), 16);

//     // Calculate brightness
//     const brightness = (r * 299 + g * 587 + b * 114) / 1000;

//     // Return white for dark backgrounds, black for light backgrounds
//     return brightness > 125 ? "#000000" : "#FFFFFF";
//   };

//   return (
//     <div>
//       <Separator className="my-4" />

//       {/* Common colors palette */}
//       <div>
//         <FormLabel className="mb-4">Common Colors</FormLabel>
//         <ScrollArea className="rounded-md">
//           <div className="flex flex-wrap gap-3 mt-4">
//             {commonColors.map((color, index) => {
//               const isSelected = selectedColors.some(
//                 (c) => c.colorCode === color.colorCode
//               );
//               return (
//                 <>
//                   <TooltipProvider key={index}>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <div
//                           onClick={() =>
//                             isSelected ? removeColor(color) : addColor(color)
//                           }
//                           className={`size-8 cursor-pointer rounded-full relative flex items-center justify-center ${
//                             isSelected
//                               ? "ring-2 ring-blue-500"
//                               : "border border-gray-200 hover:ring-2 hover:ring-gray-300"
//                           }`}
//                           style={{
//                             backgroundColor: color.colorCode,
//                           }}
//                         >
//                           {isSelected && (
//                             <Check
//                               className="w-4 h-4"
//                               style={{
//                                 color: getTextColor(color.colorCode),
//                               }}
//                             />
//                           )}
//                         </div>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>{color.name}</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
//                   {/* Add color button */}
//                   <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                     <DialogTrigger asChild>
//                       <div className="flex flex-col items-center cursor-pointer">
//                         <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-muted-foreground transition-colors">
//                           <Plus className="w-5 h-5 text-muted-foreground" />
//                         </div>
//                         <span className="text-xs mt-1 text-center">Add</span>
//                       </div>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogHeader>
//                         <DialogTitle>Add Custom Color</DialogTitle>
//                         <DialogDescription>
//                           Create a custom color for your product.
//                         </DialogDescription>
//                       </DialogHeader>

//                       <Form {...form}>
//                         <form
//                           onSubmit={form.handleSubmit(handleAddCustomColor)}
//                           className="space-y-4"
//                         >
//                           <FormField
//                             control={form.control}
//                             name="colorName"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Color Name</FormLabel>
//                                 <FormControl>
//                                   <Input
//                                     placeholder="E.g., Midnight Blue"
//                                     {...field}
//                                   />
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />

//                           <FormField
//                             control={form.control}
//                             name="colorCode"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Color Code</FormLabel>
//                                 <FormControl>
//                                   <div className="flex items-center gap-2">
//                                     <input
//                                       type="color"
//                                       value={field.value}
//                                       onChange={(e) =>
//                                         field.onChange(e.target.value)
//                                       }
//                                       className="h-10 w-10 border-0 p-0"
//                                     />
//                                     <Input placeholder="#RRGGBB" {...field} />
//                                   </div>
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />

//                           <DialogFooter className="mt-8">
//                             <DialogClose asChild>
//                               <Button size="md" type="button" variant="outline">
//                                 Cancel
//                               </Button>
//                             </DialogClose>
//                             <Button
//                               size="md"
//                               type="button"
//                               onClick={form.handleSubmit(handleAddCustomColor)}
//                             >
//                               Add Color
//                             </Button>
//                           </DialogFooter>
//                         </form>
//                       </Form>
//                     </DialogContent>
//                   </Dialog>
//                 </>
//               );
//             })}
//           </div>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface ColorsOption {
  name: string;
  colorCode: string;
}

interface ColorsSelectorProps {
  initialColors?: ColorsOption[];
  onColorsChange?: (colors: ColorsOption[]) => void;
  commonColors?: ColorsOption[];
}

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const formSchema = z.object({
  colorName: z.string().min(2, "Color name is required"),
  colorCode: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
});

type FormValues = z.infer<typeof formSchema>;

/* -------------------------------------------------------------------------- */
/*                              Default Colors                                */
/* -------------------------------------------------------------------------- */

const DEFAULT_COLORS: ColorsOption[] = [
  { name: "Black", colorCode: "#000000" },
  { name: "White", colorCode: "#FFFFFF" },
  { name: "Red", colorCode: "#FF0000" },
  { name: "Blue", colorCode: "#0000FF" },
  { name: "Green", colorCode: "#008000" },
  { name: "Yellow", colorCode: "#FFFF00" },
  { name: "Brown", colorCode: "#A52A2A" },
  { name: "Grey", colorCode: "#808080" },
  { name: "Navy", colorCode: "#000080" },
  { name: "Beige", colorCode: "#F5F5DC" },
  { name: "Pink", colorCode: "#FFC0CB" },
  { name: "Purple", colorCode: "#800080" },
  { name: "Orange", colorCode: "#FFA500" },
  { name: "Silver", colorCode: "#C0C0C0" },
  { name: "Gold", colorCode: "#FFD700" },
];

/* -------------------------------------------------------------------------- */
/*                              Helper Function                               */
/* -------------------------------------------------------------------------- */

const getTextColor = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000000" : "#FFFFFF";
};

/* -------------------------------------------------------------------------- */
/*                             ColorsSelector                                 */
/* -------------------------------------------------------------------------- */

export function ColorsSelector({
  initialColors = [],
  onColorsChange,
  commonColors = DEFAULT_COLORS,
}: ColorsSelectorProps) {
  const [selectedColors, setSelectedColors] =
    useState<ColorsOption[]>(initialColors);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      colorName: "",
      colorCode: "#000000",
    },
  });

  useEffect(() => {
    onColorsChange?.(selectedColors);
  }, [selectedColors, onColorsChange]);

  const addColor = (color: ColorsOption) => {
    if (!selectedColors.some((c) => c.colorCode === color.colorCode)) {
      setSelectedColors((prev) => [...prev, color]);
    }
  };

  const removeColor = (color: ColorsOption) => {
    setSelectedColors((prev) =>
      prev.filter((c) => c.colorCode !== color.colorCode)
    );
  };

  const handleAddCustomColor = (values: FormValues) => {
    addColor({ name: values.colorName, colorCode: values.colorCode });
    form.reset();
    setDialogOpen(false);
  };

  return (
    <div>
      <FormLabel>Available Colors</FormLabel>

      <ScrollArea className="mt-2">
        <div className="flex flex-wrap p-1 gap-3">
          {commonColors.map((color) => {
            const isSelected = selectedColors.some(
              (c) => c.colorCode === color.colorCode
            );

            return (
              <TooltipProvider key={color.colorCode}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() =>
                        isSelected ? removeColor(color) : addColor(color)
                      }
                      className={`size-8 cursor-pointer rounded-full flex items-center justify-center ${
                        isSelected
                          ? "ring-2 ring-blue-500"
                          : "border hover:ring-2"
                      }`}
                      style={{ backgroundColor: color.colorCode }}
                    >
                      {isSelected && (
                        <Check
                          className="h-4 w-4"
                          style={{ color: getTextColor(color.colorCode) }}
                        />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{color.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}

          {/* Add custom color */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <div className="size-8 cursor-pointer rounded-full border-2 border-dashed flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </div>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Color</DialogTitle>
                <DialogDescription>
                  Create a custom color for your product.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddCustomColor)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="colorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Midnight Blue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colorCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Code</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="h-10 w-10 p-0 border-0"
                            />
                            <Input {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Add Color</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </ScrollArea>
    </div>
  );
}
