"use client";
import {ErrorState,Button} from "@/components/ui";
export default function CatalogBoundary({reset}:{reset:()=>void}){return <main id="main-content" className="public-container catalog-main"><ErrorState description="The course catalog couldn't be displayed. Please try again."/><Button onClick={reset}>Try again</Button></main>;}
