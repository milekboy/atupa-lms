import {Suspense} from "react";
import {requireUser} from "@/lib/auth/session";
import {LearnerOverview} from "@/components/learning/overview";
import {DashboardOverview} from "@/components/dashboard/overview";
async function Overview(){const user=await requireUser();return user?user.role==="learner"?<LearnerOverview name={user.firstName}/>:<DashboardOverview user={user}/>:null;}
export default function DashboardPage(){return <Suspense fallback={<main id="main-content"><p role="status">Loading your workspace…</p></main>}><Overview/></Suspense>;}
