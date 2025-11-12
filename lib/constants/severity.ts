import { Severity } from "@prisma/client";

export const severities: Record<keyof typeof Severity, string> = {
  LOW: "low",
  MODERATE: "moderate",
  CRITICAL: "critical",
};

export const severityColors: Record<string, string> = {
  LOW: "text-purple-600",
  MODERATE: "text-yellow-500",
  CRITICAL: "text-red-600",
};

export const severityBackgroundColors: Record<string, string> = {
  LOW: "bg-purple-600",
  MODERATE: "bg-yellow-500",
  CRITICAL: "bg-red-600",
};
