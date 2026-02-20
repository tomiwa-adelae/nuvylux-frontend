"use client";

import React, { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { IconPlus, IconBriefcaseOff } from "@tabler/icons-react";
import { ServiceList } from "../../_components/ServiceList";
import { PageHeader } from "@/components/PageHeader";
import { serviceService } from "@/lib/services";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [services] = await Promise.all([serviceService.getMyServices()]);

        setServices(services);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <PageHeader
          title="Services"
          back
          description="Manage what clients can book you for"
        />
        <Button asChild className="w-full md:w-fit">
          <Link href={"/dashboard/services/new"}>
            <IconPlus /> Add New Service
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center py-20">Loading services...</div>
        ) : services?.length > 0 ? (
          <ServiceList services={services} onUpdate={() => {}} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <IconBriefcaseOff className="size-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No services yet</h3>
            <p className="text-muted-foreground max-w-xs mt-2">
              Clients can't book you until you add at least one service.
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link href={"/dashboard/services/new"}>
                Create your first service
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* <AddServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={refresh}
      /> */}
    </div>
  );
};

export default page;
