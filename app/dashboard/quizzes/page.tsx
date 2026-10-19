import {Suspense} from "react";
import {LearnerGate} from "@/components/learning/gate";
import {AttemptHistory} from "@/components/learning/quizzes";
async function Protected(){return <LearnerGate path="/dashboard/quizzes"><AttemptHistory/></LearnerGate>;}
export default function Page(){return <Suspense fallback={<p role="status">Opening your learning space…</p>}><Protected/></Suspense>;}
