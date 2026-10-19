import {Suspense} from "react";
import {LearnerGate} from "@/components/learning/gate";
import {GameCards} from "@/components/discovery/cards";
export default function Page(){return <Suspense fallback={<p role="status">Opening your library…</p>}><LearnerGate path="/dashboard/gamecards"><GameCards/></LearnerGate></Suspense>;}
