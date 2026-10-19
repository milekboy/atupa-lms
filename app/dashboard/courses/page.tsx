import {Suspense} from "react";
import {LearnerGate} from "@/components/learning/gate";
import {MyCourses} from "@/components/learning/courses";
async function Protected(){return <LearnerGate path="/dashboard/courses"><MyCourses/></LearnerGate>;}
export default function Page(){return <Suspense fallback={<p role="status">Opening your learning space…</p>}><Protected/></Suspense>;}
