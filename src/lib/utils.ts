import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function getInitials(name?: string | null) {
  if (!name) {
    return "SK";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: value > 9999 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  const formatter = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

  for (const [unit, unitSeconds] of units) {
    if (Math.abs(seconds) >= unitSeconds) {
      return formatter.format(-Math.floor(seconds / unitSeconds), unit);
    }
  }

  return "baru saja";
}

export function excerpt(value: string, maxLength = 180) {
  const compact = value.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength).trim()}...`;
}

export function parseTags(value: string) {
  const tags = new Map<string, string>();

  for (const rawTag of value.split(",")) {
    const name = rawTag.trim().replace(/^#/, "").slice(0, 32);
    const slug = slugify(name);

    if (name.length >= 2 && slug && !tags.has(slug)) {
      tags.set(slug, name);
    }

    if (tags.size === 5) {
      break;
    }
  }

  return Array.from(tags.values());
}

export function getTypeLabel(type: string) {
  const labels: Record<string, string> = {
    DISCUSSION: "Diskusi",
    GUIDE: "Panduan",
    NEWS: "Info",
    QUESTION: "Tanya",
    RECRUITMENT: "Guild",
  };

  return labels[type] ?? type;
}

export function getTypeTone(type: string) {
  const tones: Record<string, string> = {
    DISCUSSION: "tone-teal",
    GUIDE: "tone-gold",
    NEWS: "tone-coral",
    QUESTION: "tone-violet",
    RECRUITMENT: "tone-emerald",
  };

  return tones[type] ?? "tone-teal";
}
