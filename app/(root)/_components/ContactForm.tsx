"use client";
import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTransition } from "react";
import { Mail, MapPin, Phone, MessageSquare, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import {
  CountrySelect,
  FlagComponent,
  PhoneInput,
} from "@/components/PhoneNumberInput";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { env } from "@/lib/env";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contactFormSubjects } from "@/constants";
import { Loader } from "@/components/Loader";
import { contactFormSchema, ContactFormSchemaType } from "@/lib/zodSchemas";

export const ContactForm = () => {
  const [pending, startTransition] = useTransition();

  const form = useForm<ContactFormSchemaType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormSchemaType) {
    startTransition(async () => {});
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        {/* Hero / Headline Area */}
        <div className="text-center mb-8">
          <h1 className="font-semibold text-4xl md:text-5xl text-primary mb-4">
            Let's Illuminate Together.
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto">
            Whether you're a global brand, a press outlet, or a creator ready to
            join the movement, we’re ready to connect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="lg:col-span-1">
            <Card>
              <CardContent>
                <h3 className="font-semibold text-primary text-2xl mb-4">
                  Direct Contact
                </h3>
                <div className="text-base space-y-2 text-muted-foreground">
                  <a
                    className="flex items-center justify-start gap-1 hover:underline hover:text-primary transition-all cursor-pointer"
                    href={`mailto:${env.NEXT_PUBLIC_ADMIN_EMAIL_ADDRESS}`}
                  >
                    <IconMail className="size-4" />
                    {env.NEXT_PUBLIC_ADMIN_EMAIL_ADDRESS}
                  </a>
                  <a
                    href={`tel:${env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER}`}
                    className="flex items-center justify-start gap-1 hover:underline hover:text-primary transition-all cursor-pointer"
                  >
                    <IconPhone className="size-4" />
                    {env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER}
                  </a>
                </div>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm uppercase font-semibold mb-4">
                    Connect with the Movement
                  </p>

                  {/* Social Links Implementation */}
                  <div className="flex space-x-6">
                    {/* Instagram */}
                    <a
                      href="https://instagram.com/nuvylux"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <IconBrandInstagram className="w-6 h-6" />
                    </a>
                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com/company/nuvylux-global"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <IconBrandLinkedin className="w-6 h-6" />
                    </a>
                    {/* Twitter/X */}
                    <a
                      href="https://twitter.com/nuvylux"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <IconBrandTwitter className="w-6 h-6" />
                    </a>
                    {/* Youtube (for Academy/Studio content) */}
                    <a
                      href="https://youtube.com/nuvylux-studio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      {/* Note: Assuming 'Youtube' icon is available, using a placeholder if needed */}
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm5.834 7.641c-.426-.157-1.125-.26-1.921-.301-1.222-.061-3.69-.061-4.896 0-.806.041-1.495.144-1.921.301C7.88 7.79 7.64 8.083 7.5 8.441c-.139.358-.239 1.127-.239 2.559v2.001c0 1.432.1 2.201.239 2.559.14.358.38.651.684.811.426.157 1.125.26 1.921.301 1.222.061 3.69.061 4.896 0 .806-.041 1.495-.144 1.921-.301.304-.16.544-.453.684-.811.139-.358.239-1.127.239-2.559v-2.001c0-1.432-.1-2.201-.239-2.559-.14-.358-.38-.651-.684-.811zM10 14.501v-5l5 2.5-5 2.5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right Column: The Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                <h3 className="font-semibold text-3xl text-primary mb-6">
                  Send Us a Message
                </h3>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@gmail.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            {/* <RPNInput.default
                      className="flex rounded-md shadow-xs"
                      international
                      flagComponent={FlagComponent}
                      countrySelectComponent={CountrySelect}
                      inputComponent={PhoneInput}
                      placeholder="8012345679"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    /> */}
                            <RPNInput.default
                              className="flex rounded-md shadow-xs"
                              countrySelectComponent={CountrySelect}
                              flagComponent={FlagComponent}
                              inputComponent={PhoneInput}
                              international
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              placeholder="Enter phone number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {contactFormSubjects.map((subject, index) => (
                                <SelectItem value={subject.value} key={index}>
                                  {subject.label}
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
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Your Message" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button disabled={pending} className="w-full" type="submit">
                      {pending ? <Loader text="Submitting..." /> : "Submit"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                      For immediate support, please visit our{" "}
                      <Link
                        href="/faq"
                        className="text-primary font-medium hover:underline transition-colors"
                      >
                        FAQ Center
                      </Link>
                      .
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
