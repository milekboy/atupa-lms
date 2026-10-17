import {Suspense} from "react";
import {requireUser} from "@/lib/auth/session";
import {DashboardOverview} from "@/components/dashboard/overview";
async function Overview(){const user=await requireUser();return user?<DashboardOverview user={user}/>:null;}
export default function DashboardPage(){return <Suspense fallback={<main id="main-content"><p role="status">Loading your workspace…</p></main>}><Overview/></Suspense>;}
