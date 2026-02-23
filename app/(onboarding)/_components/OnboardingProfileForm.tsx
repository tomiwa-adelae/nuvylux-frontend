"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconCamera } from "@tabler/icons-react";
import * as RPNInput from "react-phone-number-input";
import {
  OnboardingProfileFormSchema,
  OnboardingProfileFormSchemaType,
} from "@/lib/zodSchemas";
import { useAuth } from "@/store/useAuth";
import { countries, DEFAULT_PROFILE_IMAGE, genders, states } from "@/constants";
import { Loader } from "@/components/Loader";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/PhoneNumberInput";
import { DateSelector } from "@/components/DateSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const OnboardingProfileForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const setUser = useAuth((s) => s.setUser);

  const [pending, startTransition] = useTransition();
  const [profilePic, setProfilePic] = useState<string>(user?.image || "");
  const [showModal, setShowModal] = useState(false);

  const [photoPending, startPhotoTransition] = useTransition();

  const form = useForm<OnboardingProfileFormSchemaType>({
    resolver: zodResolver(OnboardingProfileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      gender: user?.gender || "",
      dob: user?.dob || "",
      address: user?.address || "",
      phoneNumber: user?.phoneNumber || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
      image: user?.image || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        gender: user.gender || "",
        dob: user.dob || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        image: user.image || "",
      });
    }
  }, [user, form]);

  const handleUpload = (croppedImage: string) => {
    setProfilePic(croppedImage);

    if (!user) {
      toast.error("User not found");
      return;
    }

    startPhotoTransition(async () => {
      // Convert base64 → File
      const byteString = atob(croppedImage.split(",")[1]);
      const mimeString = croppedImage.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "profile-picture.jpg", {
        type: mimeString,
      });

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await api.post(`/upload/profile/${user?.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const imageUrl = res.data.imageUrl;

        toast.success(res.data.message);

        // update preview
        setProfilePic(imageUrl);

        // ✅ update auth store (SAFE)
        setUser({
          ...user,
          image: imageUrl,
        });
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Upload failed");
      }
    });
  };

  function onSubmit(data: OnboardingProfileFormSchemaType) {
    startTransition(async () => {
      try {
        const res = await api.post("/onboarding/profile", data);
        const updatedUser = res?.data?.user;
        setUser(updatedUser);
        toast.success(res?.data?.message);
        // Brand users must complete their brand identity next
        if (updatedUser?.role === "BRAND") {
          router.push("/brand-onboarding");
        } else {
          router.push("/onboarding/success");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Internal server error");
      }
    });
  }

  useEffect(() => {
    if (user?.image) setProfilePic(user?.image);
  }, [user]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProfilePictureUpload
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onUpload={(cropped) => {
            setShowModal(false);
            handleUpload(cropped);
          }}
          currentImage={user?.image}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl className="flex items-center justify-center mb-6">
                <div className="relative flex items-center justify-center w-full">
                  <Image
                    src={profilePic || field.value || DEFAULT_PROFILE_IMAGE}
                    alt="User profile picture"
                    width={1000}
                    height={1000}
                    className="rounded-full object-cover size-[250px]"
                  />
                  <Button
                    size="sm"
                    type="button"
                    variant={"secondary"}
                    className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-4 absolute bottom-[-15px] left-[50%] translate-x-[-50%] "
                    onClick={() => setShowModal(true)}
                    disabled={photoPending || pending}
                  >
                    {photoPending ? (
                      <Loader text="" />
                    ) : (
                      <>
                        <IconCamera /> Edit
                      </>
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Phone</FormLabel>
              <FormControl>
                <RPNInput.default
                  className="flex rounded-md shadow-xs"
                  international
                  flagComponent={FlagComponent}
                  countrySelectComponent={CountrySelect}
                  inputComponent={PhoneInput}
                  placeholder="+2348012345679"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <DateSelector field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genders.map((gender, index) => (
                      <SelectItem value={gender} key={index}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter complete address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Ibadan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {states.map((state, index) => (
                      <SelectItem value={state} key={index}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country, index) => (
                      <SelectItem value={country} key={index}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-start gap-2">
          <Button onClick={() => router.back()} variant={"outline"}>
            Back
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? <Loader text="Loading..." /> : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
