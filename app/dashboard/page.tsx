import {AdminOverview} from "@/components/admin/overview";
import {ParentWorkspace} from "@/components/parents/workspace";
import {TeacherOverview} from "@/components/assignments/teacher-overview";
import {Suspense} from "react";
import {requireUser} from "@/lib/auth/session";
import {LearnerOverview} from "@/components/learning/overview";
import {DashboardOverview} from "@/components/dashboard/overview";
async function Overview(){const user=await requireUser();return user?user.role==="super_admin"?<AdminOverview/>:user.role==="learner"?<LearnerOverview name={user.firstName}/>:user.role==="teacher"?<TeacherOverview name={user.firstName}/>:user.role==="parent"?<ParentWorkspace name={user.firstName}/>:<DashboardOverview user={user}/>:null;}
export default function DashboardPage(){return <Suspense fallback={<main id="main-content"><p role="status">Loading your workspace…</p></main>}><Overview/></Suspense>;}
