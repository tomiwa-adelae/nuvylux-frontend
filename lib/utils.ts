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

export const base64ToFile = (base64String: string, filename: string): File => {
  const parts = base64String.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const formatMoneyInput = (inputValue: string | number) => {
  if (inputValue == null) return "";

  let value = String(inputValue);

  // Allow spaces in text — don't format unless it's a pure number
  const numericOnly = value.replace(/,/g, ""); // remove commas to check

  if (!/^\d+(\.\d+)?$/.test(numericOnly)) {
    // Not a number → return raw text
    return value;
  }

  // Split whole and decimal
  let [whole, decimal] = numericOnly.split(".");

  // Add commas to whole number
  whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimal !== undefined ? `${whole}.${decimal}` : whole;
};
