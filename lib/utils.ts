import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const maskEmail = (email: string) => {
  const [name, domain] = email?.split("@");
  if (!name || !domain) return email; // fallback for invalid emails

  const maskedName =
    name.length > 2
      ? name.slice(0, 2) + "*".repeat(name.length - 2)
      : name[0] + "*";
  const maskedDomain =
    domain.length > 3
      ? domain[0] + "*".repeat(domain.length - 2) + domain.slice(-4)
      : domain;

  return `${maskedName}@${maskedDomain}`;
};

export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};
