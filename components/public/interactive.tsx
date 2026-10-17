"use client";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useRef,useTransition} from "react";
import {HiOutlineMoon,HiOutlineSun,HiOutlineBars3} from "react-icons/hi2";
import {useTheme} from "@/components/providers";
import {Button,IconButton} from "@/components/ui";
export function PublicTheme(){const {dark,toggle}=useTheme();return <IconButton label={dark?"Switch to light theme":"Switch to dark theme"} onClick={toggle}>{dark?<HiOutlineSun/>:<HiOutlineMoon/>}</IconButton>;}
export function RetryCatalog(){const router=useRouter();const[pending,start]=useTransition();return <Button variant="secondary" pending={pending} onClick={()=>start(()=>router.refresh())}>{pending?"Trying again…":"Try again"}</Button>;}

export function MobileSiteMenu(){const ref=useRef<HTMLDetailsElement>(null);return <details ref={ref} className="public-mobile-menu" onKeyDown={e=>{if(e.key==="Escape"&&ref.current){ref.current.open=false;ref.current.querySelector("summary")?.focus();}}} onClick={e=>{if(e.target instanceof Element&&e.target.closest("a")&&ref.current)ref.current.open=false;}}><summary aria-label="Open site navigation"><HiOutlineBars3 aria-hidden="true"/></summary><nav aria-label="Mobile site navigation"><Link href="/courses">Explore courses</Link><Link href="/#how-it-works">How it works</Link><Link href="/#gamecard">GameCard</Link><Link href="/#for-families">Families & schools</Link><Link href="/register">Create an account</Link></nav></details>;}
