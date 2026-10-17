"use client";

import {motion,useReducedMotion} from "motion/react";
import type {ReactNode} from "react";
import "./home-motion.css";

/** One gentle entrance per visit; content and API loading remain server rendered. */
export function HomeReveal({children,as="section",className="",delay=0,id,label}:{children:ReactNode;as?:"section"|"div";className?:string;delay?:number;id?:string;label?:string}){
 const reduce=useReducedMotion();
 const Element=as==="div"?motion.div:motion.section;
 return <Element id={id} aria-label={label} className={`home-reveal ${className}`} initial={reduce?false:{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12,margin:"0px 0px -24px 0px"}} transition={{duration:reduce?0:.45,delay:reduce?0:delay,ease:[.22,1,.36,1]}}>{children}</Element>;
}
