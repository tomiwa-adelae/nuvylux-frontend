import { contentWriterNavLinks, userNavLinks } from "@/constants";
import { roleNavMap } from "@/constants/roleNavMap";

export function getNavByRole(role?: string, adminPosition?: string | null) {
  if (!role) return userNavLinks;
  if (role === "ADMINISTRATOR" && adminPosition === "CONTENT_WRITER") {
    return contentWriterNavLinks;
  }
  //   @ts-ignore
  return roleNavMap[role as UserRole] ?? userNavLinks;
}
