import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ATUPA LMS | Learn your roots", template: "%s | ATUPA LMS" },
  description: "Learn Nigerian languages and culture through lessons, practice and play. Yoruba, Igbo and Hausa, together in one learning space.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><body><a className="skip-link" href="#main-content">Skip to content</a><Providers>{children}</Providers></body></html>;
}
