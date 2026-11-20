'use client';
import Link from 'next/link';
import {Button} from '@/components/ui';
export default function AdminError({reset}:{reset:()=>void}){return <section className="panel"><h2>Admin page unavailable</h2><p role="alert">We could not verify access or load this page. Please try again.</p><Button onClick={reset}>Retry</Button><Link href="/dashboard">Return to LMS workspace</Link></section>;}
