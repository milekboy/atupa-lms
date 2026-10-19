import {Suspense} from "react";
import {LearnerGate} from "@/components/learning/gate";
import {CourseLearning} from "@/components/learning/courses";
import {notFound} from "next/navigation";
async function Protected({params}:{params:Promise<{courseId:string}>}){const {courseId}=await params;if(!/^[\w-]+$/.test(courseId))notFound();return <LearnerGate path={`/dashboard/courses/${courseId}`}><CourseLearning courseId={courseId}/></LearnerGate>;}
export default function Page({params}:{params:Promise<{courseId:string}>}){return <Suspense fallback={<p role="status">Opening your learning space…</p>}><Protected params={params}/></Suspense>;}
