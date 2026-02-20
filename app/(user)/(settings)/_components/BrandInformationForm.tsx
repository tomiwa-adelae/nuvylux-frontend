"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/useAuth";
import {
  BrandOnboardingFormSchema,
  BrandOnboardingFormSchemaType,
} from "@/lib/zodSchemas";
import { Logo, SmallLogo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
  IconCheck,
  IconCloudUpload,
  IconGlobe,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import api from "@/lib/api";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/navigation";
import { LogoUpload } from "../../(brand)/(onboarding)/brand-onboarding/_components/LogoUpload";
import { Brand } from "@/types";

const PRESET_COLORS = [
  "#121212", // Black
  "#10B981", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#D946EF", // Magenta
];

export const BrandInformationForm = ({ brand }: { brand: Brand }) => {
  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const [logo, setLogo] = useState<string>("/assets/images/logo.jpg");

  const [showModal, setShowModal] = useState(false);

  const form = useForm<BrandOnboardingFormSchemaType>({
    // @ts-ignore
    resolver: zodResolver(BrandOnboardingFormSchema),
    defaultValues: {
      brandType: brand?.brandType || "",
      website: brand?.website || "",
      description: brand?.description || "",
      brandLogo: brand?.brandLogo || "",
      brandColor: brand?.brandColor?.colorCode || "#2D7EF1", // Set a default color
      socialLinks: brand?.socials || [{ url: "" }],
      brandName: brand?.brandName || "",
    },
  });

  useEffect(() => {
    if (brand) {
      form.reset({
        brandType: brand.brandType || "",
        website: brand.website || "",
        description: brand.description || "",
        brandLogo: brand.brandLogo || "",
        brandColor: brand.brandColor?.colorCode || "#2D7EF1",
        socialLinks: brand.socials?.length ? brand.socials : [{ url: "" }],
        brandName: brand.brandName || "",
      });
      if (brand.brandLogo) setLogo(brand.brandLogo);
    }
  }, [brand, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const getSocialIcon = (url: string) => {
    if (url.includes("twitter") || url.includes("x.com"))
      return <IconBrandTwitter className="w-4 h-4" />;
    if (url.includes("instagram"))
      return <IconBrandInstagram className="w-4 h-4" />;
    if (url.includes("github")) return <IconBrandGithub className="w-4 h-4" />;
    if (url.includes("linkedin"))
      return <IconBrandLinkedin className="w-4 h-4" />;
    if (url.includes("youtube"))
      return <IconBrandYoutube className="w-4 h-4" />;
    return <IconGlobe className="w-4 h-4" />;
  };

  const addSocialLink = () => {
    append({ url: "" });
  };

  const removeSocialLink = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  function onSubmit(data: BrandOnboardingFormSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post("/onboarding/brand", data);
        toast.success(res?.data?.message);
        router.refresh();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Internal server error");
      }
    });
  }

  return (
    <div>
      <Form {...form}>
        {/* @ts-ignore */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            // @ts-ignore
            control={form.control}
            name="brandLogo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Logo</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-start gap-2">
                    <div className="border rounded-md">
                      <Image
                        src={logo}
                        alt="Brand Logo"
                        width={1000}
                        height={1000}
                        className="size-10 object-cover rounded-md"
                      />
                    </div>
                    <Button
                      onClick={() => setShowModal(true)}
                      variant={"outline"}
                      type="button"
                    >
                      <IconCloudUpload />
                      Upload
                    </Button>
                    <LogoUpload
                      isOpen={showModal}
                      onClose={() => setShowModal(false)}
                      onUpload={(logo) => {
                        setShowModal(false);
                        setLogo(logo);
                        field.onChange(logo);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator decorative />
          <FormField
            // @ts-ignore
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand name</FormLabel>
                <FormControl>
                  <Input placeholder="Type your brand name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // @ts-ignore
            control={form.control}
            name="brandType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry / Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="skincare">Skincare</SelectItem>
                    <SelectItem value="makeup">Makeup Artistry</SelectItem>
                    <SelectItem value="fashion">Fashion Design</SelectItem>
                    <SelectItem value="hair">Hair Styling</SelectItem>
                    <SelectItem value="tech">Beauty Tech</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // @ts-ignore
            control={form.control}
            name="brandColor"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel>Choose your brand color</FormLabel>
                  <FormDescription>
                    Update your dashboard to your brand color.
                  </FormDescription>
                </div>
                <FormControl>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Preset Swatches */}
                    <div className="flex items-center gap-1.5">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={cn(
                            "size-8 rounded-lg border border-black/10 cursor-pointer transition-transform active:scale-95",
                            field.value === color &&
                              "ring-2 ring-offset-2 ring-primary",
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => field.onChange(color)}
                        />
                      ))}

                      {/* Native Color Picker Trigger (The "+" button) */}
                      <div className="relative size-8">
                        <input
                          type="color"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <div className="flex items-center justify-center size-8 border rounded-lg text-muted-foreground">
                          +
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-muted-foreground mx-1">
                      OR
                    </span>

                    {/* Manual Input and Preview */}
                    <div className="flex items-center gap-2">
                      <div
                        className="size-10 rounded-lg border-4 border-blue-100 shadow-sm"
                        style={{ backgroundColor: field.value }}
                      />
                      <Input
                        {...field}
                        className="w-28 font-mono uppercase"
                        placeholder="#FFFFFF"
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // @ts-ignore
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <IconGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4" />
                    <Input
                      className="pl-10"
                      placeholder="https://yourbrand.com"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // @ts-ignore
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Story</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly describe what your brand stands for..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>Maximum 500 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2.5">
            <FormLabel>Social Presence</FormLabel>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  // @ts-ignore
                  control={form.control}
                  name={`socialLinks.${index}.url`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                            {formField.value ? (
                              getSocialIcon(formField.value)
                            ) : (
                              <IconGlobe className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <Input
                            {...formField}
                            type="url"
                            placeholder={`Social media link ${index + 1}`}
                            className="pl-10"
                          />
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSocialLink(index)}
                                className="text-muted-foreground hover:text-red-500"
                              >
                                <IconX className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant={"secondary"}
                onClick={addSocialLink}
                size="md"
                disabled={pending}
              >
                <IconPlus className="w-4 h-4 mr-1" />
                Add Link
              </Button>
            </div>
          </div>
          <Button disabled={pending} type="submit" className="w-full">
            {pending ? <Loader text="Saving..." /> : "Save changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
