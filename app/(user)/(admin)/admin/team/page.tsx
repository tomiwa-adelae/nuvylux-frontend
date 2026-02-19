"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminService } from "@/lib/admin";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Loader2, Plus, Trash2, UserPlus } from "lucide-react";

const DEFAULT_IMAGE = "/assets/images/profile-img.jpg";
const POSITIONS = ["SUPER_ADMIN", "ADMIN", "MODERATOR"];

export default function AdminTeamPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    position: "ADMIN",
  });

  const fetchAdmins = async () => {
    try {
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Failed to fetch admins", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.password
    ) {
      toast.error("Please fill all fields");
      return;
    }
    setCreating(true);
    try {
      await adminService.createAdmin(formData);
      toast.success("Admin created successfully");
      setShowForm(false);
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        position: "ADMIN",
      });
      fetchAdmins();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create admin");
    } finally {
      setCreating(false);
    }
  };

  const handlePositionChange = async (adminId: string, position: string) => {
    try {
      await adminService.updateAdmin(adminId, position);
      toast.success("Position updated");
      fetchAdmins();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update position",
      );
    }
  };

  const handleRemove = async (adminId: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this admin? They will be reverted to a regular USER.",
      )
    )
      return;
    try {
      await adminService.removeAdmin(adminId);
      toast.success("Admin removed");
      fetchAdmins();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove admin");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-1">
        <PageHeader
          title="Admin Team"
          description="Manage administrator accounts and access levels"
          back
        />
        <Button
          className="w-full md:w-auto"
          onClick={() => setShowForm(!showForm)}
        >
          <UserPlus />
          {showForm ? "Cancel" : "Add Admin"}
        </Button>
      </div>

      {/* Create Admin Form */}
      {showForm && (
        <Card className="mt-4 gap-1">
          <CardHeader>
            <CardTitle className="text-base">Create New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    First Name
                  </label>
                  <Input
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Last Name
                  </label>
                  <Input
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Position
                  </label>
                  <Select
                    value={formData.position}
                    onValueChange={(v) =>
                      setFormData({ ...formData, position: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={creating}>
                {creating ? (
                  <Loader2 className="animate-spin size-4 mr-1" />
                ) : (
                  <Plus className="size-4 mr-1" />
                )}
                Create Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Admin List */}
      <Card className="mt-4">
        <CardContent>
          <div className="space-y-1">
            {admins.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No admin accounts found
              </p>
            )}
            {admins.map((admin: any) => (
              <div
                key={admin.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Image
                    src={admin.user?.image || DEFAULT_IMAGE}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full size-10 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-medium">
                      {admin.user?.firstName} {admin.user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {admin.user?.email}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">
                      Added {formatDate(admin.createdAt)}
                    </p>
                  </div>

                  <Select
                    defaultValue={admin.position}
                    onValueChange={(v) => handlePositionChange(admin.id, v)}
                  >
                    <SelectTrigger className="w-full md:w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemove(admin.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Position Legend */}
          <Separator className="my-4" />
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              <strong>SUPER ADMIN</strong> — Full access. Can manage other
              admins.
            </p>
            <p>
              <strong>ADMIN</strong> — Can manage users, orders, bookings,
              products, and services.
            </p>
            <p>
              <strong>MODERATOR</strong> — Can view and moderate content only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
