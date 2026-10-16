export function required(value: string, label = "This field"): string | undefined { return value.trim() ? undefined : `${label} is required.`; }
export function validateEmail(value: string): string | undefined { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : "Enter a valid email address."; }
export function validatePassword(value: string, minimumLength: number): string | undefined { return value.length >= minimumLength ? undefined : `Use at least ${minimumLength} characters.`; }
export function validateUrl(value: string): string | undefined { try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? undefined : "Use an http or https URL."; } catch { return "Enter a valid URL."; } }
export function validateFile(file: Pick<File, "size" | "type">, allowedTypes: readonly string[], maxBytes: number): string | undefined {
  if (file.size > maxBytes) return `Choose a file smaller than ${Math.round(maxBytes / 1024 / 1024)} MB.`;
  return allowedTypes.includes(file.type) ? undefined : "This file type is not supported.";
}
