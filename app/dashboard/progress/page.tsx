import {Suspense} from "react";
import {LearnerGate} from "@/components/learning/gate";
import {LearnerOverview} from "@/components/learning/overview";
export default function ProgressPage(){return <Suspense fallback={<p role="status">Loading progress…</p>}><LearnerGate path="/dashboard/progress"><LearnerOverview name="" detail/></LearnerGate></Suspense>;}
