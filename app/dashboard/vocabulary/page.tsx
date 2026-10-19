import {Suspense} from "react";
import {LearnerGate} from "@/components/learning/gate";
import {ResourceLibrary} from "@/components/discovery/library";
export default function Page(){return <Suspense fallback={<p role="status">Opening your library…</p>}><LearnerGate path="/dashboard/vocabulary"><ResourceLibrary kind="vocabulary"/></LearnerGate></Suspense>;}
