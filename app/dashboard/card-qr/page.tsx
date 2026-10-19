import {Suspense} from "react";
import {requireUser} from "@/lib/auth/session";
import {GameCards} from "@/components/discovery/cards";
async function PrintCards(){const user=await requireUser('/dashboard/card-qr');return user&&['teacher','content_creator','super_admin'].includes(user.role)?<GameCards printing/>:<p>This page is available to content staff.</p>;}
export default function Page(){return <Suspense fallback={<p>Opening card printing…</p>}><PrintCards/></Suspense>;}
