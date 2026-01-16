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

export function formatDate(
  dateString: string | Date,
  withTime: boolean = false
): string {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const getOrdinalSuffix = (num: number): string => {
    const modulo100 = num % 100;
    const modulo10 = num % 10;

    if (modulo100 >= 11 && modulo100 <= 13) return `${num}th`;
    if (modulo10 === 1) return `${num}st`;
    if (modulo10 === 2) return `${num}nd`;
    if (modulo10 === 3) return `${num}rd`;
    return `${num}th`;
  };

  const datePart = `${month} ${getOrdinalSuffix(day)}, ${year}`;

  if (!withTime) return datePart;

  const timePart = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} • ${timePart}`;
}

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

export function formatPhoneNumber(
  phone: string | null = "",
  style: "international" | "local" = "international"
): string {
  if (!phone) return "";

  // Remove all non-digit chars but keep +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // Nigerian numbers start with +234 or 0
  if (style === "international") {
    // Format as +234 802 783 6001
    return cleaned.replace(/^(\+234)(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3 $4");
  } else {
    // Convert +2348027836001 → 08027836001
    return cleaned.replace(/^\+234(\d{3})(\d{3})(\d{4})$/, "0$1 $2 $3");
  }
}
