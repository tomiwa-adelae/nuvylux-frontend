import type { Metadata } from "next";
import { ContactForm } from "../_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Nuvylux team. Whether you're a creator, brand, or customer — we'd love to hear from you.",
  alternates: { canonical: "https://nuvylux.com/contact" },
  openGraph: {
    title: "Contact Nuvylux",
    description: "Reach out to the Nuvylux team for support, partnerships, or general inquiries.",
    url: "https://nuvylux.com/contact",
  },
};

const page = () => {
  return (
    <div>
      <ContactForm />
    </div>
  );
};

export default page;
