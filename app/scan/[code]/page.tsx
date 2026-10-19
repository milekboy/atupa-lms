import {Suspense} from "react";
import {redirect,notFound} from "next/navigation";
import {requireUser} from "@/lib/auth/session";
async function Scan({params}:{params:Promise<{code:string}>}){const {code}=await params;if(!/^[A-Za-z0-9_-]{1,100}$/.test(code))notFound();const target=`/dashboard/gamecards?code=${code}`;await requireUser(target);return redirect(target);}
export default function Page({params}:{params:Promise<{code:string}>}){return <Suspense fallback={<p>Opening GameCard…</p>}><Scan params={params}/></Suspense>;}
