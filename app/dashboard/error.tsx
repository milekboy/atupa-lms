"use client";
import { ErrorState } from "@/components/ui";
export default function DashboardError({reset}:{reset:()=>void}) {return <main id="main-content" className="preview-main"><ErrorState title="We couldn't verify your session" description="The account service is temporarily unavailable. Please try again." onRetry={reset} /></main>;}
