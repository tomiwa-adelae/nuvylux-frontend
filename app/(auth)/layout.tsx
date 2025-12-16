import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Testimonials } from "./_components/Testimonials";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <Testimonials />
      <div className="flex min-h-[80vh] items-center justify-center">
        {children}
      </div>
    </div>
  );
}
