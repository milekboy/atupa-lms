import {Suspense} from "react";
import {LearnerGate} from "@/components/learning/gate";
import {AttemptReview} from "@/components/learning/quizzes";
import {notFound} from "next/navigation";
async function Protected({params}:{params:Promise<{attemptId:string}>}){const {attemptId}=await params;if(!/^[\w-]+$/.test(attemptId))notFound();return <LearnerGate path={`/dashboard/quizzes/results/${attemptId}`}><AttemptReview attemptId={attemptId}/></LearnerGate>;}
export default function Page({params}:{params:Promise<{attemptId:string}>}){return <Suspense fallback={<p role="status">Opening your learning space…</p>}><Protected params={params}/></Suspense>;}
