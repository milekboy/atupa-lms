import {Suspense} from "react";
import {LearnerGate} from "@/components/learning/gate";
import {LessonReader} from "@/components/learning/lesson";
import {notFound} from "next/navigation";
async function Protected({params}:{params:Promise<{lessonId:string}>}){const {lessonId}=await params;if(!/^[\w-]+$/.test(lessonId))notFound();return <LearnerGate path={`/dashboard/learn/${lessonId}`}><LessonReader lessonId={lessonId}/></LearnerGate>;}
export default function Page({params}:{params:Promise<{lessonId:string}>}){return <Suspense fallback={<p role="status">Opening your learning space…</p>}><Protected params={params}/></Suspense>;}
