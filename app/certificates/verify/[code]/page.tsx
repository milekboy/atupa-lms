import {Suspense} from "react";
import {notFound} from "next/navigation";
import {PublicVerification} from "@/components/certificates/verification";
export const metadata={title:'Certificate verification'};
async function Verify({params}:{params:Promise<{code:string}>}){const {code}=await params;if(!/^[A-Za-z0-9_-]{1,100}$/.test(code))notFound();return <PublicVerification key={code} initialCode={code}/>;}
export default function Page({params}:{params:Promise<{code:string}>}){return <Suspense fallback={<p role="status">Opening verification…</p>}><Verify params={params}/></Suspense>;}
