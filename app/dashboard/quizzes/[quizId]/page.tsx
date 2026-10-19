import {Suspense} from "react";
import {LearnerGate} from "@/components/learning/gate";
import {QuizPlayer} from "@/components/learning/quizzes";
import {notFound} from "next/navigation";
async function Protected({params}:{params:Promise<{quizId:string}>}){const {quizId}=await params;if(!/^[\w-]+$/.test(quizId))notFound();return <LearnerGate path={`/dashboard/quizzes/${quizId}`}><QuizPlayer quizId={quizId}/></LearnerGate>;}
export default function Page({params}:{params:Promise<{quizId:string}>}){return <Suspense fallback={<p role="status">Opening your learning space…</p>}><Protected params={params}/></Suspense>;}
