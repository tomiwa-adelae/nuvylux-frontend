"use client";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignout } from "@/hooks/use-signout";
import { useAuth } from "@/store/useAuth";
import { IconBell, IconHeart, IconUser } from "@tabler/icons-react";
import Link from "next/link";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";

export function UserDropdown() {
  const { user } = useAuth();
  const handleSignout = useSignout();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent gap-4"
        >
          <Avatar>
            <AvatarImage
              src={user?.image || DEFAULT_PROFILE_IMAGE}
              alt={`${user?.firstName}'s picture` || ""}
              className="size-full object-cover"
            />
            <AvatarFallback>Nuvylux</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60 text-white"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/profile/${user.username}`}>
              <IconUser size={16} className="opacity-60" aria-hidden="true" />
              <span>View profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/notifications`}>
              <IconBell size={16} className="opacity-60" aria-hidden="true" />
              <span>Notifications</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/saved`}>
              <IconHeart size={16} className="opacity-60" aria-hidden="true" />
              <span>Saved Items</span>
            </Link>
          </DropdownMenuItem>

          {user.role === "ADMINISTRATOR" && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user.username}`}>
                  <IconUser
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>View profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignout}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
