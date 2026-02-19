// constants/roleNavMap.ts
import {
  adminNavLinks,
  architectNavLinks,
  brandNavLinks,
  userNavLinks,
} from "@/constants";

export type UserRole =
  | "ADMINISTRATOR"
  | "ARTISAN"
  | "BRAND"
  | "PROFESSIONAL"
  | "USER";

export const roleNavMap: Record<UserRole, typeof userNavLinks> = {
  ADMINISTRATOR: adminNavLinks,
  BRAND: brandNavLinks,
  PROFESSIONAL: architectNavLinks,
  USER: userNavLinks,
  ARTISAN: architectNavLinks,
};
