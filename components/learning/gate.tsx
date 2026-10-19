import type {ReactNode} from "react";
import {requireUser} from "@/lib/auth/session";
export async function LearnerGate({path,children}:{path:string;children:ReactNode}){const user=await requireUser(path);if(!user||user.role!=="learner")return <p>This learning space is available to learner accounts.</p>;return children;}
